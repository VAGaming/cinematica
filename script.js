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

document.addEventListener('DOMContentLoaded', setupHero);


const GENRE_URL = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`;
const DISCOVER_URL = `${BASE_URL}/discover/movie?api_key=${API_KEY}`;

let currentSlide = 0;

//Mục phim
async function setupCategories() {
    try {
        const res = await fetch(GENRE_URL);
        const genreData = await res.json();
        const genres = genreData.genres;

        const container = document.getElementById('categories-container');

        // Mỗi mục 4 phim
        const categoryCards = await Promise.all(genres.map(async (genre) => {
            const movieRes = await fetch(`${DISCOVER_URL}&with_genres=${genre.id}`);
            const movieData = await movieRes.json();
            const fourMovies = movieData.results.slice(0, 4);

            return `
                <div class="category-card">
                    <div class="category-images">
                        ${fourMovies.map(m => `<img src="${IMG_URL + m.poster_path}" alt="movie">`).join('')}
                        <div class="category-images-fade-out"></div>
                    </div>
                    <div class="category-info">
                        <span>${genre.name}</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </div>
                </div>
            `;
        }));

        container.innerHTML = categoryCards.join('');
        setupSliderLogic(genres.length);

    } catch (err) {
        console.error("Lỗi tải Categories:", err);
    }
}

// Slider
function setupSliderLogic(totalItems) {
    const container = document.getElementById('categories-container');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const dotIndicator = document.getElementById('dot-indicator');
    
    const itemsPerPage = 5;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Dot
    dotIndicator.innerHTML = ''; 
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active'); 
        dotIndicator.appendChild(dot);
    }

    // Cập nhật trạng thái dấu gạch
    const updateDots = (index) => {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };

    // Nút Next
    nextBtn.onclick = () => {
        if (currentSlide < totalPages - 1) {
            currentSlide++;
            container.style.transform = `translateX(-${currentSlide * 100}%)`;
            updateDots(currentSlide);
        }
    };

    // Nút Prev
    prevBtn.onclick = () => {
        if (currentSlide > 0) {
            currentSlide--;
            container.style.transform = `translateX(-${currentSlide * 100}%)`;
            updateDots(currentSlide);
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    setupHero(); 
    setupCategories(); 
});

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