# Stitch & Stroop — Maintainer Guide

A static website for the Stitch & Stroop sewing community in the Netherlands.
No build tools, no npm, no dependencies beyond Leaflet (loaded via CDN) and Google Fonts.

---

## File structure

```
/
├── index.html          Homepage
├── stores.html         Fabric shops + Leaflet map
├── courses.html        Sewing courses
├── patterns.html       Pattern websites
├── inspiration.html    Makers we follow
├── glossary.html       NL / EN / RU glossary
├── faq.html            Tips and FAQ
├── contact.html        Contact / contribute form
├── 404.html            Not found page
├── .nojekyll           Prevents GitHub Pages Jekyll processing
│
├── assets/
│   └── favicon.svg     Needle favicon
│
├── css/
│   └── style.css       All styles
│
├── js/
│   ├── nav.js          Shared nav + footer injection, homepage card
│   ├── stores.js       Shops page logic
│   ├── courses.js      Courses page logic
│   ├── patterns.js     Patterns page logic
│   ├── inspiration.js  Inspiration page logic
│   ├── glossary.js     Glossary page logic
│   └── contact.js      Contact form logic
│
└── data/
    ├── stores.json
    ├── courses.json
    ├── patterns.json
    ├── inspiration.json
    ├── glossary.json
    └── homepage.json
```

---

## How to add a new shop

1. Open `data/stores.json`.
2. Add a new object to the `"items"` array, following this schema:

```json
{
  "id": "unique-kebab-case-id",
  "name": "Full shop name",
  "shortName": "Short name",
  "city": "City name",
  "description": "One to two sentence description.",
  "beforeYouGo": "Practical tips — hours, parking, payment, things to know.",
  "website": "https://example.com/",
  "mapUrl": "https://maps.google.com/?q=...",
  "lat": 52.3676,
  "lng": 4.9041,
  "pick": false,
  "tags": ["fabric", "notions"]
}
```

- Set `"pick": true` only for especially recommended shops.
- Set `"website": null` if the shop has no website.
- **Important:** verify the `lat` / `lng` coordinates before committing — see the note at the bottom of this file.
- Update `"lastUpdated"` to today's date (`YYYY-MM-DD`) at the top of the file.

3. Commit and push to main. GitHub Pages will deploy automatically within a minute or two.

---

## How to edit the "This week" tile

1. Open `data/homepage.json`.
2. Edit the `"thisWeek"` object:

```json
"thisWeek": {
  "title": "Fabric market in Utrecht, Saturday",
  "body": "Three members going. Ping the chat if you want to join.",
  "dateLabel": "2 days ago"
}
```

- `"title"` — headline for the card.
- `"body"` — one or two sentences of detail.
- `"dateLabel"` — freeform relative label, e.g. `"Today"`, `"This Saturday"`, `"2 days ago"`.

3. Commit and push.

---

## How to update the lastUpdated date on any page

Each data file has a `"lastUpdated"` field at the top:

```json
{
  "lastUpdated": "2026-04-17",
  "items": [...]
}
```

Change the date string to today's date in `YYYY-MM-DD` format. The site will display it in `15 Apr 2026` format automatically.

---

## How to swap the Formspree endpoint

1. Create a free account at [formspree.io](https://formspree.io) and create a new form.
2. Copy your form endpoint URL — it looks like `https://formspree.io/f/xxxxxxxxxxx`.
3. Open `contact.html` and find this line near the top of the `<form>` element:

```html
<form id="contact-form" action="YOUR_FORMSPREE_ENDPOINT" method="POST" novalidate>
```

4. Replace `YOUR_FORMSPREE_ENDPOINT` with your Formspree URL.
5. Commit and push.

---

## How GitHub Pages deploys

The site deploys automatically on every push to the `main` branch via GitHub Pages.

- Go to **Settings → Pages** in your GitHub repository.
- Set source to **Deploy from a branch** → `main` → `/ (root)`.
- The `.nojekyll` file in the root prevents GitHub Pages from trying to process the site with Jekyll (which would break the `data/` fetch paths).
- First deployment takes a minute or two; subsequent deploys are faster.
- Your site URL will be `https://<username>.github.io/<repo-name>/`.

---

## How to preview locally

**Option 1 — Direct open (limited):**
Open `index.html` directly in your browser. Navigation and static content work, but `fetch()` calls for the JSON data files will fail due to browser security restrictions on `file://` URLs.

**Option 2 — Local server (recommended):**
In the project root, run:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser. All data files will load correctly.

Alternatively, if you have Node.js installed:

```bash
npx serve .
```

---

## Notes

- **Coordinates:** The `lat` / `lng` values for shops should be verified against Google Maps or OpenStreetMap before the site goes live. Open the shops page locally and confirm each pin lands in the right place.
- **Formspree free tier:** Limited to 50 submissions/month. Should be more than enough for a community site, but keep it in mind.
- **Leaflet:** Loaded via CDN (`unpkg.com`). If you want to self-host it, download Leaflet and update the script/link tags in `stores.html`.
