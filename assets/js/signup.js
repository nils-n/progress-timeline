import { doc, getDoc, setDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "../../config/firebase-config";

const googleSignUpButton = document.getElementById("signup-google-btn");

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
console.log(firebaseAuth);

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(firebaseAuth, provider);
    const user = result.user;
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

googleSignUpButton.addEventListener("click", signInWithGoogle);
