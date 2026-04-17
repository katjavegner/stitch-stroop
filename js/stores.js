/* ============================================================
   stores.js — Loads fabric shop data, renders map + cards,
   handles city filter chips.
   ============================================================ */

/* ---- Helpers ---- */
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

/* ---- State ---- */
let allShops = [];
let activeCity = 'All';
let map = null;
let markers = {};

/* ---- Map ---- */
function initMap(shops) {
  if (!window.L) {
    document.getElementById('map').style.display = 'none';
    return;
  }

  // Center on Netherlands
  map = L.map('map', {
    center: [52.25, 4.75],
    zoom: 8,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  shops.forEach(shop => {
    if (!shop.lat || !shop.lng) return;
    const marker = createMarker(shop, false);
    markers[shop.id] = marker;
  });
}

function createMarker(shop, highlighted) {
  const color = highlighted ? '#C84B2F' : '#1B3A5C';
  const icon = L.divIcon({
    className: '',
    html: `<div style="
      width:12px;height:12px;
      background:${color};
      border:2px solid #fff;
      border-radius:50%;
      box-shadow:0 1px 4px rgba(0,0,0,0.3);
      transition:background 0.2s;
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

  const marker = L.marker([shop.lat, shop.lng], { icon })
    .addTo(map)
    .bindPopup(`
      <strong style="font-family:'Fraunces',serif;font-size:1rem;">${escapeHTML(shop.name)}</strong><br>
      <span style="color:#5F5E5A;font-size:0.8125rem;">${escapeHTML(shop.city)}</span>
      ${shop.mapUrl ? `<br><a href="${escapeHTML(shop.mapUrl)}" target="_blank" rel="noopener" style="font-size:0.8125rem;">Open in Maps →</a>` : ''}
    `);

  marker.on('mouseover', () => setMarkerHighlight(shop.id, true));
  marker.on('mouseout', () => setMarkerHighlight(shop.id, false));

  return marker;
}

function setMarkerHighlight(shopId, on) {
  const marker = markers[shopId];
  if (!marker) return;
  const color = on ? '#C84B2F' : '#1B3A5C';
  const el = marker.getElement();
  if (el) {
    const dot = el.querySelector('div');
    if (dot) dot.style.background = color;
  }
}

function updateMapVisibility(filteredShops) {
  if (!map) return;
  const visibleIds = new Set(filteredShops.map(s => s.id));

  Object.entries(markers).forEach(([id, marker]) => {
    if (visibleIds.has(id)) {
      if (!map.hasLayer(marker)) marker.addTo(map);
    } else {
      if (map.hasLayer(marker)) map.removeLayer(marker);
    }
  });
}

/* ---- City filter chips ---- */
function renderCityChips(shops) {
  const cities = ['All', ...new Set(shops.map(s => s.city).sort())];
  const container = document.getElementById('city-filters');
  if (!container) return;

  container.innerHTML = `<span class="filter-label">City:</span>`;

  cities.forEach(city => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (city === activeCity ? ' active' : '');
    btn.textContent = city;
    btn.addEventListener('click', () => {
      activeCity = city;
      renderCityChips(shops);
      renderShops(filterShops());
      updateMapVisibility(filterShops());
    });
    container.appendChild(btn);
  });
}

function filterShops() {
  if (activeCity === 'All') return allShops;
  return allShops.filter(s => s.city === activeCity);
}

/* ---- Shop cards ---- */
function renderShops(shops) {
  const container = document.getElementById('shop-list');
  if (!container) return;

  if (shops.length === 0) {
    container.innerHTML = `<p class="text-muted" style="padding:var(--space-lg) 0;">No shops match the current filter.</p>`;
    return;
  }

  container.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'card-grid';

  shops.forEach(shop => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.id = shop.id;

    const pickBadge = shop.pick ? `<span class="badge-pick">Pick</span>` : '';
    const websiteLink = shop.website
      ? `<a href="${escapeHTML(shop.website)}" class="btn btn-outline btn-sm" target="_blank" rel="noopener">Website →</a>`
      : '';
    const mapsLink = shop.mapUrl
      ? `<a href="${escapeHTML(shop.mapUrl)}" class="btn btn-outline btn-sm" target="_blank" rel="noopener">Directions</a>`
      : '';

    card.innerHTML = `
      ${pickBadge}
      <p class="card-city">${escapeHTML(shop.city)}</p>
      <h2 class="card-name">${escapeHTML(shop.name)}</h2>
      <p class="card-description">${escapeHTML(shop.description)}</p>
      ${shop.beforeYouGo ? `
      <div class="before-you-go">
        <strong>Before you go</strong>
        ${escapeHTML(shop.beforeYouGo)}
      </div>` : ''}
      <div class="card-links">
        ${websiteLink}
        ${mapsLink}
      </div>
    `;

    // Highlight map pin on hover
    card.addEventListener('mouseenter', () => setMarkerHighlight(shop.id, true));
    card.addEventListener('mouseleave', () => setMarkerHighlight(shop.id, false));

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', async () => {
  const shopList = document.getElementById('shop-list');
  const mapEl = document.getElementById('map');

  try {
    const res = await fetch('data/stores.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    allShops = data.items || [];

    if (mapEl) initMap(allShops);
    renderCityChips(allShops);
    renderShops(allShops);

  } catch (err) {
    console.error('stores.js:', err);
    if (shopList) {
      shopList.innerHTML = `<p class="error-message">Could not load shop data. Please try refreshing the page.</p>`;
    }
    if (mapEl) mapEl.style.display = 'none';
  }
});
