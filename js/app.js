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

// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
