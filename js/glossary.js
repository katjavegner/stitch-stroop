/* ============================================================
   glossary.js — Loads glossary data, renders NL/EN/RU rows
   with category filter chips and separator rows.
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

const CATEGORY_LABELS = {
  fibre:     'Fibres',
  weave:     'Weaves',
  notion:    'Notions',
  technique: 'Techniques',
};

const CATEGORY_ORDER = ['fibre', 'weave', 'notion', 'technique'];

let allTerms = [];
let activeCategory = 'All';

function filterTerms() {
  if (activeCategory === 'All') return allTerms;
  return allTerms.filter(t => t.category === activeCategory);
}

function renderCategoryChips() {
  const container = document.getElementById('category-filters');
  if (!container) return;

  const categories = ['All', ...CATEGORY_ORDER];
  container.innerHTML = `<span class="filter-label">Category:</span>`;

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (cat === activeCategory ? ' active' : '');
    btn.textContent = cat === 'All' ? 'All' : CATEGORY_LABELS[cat] || cat;
    btn.addEventListener('click', () => {
      activeCategory = cat;
      renderCategoryChips();
      renderGlossary(filterTerms());
    });
    container.appendChild(btn);
  });
}

function renderGlossary(terms) {
  const container = document.getElementById('glossary-list');
  if (!container) return;

  if (terms.length === 0) {
    container.innerHTML = `<p class="text-muted" style="padding:var(--space-lg) 0;">No terms match the current filter.</p>`;
    return;
  }

  container.innerHTML = '';
  const list = document.createElement('div');
  list.className = 'glossary-list';

  // Group terms by category if showing all
  let renderedCategories = new Set();

  terms.forEach(term => {
    // Insert separator row when category changes (only in "All" view)
    if (activeCategory === 'All' && !renderedCategories.has(term.category)) {
      renderedCategories.add(term.category);
      const sep = document.createElement('div');
      sep.className = 'glossary-separator';
      sep.textContent = CATEGORY_LABELS[term.category] || term.category;
      list.appendChild(sep);
    }

    const row = document.createElement('div');
    row.className = 'glossary-row';

    const noteHTML = term.note
      ? `<p class="glossary-note">${escapeHTML(term.note)}</p>`
      : '';

    row.innerHTML = `
      <div class="glossary-nl-col">
        <span class="glossary-nl">${escapeHTML(term.nl)}</span>
        <span class="glossary-lang-tag">NL</span>
      </div>
      <div class="glossary-translations">
        <span class="glossary-en">
          <span class="glossary-prefix">EN</span>${escapeHTML(term.en)}
        </span>
        <span class="glossary-ru">
          <span class="glossary-prefix">RU</span>${escapeHTML(term.ru)}
        </span>
        ${noteHTML}
      </div>
    `;

    list.appendChild(row);
  });

  container.appendChild(list);
}

document.addEventListener('DOMContentLoaded', async () => {
  const listContainer = document.getElementById('glossary-list');

  try {
    const res = await fetch('data/glossary.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Sort by category order, then alphabetically within category
    allTerms = (data.items || []).sort((a, b) => {
      const catA = CATEGORY_ORDER.indexOf(a.category);
      const catB = CATEGORY_ORDER.indexOf(b.category);
      if (catA !== catB) return catA - catB;
      return a.nl.localeCompare(b.nl);
    });

    renderCategoryChips();
    renderGlossary(allTerms);

  } catch (err) {
    console.error('glossary.js:', err);
    if (listContainer) {
      listContainer.innerHTML = `<p class="error-message">Could not load glossary data. Please try refreshing the page.</p>`;
    }
  }
});
