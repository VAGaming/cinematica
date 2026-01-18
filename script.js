const API_KEY = 'dbdaab4b0de7600840565a024e442974';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w300';

//Hàm lấy phim từng trang trên TMDB
async function fetchMoviesByPage(page) {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
    const data = await response.json();

    return data.results;
}

//Hàm tạo HTML cho từng hàng phim chạy
function createMovies(movies) {
    return movies.map(movie => `
        <div class="marquee-item">
            <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}" loading="lazy">
        </div>`
    ).join('');
}

//
async function setupHero() {
    try {
        for(let i = 1; i <= 4; i++) {
            const row = document.getElementById(`marquee-row-${i}`);
            if(row) {
                const movies = await fetchMoviesByPage(i);
                const posterHTML = createMovies(movies);

                row.innerHTML = posterHTML + posterHTML;
            }
        }
    }
    catch(err) {
        console.err("Lỗi tải poster phim.");
    }
}
document,addEventListener('DOMContentLoaded', setupHero);

// const GENRE_URL = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`;
// const DISCOVER_URL = `${BASE_URL}/discover/movie?api_key=${API_KEY}`;

// let currentSlide = 0;

// //Mục phim
// async function setupCategories() {
//     try {
//         const res = await fetch(GENRE_URL);
//         const genreData = await res.json();
//         const genres = genreData.genres;

//         const container = document.getElementById('categories-container');

//         // Mỗi mục 4 phim
//         const categoryCards = await Promise.all(genres.map(async (genre) => {
//             const movieRes = await fetch(`${DISCOVER_URL}&with_genres=${genre.id}`);
//             const movieData = await movieRes.json();
//             const fourMovies = movieData.results.slice(0, 4);

//             return `
//                 <div class="category-card">
//                     <div class="category-images">
//                         ${fourMovies.map(m => `<img src="${IMG_URL + m.poster_path}" alt="movie">`).join('')}
//                         <div class="category-images-fade-out"></div>
//                     </div>
//                     <div class="category-info">
//                         <span>${genre.name}</span>
//                         <i class="fa-solid fa-arrow-right"></i>
//                     </div>
//                 </div>
//             `;
//         }));

//         container.innerHTML = categoryCards.join('');
//         setupSliderLogic(genres.length);

//     } catch (err) {
//         console.error("Lỗi tải Categories:", err);
//     }
// }
// // Slider
// function setupSliderLogic(totalItems) {
//     const container = document.getElementById('categories-container');
//     const nextBtn = document.getElementById('next-btn');
//     const prevBtn = document.getElementById('prev-btn');
//     const dotIndicator = document.getElementById('dot-indicator');
    
//     const itemsPerPage = 5;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);

//     // Dot
//     dotIndicator.innerHTML = ''; 
//     for (let i = 0; i < totalPages; i++) {
//         const dot = document.createElement('div');
//         dot.classList.add('dot');
//         if (i === 0) dot.classList.add('active'); 
//         dotIndicator.appendChild(dot);
//     }

//     // Cập nhật trạng thái dấu gạch
//     const updateDots = (index) => {
//         const dots = document.querySelectorAll('.dot');
//         dots.forEach((dot, i) => {
//             dot.classList.toggle('active', i === index);
//         });
//     };

//     // Nút Next
//     nextBtn.onclick = () => {
//         if (currentSlide < totalPages - 1) {
//             currentSlide++;
//             container.style.transform = `translateX(-${currentSlide * 100}%)`;
//             updateDots(currentSlide);
//         }
//     };

//     // Nút Prev
//     prevBtn.onclick = () => {
//         if (currentSlide > 0) {
//             currentSlide--;
//             container.style.transform = `translateX(-${currentSlide * 100}%)`;
//             updateDots(currentSlide);
//         }
//     };
// }

// document.addEventListener('DOMContentLoaded', () => {
//     setupHero(); 
//     setupCategories(); 
// });
const API_ENDPOINTS = {
  popular: `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=vi-VN`,
  now_playing: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=vi-VN`,
  top_rated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=vi-VN`
};

async function loadMovies(type, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch(API_ENDPOINTS[type]);
    const data = await res.json();
    
    container.innerHTML = data.results.slice(0, 20).map(movie => {
      const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '';
      const rating = movie.vote_average.toFixed(1);

      return `
        <a href="movie-detail.html?id=${movie.id}&type=movie" class="movie-card">
          <img src="${IMG_URL + movie.backdrop_path}" alt="${movie.title}" loading="lazy">
          <div class="movie-card-overlay">
            <h4>${movie.title}</h4>
            <div class="movie-card-meta">
              <span class="rating-star"><i class="fa-solid fa-star"></i> ${rating}</span>
              <span class="year">${releaseYear}</span>
            </div>
          </div>
        </a>
      `;
    }).join('');
  } catch (err) {
    console.error(`Lỗi:`, err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadMovies('popular', 'popular-slider');
  loadMovies('now_playing', 'now-playing-slider');
  loadMovies('top_rated', 'top-rated-slider');
});


// async function loadTV(containerId) {
//   const container = document.getElementById(containerId);
//   if (!container) return;

//   try {
//     const res = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=vi-VN`);
//     const data = await res.json();
    
//     container.innerHTML = data.results.slice(0, 20).map(movie => {
//       const releaseYear = movie.first_air_date ? movie.first_air_date.split('-')[0] : '';
//       const rating = movie.vote_average.toFixed(1);

//       return `
//         <a href="tv-detail.html?id=${movie.id}&type=tv" class="movie-card">
//           <img src="${IMG_URL + movie.backdrop_path}" alt="${movie.name}" loading="lazy">
//           <div class="movie-card-overlay">
//             <h4>${movie.name}</h4>
//             <div class="movie-card-meta">
//               <span class="rating-star"><i class="fa-solid fa-star"></i> ${rating}</span>
//               <span class="year">${releaseYear}</span>
//             </div>
//           </div>
//         </a>
//       `;
//     }).join('');
//   } catch (err) {
//     console.error(`Lỗi:`, err);
//   }
// }

document.addEventListener('DOMContentLoaded', loadTV('tv-slider'));
//---------------------------
function setupFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const isNowActive = item.classList.toggle('active');
      const icon = item.querySelector('.faq-toggle i');
      
      icon.className = isNowActive ? 'fa-solid fa-minus' : 'fa-solid fa-plus';
    });
  });
}

document.addEventListener('DOMContentLoaded', setupFAQ);


//Background Section xem chùa
async function setupFreeTrialBackground() {
    const background = document.getElementById('free-trial-background');

    try {
        const [page1, page2] = await Promise.all([
            fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`).then(r => r.json()),
            fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=2`).then(r => r.json())
        ]);

        const movies = [...page1.results, ...page2.results];

        background.innerHTML = movies.map(movie => `
            <img src="${IMG_URL + movie.poster_path}" alt="poster" loading="lazy">
        `).join('');
    }
    catch(err) {
        console.error("Lỗi tải ảnh:", err);
    }
}

document.addEventListener('DOMContentLoaded', setupFreeTrialBackground);