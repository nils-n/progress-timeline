import { collection, getDocs } from "firebase/firestore";
import { firebaseAuth, firebaseDB } from "./config/firebase-config";
import { renderStoryDiv } from "./assets/js/helpers";

const storiesContainer = document.getElementById("stories-container");

async function loadUserStories() {
  storiesContainer.innerHTML = "";
  const loader = document.createElement("div");
  loader.id = "loader";
  storiesContainer.appendChild(loader);

  try {
    const storiesSnapshot = await getDocs(collection(firebaseDB, "stories"));
    storiesContainer.removeChild(loader);

    const totalStories = [];
    storiesSnapshot.forEach((storyDoc) => totalStories.push(storyDoc.data()));

    const filteredStories = totalStories.filter((story) => {
      if (story.author === firebaseAuth.currentUser.displayName) {
        return story.author;
      } else if (story.author === firebaseAuth.currentUser.email) {
        return story.author;
      } else return;
    });

    filteredStories.forEach((story) => {
      const storyElement = document.createElement("div");
      storyElement.innerHTML = `  <div class="story-profile">
      <h3>${story.title}</h3>
      <p>
      ${story.content}
      </p>
    </div> `;
      storiesContainer.appendChild(storyElement);
    });

    // Add event listeners for like buttons
  } catch (error) {
    console.error("Error retrieving stories:", error);
    alert("Failed to retrieve stories. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", loadUserStories());

console.log(storiesContainer);

// DISPLAY USER STORY FORM
function displayStoryForm() {
  storyFormContainer.style.display = "flex";
}
