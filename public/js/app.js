// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Reference to collection
const usersRef = collection(db, "users");

// CREATE
window.addUser = async function () {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  await addDoc(usersRef, {
    name,
    email,
  });

  loadUsers();
};

// READ
async function loadUsers() {
  const snapshot = await getDocs(usersRef);
  const list = document.getElementById("userList");
  list.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const user = docSnap.data();
    const li = document.createElement("li");

    li.innerHTML = `
      ${user.name} (${user.email})
      <button onclick="editUser('${docSnap.id}', '${user.name}', '${user.email}')">Edit</button>
      <button onclick="deleteUser('${docSnap.id}')">Delete</button>
    `;

    list.appendChild(li);
  });
}

// UPDATE
window.editUser = async function (id, name, email) {
  const newName = prompt("New name:", name);
  const newEmail = prompt("New email:", email);

  if (newName && newEmail) {
    await updateDoc(doc(db, "users", id), {
      name: newName,
      email: newEmail,
    });
    loadUsers();
  }
};

// DELETE
window.deleteUser = async function (id) {
  await deleteDoc(doc(db, "users", id));
  loadUsers();
};

// Initial load
loadUsers();
