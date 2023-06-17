import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import "firebase/database";

import { firebaseAuth, firebaseDB } from "../../config/firebase-config";

const signUpBtn = document.getElementById("sign-up");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const filterBtn = document.getElementById("filter");
const contentContainer = document.getElementById("demo-content-container");

// user sign up
const userSignUp = async () => {
  const signUpEmail = document.getElementById("signup-email").value;
  const signUpPassword = document.getElementById("signup-password").value;

  try {
    const { user } = await createUserWithEmailAndPassword(
      firebaseAuth,
      signUpEmail,
      signUpPassword
    );
    createUserDocumentFromAuth(user);

    alert("You have signed up successfully!");
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + errorMessage);
  }
};

// create story
const createStory = async (title, content, decade, publishDate) => {
  const user = firebaseAuth.currentUser;

  if (user) {
    try {
      const storyRef = doc(firebaseDB, "stories", generateUniqueID());
      const newStory = {
        title,
        content,
        author: user.uid,
        likeCounter: 0,
        decade,
        publishDate,
        createdAt: new Date(),
      };
      await setDoc(storyRef, newStory);

      alert("Story created successfully!");
    } catch (error) {
      console.error("Error creating story: ", error);
      alert("Failed to create story. Please try again.");
    }
  } else {
    alert("You need to be logged in to create a story.");
  }
};

// generate unique id
const generateUniqueID = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

// user sign in
const userSignIn = async () => {
  const signInEmail = document.getElementById("login-email").value;
  const signInPassword = document.getElementById("login-password").value;
  try {
    signInWithEmailAndPassword(firebaseAuth, signInEmail, signInPassword);
    alert("You have signed in successfully!");
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + errorMessage);
  }
};

// user sign out
const userSignOut = async () => {
  await signOut(firebaseAuth);
};

// display stories
const displayStories = async () => {
  const storiesContainer = document.getElementById("stories-container");

  try {
    const storiesSnapshot = await getDocs(collection(firebaseDB, "stories"));
    storiesSnapshot.forEach((storyDoc) => {
      const storyData = storyDoc.data();
      const storyElement = document.createElement("div");
      storyElement.innerHTML = `
        <h2>${storyData.title}</h2>
        <p>${storyData.content}</p>
        <p>Author: ${storyData.author}</p>
        <p class="like-counter">Like Count: ${storyData.likeCounter}</p>
        <button class="like-button" data-story-id="${storyDoc.id}">Like</button>
      `;
      storiesContainer.appendChild(storyElement);

      const likeButton = storyElement.querySelector(".like-button");
      likeButton.addEventListener("click", () => {
        handleLikeButton(storyDoc.id);
      });
    });
  } catch (error) {
    console.error("Error retrieving stories:", error);
    alert("Failed to retrieve stories. Please try again.");
  }
};

// handle like button
const handleLikeButton = async (storyId) => {
  const storyRef = doc(firebaseDB, "stories", storyId);

  try {
    const storyDoc = await getDoc(storyRef);
    const storyData = storyDoc.data();
    const updatedLikeCounter = storyData.likeCounter + 1;
    await updateDoc(storyRef, { likeCounter: updatedLikeCounter });

    // Update like counter in DOM
    const likeCounterElement = document.querySelector(
      `[data-story-id="${storyId}"] .like-counter`
    );
    likeCounterElement.textContent = `Like Count: ${updatedLikeCounter}`;

    alert("Liked the story!");
  } catch (error) {
    console.error("Error updating like counter:", error);
    alert("Failed to update like counter. Please try again.");
  }
};

// check user auth state
const checkAuthState = async () => {
  onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
      console.log(user);
      displayStories();
    } else {
      alert("no user");
    }
  });
};

const googleBtn = document.getElementById("google");

// sign in with google
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(firebaseAuth, provider);
    const user = result.user;
    console.log(user);
    alert("You have signed in with Google successfully!");
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + errorMessage);
  }
};

export const createUserDocumentFromAuth = async (userAuth) => {
  if (!userAuth) return;

  const userDocRef = doc(firebaseDB, "users", userAuth.uid);

  const userSnapShot = await getDoc(userDocRef);

  if (!userSnapShot.exists()) {
    const { email } = userAuth;

    const createAt = new Date();

    try {
      await setDoc(userDocRef, {
        email,
        createAt,
      });
    } catch (err) {
      console.log(`error creating user`, err.message);
    }
  }

  return userSnapShot;
};

const createStoryBtn = document.getElementById("create-story");
createStoryBtn.addEventListener("click", () => {
  const title = document.getElementById("story-title").value;
  const content = document.getElementById("story-content").value;
  const decade = document.getElementById("story-decade").value;
  const publishDate = document.getElementById("story-publish-date").value;

  createStory(title, content, decade, publishDate);
});

async function filterContent() {
  let category = filterBtn.value;

  try {
    const contentDocuments = [];
    const contentSnapshotRef = await getDocs(collection(firebaseDB, "content"));

    contentSnapshotRef.forEach((contentSnap) => {
      const contentDocument = contentSnap.data();
      contentDocuments.push(contentDocument);
    });

    const filteredDocuments = contentDocuments.filter(
      (document) => document.category === category
    );

    filteredDocuments.forEach((doc) => {
      const contentElement = document.createElement("div");

      contentElement.classList.add("content-box");

      const html = ` 
      <h2 class="content-header">${doc.title}</h2>
      <h3 class="content-decade">${doc.decade}</h3>
      <p class="content">
      ${doc.content}
      </p>
    `;

      contentElement.innerHTML = html;

      contentContainer.innerHTML = "";

      contentContainer.appendChild(contentElement);
    });
  } catch (error) {
    console.error("Error retrieving content:", error);
    alert("Failed to retrieve stories. Please try again.");
  }
}

checkAuthState();

signUpBtn.addEventListener("click", userSignUp);
loginBtn.addEventListener("click", userSignIn);
logoutBtn.addEventListener("click", userSignOut);
googleBtn.addEventListener("click", signInWithGoogle);
filterBtn.addEventListener("change", filterContent);

// event listener for create story button
