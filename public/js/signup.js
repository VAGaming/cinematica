import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const errorDiv = document.getElementById("error-message");

function getSignupErrorMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Email không hợp lệ.";
    case "auth/email-already-in-use":
      return "Email đã được sử dụng.";
    case "auth/weak-password":
      return "Mật khẩu phải có ít nhất 6 ký tự.";
    case "auth/operation-not-allowed":
      return "Chức năng đăng ký hiện không khả dụng.";
    case "auth/network-request-failed":
      return "Lỗi kết nối mạng. Vui lòng kiểm tra internet.";
    default:
      return "Đăng ký thất bại. Vui lòng thử lại.";
  }
}

document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      role: "user",
      createdAt: serverTimestamp(),
    });

    window.location.replace("login.html");
  } catch (err) {
    errorDiv.textContent = getSignupErrorMessage(err.code);
    errorDiv.classList.remove("show");
    void errorDiv.offsetWidth;
    errorDiv.classList.add("show");
    if (err.code === "auth/email-already-in-use") {
      window.location.href = "login.html";
      return;
    }

    errorDiv.textContent = getSignupErrorMessage(err.code);
    errorDiv.classList.remove("show");
    void errorDiv.offsetWidth;
    errorDiv.classList.add("show");
  }
});

["email", "password"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => {
    errorDiv.textContent = "skibidi";
    errorDiv.classList.remove("show");
  });
});
