/* ============================================================
   courses.js — Loads courses data, renders cards with
   city + language filter chips.
   ============================================================ */

function formatDate(isoString) {
  if (!isoString) return '';
  const [year, month, day] = isoString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function escapeHTML(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str || ''));
  return d.innerHTML;
}

let allCourses = [];
let activeCity = 'All';
let activeLang = 'All';

function filterCourses() {
  return allCourses.filter(course => {
    const cityMatch = activeCity === 'All' || course.city === activeCity;
    const langMatch = activeLang === 'All' || (course.languages && course.languages.includes(activeLang));
    return cityMatch && langMatch;
  });
}

function renderCityChips() {
  const cities = ['All', ...new Set(allCourses.map(c => c.city).sort())];
  const container = document.getElementById('city-filters');
  if (!container) return;

  container.innerHTML = `<span class="filter-label">City:</span>`;
  cities.forEach(city => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (city === activeCity ? ' active' : '');
    btn.textContent = city;
    btn.addEventListener('click', () => {
      activeCity = city;
      renderCityChips();
      renderLangChips();
      renderCourses(filterCourses());
    });
    container.appendChild(btn);
  });
}

function renderLangChips() {
  const langs = new Set();
  allCourses.forEach(c => (c.languages || []).forEach(l => langs.add(l)));
  const sortedLangs = ['All', ...Array.from(langs).sort()];

  const container = document.getElementById('lang-filters');
  if (!container) return;

  container.innerHTML = `<span class="filter-label">Language:</span>`;
  sortedLangs.forEach(lang => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (lang === activeLang ? ' active' : '');
    btn.textContent = lang;
    btn.addEventListener('click', () => {
      activeLang = lang;
      renderCityChips();
      renderLangChips();
      renderCourses(filterCourses());
    });
    container.appendChild(btn);
  });
}

function renderCourses(courses) {
  const container = document.getElementById('course-list');
  if (!container) return;

  if (courses.length === 0) {
    container.innerHTML = `<p class="text-muted" style="padding:var(--space-lg) 0;">No courses match the current filters.</p>`;
    return;
  }

  container.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'card-grid';

  courses.forEach(course => {
    const card = document.createElement('article');
    card.className = 'card';

    const langBadges = (course.languages || []).map(l =>
      `<span class="badge badge-lang">${escapeHTML(l)}</span>`
    ).join('');

    const websiteLink = course.website
      ? `<a href="${escapeHTML(course.website)}" class="btn btn-outline btn-sm" target="_blank" rel="noopener">Visit website →</a>`
      : '';

    card.innerHTML = `
      <p class="card-city">${escapeHTML(course.city)}</p>
      <h2 class="card-name">${escapeHTML(course.name)}</h2>
      <div class="badge-row">${langBadges}</div>
      <p class="schedule-line">${escapeHTML(course.schedule)}</p>
      <p class="card-description">${escapeHTML(course.description)}</p>
      <div class="card-links">${websiteLink}</div>
    `;

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('course-list');

  try {
    const res = await fetch('data/courses.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    allCourses = data.items || [];

    renderCityChips();
    renderLangChips();
    renderCourses(allCourses);

  } catch (err) {
    console.error('courses.js:', err);
    if (list) {
      list.innerHTML = `<p class="error-message">Could not load course data. Please try refreshing the page.</p>`;
    }
  }
});
