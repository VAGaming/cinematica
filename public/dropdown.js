console.log("user-dropdown loaded");

import { auth } from "./js/firebase.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const userBtn = document.getElementById("userBtn");
const dropdown = document.getElementById("userDropdown");

const loggedOutView = document.getElementById("loggedOutView");
const loggedInView = document.getElementById("loggedInView");
const userEmail = document.getElementById("userEmail");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");

/* Toggle dropdown */
userBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("hidden");
});

/* Close when clicking outside */

document.addEventListener("click", () => {
  dropdown.classList.add("hidden");
});

/* Prevent closing when clicking inside */
dropdown.addEventListener("click", (e) => e.stopPropagation());

/* Auth state */
onAuthStateChanged(auth, (user) => {
  if (user) {
    loggedOutView.classList.add("hidden");
    loggedInView.classList.remove("hidden");
    userEmail.textContent = user.email;
  } else {
    loggedInView.classList.add("hidden");
    loggedOutView.classList.remove("hidden");
  }
});

/* Actions */
loginBtn.onclick = () => (window.location.href = "login.html");
signupBtn.onclick = () => (window.location.href = "signup.html");

logoutBtn.onclick = async () => {
  await signOut(auth);
  dropdown.classList.add("hidden");
};
