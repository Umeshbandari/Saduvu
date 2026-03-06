// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxxfLAAXk0exdsBnevsZP_H9MTih0IzUk",
  authDomain: "saduvu-bcc8b.firebaseapp.com",
  projectId: "saduvu-bcc8b",
  storageBucket: "saduvu-bcc8b.firebasestorage.app",
  messagingSenderId: "473297289120",
  appId: "1:473297289120:web:f54329e26caa70bb3f2ec5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services you need (Firestore, Auth, etc.)
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;