# CLAUDE.md - Guidelines for Detasco Hospitality Supplier

Static website for **PT. Detasco Elca Sarana** (brand: DETASCO), a B2B supplier of hotel and hospital supplies in Medan, Indonesia. It is co-developed by two developers using two AI assistants (Google Antigravity and Anthropic Claude). Read this file before editing, and follow the rules below.

---

## Stack and pages

- **Stack**: pure HTML5, Tailwind CSS via CDN, Vanilla JS, Lucide icons (CDN), Google Fonts (`Cinzel`, `Playfair Display`, `Plus Jakarta Sans`). No build step, no `package.json`.
- **Server**: zero-dependency `server.js` on port 3000 (`node server.js`).
- **Pages** (all share the same header, mobile menu, footer and floating WhatsApp button):
  - `index.html` - landing page, request-for-quote form, company location card.
  - `linen.html`, `amenities.html`, `gorden.html`, `towel.html`, `hospital.html` - product category pages (hero, 4-card feature strip, product grid, consultation banner).
  - `about.html` - "Tentang Kami" (company story, clients, commitments).
- **Shared files**: `i18n.js` (ID/EN switcher), `theme.js` + `theme.css` (light/dark), `robots.txt`, `sitemap.xml`.
- **Legacy, not loaded by any page**: `products-data.js`. `katalog.html` no longer exists. Do not rebuild a product database; product cards are written directly in each category page.

## Commands

```bash
node server.js                      # local preview at http://localhost:3000
node scripts/test-e2e.js            # full E2E suite (must stay 100% before pushing)
node scripts/test-e2e.js --json     # structured report
node scripts/check-html.js <file>   # quick structural check of one HTML/i18n file
git pull origin main                # ALWAYS before starting work
```

---

## Content rules (owner decisions, do not undo)

1. **Product cards show general benefits only.** Exactly **3** short bullets per card, no technical specifications (no GSM, BPOM, NFPA/flame-retardant, dB, combed cotton, thread count, material grades, sizes). Buyers contact the admin for full specs. The E2E suite enforces this (`FORBIDDEN_SPEC_PATTERNS`, `BULLETS_PER_CARD` in `scripts/test-e2e.js`).
2. **DETASCO does not offer** showroom visits, F&B/banquet supplies, or in-room equipment (minibar, safe box, kettle, trolley). Do not add them back. The company **address stays** on the site as a head-office card.
3. **No made-up client names.** The only real client examples (given by the owner) are **Grand City Hall** (hotel) and **Columbia Asia** (hospital), on `about.html`.
4. **Company facts**: PT. Detasco Elca Sarana has met the amenity needs of many hotels and hospitals since 2006, and prioritizes quality and premium products.
5. **"Best Price"** appears in four main places only: homepage hero badge, homepage "why choose us" intro, order step 2, and the About commitment card. Do not sprinkle it elsewhere.
6. **Real data**: address `Jalan HM. Joni No. 30A, Kelurahan Pasar Merah Barat, Kecamatan Medan Kota, Medan 20214`, email `detasco55@gmail.com`.

### Known placeholders (replace together when real values exist)

- Phone `(021) 5890-7788` and WhatsApp `6281234567890` (used in every `wa.me` link and the homepage form; the E2E constant `WA_PHONE_EXPECTED` must be updated at the same time).
- Domain `https://www.detasco.co.id` in canonical, Open Graph, JSON-LD, `robots.txt` and `sitemap.xml`.
- The homepage quote form only opens WhatsApp; it does not store or email anything.

---

## i18n (ID/EN) - the most common source of bugs

`i18n.js` swaps text by **exact match** against `DICTIONARY` (Indonesian text node -> English). Rules:

- Every visible Indonesian string needs an EN entry. The key is the **trimmed text node exactly as rendered** (write `&amp;` in HTML as `&` in the key).
- A paragraph that is one text node needs the **whole paragraph** as the key, not a fragment.
- Page `<title>` translations live in the `titleMap` inside `updateToggleUI()`.
- Check after editing: in the browser console run `DetascoI18n.setLang('en')`, scan for leftover Indonesian, then `DetascoI18n.setLang('id')`.
- Add new entries at the end of the dictionary under a comment header; do not duplicate existing keys.

## Editing pitfalls

- Several files use **CRLF** line endings. When scripting edits, match `\r?\n`, and never `slice()` with an `indexOf` result without checking for `-1` (this once truncated a whole page).
- The desktop nav now has 8 items. When adding a nav item, update the desktop nav, mobile menu and footer `NAVIGASI` list in **all 7 pages**, and re-check there is no overflow at 1280px in both languages.
- Do not rewrite a whole page file that the other developer is working on; make targeted edits, `git fetch` before pushing, and re-run the E2E suite after merging.
- Images: use real, verified photos. Never guess Unsplash photo IDs; load the URL and confirm the subject matches the product.

---

## Design system (do not break)

1. **Section rhythm**: sections alternate between Dark Obsidian (`#0D1017` / `#0A0D13`, gold accents `#E5B13A`) and Warm Linen / Ivory (`#F8F5EE` / `#F3EDE0`, text `#1A1E29`). Keep contrast high: no dark grey text on obsidian, no light text on ivory.
2. **Navbar**: fixed header is 80px high (`h-20`). Every section used as an anchor target needs `scroll-mt-20`.
3. **Cards**: product cards use the shared pattern (`rounded-2xl`, `border-[#DDD5C5]`, gold hover), an `aspect-square` photo, a bold `h3` title and checkmark bullets.
4. **Headings** use `font-cinzel`; body text uses Plus Jakarta Sans.
5. **SEO head block** on every page: `<title>`, meta description (about 150 chars), canonical, Open Graph/Twitter tags and JSON-LD. Add every new page to `sitemap.xml`.

## Collaboration

- Always `git pull origin main` first, run `node scripts/test-e2e.js` before pushing, then `git push origin main`.
- Write commit messages that say what and why. Branch + Pull Request for large features (see `AI_GUIDELINES.md`).
