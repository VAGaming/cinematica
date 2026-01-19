const API_KEY = "dbdaab4b0de7600840565a024e442974";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w300";
const IMG_URL_ORIGINAL = "https://image.tmdb.org/t/p/original";

/* ===============================
   GET QUERY PARAMS
================================ */
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const type = urlParams.get("type"); 

if (!id || !["movie", "tv"].includes(type)) {
  console.error("Invalid media params");
}

/* ===============================
   MAIN FETCH
================================ */
async function getMovieDetail() {
  try {
    const res = await fetch(
      `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=vi-VN&append_to_response=credits.videos&append_to_response=credits`,
    );

    if (!res.ok) throw new Error("TMDB fetch failed");

    const data = await res.json();

    renderHero(data);
    renderDescription(data);
    renderSidebar(data);
    renderCast(data.credits?.cast);
    renderCrew(data);

    let videos = data.videos?.results || [];
    
    if (videos.length === 0) {
        //gọi thêm language khác
        const videoRes = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
        const videoData = await videoRes.json();
        videos = videoData.results || [];
    }

    setupVideoPlayer(videos);

    if (type === "tv") {
      fetchEpisodes();
    }
  } catch (err) {
    console.error("Lỗi lấy dữ liệu phim:", err);
  }
}

/* ===============================
   VIDEO PLAYER LOGIC
================================ */
function setupVideoPlayer(videos = []) {
  const playBtn = document.querySelector(".btn-primary"); 
  const modal = document.getElementById("video-modal");
  const iframe = document.getElementById("trailer-video");
  const closeBtn = document.querySelector(".close-modal");

  if (!playBtn || !modal || !iframe) return;

  const trailer = videos.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  if (!trailer) {
    playBtn.innerHTML = `<i class="fa-solid fa-circle-info"></i> Không có trailer`;
    playBtn.style.opacity = "0.6";
    return;
  }

  playBtn.onclick = () => {
    iframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&modestbranding=1&rel=0`;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; 
  };

  const closeModal = () => {
    modal.style.display = "none";
    iframe.src = ""; 
    document.body.style.overflow = "auto";
  };

  if (closeBtn) closeBtn.onclick = closeModal;
  
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ===============================
   EPISODES
================================ */
async function fetchEpisodes() {
  try {
    const res = await fetch(
      `${BASE_URL}/tv/${id}/season/1?api_key=${API_KEY}&language=vi-VN`,
    );

    if (!res.ok) throw new Error("Episode fetch failed");

    const data = await res.json();
    renderEpisodes(data.episodes);
  } catch (err) {
    console.error("Lỗi lấy tập phim:", err);
  }
}

function renderEpisodes(episodes = []) {
  const container = document.getElementById("episodes-container");
  if (!container || episodes.length === 0) return;

  container.innerHTML = episodes
    .map(
      (ep) => `
      <div class="episode-item">
        <span class="ep-number">
          ${ep.episode_number < 10 ? "0" + ep.episode_number : ep.episode_number}
        </span>

        <div class="ep-thumbnail">
          <img src="${
            ep.still_path ? IMG_URL + ep.still_path : "./images/skibidi.png"
          }" alt="${ep.name || ""}">
          <i class="fa-regular fa-circle-play"></i>
        </div>

        <div class="ep-info">
          <div class="ep-head">
            <h4>${ep.name || "Tập phim"}</h4>
            <div class="duration">
              <i class="fa-regular fa-clock"></i>
              <span>${ep.runtime || "--"}p</span>
            </div>
          </div>
          <p>${ep.overview || "Nội dung đang được cập nhật..."}</p>
        </div>
      </div>
    `,
    )
    .join("");
}

/* ===============================
   HERO
================================ */
function renderHero(data) {
  const hero = document.getElementById("hero-banner");
  const titleEl = document.getElementById("movie-title");

  if (hero && data.backdrop_path) {
    hero.style.backgroundImage = `url(${IMG_URL_ORIGINAL + data.backdrop_path})`;
  }

  if (titleEl) {
    titleEl.innerText = data.title || data.name || "";
  }
}

/* ===============================
   DESCRIPTION
================================ */
function renderDescription(data) {
  const overviewEl = document.getElementById("movie-overview");
  if (!overviewEl) return;

  overviewEl.innerText = data.overview || "Nội dung đang cập nhật...";
}

/* ===============================
   SIDEBAR
================================ */
function renderSidebar(data) {
  // Year
  const yearEl = document.getElementById("movie-year");
  if (yearEl) {
    const date = data.release_date || data.first_air_date;
    yearEl.innerText = date ? date.split("-")[0] : "N/A";
  }

  // Genres
  const genreBox = document.getElementById("genres");
  if (genreBox && data.genres?.length) {
    genreBox.innerHTML = data.genres
      .map((g) => `<p class="tag">${g.name}</p>`)
      .join("");
  }

  // Rating
  const ratingStars = document.getElementById("rating-stars");
  if (ratingStars && typeof data.vote_average === "number") {
    const score = Math.round(data.vote_average / 2);
    ratingStars.innerHTML =
      "★".repeat(score) +
      "☆".repeat(5 - score) +
      ` <span>${data.vote_average.toFixed(1)}</span>`;
  }

  // Languages
  const langBox = document.getElementById("languages");
  if (langBox && data.spoken_languages?.length) {
    langBox.innerHTML = data.spoken_languages
      .map((l) => `<p class="tag">${l.name}</p>`)
      .join("");
  }
}

/* ===============================
   CAST
================================ */
function renderCast(cast = []) {
  const container = document.getElementById("cast-container");
  if (!container || cast.length === 0) return;

  container.innerHTML = cast
    .slice(0, 10)
    .map(
      (person) => `
      <img
        src="${
          person.profile_path
            ? IMG_URL + person.profile_path
            : "./images/placeholder.jpg"
        }"
        alt="${person.name || ""}"
        class="cast-item-img"
      >
    `,
    )
    .join("");
}

/* ===============================
   CREW / DIRECTOR
================================ */
function renderCrew(data) {
  const directorBox = document.getElementById("director-box");
  if (!directorBox) return;

  let director = null;

  if (data.created_by?.length) {
    director = data.created_by[0];
  } else if (data.credits?.crew) {
    director = data.credits.crew.find((c) => c.job === "Director");
  }

  if (!director) {
    directorBox.innerHTML = `<p class="tag">Đang cập nhật...</p>`;
    return;
  }

  directorBox.innerHTML = `
    <div class="crew-card">
      <img
        src="${
          director.profile_path
            ? IMG_URL + director.profile_path
            : "./images/placeholder.jpg"
        }"
        class="mini-thumb"
      >
      <p>${director.name}</p>
    </div>
  `;
}
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function getMediaFromQuery() {
  const params = new URLSearchParams(window.location.search);

  const id = params.get("id");
  const type = params.get("type");

  if (!id || !["movie", "tv"].includes(type)) {
    return null;
  }

  return { id, type };
}

async function fetchMedia(type, id) {
  const response = await fetch(
    `${TMDB_BASE_URL}/${type}/${id}?api_key=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("TMDB request failed");
  }

  return response.json();
}

function setDocumentTitle(type, data) {
  let title;
  let year;

  if (type === "movie") {
    title = data.title || data.original_title;
    year = data.release_date?.slice(0, 4);
  }

  if (type === "tv") {
    title = data.name || data.original_name;
    year = data.first_air_date?.slice(0, 4);
  }

  document.title = year ? `${title} (${year})` : title;
}

(async function init() {
  try {
    const media = getMediaFromQuery();
    if (!media) return;

    const data = await fetchMedia(media.type, media.id);
    setDocumentTitle(media.type, data);
  } catch (error) {
    console.error("TMDB title error:", error);
    document.title = "Cinematica";
  }
})();
/* ===============================
   INIT
================================ */
getMovieDetail();
