import { userSignUp, userSignIn, userSignOut, checkAuthState2 } from "./auth";
import { createStory, displayStories, handleLikeButton } from "./stories";
import { filterContent, sortContent } from "./content";

const signUpBtn = document.getElementById("sign-up");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const createStoryBtn = document.getElementById("create-story");
const googleBtn = document.getElementById("google");

// Wait for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
  // Add event listener for each like button
  const likeButtons = document.querySelectorAll(".like-button");
  likeButtons.forEach((likeButton) => {
    likeButton.addEventListener("click", () => {
      const storyId = likeButton.getAttribute("data-story-id");
      handleLikeButton(storyId);
    });
  });
});

// Set up event listeners and initial setup
checkAuthState2();

signUpBtn.addEventListener("click", userSignUp);
loginBtn.addEventListener("click", userSignIn);
logoutBtn.addEventListener("click", userSignOut);
googleBtn.addEventListener("click", signInWithGoogle);
filterBtn.addEventListener("change", filterContent);
sortBtn.addEventListener("click", sortContent);
createStoryBtn.addEventListener("click", () => {
  const title = document.getElementById("story-title").value;
  const content = document.getElementById("story-content").value;
  const decade = document.getElementById("story-decade").value;
  const publishDate = document.getElementById("story-publish-date").value;

  createStory(title, content, decade, publishDate);
});
