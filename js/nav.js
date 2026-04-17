/* ============================================================
   nav.js — Injects shared nav & footer, handles mobile menu,
   loads "This week" card on homepage.
   ============================================================ */

const NAV_LINKS = [
  { label: 'Home',      href: 'index.html' },
  { label: 'Shops',     href: 'stores.html' },
  { label: 'Courses',   href: 'courses.html' },
  { label: 'Patterns',  href: 'patterns.html' },
  { label: 'Inspo',     href: 'inspiration.html' },
  { label: 'Glossary',  href: 'glossary.html' },
  { label: 'Tips',      href: 'faq.html' },
  { label: 'Contact',   href: 'contact.html' },
];

/* ---- Helpers ---- */
function formatDate(isoString) {
  if (!isoString) return '';
  const [year, month, day] = isoString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getActivePage() {
  const path = window.location.pathname;
  const file = path.split('/').pop() || 'index.html';
  return file === '' ? 'index.html' : file;
}

/* ---- Inject Nav ---- */
function injectNav() {
  const placeholder = document.getElementById('site-nav');
  if (!placeholder) return;

  const activePage = getActivePage();

  const linksHTML = NAV_LINKS.map(link => {
    const isActive = activePage === link.href;
    return `<li><a href="${link.href}"${isActive ? ' class="active" aria-current="page"' : ''}>${link.label}</a></li>`;
  }).join('\n');

  const mobileLinksHTML = NAV_LINKS.map(link => {
    const isActive = activePage === link.href;
    return `<li><a href="${link.href}"${isActive ? ' class="active"' : ''}>${link.label}</a></li>`;
  }).join('\n');

  const navHTML = `
<nav class="site-nav" role="navigation" aria-label="Main navigation">
  <div class="nav-inner">
    <a href="index.html" class="nav-brand">Stitch &amp; Stroop</a>
    <ul class="nav-links" id="nav-links-desktop" role="list">
      ${linksHTML}
    </ul>
    <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-mobile-menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
  <div class="nav-mobile-menu" id="nav-mobile-menu" role="dialog" aria-label="Mobile menu">
    <ul role="list">
      ${mobileLinksHTML}
    </ul>
  </div>
</nav>`;

  placeholder.outerHTML = navHTML;

  // Bind hamburger after injection
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', !isOpen);
      hamburger.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      const nav = document.querySelector('.site-nav');
      if (nav && !nav.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ---- Inject Footer ---- */
function injectFooter() {
  const placeholder = document.getElementById('site-footer');
  if (!placeholder) return;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const footerHTML = `
<footer class="site-footer" role="contentinfo">
  <div class="footer-inner">
    <span>Maintained by Stitch &amp; Stroop &nbsp;&middot;&nbsp; Last updated ${dateStr}</span>
    <a href="contact.html">Contribute &rarr;</a>
  </div>
</footer>`;

  placeholder.outerHTML = footerHTML;
}

/* ---- Load "This Week" card on homepage ---- */
async function loadThisWeek() {
  const card = document.getElementById('this-week-card');
  if (!card) return;

  try {
    const res = await fetch('data/homepage.json');
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    const tw = data.thisWeek;
    if (!tw) return;

    card.innerHTML = `
      <span class="eyebrow">This week</span>
      <h3>${tw.title}</h3>
      <p>${tw.body}</p>
      <span class="this-week-date">${tw.dateLabel}</span>
    `;
  } catch (err) {
    // Silently fail — card stays with loading state or is already server-rendered
    card.innerHTML = `<span class="eyebrow">This week</span><p class="text-muted">Nothing planned yet — check back soon.</p>`;
  }
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  injectNav();
  injectFooter();
  loadThisWeek();
});
