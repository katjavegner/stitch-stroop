/* ============================================================
   patterns.js — Loads pattern site data, renders cards with
   language + payment filter chips.
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

let allPatterns = [];
let activeLang = 'All';
let activePayment = 'All';

function filterPatterns() {
  return allPatterns.filter(p => {
    const langMatch = activeLang === 'All' || (p.languages && p.languages.includes(activeLang));
    const payMatch =
      activePayment === 'All' ||
      (activePayment === 'Card-friendly' && p.foreignCards === true) ||
      (activePayment === 'iDEAL / local' && p.foreignCards === false);
    return langMatch && payMatch;
  });
}

function renderLangChips() {
  const langs = new Set();
  allPatterns.forEach(p => (p.languages || []).forEach(l => langs.add(l)));
  const sorted = ['All', ...Array.from(langs).sort()];

  const container = document.getElementById('lang-filters');
  if (!container) return;

  container.innerHTML = `<span class="filter-label">Language:</span>`;
  sorted.forEach(lang => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (lang === activeLang ? ' active' : '');
    btn.textContent = lang;
    btn.addEventListener('click', () => {
      activeLang = lang;
      renderLangChips();
      renderPaymentChips();
      renderPatterns(filterPatterns());
    });
    container.appendChild(btn);
  });
}

function renderPaymentChips() {
  const options = ['All', 'Card-friendly', 'iDEAL / local'];
  const container = document.getElementById('payment-filters');
  if (!container) return;

  container.innerHTML = `<span class="filter-label">Payment:</span>`;
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (opt === activePayment ? ' active' : '');
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      activePayment = opt;
      renderLangChips();
      renderPaymentChips();
      renderPatterns(filterPatterns());
    });
    container.appendChild(btn);
  });
}

function renderPatterns(patterns) {
  const container = document.getElementById('pattern-list');
  if (!container) return;

  if (patterns.length === 0) {
    container.innerHTML = `<p class="text-muted" style="padding:var(--space-lg) 0;">No pattern sites match the current filters.</p>`;
    return;
  }

  container.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'card-grid';

  patterns.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';

    const langBadges = (p.languages || []).map(l =>
      `<span class="badge badge-lang">${escapeHTML(l)}</span>`
    ).join('');

    const cardBadge = p.foreignCards
      ? `<span class="badge badge-card-friendly">Card-friendly</span>`
      : '';

    const currencyBadge = p.currency
      ? `<span class="badge">${escapeHTML(p.currency)}</span>`
      : '';

    card.innerHTML = `
      <h2 class="card-name">${escapeHTML(p.name)}</h2>
      <div class="badge-row">
        ${langBadges}
        ${currencyBadge}
        ${cardBadge}
      </div>
      <p class="card-description">${escapeHTML(p.description)}</p>
      <div class="card-links">
        <a href="${escapeHTML(p.website)}" class="btn btn-outline btn-sm" target="_blank" rel="noopener">Visit site →</a>
      </div>
    `;

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('pattern-list');

  try {
    const res = await fetch('data/patterns.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    allPatterns = data.items || [];

    renderLangChips();
    renderPaymentChips();
    renderPatterns(allPatterns);

  } catch (err) {
    console.error('patterns.js:', err);
    if (list) {
      list.innerHTML = `<p class="error-message">Could not load pattern data. Please try refreshing the page.</p>`;
    }
  }
});
