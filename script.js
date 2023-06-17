import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import "firebase/database";

import { firebaseAuth, firebaseDB } from "./config/firebase-config";

const signUpBtn = document.getElementById("sign-up");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");

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

// check user auth state
const checkAuthState = async () => {
  onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
      console.log(user);
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

checkAuthState();

signUpBtn.addEventListener("click", userSignUp);
loginBtn.addEventListener("click", userSignIn);
logoutBtn.addEventListener("click", userSignOut);
googleBtn.addEventListener("click", signInWithGoogle);

// event listener for create story button
