import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import "firebase/database";
import { firebaseAuth, firebaseDB } from "../../config/firebase-config";

export {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  firebaseAuth,
  firebaseDB,
};
