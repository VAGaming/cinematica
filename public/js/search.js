function initGlobalSearch() {
  const searchBtn = document.querySelector(".header-icon .fa-magnifying-glass")?.parentElement;
  const searchModal = document.getElementById("search-modal");
  const closeSearch = document.querySelector(".close-search");
  const searchInput = document.getElementById("search-input");
  const submitBtn = document.getElementById("search-submit-btn");

  if (!searchBtn || !searchModal) return;

  searchBtn.onclick = (e) => {
    e.preventDefault();
    searchModal.style.display = "flex";
    searchInput.focus();
  };

  // Đóng modal
  const closeModal = () => (searchModal.style.display = "none");
  if (closeSearch) closeSearch.onclick = closeModal;
  window.addEventListener("click", (e) => { if (e.target === searchModal) closeModal(); });

  // Xử lý chuyển trang khi tìm kiếm
  const performSearch = () => {
    const val = searchInput.value.trim();
    if (val) {
      window.location.href = `./filter.html?query=${encodeURIComponent(val)}`;
    }
  };

  if (submitBtn) submitBtn.onclick = performSearch;
  searchInput.onkeypress = (e) => { if (e.key === "Enter") performSearch(); };
}

document.addEventListener("DOMContentLoaded", initGlobalSearch);