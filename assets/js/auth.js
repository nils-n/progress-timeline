import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../../config/firebase-config";

const accountBtn = document.getElementById("account-btn");

const checkAuthState = async () => {
  onAuthStateChanged(firebaseAuth, (user) => {
    console.log(user);
    if (user) {
      accountBtn.textContent = user.displayName;
    } else {
      accountBtn.textContent = "Login";
    }
  });
};

checkAuthState();

// user sign up
export const userSignUp = async () => {
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

// user sign in
export const userSignIn = async () => {
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
export const userSignOut = async () => {
  await signOut(firebaseAuth);
};

// check user auth state
export const checkAuthState2 = async () => {
  onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
      console.log(user);
      displayStories();
    } else {
      alert("no user");
    }
  });
};