# TEST_READY: DETASCO Hospitality Supplier E2E Test Suite

## Executive Summary

The automated End-to-End (E2E) Test Suite for the DETASCO Hospitality Supplier multi-page platform has been designed, constructed, and published at `scripts/test-e2e.js`. 

The test suite is **100% zero-dependency** (running on native Node.js built-in modules: `http`, `fs`, `path`, `url`), requires no npm package installations, and implements strict content-aware assertions designed to detect false positives caused by the `server.js` single-page application (SPA) fallback mechanism.

---

## Test Architecture & Capabilities

```
┌────────────────────────────────────────────────────────────────────────┐
│                   DETASCO E2E TEST RUNNER ARCHITECTURE                 │
├────────────────────────────────────────────────────────────────────────┤
│  Execution Modes:                                                      │
│   • Live HTTP Mode    : Probes http://localhost:3000 (Dual port 3000)  │
│   • Offline Fallback  : Direct filesystem parsing if server is offline │
│   • Content Signature : Validates distinct title & section headers     │
│                         (prevents SPA fallback false positives)        │
│                                                                        │
│  Tiers of Verification:                                                │
│   • Tier 1: Feature & Catalog Coverage                                 │
│   • Tier 2: Boundary & Specification Integrity                         │
│   • Tier 3: Link & Quotation Integrity                                 │
│   • Tier 4: Script & Theme Hooks                                       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Test Catalog by Tier

### Tier 1: Feature & Catalog Coverage
1. **HTML File Existence & Integrity (`T1.1_FILE_*`)**:
   - Asserts existence and non-empty size (> 5 KB) for `/index.html`, `/linen.html`, `/amenities.html`, `/gorden.html`, and `/towel.html`.
2. **HTTP 200 & Non-Fallback Delivery (`T1.2_HTTP_*`)**:
   - Sends HTTP GET requests to `http://localhost:3000` for each subpage.
   - Asserts HTTP 200 response code.
   - Verifies the response body is **not** the `index.html` fallback by asserting distinct `<title>` keywords (`Linen & Bedding`, `Amenities Hotel Premium`, `Gorden Hotel`, `Handuk Hotel`) and distinct section headers.
3. **Catalog Solution Section Existence (`T1.3_SECTION_*`)**:
   - Verifies presence of `<section id="linen-solution">` in `linen.html`.
   - Verifies presence of `<section id="amenities-solution">` in `amenities.html`.
   - Verifies presence of `<section id="gorden-solution">` in `gorden.html`.
   - Verifies presence of `<section id="towel-solution">` in `towel.html`.
4. **Product Card Quantity Validation (`T1.3_COUNT_*`)**:
   - Target: **12 product cards** per category solution grid.
   - Strict Minimum: **8 product cards** per category solution grid.

### Tier 2: Boundary & Specification Integrity
1. **Product Card Structural Integrity (`T2.1_STRUCT_*`)**:
   - Inspects each card within the category solution grid.
   - Asserts presence of an aspect-square image frame (`aspect-square` class or wrapper).
   - Asserts presence of a valid `<img>` tag with non-empty `alt` attribute and `loading="lazy"`.
   - Asserts presence of a bold product title (`<h3>` with `font-bold` / `font-cinzel`).
   - Asserts presence of an unordered list with at least **4 checkmark bullet points** featuring a checkmark badge (`✓` or `bg-[#EA580C]`).
2. **Amenities Category Specifications (`T2.2_SPECS_AMENITIES`)**:
   - Verifies cards explicitly state **BPOM / izin edar / formula aman**.
   - Verifies cards explicitly state **Eco-friendly / ramah lingkungan / biodegradable / jerami gandum**.
   - Verifies cards explicitly state **Custom logo / hotel branding / kemasan custom**.
3. **Gorden Category Specifications (`T2.3_SPECS_GORDEN`)**:
   - Verifies cards explicitly state **100% Blackout / penahan cahaya**.
   - Verifies cards explicitly state **Flame-retardant / tahan api / NFPA 701 / BS 5867**.
   - Verifies cards explicitly state **Acoustic / peredam suara / dB desibel**.
   - Verifies cards explicitly state **Motorized track / smart track / rel otomatis**.
4. **Towel Category Specifications (`T2.4_SPECS_TOWEL`)**:
   - Verifies cards explicitly state **GSM grammage within the 450–800 GSM range** (e.g. 450, 500, 650, 800 GSM).
   - Verifies cards explicitly state **100% Combed Cotton / katun pilihan**.
   - Verifies cards explicitly state **Industrial laundry durability / tahan cuci industri (85°C / 200+ siklus)**.

### Tier 3: Link & Quotation Integrity
1. **WhatsApp B2B Lead Generation Integrity (`T3.1_WA_*`)**:
   - Checks that all WhatsApp links target the official phone number `6281234567890`.
   - Asserts that all pre-filled query strings (`?text=...`) are valid, non-empty, and properly URI-encoded.
2. **Prominent Bottom CTA Button ("Pesan Sekarang!") (`T3.1_BOTTOM_CTA_*`)**:
   - Checks that each subcategory solution section concludes with a prominent bottom order inquiry button ("Pesan Sekarang!") linked to `https://wa.me/6281234567890?text=...`.
3. **Zero Broken Internal Links & Valid Local Assets (`T3.2_*`)**:
   - Crawls all internal `href` attributes across all 5 HTML documents.
   - Verifies that all referenced `.html` files exist on disk.
   - Verifies that all referenced in-page anchors (`#anchorId`) exist in the destination file (`id="anchorId"`).
   - Crawls all local `src` attributes and verifies that all local images, scripts, and stylesheets exist on disk and have file size > 0 bytes.
4. **Breadcrumb & Active Navbar Tabs (`T3.3_*`)**:
   - Verifies that subpages have a breadcrumb trail linking back to `index.html`.
   - Verifies that the navigation header highlights the active subpage with class `.active` and that other subpage links do not have the active class.

### Tier 4: Script & Theme Hooks
1. **Lucide Icons Integration (`T4.1_LUCIDE_*`)**:
   - Checks `<script src="...lucide...">` import on all 5 pages.
   - Checks inline execution of `lucide.createIcons()` on all 5 pages.
   - Checks presence of elements with `data-lucide` attributes (minimum 5 icons per page).
2. **Theme Switcher Hooks & Styling (`T4.2_THEME_*`)**:
   - Checks `<link rel="stylesheet" href="theme.css">` on all 5 pages.
   - Checks `<script src="theme.js">` on all 5 pages.
   - Checks presence of toggle button with `[data-theme-toggle]` attribute on all 5 pages.
   - Verifies `theme.css` defines `html.light-mode` rules.
   - Verifies `theme.js` defines `STORAGE_KEY = 'detasco-theme'`.
3. **i18n Translation Subsystem (`T4.3_I18N_*`)**:
   - Checks `<script src="i18n.js">` on all 5 pages.
   - Checks language selector buttons `[data-lang-set="id"]` and `[data-lang-set="en"]` on all 5 pages.
   - Verifies `i18n.js` defines `DICTIONARY`, `titleMap`, and `window.DetascoI18n`.

---

## How to Run the Tests

### 1. Standard Full Suite Run
Executes all 4 tiers across all pages. Exits with code `0` if all pass, or `1` if any defects are detected:
```bash
node scripts/test-e2e.js
```

### 2. Milestone M0 Verification (Completed Scope Benchmark)
Validates only features completed in M0 (Linen benchmark reference, index.html integrity, server delivery, theme, icons):
```bash
node scripts/test-e2e.js --milestone=M0
```

### 3. Progressive Integration Run (Treat Pending Milestones as Non-Failing)
Evaluates all tests, displaying full progress, but marks pending worker milestones (M1, M2, M3) as `PENDING` instead of hard-failing the exit code:
```bash
node scripts/test-e2e.js --allow-pending
```

### 4. Direct Offline Filesystem Mode
Bypasses HTTP server probing and parses files directly:
```bash
node scripts/test-e2e.js --offline
```

### 5. Specific Tier Execution
Run only specific tiers (e.g. Tier 1 and Tier 3):
```bash
node scripts/test-e2e.js --tier=1,3
```

### 6. Machine-Readable JSON Output
Outputs structured JSON report for CI/CD or audit logging:
```bash
node scripts/test-e2e.js --json
```

---

## Current Baseline Test Results & Escalations

### Status of Milestone M0 Scope (Benchmark Reference)
- `index.html` & `linen.html` file integrity: **PASS**
- Local HTTP Server 200 delivery & non-fallback content: **PASS**
- `#linen-solution` 12 product cards: **PASS**
- Linen card structures (aspect-square, bold title, 4 checkmarks): **PASS**
- Linen bottom prominent CTA "Pesan Sekarang!": **PASS**
- Linen breadcrumbs & navbar active tab: **PASS**
- Lucide icons, theme toggle hooks, i18n hooks: **PASS**

### Implementation Defects Discovered for Peer Workers (Escalation Matrix)

| Milestone | Target File | Defect Summary | Action Required by Implementing Worker |
|-----------|-------------|----------------|-----------------------------------------|
| **M1** | `amenities.html` | Missing `#amenities-solution` container; only 5 cards present (target 12; min 8); cards lack aspect-square frames and 4 checkmark bullet points; missing prominent bottom "Pesan Sekarang!" CTA; missing explicit BPOM, eco-friendly, and custom logo specifications. | Worker M1 must overhaul `amenities.html` to mirror `linen.html`'s card grid, checkmark badges, and quotation buttons. |
| **M2** | `gorden.html` | Missing `#gorden-solution` container; only 3 cards present (target 12; min 8); cards lack WhatsApp quotation links and checkmark bullets; missing prominent bottom CTA; missing explicit 100% blackout, flame-retardant (NFPA 701), acoustic dB, and motorized track specifications. | Worker M2 must overhaul `gorden.html` with 12 technical fabric cards and WhatsApp quotation links. |
| **M3** | `towel.html` | Missing `#towel-solution` container; only 4 cards present (target 12; min 8); cards lack 4 checkmark bullets; missing bottom "Pesan Sekarang!" CTA; missing explicit 450–800 GSM grammage, combed cotton, and industrial wash specifications. | Worker M3 must overhaul `towel.html` with 12 towel/bathrobe cards and grammage specifications. |
| **M4** | `index.html` | Legacy footer navigation links in Col 2 and Col 3 point to `#kategori` and `#inspirasi` which do not exist as element IDs in `index.html`. | Worker M4 must align `index.html`'s footer navigation with subcategory footers (`linen.html`, `amenities.html`, `gorden.html`, `towel.html`). |
| **M4** | `i18n.js` | `titleMap` in `i18n.js` only covers `index.html` and deleted `katalog.html`; it lacks translations for `linen.html`, `amenities.html`, `gorden.html`, and `towel.html`. | Worker M4 must expand `titleMap` in `i18n.js` with the 4 subpage titles. |

---

## Verification Checklist for Orchestrator & Auditors

- [x] Test runner created at `scripts/test-e2e.js` using native Node.js only.
- [x] Zero external npm package dependencies.
- [x] Server HTTP 200 non-fallback check implemented (checks distinct title & headers to prevent SPA false positives).
- [x] Graceful offline fallback implemented.
- [x] Tier 1 to Tier 4 comprehensive coverage implemented.
- [x] Card parsing handles nested tags accurately via balanced tag counting.
- [x] WhatsApp B2B link schema and URI encoding validation implemented.
- [x] All local file links and hash anchors crawled for broken link detection.
- [x] Baseline run completed and actionable defect escalations cataloged.
- [x] `TEST_READY.md` published in project root.
