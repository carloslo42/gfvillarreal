// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDTgkbElD1TduU-Z5M0lOp_I7JuyRQ8ES0",
  authDomain: "gfvillarreal-47781.firebaseapp.com",
  projectId: "gfvillarreal-47781",
  storageBucket: "gfvillarreal-47781.firebasestorage.app",
  messagingSenderId: "628099013784",
  appId: "1:628099013784:web:1212bfd361943ec7de44ed"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);