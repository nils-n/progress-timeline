import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, firebaseDB } from "../../config/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const accountBtn = document.getElementById("account-btn");

// create user document from firebase auth
const getUserData = async (userId) => {
  try {
    const docRef = doc(firebaseDB, "users", userId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const nameInput = document.getElementById("signup-name");
      const emailInput = document.getElementById("signup-email");
      const usernameInput = document.getElementById("signup-username");
      const image = document.querySelector(".profile-image2");

      image.src = userData.image;

      // Update input fields with user data
      nameInput.value = userData.name;
      emailInput.value = userData.email;
      usernameInput.value = userData.username;
    } else {
      console.log("User document does not exist");
    }
  } catch (error) {
    console.log("Error retrieving user data:", error);
  }
};

// change user data
const submitChangesBtn = document.getElementById("submit-changes-btn");

submitChangesBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const userId = firebaseAuth.currentUser.uid;
  const nameInput = document.getElementById("signup-name").value;
  const emailInput = document.getElementById("signup-email").value;
  const usernameInput = document.getElementById("signup-username").value;

  try {
    const docRef = doc(firebaseDB, "users", userId);
    await updateDoc(docRef, {
      name: nameInput,
      email: emailInput,
      username: usernameInput,
    });

    alert("Changes submitted successfully!");
  } catch (error) {
    console.log("Error submitting changes:", error);
  }
});

export const checkAuthState = async () => {
  onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
      console.log("User is logged in:", user);

      getUserData(user.uid);
    } else {
      console.log("user is not logged in");
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
      displayStories();
    } else {
      alert("no user");
    }
  });
};
