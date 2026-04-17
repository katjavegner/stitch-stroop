# NL Sewing community website — build brief

## What this is

A small static website for a Netherlands-based sewing community chat. It lists fabric shops, sewing courses, pattern websites, inspiration links, and a fabric glossary. Visitors can contact the community via a smart form. Site content is in English; individual resource comments and tags may be in Russian or Dutch where relevant.

The site must be:

- Fully static (no backend server)
- Hostable for free on GitHub Pages
- Buildable and deployable with zero build step (no npm, no bundler, no framework)
- Maintainable by someone editing JSON files — not HTML

## Tech stack — non-negotiable

- Plain HTML + CSS + vanilla JavaScript (ES modules, no TypeScript)
- Data lives in JSON files under `/data/`, loaded via `fetch()` at runtime
- Leaflet.js + OpenStreetMap tiles for the shops map (via CDN, no API key)
- Formspree or Web3Forms for the contact form (the form `action` URL is left as a placeholder `YOUR_FORMSPREE_ENDPOINT` — user will paste their own)
- Google Fonts: **Fraunces** (serif display) + **Inter** (sans body)
- No build tools, no package.json, no React, no Tailwind, no Astro, no Eleventy. Editing must be possible with nothing but a text editor.

## File structure

```
/
├── index.html
├── stores.html
├── courses.html
├── patterns.html
├── inspiration.html
├── glossary.html
├── faq.html
├── contact.html
├── 404.html
├── css/
│   └── style.css
├── js/
│   ├── nav.js            (shared nav + footer injection, last-updated date)
│   ├── stores.js
│   ├── courses.js
│   ├── patterns.js
│   ├── inspiration.js
│   ├── glossary.js
│   └── contact.js
├── data/
│   ├── stores.json
│   ├── courses.json
│   ├── patterns.json
│   ├── inspiration.json
│   └── glossary.json
├── assets/
│   └── favicon.svg
├── README.md             (for maintainers: how to add a shop, etc.)
└── .nojekyll             (empty file so GitHub Pages doesn't run Jekyll)
```

## Design system

### Palette

| Name        | Hex       | Usage                                      |
|-------------|-----------|--------------------------------------------|
| Paper       | `#FBF8F3` | Page background                            |
| Ink blue    | `#1B3A5C` | Primary text, primary buttons, dark tiles  |
| Sage        | `#7A9471` | Secondary text, borders, accent labels     |
| Linen tint  | `#EFE8DB` | Card backgrounds, subtle surfaces          |
| Warm border | `#D4C9B0` | Subtle borders on linen-tint cards         |
| Thread red  | `#C84B2F` | ONE accent per page only (dots, badges, active nav underline) |
| Muted text  | `#5F5E5A` | Body paragraph text                        |
| Soft blue   | `#B5D4F4` | Subtext on ink blue backgrounds            |

Thread red discipline: it should appear at most 2–3 times per page, on genuinely important elements. Never on body text, never on primary buttons, never on large areas.

### Typography

- Serif: **Fraunces**, weights 400 and 500 (display headings, large section titles, shop names)
- Sans: **Inter**, weights 400 and 500 (everything else)
- Sentence case throughout. Never Title Case, never ALL CAPS except for small eyebrow/letterspaced labels (≤11px, `letter-spacing: 1.5px–2px`)
- Heading scale (desktop → mobile): h1 42→30, h2 28→22, h3 20→18, body 15px/1.6
- Italic serif for occasional emphasis (e.g. "makers", "this week") — use sparingly, one or two per page

### Layout

- Max content width: 1100px, centered
- Mobile-first CSS; single breakpoint at 768px is enough
- Generous vertical rhythm — sections spaced with 3–4rem gaps
- Asymmetric tile grid on homepage (see mockup); single column on mobile
- Cards: linen-tint background OR 0.5px warm border on paper, 12px border-radius
- No drop shadows. No gradients. No glassmorphism.

### Components

- **Pill buttons**: 999px border-radius, 10px 18px padding. Primary = ink blue bg + paper text. Secondary = 0.5px sage border + ink blue text, transparent bg.
- **Filter chips**: 999px radius, 5px 12px padding, 0.5px sage border when inactive, ink blue bg + paper text when active.
- **Eyebrow labels**: 10–11px, sage color, 1.5–2px letter-spacing, uppercase, above section headings.
- **Last-updated dot**: small red circle + "Last updated DD MMM YYYY" in 10–11px sage, bottom of each content page.
- **Decorative thread line** (optional): dashed SVG path in thread red across the top of major pages. Subtle, 1–2px stroke.

### Accessibility baseline

- All images have alt text
- All form inputs have associated `<label>`
- Focus rings visible (don't `outline: none` without replacement)
- Color contrast: ink blue on paper passes WCAG AA; sage on paper is borderline — only use sage for decorative labels, never for body copy

## Shared layout

Every page has:

1. **Top nav** — brand wordmark left (serif italic "NL Sewing" or the group's chosen name), nav links right. Mobile: hamburger that toggles a full-height overlay.
2. **Main content**
3. **Footer** — thin, sage-colored, 11px: "Maintained by [group name] · Last updated {date from data or build} · [Contribute link → contact page]"

Nav + footer should be injected by `nav.js` so there's a single place to edit them.

### Nav links (in order)

Home · Shops · Courses · Patterns · Inspo · Glossary · Tips · Contact

The active page gets a 1.5px thread-red underline under its nav item.

## Pages

### Home (`index.html`)

1. Hero: large serif headline, short intro paragraph, "Join the chat" primary pill button, secondary small text link "or browse below"
2. "This week" card (right side of hero on desktop, below on mobile): linen-tint bg, manually editable in `data/homepage.json` — pulled by `nav.js` or a small inline script
3. Asymmetric 5-tile grid linking to: Shops (big dark tile, ink blue bg), Courses (linen tile), Patterns (sage tile, paper text), Inspo (dashed sage border, paper bg), Glossary (warm-border paper tile)
4. Each tile shows: eyebrow number ("01 · Shops"), serif title, one-line description, subtle arrow on hover

No shop/course/pattern cards on the home page — those live on their respective pages. Home is a gateway, not a dumping ground.

### Shops (`stores.html`)

1. Page header: eyebrow "Fabric · notions · markets", serif h1 "Fabric shops", italic subtitle like "Nine spots, four cities"
2. **Map**: Leaflet map, ~300px tall, OSM tiles, pins for each shop with a popup showing name + city + website link. Pins use thread red for the currently-filtered/hovered shop, ink blue otherwise.
3. **Filter chips**: "All" + one chip per unique city in the data. Clicking filters both the list and the map.
4. **Shop list**: each shop is a card. Cards have:
   - Serif shop name (18px)
   - Small uppercase city label, right-aligned, sage
   - One-line description
   - **"Before you go" box** — linen-tint background, small sage eyebrow "BEFORE YOU GO", 1–3 lines of insider tips (opening hour quirks, cash-only, remnants bin, etc.)
   - Two underlined text links: Website, Directions (Google Maps)
   - Optional "PICK" badge (small thread-red pill, top-left) for community favorites
5. Last-updated line at the bottom.

Data: `data/stores.json`

### Courses (`courses.html`)

1. Standard page header
2. Filter chips: All · Amsterdam · Haarlem · ... · Online · EN · NL · RU (two filter groups — city and language — render as two chip rows)
3. List of course cards:
   - Serif course/school name
   - City + language badges
   - Schedule (e.g. "Friday mornings, by order")
   - One-line description
   - Website link

Data: `data/courses.json`

### Patterns (`patterns.html`)

1. Standard page header: "Pattern websites"
2. Filter chips: language (EN, RU), payment (accepts foreign cards)
3. List of pattern sites:
   - Serif site name
   - Language + currency badges (e.g. "RU · EUR", "EN · USD")
   - "Card-friendly" badge (sage) if they accept foreign cards
   - One-line description (what the site specializes in — garments, home goods, kids, etc.)
   - Link

Data: `data/patterns.json`

### Inspiration (`inspiration.html`)

1. Standard header: "Makers we follow"
2. Two sections: "Chat members" and "Other makers we love"
3. Each entry is a card with:
   - Serif name / handle
   - Platform badge (Instagram / website / etc.)
   - Short description (why they're interesting)
   - Link
   - Optional manually-added screenshot path (if present in JSON, render; if absent, skip — no broken images)

Data: `data/inspiration.json`

### Glossary (`glossary.html`)

1. Standard header: "Fabric glossary", subtitle "What that Dutch label is actually saying"
2. Filter chips: All · Fibres · Weaves · Notions · Techniques
3. List of entries — each is a row with:
   - Serif primary term (20px) — shown in its NL form by default since that's the label you'll see in shops
   - Tiny language tag (NL/EN/RU) in thread red, right-aligned
   - Below: small EN and RU translations side by side, each prefixed with a sage italic "en" or "ru" label
   - Optional one-line note (e.g. "breathable, wrinkles easily")
4. Category separator rows between fibres/weaves/notions (serif italic, sage)

Data: `data/glossary.json`

### Tips & FAQ (`faq.html`)

Prose page — editorial layout, max width 680px for readability.

Sections:
- **Starting out**: 3–4 short paragraphs on picking a first project, a first machine, a first pattern
- **Reading a Dutch fabric label**: what "100% katoen / breedte 140cm / krimpvrij" means
- **Where to learn more**: links to YouTube channels, Dutch sewing blogs, books
- **FAQ**: 5–8 collapsible `<details>` elements for common questions

Content placeholders are fine — write stubs the maintainer can expand. Don't invent facts.

### Contact (`contact.html`)

1. Standard header: "Get in touch", subtitle "Share a find or ask a question"
2. The smart form:

```
Topic dropdown:
  ▸ Suggest a new store
  ▸ Suggest a new course
  ▸ Suggest a pattern site
  ▸ Suggest an inspiration link
  ▸ Add a glossary term
  ▸ Report a broken link or outdated info
  ▸ General question
```

Based on the selection, reveal the matching field set. Field sets:

| Topic                     | Fields (in addition to name + email)                        |
|---------------------------|--------------------------------------------------------------|
| Suggest a store           | Shop name, Website, City, Google Maps link (optional), Notes |
| Suggest a course          | School/course name, Website, City, Language(s), Schedule, Notes |
| Suggest a pattern site    | Website, Language, Currency, Accepts foreign cards? (yes/no/unsure), Notes |
| Suggest an inspo link     | Link, Platform, Why it's cool                                |
| Add a glossary term       | Term (NL), English translation, Russian translation (optional), Category, Note |
| Report a broken link      | Which page, Which link, What's wrong                         |
| General question          | Message (textarea)                                           |

Implementation notes:
- Name + email are always shown
- Each field set is a `<fieldset>` that starts hidden (`hidden` attr) and is revealed when its topic is selected
- Single `<form>` submits to Formspree — use `name` attributes that match the topic so the email is readable on the receiving end
- Successful submission shows a thank-you state inline (no page redirect)
- Basic HTML5 validation (required attrs, type="email", type="url")

### 404 (`404.html`)

Simple, on-brand. Serif "Lost a stitch." headline, one paragraph, link back to home. GitHub Pages serves this automatically.

## Data schemas

### `data/stores.json`

```json
{
  "lastUpdated": "2026-04-17",
  "items": [
    {
      "id": "a-boeken",
      "name": "A. Boeken Fabric and Notions Shop",
      "shortName": "A. Boeken",
      "city": "Amsterdam",
      "description": "Classic Amsterdam institution. Buttons, trims, and a big fabric wall.",
      "beforeYouGo": "Cash preferred. Closed Sundays. Weekday mornings are calm; weekends are chaos.",
      "website": "http://aboeken.nl/",
      "mapUrl": "https://maps.app.goo.gl/LwUaweB33cP7hWoq8",
      "lat": 52.3676,
      "lng": 4.9041,
      "pick": true,
      "tags": ["fabric", "notions"]
    }
  ]
}
```

Pre-populate `items` with all 9 shops from the source document. Use approximate lat/lng for each city as a placeholder (Amsterdam 52.3676,4.9041; Haarlem 52.3874,4.6462; Den Haag 52.0705,4.3007; Aalsmeer 52.2640,4.7470) — leave a comment in the README that exact coordinates should be verified.

### `data/courses.json`

```json
{
  "lastUpdated": "2026-04-17",
  "items": [
    {
      "id": "rechtesteek",
      "name": "Rechtesteek",
      "city": "Haarlem",
      "languages": ["RU", "NL"],
      "schedule": "Friday mornings, by order",
      "description": "Russian-speaking owner, small-group classes.",
      "website": "https://rechtesteek.nl/products/naailes-vrijdag-ochtend-per-order",
      "online": false
    }
  ]
}
```

Pre-populate with the 2 entries from the source doc.

### `data/patterns.json`

```json
{
  "lastUpdated": "2026-04-17",
  "items": [
    {
      "id": "vikisews",
      "name": "Vikisews",
      "languages": ["RU", "EN"],
      "currency": "EUR/USD",
      "foreignCards": true,
      "description": "Russian indie pattern company; English site accepts foreign cards.",
      "website": "https://vikisews.com/",
      "categories": ["womenswear"]
    }
  ]
}
```

Pre-populate the 3 entries from the source doc.

### `data/inspiration.json`

```json
{
  "lastUpdated": "2026-04-17",
  "items": [
    {
      "id": "devlieg-studio",
      "name": "devlieg.studio",
      "handle": "@devlieg.studio",
      "platforms": [
        {"type": "website", "url": "https://devlieg.studio/"},
        {"type": "instagram", "url": "https://www.instagram.com/devlieg.studio"}
      ],
      "description": "Chat member — studio practice and personal work.",
      "group": "members",
      "image": null
    }
  ]
}
```

Pre-populate all 4 entries from the source doc. Separate "members" vs "inspo" in the `group` field.

### `data/glossary.json`

```json
{
  "lastUpdated": "2026-04-17",
  "items": [
    {
      "id": "katoen",
      "nl": "Katoen",
      "en": "Cotton",
      "ru": "Хлопок",
      "category": "fibre",
      "note": "Breathable, takes dye well, wrinkles."
    }
  ]
}
```

Seed with: katoen/cotton, linnen/linen, wol/wool, zijde/silk, viscose, polyester, spijkerstof/denim, jersey, fleece, badstof/terry, ribstof/ribbed knit, voering/lining, rits/zipper, knoop/button, garen/thread, naald/needle, schaar/scissors, krimpvrij/pre-shrunk, breedte/width. 15–20 entries is plenty to start.

### `data/homepage.json`

```json
{
  "lastUpdated": "2026-04-17",
  "thisWeek": {
    "title": "Fabric market in Utrecht, Saturday",
    "body": "Three members going. Ping the chat if you want to join.",
    "dateLabel": "2 days ago"
  },
  "counts": {
    "stores": 9,
    "courses": 2,
    "patterns": 3,
    "inspiration": 4
  }
}
```

The `counts` could in theory be computed from the other JSON files at load — do that instead if it's cleaner. `thisWeek` is manually edited.

## Behaviour details

- **Loading state**: brief text placeholder, no spinners. JSON fetch is fast on GitHub Pages.
- **Error state**: if a JSON fetch fails, show a small sage-colored message "Couldn't load this list. Try refreshing." Don't crash the page.
- **No JavaScript fallback**: add a `<noscript>` to pages that rely on JSON — "This page needs JavaScript to show the list. Sorry."
- **Dates**: show as `15 Apr 2026`, never `2026-04-15` in the UI.
- **External links**: `target="_blank" rel="noopener"` on everything that leaves the site.
- **Map**: if a shop has no lat/lng, skip the pin but still show it in the list.

## Maintenance doc (`README.md`)

Include step-by-step for non-technical maintainers:

1. How to add a new shop (edit `data/stores.json`, add an object, commit)
2. How to edit the "This week" tile
3. How to update the `lastUpdated` date on any page
4. How to swap the Formspree endpoint
5. How GitHub Pages deploys on push to `main`
6. How to preview locally (just open `index.html` in a browser — but mention `fetch()` to a local JSON file may need a simple static server like `python3 -m http.server`)

## Deployment

- Commit everything to `main`
- Enable GitHub Pages in repo settings → Pages → Source: `main` branch, `/` root
- Site will be live at `https://USERNAME.github.io/REPO-NAME/` within a minute or two
- Add `CNAME` file later if a custom domain is wanted (not required for v1)

## What NOT to build (v1 scope discipline)

- No search bar (the lists are too short to need one)
- No user accounts, logins, or saved favorites
- No comments on shops
- No newsletter signup
- No analytics (can be added later if wanted — Plausible or GoatCounter)
- No dark mode (paper bg is the point; dark mode fights the aesthetic)
- No i18n toggle (site is English; resource comments stay in whatever language they're in)
- No blog / CMS

These are all reasonable future additions — but v1 is "static pages + JSON + contact form," full stop.

## Acceptance checklist

Before calling v1 done:

- [ ] All 8 pages render on desktop and mobile
- [ ] All 9 shops appear on the map and in the filtered list
- [ ] City filter on shops page works and updates both the list and map pins
- [ ] Contact form shows the right fields when topic changes
- [ ] Contact form submits successfully to a placeholder Formspree URL (documented)
- [ ] Every page has the shared nav + footer + last-updated line
- [ ] Fonts load from Google Fonts
- [ ] Page loads work with no console errors
- [ ] Site passes an HTML validator spot-check
- [ ] README explains how to add a shop in under a minute
