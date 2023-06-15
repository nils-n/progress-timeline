import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import "firebase/database";

const signUpBtn = document.getElementById("sign-up");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD7w6h9rZgPzHXjxn1XAAEvsvEyokkhx0c",
  authDomain: "testing-node-auth.firebaseapp.com",
  projectId: "testing-node-auth",
  storageBucket: "testing-node-auth.appspot.com",
  messagingSenderId: "834539674456",
  appId: "1:834539674456:web:717fcc42c8ceb22a40e32d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const userSignUp = async () => {
  const signUpEmail = document.getElementById("signup-email").value;
  const signUpPassword = document.getElementById("signup-password").value;

  try {
    createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
    alert("You have signed up successfully!");
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + errorMessage);
  }
};

const userSignIn = async () => {
  const signInEmail = document.getElementById("login-email").value;
  const signInPassword = document.getElementById("login-password").value;
  try {
    signInWithEmailAndPassword(auth, signInEmail, signInPassword);
    alert("You have signed in successfully!");
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + errorMessage);
  }
};

const userSignOut = async () => {
  await signOut(auth);
};

const checkAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);
    } else {
      alert("no user");
    }
  });
};

checkAuthState();

signUpBtn.addEventListener("click", userSignUp);
loginBtn.addEventListener("click", userSignIn);
logoutBtn.addEventListener("click", userSignOut);
