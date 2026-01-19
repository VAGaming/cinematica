const API_KEY = "dbdaab4b0de7600840565a024e442974";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w1280";

document.addEventListener("DOMContentLoaded", (event) => {
  async function setRandomMovieBackground() {
    const randomPage = Math.floor(Math.random() * 500) + 1;

    const res = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${randomPage}`
    );
    const data = await res.json();

    const movie = data.results[Math.floor(Math.random() * data.results.length)];
    const imagePath = movie.backdrop_path || movie.poster_path;

    if (!imagePath) return;

    const imageUrl = `${IMAGE_BASE}${imagePath}`;

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      const bg = document.getElementById("bg");
      bg.style.backgroundImage = `url(${IMAGE_BASE}${imagePath})`;
      bg.style.backgroundSize = "cover";
      bg.style.backgroundPosition = "center";
      bg.style.backgroundRepeat = "no-repeat";
      bg.style.minHeight = "100vh";
      bg.style.backdropFilter = "blur(100px)";
      bg.style.transition = "opacity 0.5s ease-in-out";
      bg.style.opacity = "1";
    };
  }

  setRandomMovieBackground();
});

const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("togglePassword");
const eyeOpenIcon = `
  <i class="fa-solid fa-eye"></i>
`;

const eyeClosedIcon = `
  <i class="fa-solid fa-eye-slash"></i>
`;
let passwordVisible = false;
let visibilityTimeout;

togglePasswordButton.addEventListener("click", () => {
  passwordVisible = !passwordVisible;
  passwordInput.type = passwordVisible ? "text" : "password";
  togglePasswordButton.setAttribute("aria-pressed", passwordVisible);
  togglePasswordButton.setAttribute(
    "aria-label",
    passwordVisible ? "Hide password" : "Show password"
  );

  const eyeIcon = passwordVisible ? eyeOpenIcon : eyeClosedIcon;
  togglePasswordButton.innerHTML = eyeIcon;

  if (passwordVisible) {
    visibilityTimeout = setTimeout(() => {
      passwordInput.type = "password";
      passwordVisible = false;
      togglePasswordButton.setAttribute("aria-pressed", "false");
      togglePasswordButton.setAttribute("aria-label", "Show password");
      togglePasswordButton.innerHTML = eyeClosedIcon;
    }, 5000);
  } else {
    clearTimeout(visibilityTimeout);
  }
});
