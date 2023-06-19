import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth } from "../../config/firebase-config";

const accountLoginBtn = document.getElementById("login-logout-btn");
const profilePageBtn = document.getElementById("profile-page-btn");

// LOGOUT
async function logout() {
  await signOut(firebaseAuth);
}

const checkAuthState = async () => {
  onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
      profilePageBtn.textContent = user.displayName;
      accountLoginBtn.addEventListener("click", logout);
      profilePageBtn.style.display = "flex";
      accountLoginBtn.textContent = "Logout";
    } else {
      accountLoginBtn.textContent = "Login";
      accountLoginBtn.removeEventListener("click", logout);
      profilePageBtn.style.display = "none";
    }
  });
};

checkAuthState();
