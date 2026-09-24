# CLAUDE.md - Guidelines for Detasco Hospitality Supplier

This repository is a collaborative project for **Detasco Hospitality Supplier** (B2B luxury hotel amenities & linen supplier in Indonesia). It is co-developed by two developers using two different AI assistants: **Google Antigravity** and **Anthropic Claude**.

Please strictly adhere to the project conventions, architecture, and design system documented below.

---

## 🛠️ Project Stack & Architecture

- **Stack**: Pure HTML5, Tailwind CSS (via CDN), Vanilla JavaScript, Font Awesome 6, Google Fonts (`Cinzel`, `Playfair Display`, `Plus Jakarta Sans`).
- **Server**: Zero-dependency Node.js HTTP server (`server.js`) serving static files on port 3000 (and fallback 3001).
- **Core Files**:
  - `index.html`: Landing page (Hero, 1-row Featured Catalog, Categories, Inspiration, SLA Standards, 4-Step Order Guide, RFQ Form, Showroom Location & Maps).
  - `katalog.html`: Dedicated complete catalog page (Search, Category filters, Sorting, Commercial spec modal, dynamic WhatsApp quote button).
  - `products-data.js`: **Single Source of Truth** for all 20+ hotel products. Exposes `window.products`.
  - `server.js`: Development server (`node server.js`).
  - `logo.png`: Brand asset.

---

## 💻 Common Commands

```bash
# Run local development server
node server.js

# Sync with remote before starting work
git pull origin main

# View status of changes
git status

# Commit and push changes
git add .
git commit -m "feat: description of change"
git push origin main
```

- **Local Preview**:
  - Beranda: `http://localhost:3000/`
  - Katalog Lengkap: `http://localhost:3000/katalog.html`

---

## 🎨 Design System & Strict Rules (DO NOT BREAK)

1. **Single Source of Truth for Products**:
   - **NEVER** hardcode product cards or product arrays directly inside `index.html` or `katalog.html`.
   - All product items, specs, pricing, and categories are defined in `products-data.js`.
   - If adding or editing products, update `products-data.js`.

2. **Section Rhythm & Color Palette**:
   - Sections strictly alternate in a luxury rhythm:
     - **Dark Obsidian**: `#0D1017` / `#0A0D13` with gold accents (`#D4AF37`, `#C5A059`, `#B8973A`).
     - **Warm Linen / Ivory**: `#F8F5EE` / `#F3EDE0` with warm slate `#1C1917` text.
   - Maintain high contrast: never put dark grey text on obsidian background or light text on linen background.

3. **Navbar & Scroll Anchors**:
   - The fixed navigation header is 80px high (`h-20`).
   - Every section with an ID target (e.g., `#tentang-kami`, `#katalog`, `#kontak`) MUST have `scroll-mt-20` (or `scroll-margin-top: 5rem`) to prevent the navbar from obscuring section headings.
   - Navbar "Katalog" link points to `katalog.html`.

4. **Homepage vs Catalog Page Separation**:
   - The homepage (`index.html`) `#katalog` section displays only **1 row (4 featured items)** with a "Lihat Semua Katalog" button linking to `katalog.html`. Do not bloat the homepage with all 20 items.
   - The full catalog with live search, category pills, sorting, and detail modals is strictly housed in `katalog.html`.

5. **Scrollbar Design**:
   - Custom scrollbars are configured with subtle gold/slate thumbs and generous track padding to ensure scrollbars never clip or crowd adjacent text content.

6. **Typography**:
   - Headings / Luxury titles: `font-serif` (`Cinzel` or `Playfair Display`).
   - Body & UI text: `font-sans` (`Plus Jakarta Sans`).

---

## 🤝 Multi-AI Collaboration Protocol (Claude + Antigravity)

1. **Pull First**: Always ask the developer to confirm `git pull origin main` before generating or applying modifications.
2. **Modular Changes**: Do not refactor unrelated files or overhaul existing layouts unless explicitly requested.
3. **Commit Messages**: Use Conventional Commits format (`feat:`, `fix:`, `style:`, `refactor:`, `docs:`).
4. **Refer to `AI_GUIDELINES.md`**: For detailed division of tasks and conflict resolution workflows.
