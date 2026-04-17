/* ============================================================
   inspiration.js — Loads maker inspiration data, renders
   "Chat members" and "Other makers we love" sections.
   ============================================================ */

function escapeHTML(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str || ''));
  return d.innerHTML;
}

const PLATFORM_LABELS = {
  website:   'Website',
  instagram: 'Instagram',
  youtube:   'YouTube',
  tiktok:    'TikTok',
  twitter:   'Twitter / X',
  substack:  'Substack',
  patreon:   'Patreon',
};

function platformBadge(type) {
  const label = PLATFORM_LABELS[type] || type;
  return `<span class="badge badge-platform">${escapeHTML(label)}</span>`;
}

function renderMakerCard(maker) {
  const card = document.createElement('article');
  card.className = 'card';

  const imageHTML = maker.image
    ? `<img src="${escapeHTML(maker.image)}" alt="${escapeHTML(maker.name)}" class="card-image" loading="lazy">`
    : '';

  const badgeRow = (maker.platforms || []).map(p => platformBadge(p.type)).join('');

  const links = (maker.platforms || []).map(p => {
    const label = PLATFORM_LABELS[p.type] || p.type;
    return `<a href="${escapeHTML(p.url)}" class="btn btn-outline btn-sm" target="_blank" rel="noopener">${escapeHTML(label)} →</a>`;
  }).join('');

  card.innerHTML = `
    ${imageHTML}
    <h2 class="card-name">${escapeHTML(maker.name)}</h2>
    <p class="card-handle">${escapeHTML(maker.handle)}</p>
    <div class="badge-row">${badgeRow}</div>
    <p class="card-description">${escapeHTML(maker.description)}</p>
    <div class="card-links">${links}</div>
  `;

  return card;
}

function renderSection(sectionEl, makers) {
  if (!sectionEl) return;

  if (makers.length === 0) {
    sectionEl.innerHTML = `<p class="text-muted">Nothing here yet.</p>`;
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'card-grid';
  makers.forEach(maker => grid.appendChild(renderMakerCard(maker)));
  sectionEl.appendChild(grid);
}

document.addEventListener('DOMContentLoaded', async () => {
  const membersSection = document.getElementById('members-section');
  const inspoSection = document.getElementById('inspo-section');

  try {
    const res = await fetch('data/inspiration.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items = data.items || [];

    const members = items.filter(i => i.group === 'members');
    const inspo = items.filter(i => i.group === 'inspo');

    renderSection(membersSection, members);
    renderSection(inspoSection, inspo);

  } catch (err) {
    console.error('inspiration.js:', err);
    const target = membersSection || inspoSection;
    if (target) {
      target.innerHTML = `<p class="error-message">Could not load inspiration data. Please try refreshing the page.</p>`;
    }
  }
});
