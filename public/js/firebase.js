import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3owRur9MWgjKY70-NlyZfOdd1IJvex4g",
  authDomain: "cinematica-8e23f.firebaseapp.com",
  projectId: "cinematica-8e23f",
  storageBucket: "cinematica-8e23f.firebasestorage.app",
  messagingSenderId: "324150998994",
  appId: "1:324150998994:web:68288859e11a0d4ef5ba0b",
  measurementId: "G-Y3MG5ZXYLG",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
