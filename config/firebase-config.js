import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Initialize Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyD7w6h9rZgPzHXjxn1XAAEvsvEyokkhx0c",
  authDomain: "testing-node-auth.firebaseapp.com",
  projectId: "testing-node-auth",
  storageBucket: "testing-node-auth.appspot.com",
  messagingSenderId: "834539674456",
  appId: "1:834539674456:web:717fcc42c8ceb22a40e32d",
};

export const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);
