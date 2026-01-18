const API_KEY = 'dbdaab4b0de7600840565a024e442974';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w300';
const IMG_URL_ORIGINAL = 'https://image.tmdb.org/t/p/original';

// 1. Lấy ID từ URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const type = urlParams.get('type');

async function getMovieDetail() {
    try {
        const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=vi-VN&append_to_response=credits`);
        const data = await res.json();

        renderHero(data);
        renderDescription(data);
        renderSidebar(data);
        renderCast(data.credits.cast);
        renderCrew(data);

        if(type === 'tv') {
            fetchEpisodes();
        }
    } catch (err) {
        console.error("Lỗi lấy dữ liệu phim:", err);
    }
}
async function fetchEpisodes() {
    try {
        // mặc định ss1
        const res = await fetch(`${BASE_URL}/tv/${id}/season/1?api_key=${API_KEY}&language=vi-VN`);
        const data = await res.json();
        renderEpisodes(data.episodes);
    } catch (err) {
        console.error("Lỗi lấy tập phim:", err);
    }
}
function renderEpisodes(episodes) {
    const container = document.getElementById('episodes-container');

    container.innerHTML = episodes.map(ep => `
        <div class="episode-item">
            <span class="ep-number">${ep.episode_number < 10 ? '0' + ep.episode_number : ep.episode_number}</span>
            <div class="ep-thumbnail">
                <img src="${ep.still_path ? IMG_URL + ep.still_path : './images/skibidi.png'}" alt="${ep.name}">
                <i class="fa-regular fa-circle-play"></i>
            </div>
            <div class="ep-info">
                <div class="ep-head">
                    <h4>${ep.name}</h4>
                    <div class="duration">
                        <i class="fa-regular fa-clock"></i>
                        <span>${ep.runtime || '--'}p</span>
                    </div>
                </div>
                <p>${ep.overview || "Nội dung đang được cập nhật..."}</p>
            </div>
        </div>
    `).join('');
}

function renderHero(data) {
    const hero = document.getElementById('hero-banner');
    hero.style.backgroundImage = `url(${IMG_URL_ORIGINAL + data.backdrop_path})`;
    document.getElementById('movie-title').innerText = data.title || data.name;
}

function renderDescription(data) {
    //mô tả
    document.getElementById('movie-overview').innerText = data.overview;
}

function renderSidebar(data) {
    //năm sx
    const date = data.release_date || data.first_air_date || "";
    document.getElementById('movie-year').innerText = (date ? date.split('-')[0] : "N/A");
    
    // thể loại 
    const genreBox = document.getElementById('genres');
    genreBox.innerHTML = data.genres.map(g => `<p class="tag">${g.name}</p>`).join('');

    //  đánh giá
    const ratingStars = document.getElementById('rating-stars');
    const score = Math.round(data.vote_average / 2); 
    ratingStars.innerHTML = '★'.repeat(score) + '☆'.repeat(5 - score) + ` <span>${data.vote_average.toFixed(1)}</span>`;

    //Đổ Ngôn ngữ giả lập (đây là các ngôn ngữ có sử dụng trong phim)
    const langBox = document.getElementById('languages');
    langBox.innerHTML = data.spoken_languages.map(l => `<p class="tag">${l.name}</p>`).join('');
}

function renderCast(cast) {
    const container = document.getElementById('cast-container');
    container.innerHTML = cast.slice(0, 10).map(person => `
        <img src="${person.profile_path ? IMG_URL + person.profile_path : 'placeholder.jpg'}" alt="${person.name}" class="cast-item-img">
    `).join('');
}

function renderCrew(data) {
    const directorBox = document.getElementById('director-box');

    let directorData = null;

    if (data.created_by && data.created_by.length > 0) {
        const creator = data.created_by[0];
        directorData = {
            name: creator.name,
            profile_path: creator.profile_path
        };
    } 
    else if (data.credits && data.credits.crew) {
        const director = data.credits.crew.find(d => d.job === 'Director');
        if (director) {
            directorData = {
                name: director.name,
                profile_path: director.profile_path
            }; 
        }
    }

    if (directorData) {
        directorBox.innerHTML = `
            <div class="crew-card">
                <img src="${IMG_URL + directorData.profile_path}" class="mini-thumb">
                <p>${directorData.name}</p>
            </div>`;
    }
    else {
        directorBox.innerHTML = `<p class="tag">Đang cập nhật...</p>`;
    }
}

document.addEventListener('DOMContentLoaded', getMovieDetail);
