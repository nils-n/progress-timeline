import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { firebaseAuth, firebaseDB } from "../../config/firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { generateUniqueID } from "./helpers";

const filterBtn = document.getElementById("filter-btn");
const sortBtn = document.getElementById("sort-btn");
const storyFormContainer = document.getElementById("story-UI-container");
const contentContainer = document.getElementById("demo-content-container");
const shareStoryBtn = document.getElementById("share-story-button");
const submitStoryBtn = document.getElementById("submit-story-btn");
const dontSubmitStoryBtn = document.getElementById("dont-submit-story-btn");
const accountLoginBtn = document.getElementById("login-logout-btn");
const profilePageBtn = document.getElementById("profile-page-btn");

// FILTER CONTENT
async function filterContent() {
  let category = filterBtn.value;

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
      <div data-date="${doc.decade}" class="home-timeline-l-container">
      <div class="home-year-container">
        <h2 class="home-text04 h2">${doc.decade}</h2>
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
            src="https://play.teleporthq.io/static/svg/default-img.svg"
            class="home-image2"
          />
        </div>
      </div>
      <div class="home-event-text-container">
        <div class="home-container10">
          <span class="home-text05">${doc.title}</span>
          <span class="home-text06">
          ${doc.content}
          </span>
        </div>
      </div>
      <div class="home-user-modal-container">
        <h2 class="home-text07">Your storIES</h2>
        <div class="home-testimonial-card">
          <div class="home-testimonial">
            <svg viewBox="0 0 1024 1024" class="home-icon08">
              <path
                d="M225 448c123.712 0 224 100.29 224 224 0 123.712-100.288 224-224 224s-224-100.288-224-224l-1-32c0-247.424 200.576-448 448-448v128c-85.474 0-165.834 33.286-226.274 93.726-11.634 11.636-22.252 24.016-31.83 37.020 11.438-1.8 23.16-2.746 35.104-2.746zM801 448c123.71 0 224 100.29 224 224 0 123.712-100.29 224-224 224s-224-100.288-224-224l-1-32c0-247.424 200.576-448 448-448v128c-85.474 0-165.834 33.286-226.274 93.726-11.636 11.636-22.254 24.016-31.832 37.020 11.44-1.8 23.16-2.746 35.106-2.746z"
              ></path>
            </svg>
            <span class="home-text08">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              In lorem lorem, malesuada in metus vitae, scelerisque
              accumsan ipsum.
            </span>
            <div class="home-like-container">
              <div class="home-container11">
                <span class="home-text09">
                  <span class="home-text10">15</span>
                  <span></span>
                  <br />
                </span>
                <span class="home-text13">Likes</span>
              </div>
              <div class="home-container12">
                <button
                  id="filter-stories"
                  type="button"
                  class="home-button3 button"
                >
                  Like
                </button>
              </div>
            </div>
          </div>
          <div class="home-container13">
            <div class="home-container14">
              <img
                alt="profile"
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixid=Mnw5MTMyMXwwfDF8c2VhcmNofDE0fHxwb3J0cmFpdHxlbnwwfHx8fDE2MjYzNzg5NzI&amp;ixlib=rb-1.2.1&amp;w=200"
                class="home-image3"
              />
              <span class="home-text14">Test User</span>
            </div>
          </div>
        </div>
        <div class="home-testimonial-card1">
          <div class="home-testimonial1">
            <svg viewBox="0 0 1024 1024" class="home-icon10">
              <path
                d="M225 448c123.712 0 224 100.29 224 224 0 123.712-100.288 224-224 224s-224-100.288-224-224l-1-32c0-247.424 200.576-448 448-448v128c-85.474 0-165.834 33.286-226.274 93.726-11.634 11.636-22.252 24.016-31.83 37.020 11.438-1.8 23.16-2.746 35.104-2.746zM801 448c123.71 0 224 100.29 224 224 0 123.712-100.29 224-224 224s-224-100.288-224-224l-1-32c0-247.424 200.576-448 448-448v128c-85.474 0-165.834 33.286-226.274 93.726-11.636 11.636-22.254 24.016-31.832 37.020 11.44-1.8 23.16-2.746 35.106-2.746z"
              ></path>
            </svg>
            <span class="home-text15">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              In lorem lorem, malesuada in metus vitae, scelerisque
              accumsan ipsum.
            </span>
            <div class="home-like-container1">
              <div class="home-container15">
                <span class="home-text16">
                  <span class="home-text17">15</span>
                  <span></span>
                  <br />
                </span>
                <span class="home-text20">Likes</span>
              </div>
              <div class="home-container16">
                <button
                  id="filter-stories"
                  type="button"
                  class="home-button4 button"
                >
                  Like
                </button>
              </div>
            </div>
          </div>
          <div class="home-container17">
            <div class="home-container18">
              <img
                alt="profile"
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixid=Mnw5MTMyMXwwfDF8c2VhcmNofDE0fHxwb3J0cmFpdHxlbnwwfHx8fDE2MjYzNzg5NzI&amp;ixlib=rb-1.2.1&amp;w=200"
                class="home-image4"
              />
              <span class="home-text21">Test User</span>
            </div>
          </div>
        </div>
      </div>
      <button
        id="filter-stories-right"
        type="button"
        class="home-button5 button"
      >
        Show YOUR STORIES
      </button>
      </div>
      `;

      contentElement.innerHTML = html;

      contentContainer.appendChild(contentElement);
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

// DISPLAY USER STORY FORM
function displayStoryForm() {
  storyFormContainer.style.display = "flex";
}

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

  closeStoryFormModal();
}

async function logout() {
  await signOut(firebaseAuth);
}

const checkAuthState = async () => {
  onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
      profilePageBtn.textContent = user.displayName;
      accountLoginBtn.addEventListener("click", logout);
      profilePageBtn.style.display = "flex";
      accountLoginBtn.textContent = "Logout";
    } else {
      accountLoginBtn.textContent = "Login";
      accountLoginBtn.removeEventListener("click", logout);
      profilePageBtn.style.display = "none";
    }
  });
};

function closeStoryFormModal() {
  storyFormContainer.style.display = "none";
}

checkAuthState();

dontSubmitStoryBtn.addEventListener("click", closeStoryFormModal);
storyFormContainer.addEventListener("submit", submitYourStory);
shareStoryBtn.addEventListener("click", displayStoryForm);
filterBtn.addEventListener("change", filterContent);
sortBtn.addEventListener("click", sortContent);
