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
