import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseAuth, firebaseDB } from "../../config/firebase-config";

const googleSignUpButton = document.getElementById("signup-google-btn");
const emailSignInButton = document.getElementById("signup-submit-btn");
const signInButton = document.getElementById("login");

const userSignUp = async (e) => {
  e.preventDefault();
  const signUpEmail = document.getElementById("signup-email").value;
  const signUpPassword = document.getElementById("signup-password").value;
  const signUpName = document.getElementById("signup-name").value;
  const signUpUserName = document.getElementById("signup-name").value;

  try {
    const { user } = await createUserWithEmailAndPassword(
      firebaseAuth,
      signUpEmail,
      signUpPassword
    );

    const userDocument = {
      ...user,
      displayName: signUpUserName || "anon",
      name: signUpName,
    };

    console.log(userDocument);
    createUserDocumentFromAuth(userDocument);

    alert("You have signed up successfully!");
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + errorMessage);
  }
};

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(firebaseAuth, provider);
    const user = result.user;

    createUserDocumentFromAuth(user);
    alert("You have signed in with Google successfully!");
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + errorMessage);
  }
};

// user sign in
export const userSignIn = async (e) => {
  e.preventDefault();
  const signInEmail = document.getElementById("login-email").value;
  const signInPassword = document.getElementById("login-password").value;
  console.log(signInEmail, signInPassword)
  try {
    signInWithEmailAndPassword(firebaseAuth, signInEmail, signInPassword);
    alert("You have signed in successfully!");
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
    const { email, displayName, name } = userAuth;

    const createAt = new Date();

    const newDocument = {
      createAt,
      email,
      name: displayName || name,
      userName: displayName,
      image:
        "https://ih1.redbubble.net/image.2112861038.5445/st,small,507x507-pad,600x600,f8f8f8.jpg",
    };

    try {
      await setDoc(userDocRef, newDocument);
    } catch (err) {
      console.log(`error creating user`, err.message);
    }
  }

  return userSnapShot;
};

googleSignUpButton.addEventListener("click", signInWithGoogle);
emailSignInButton.addEventListener("click", userSignUp);
signInButton.addEventListener("click", userSignIn);