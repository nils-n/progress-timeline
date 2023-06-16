import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
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
const db = getFirestore(app);

// user sign up
const userSignUp = async () => {
  const signUpEmail = document.getElementById("signup-email").value;
  const signUpPassword = document.getElementById("signup-password").value;

  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
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

// user sign in
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

// user sign out
const userSignOut = async () => {
  await signOut(auth);
};

// check user auth state
const checkAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
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
    const result = await signInWithPopup(auth, provider);
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

  const userDocRef = doc(db, "users", userAuth.uid);

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

checkAuthState();

signUpBtn.addEventListener("click", userSignUp);
loginBtn.addEventListener("click", userSignIn);
logoutBtn.addEventListener("click", userSignOut);
googleBtn.addEventListener("click", signInWithGoogle);
