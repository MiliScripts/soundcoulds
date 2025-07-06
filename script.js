// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality (shared across all pages)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const html = document.documentElement;
        
        if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            html.setAttribute('data-theme', 'dark');
            themeToggle.checked = true;
        } else {
            html.setAttribute('data-theme', 'light');
            themeToggle.checked = false;
        }

        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                html.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Search functionality (for index.html)
    const searchDrawer = document.getElementById('search-drawer');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchButton = document.querySelector('a[href="#search"]');
    const closeSearchDrawer = document.getElementById('close-search-drawer');
    
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            searchDrawer.classList.remove('hidden');
        });
    }
    
    if (closeSearchDrawer) {
        closeSearchDrawer.addEventListener('click', function() {
            searchDrawer.classList.add('hidden');
        });
    }
    
    async function performSearch(query) {
        if (!query) return;
        
        searchResults.innerHTML = '<div class="text-center py-8"><span class="loading loading-spinner loading-lg"></span></div>';
        
        try {
            const response = await fetch(`https://autumn-waterfall-ddac.milaadfarzian.workers.dev/search/${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.tracks && data.tracks.length > 0) {
                displayResults(data.tracks);
            } else {
                searchResults.innerHTML = '<div class="text-center py-8 text-lg">نتیجه‌ای یافت نشد</div>';
            }
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = '<div class="text-center py-8 text-lg text-error">خطا در دریافت نتایج</div>';
        }
    }
    
    function displayResults(tracks) {
        searchResults.innerHTML = tracks.map(track => `
            <div class="card card-side bg-base-100 shadow-xl mb-4">
                <figure class="w-24"><img src="${track.artwork_url || 'https://via.placeholder.com/150'}" alt="${track.title}" /></figure>
                <div class="card-body">
                    <h3 class="card-title">${track.title}</h3>
                    <p>${track.artist}</p>
                    <div class="card-actions justify-end">
                        <a href="/result.html?url=${encodeURIComponent(track.permalink_url)}" class="btn btn-primary">دانلود</a>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            performSearch(query);
        });
    }
});