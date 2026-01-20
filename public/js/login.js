import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const errorDiv = document.getElementById("error-message");

function getAuthErrorMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Email không hợp lệ.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email hoặc mật khẩu không đúng.";
    case "auth/user-disabled":
      return "Tài khoản đã bị vô hiệu hóa.";
    case "auth/too-many-requests":
      return "Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.";
    case "auth/network-request-failed":
      return "Lỗi kết nối mạng. Vui lòng kiểm tra internet.";
    default:
      return "Đã xảy ra lỗi. Vui lòng thử lại.";
  }
}

document.getElementById("loginBtn").addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    window.location.replace("index.html");
  } catch (err) {
    errorDiv.textContent = getAuthErrorMessage(err.code);

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
