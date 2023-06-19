import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { firebaseAuth, firebaseDB } from "../../config/firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { generateUniqueID, renderStoryDiv } from "./helpers";

const filterBtn = document.getElementById("filter-btn");
const sortBtn = document.getElementById("sort-btn");
const storyFormContainer = document.getElementById("story-UI-container");
const contentContainer = document.getElementById("content-wrapper");
const shareStoryBtn = document.getElementById("share-story-button");
const dontSubmitStoryBtn = document.getElementById("dont-submit-story-btn");
const accountLoginBtn = document.getElementById("login-logout-btn");
const profilePageBtn = document.getElementById("profile-page-btn");
const loader = document.getElementById("loader");
const overlay = document.getElementById("overlay");
const userStoryBtns = Array.from(
  contentContainer.querySelectorAll(".home-button6")
);
const userStoryBtnsRight = Array.from(
  contentContainer.querySelectorAll(".home-button7")
);

// FILTER CONTENT
async function filterContent() {
  const category = filterBtn.value;

  try {
    const contentDocuments = [];
    const contentSnapshotRef = await getDocs(collection(firebaseDB, "content"));

    contentSnapshotRef.forEach((contentSnap) => {
      const contentDocument = contentSnap.data();
      contentDocuments.push(contentDocument);
    });

    const filteredDocuments = contentDocuments.filter((document) => {
      if (category === "all") {
        return document;
      }
      if (document.category !== category) {
        return document.decade.toString() === category;
      } else {
        return document.category === category;
      }
    });

    contentContainer.innerHTML = "";

    filteredDocuments.forEach((doc) => {
      const contentElement = document.createElement("div");

      contentElement.classList.add("content-box");

      const html = ` 
      <div data-date=${doc.decade} class="home-timeline-l-container">
      <div class="home-year-container">
        <h2 class="home-text05 h2">${doc.decade}</h2>
      </div>
      <div class="home-line-container">
        <div class="home-line-container1">
          <img
            alt="Ellipse152915"
            src="public/external/ellipse192917-o77j-200h.png"
            class="home-ellipse15"
          />
          <div class="home-separator"></div>
        </div>
        <div class="home-image-container">
          <img
            alt="image"
            src="${doc.imageUrl}"
            class="home-image2"
          />
        </div>
      </div>
      <div class="home-event-text-container">
        <div class="home-container12">
          <span class="home-text06">${doc.title}</span>
          <span class="home-text07">
          ${doc.content}
          </span>
        </div>
      </div>
      <button
      data-date=${doc.decade}
        type="button"
        class="home-button6 button"
      >
        User Stories in ${doc.decade}
      </button>
      </div>
      `;

      contentElement.innerHTML = html;

      contentContainer.appendChild(contentElement);
    });

    // RE-ADD BUTTON FUNCTION TO DYNAMIC BUTTONS
    const userStoryBtns = Array.from(
      contentContainer.querySelectorAll(".home-button6")
    );

    userStoryBtns.forEach((btn) => {
      btn.addEventListener("click", renderUserStories);
    });
  } catch (error) {
    console.error("Error retrieving content:", error);
    alert("Failed to retrieve content. Please try again.");
  }
}

// SORT CONTENT
function sortContent() {
  const isAscending = sortBtn.classList.contains("asc");

  const order = isAscending ? "ascending" : "descending";
  isAscending ? sortBtn.classList.remove("asc") : sortBtn.classList.add("asc");

  const content = Array.from(
    contentContainer.querySelectorAll(".home-timeline-l-container")
  );

  content.sort((a, b) => {
    const dateA = parseInt(a.dataset.date);
    const dateB = parseInt(b.dataset.date);

    if (order === "ascending") {
      return dateA - dateB;
    } else if (order === "descending") {
      return dateB - dateA;
    }
  });

  contentContainer.innerHTML = "";

  content.forEach((data) => contentContainer.appendChild(data));
}

// RENDER STORIES
async function renderUserStories(e) {
  const decadeFilter = parseInt(e.target.dataset.date);
  overlay.style.display = "flex";
  const storiesContainer = document.getElementById("user-story-modal");
  storiesContainer.innerHTML = "";
  const header = document.createElement("h2");
  header.textContent = `Stories of the ${decadeFilter}`;
  header.classList.add("home-text08");
  header.id = "your-stories-left";
  storiesContainer.appendChild(header);

  const loader = document.createElement("div");
  loader.id = "loader";

  storiesContainer.appendChild(loader);

  try {
    const storiesSnapshot = await getDocs(collection(firebaseDB, "stories"));
    storiesContainer.removeChild(loader);

    const totalStories = [];
    storiesSnapshot.forEach((storyDoc) => totalStories.push(storyDoc.data()));

    const filteredStories = totalStories.filter((story) => {
      const decade = Math.floor(story.decade / 10) * 10;
      return decade === decadeFilter;
    });

    filteredStories.forEach((story) => {
      const user = firebaseAuth.currentUser;
      // const isLikedByUser =
      // user && storyData.likedBy && storyData.likedBy.includes(user.uid);
      console.log(story);
      const storyElement = document.createElement("div");
      storyElement.classList.add("home-testimonial-card");

      storyElement.innerHTML = renderStoryDiv(story);
      storiesContainer.appendChild(storyElement);
    });

    // Add event listeners for like buttons
    const likeButtons = document.querySelectorAll(".like-button");
    likeButtons.forEach((likeButton) => {
      likeButton.addEventListener("click", async (event) => {
        const storyId = event.target.getAttribute("data-story-id");
        await handleLikeButton(storyId);
      });
    });
  } catch (error) {
    console.error("Error retrieving stories:", error);
    alert("Failed to retrieve stories. Please try again.");
  }
}

// DISPLAY USER STORY FORM
function displayStoryForm() {
  storyFormContainer.style.display = "flex";
}

console.log(firebaseAuth);

// SUBMIT STORY
async function submitYourStory(e) {
  e.preventDefault();
  const user = firebaseAuth.currentUser;
  if (!user) {
    alert("You need to be logged in to create a story.");
    return;
  }

  const title = document.getElementById("story-title").value;
  const content = document.getElementById("story-content").value;
  const date = document.getElementById("story-date-input").value;

  //   CONVERT INPUT TO JUST GET DECADE
  const selectedDate = new Date(date);
  const decade = selectedDate.getFullYear();

  const newStory = {
    title,
    content,
    date,
    decade,
    author: user.displayName || "anon",
    likeCounter: 0,
    createdAt: new Date(),
  };

  if (user) {
    try {
      const storyRef = doc(firebaseDB, "stories", generateUniqueID());
      await setDoc(storyRef, newStory);

      alert("Story created successfully!");
    } catch (error) {
      console.error("Error creating story: ", error);
      alert("Failed to create story. Please try again.");
    }
  } else {
    alert("You need to be logged in to create a story.");
  }

  closeModal(storyFormContainer);
}

function closeModal(element) {
  element.style.display = "none";
}
// CLOSE USER STORYS MODAL

overlay.addEventListener("click", () => closeModal(overlay));

userStoryBtns.forEach((btn) =>
  btn.addEventListener("click", renderUserStories)
);
userStoryBtnsRight.forEach((btn) =>
  btn.addEventListener("click", renderUserStories)
);
dontSubmitStoryBtn.addEventListener("click", () =>
  closeModal(storyFormContainer)
);
storyFormContainer.addEventListener("submit", submitYourStory);
shareStoryBtn.addEventListener("click", displayStoryForm);
filterBtn.addEventListener("change", filterContent);
sortBtn.addEventListener("click", sortContent);
