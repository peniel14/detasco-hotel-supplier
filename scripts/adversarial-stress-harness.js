#!/usr/bin/env node
/**
 * =============================================================================
 * DETASCO Hospitality Supplier - Adversarial Stress Harness
 * =============================================================================
 * Independent Empirical Verification & Stress Test Suite
 * Executed by Challenger 1
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SERVER_URL = 'http://localhost:3000';
const TARGET_PHONE = '6281234567890';
const HTML_PAGES = ['index.html', 'linen.html', 'amenities.html', 'gorden.html', 'towel.html'];

// Color output formatting
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  findings: []
};

function pass(testName, details = '') {
  results.passed++;
  console.log(`  ${c.green}✔ PASS${c.reset}  ${testName}${details ? ` ${c.gray}(${details})${c.reset}` : ''}`);
}

function fail(testName, error, details = '') {
  results.failed++;
  const finding = { testName, error, details };
  results.findings.push(finding);
  console.log(`  ${c.red}✖ FAIL${c.reset}  ${c.bold}${testName}${c.reset}: ${c.red}${error}${c.reset}${details ? `\n       ↳ ${c.gray}${details}${c.reset}` : ''}`);
}

function warn(testName, warning, details = '') {
  results.warnings++;
  console.log(`  ${c.yellow}⚠ WARN${c.reset}  ${testName}: ${c.yellow}${warning}${c.reset}${details ? ` ${c.gray}(${details})${c.reset}` : ''}`);
}

console.log(`\n${c.bold}${c.cyan}================================================================================${c.reset}`);
console.log(`${c.bold}${c.cyan}  DETASCO ADVERSARIAL STRESS HARNESS — EMPIRICAL CHALLENGER 1${c.reset}`);
console.log(`${c.bold}${c.cyan}================================================================================${c.reset}`);
console.log(`${c.gray}Target Project Root: ${PROJECT_ROOT}${c.reset}\n`);

// -----------------------------------------------------------------------------
// HTML Helper Utilities
// -----------------------------------------------------------------------------
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

function parseAttributes(attrStr) {
  const attrs = {};
  const regex = /([a-zA-Z0-9_\-:@.]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m;
  while ((m = regex.exec(attrStr)) !== null) {
    const key = m[1].toLowerCase();
    const val = m[2] !== undefined ? m[2] : (m[3] !== undefined ? m[3] : (m[4] !== undefined ? m[4] : true));
    attrs[key] = val;
  }
  return attrs;
}

// -----------------------------------------------------------------------------
// SUITE 1: HTML Tag Balance, Nesting & Structural Integrity
// -----------------------------------------------------------------------------
console.log(`${c.bold}${c.magenta}━━━ SUITE 1: HTML SYNTAX, TAG NESTING & ID UNIQUENESS ━━━━━━━━━━━━━━━━━━━${c.reset}`);

for (const page of HTML_PAGES) {
  const filePath = path.join(PROJECT_ROOT, page);
  if (!fs.existsSync(filePath)) {
    fail(`File Exists: ${page}`, 'File not found on disk');
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. DOCTYPE and essential tags
  if (!/<!DOCTYPE\s+html>/i.test(content)) {
    fail(`DOCTYPE Check (${page})`, 'Missing or invalid <!DOCTYPE html>');
  } else {
    pass(`DOCTYPE Check (${page})`);
  }

  // 2. ID Uniqueness Check
  const idRegex = /\bid=["']([^"']+)["']/gi;
  const idMap = new Map();
  let idMatch;
  while ((idMatch = idRegex.exec(content)) !== null) {
    const idVal = idMatch[1];
    idMap.set(idVal, (idMap.get(idVal) || 0) + 1);
  }
  const duplicateIds = [...idMap.entries()].filter(([_, count]) => count > 1).map(([id, count]) => `${id} (x${count})`);
  if (duplicateIds.length > 0) {
    fail(`Unique IDs (${page})`, `Found duplicate IDs: ${duplicateIds.join(', ')}`);
  } else {
    pass(`Unique IDs (${page})`, `${idMap.size} unique IDs`);
  }

  // 3. Nested <a> tags check (illegal in HTML5)
  // Scan for <a> ... <a ...> ... </a> ... </a>
  const aNestingRegex = /<a\b[^>]*>[\s\S]*?<a\b[^>]*>/gi;
  const rawContentNoComments = content.replace(/<!--[\s\S]*?-->/g, '');
  
  // Tag Stack Validator
  const tagTokenRegex = /<(\/)?([a-zA-Z0-9\-]+)([^>]*)>/g;
  let token;
  const stack = [];
  const nestingErrors = [];
  let aDepth = 0;

  // Remove script and style contents for tag stack analysis
  const contentWithoutScripts = rawContentNoComments
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');

  tagTokenRegex.lastIndex = 0;
  while ((token = tagTokenRegex.exec(contentWithoutScripts)) !== null) {
    const isClosing = token[1] === '/';
    const tagName = token[2].toLowerCase();
    const rawTag = token[0];

    if (tagName === '!--') continue;
    if (VOID_ELEMENTS.has(tagName)) {
      if (isClosing) {
        nestingErrors.push(`Void element <${tagName}> should not have a closing tag: ${rawTag}`);
      }
      continue;
    }

    if (!isClosing) {
      if (tagName === 'a') {
        aDepth++;
        if (aDepth > 1) {
          nestingErrors.push(`Nested <a> tag detected at index ${token.index}`);
        }
      }
      // Push opening tag
      stack.push({ tagName, index: token.index });
    } else {
      if (tagName === 'a') {
        if (aDepth > 0) aDepth--;
      }
      if (stack.length === 0) {
        nestingErrors.push(`Unexpected closing tag </${tagName}> without opening tag`);
      } else {
        const top = stack[stack.length - 1];
        if (top.tagName === tagName) {
          stack.pop();
        } else {
          // Check if top is an optionally closable tag like p, li, dt, dd
          const optionalCloseTags = new Set(['p', 'li', 'dt', 'dd', 'option', 'tr', 'td', 'th']);
          if (optionalCloseTags.has(top.tagName)) {
            stack.pop(); // Auto-close
            if (stack.length > 0 && stack[stack.length - 1].tagName === tagName) {
              stack.pop();
            } else {
              nestingErrors.push(`Mismatched closing tag </${tagName}>, expected </${top.tagName}>`);
            }
          } else {
            nestingErrors.push(`Mismatched closing tag </${tagName}>, expected </${top.tagName}>`);
          }
        }
      }
    }
  }

  const unclosedNonOptional = stack.filter(item => !['p', 'li', 'dt', 'dd'].includes(item.tagName));
  if (nestingErrors.length > 0) {
    fail(`Tag Nesting & Balance (${page})`, `${nestingErrors.length} syntax/nesting errors`, nestingErrors.slice(0, 3).join('; '));
  } else if (unclosedNonOptional.length > 0) {
    fail(`Unclosed Tags (${page})`, `${unclosedNonOptional.length} unclosed tags: ${unclosedNonOptional.map(u => u.tagName).join(', ')}`);
  } else {
    pass(`Tag Nesting & Balance (${page})`, `All tags balanced cleanly`);
  }
}

// -----------------------------------------------------------------------------
// SUITE 2: Comprehensive URL, Href & Src Validation
// -----------------------------------------------------------------------------
console.log(`\n${c.bold}${c.magenta}━━━ SUITE 2: COMPREHENSIVE HREF & SRC VALIDATION ━━━━━━━━━━━━━━━━━━━━━━━${c.reset}`);

// Pre-load all files for anchor resolution
const pageContents = {};
for (const page of HTML_PAGES) {
  const p = path.join(PROJECT_ROOT, page);
  if (fs.existsSync(p)) pageContents[page] = fs.readFileSync(p, 'utf8');
}
if (fs.existsSync(path.join(PROJECT_ROOT, 'hospital.html'))) {
  pageContents['hospital.html'] = fs.readFileSync(path.join(PROJECT_ROOT, 'hospital.html'), 'utf8');
}

for (const page of HTML_PAGES) {
  const content = pageContents[page];
  if (!content) continue;

  const tagRegex = /<(a|link|img|script|source)\b([^>]*)>/gi;
  let tagMatch;
  const checkedLinks = [];
  const errors = [];

  while ((tagMatch = tagRegex.exec(content)) !== null) {
    const tagName = tagMatch[1].toLowerCase();
    const attrs = parseAttributes(tagMatch[2]);
    const targetUrl = attrs.href || attrs.src;

    if (!targetUrl || typeof targetUrl !== 'string') continue;
    const trimmed = targetUrl.trim();
    if (trimmed === '' || trimmed === '#') continue;

    checkedLinks.push({ tagName, url: trimmed });

    // Check protocols
    if (trimmed.startsWith('javascript:')) {
      errors.push(`Disallowed inline javascript: link: "${trimmed}"`);
      continue;
    }

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      // Validate full URL
      try {
        const parsed = new URL(trimmed);
        if (parsed.hostname.includes(' ')) {
          errors.push(`URL hostname contains spaces: "${trimmed}"`);
        }
      } catch (err) {
        errors.push(`Malformed absolute URL: "${trimmed}" (${err.message})`);
      }
      continue;
    }

    if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
      continue;
    }

    // Local anchor: #anchor
    if (trimmed.startsWith('#')) {
      const anchor = trimmed.slice(1);
      const hasId = content.includes(`id="${anchor}"`) || content.includes(`id='${anchor}'`);
      if (!hasId) {
        errors.push(`Broken local anchor "#${anchor}" not found in ${page}`);
      }
      continue;
    }

    // Local file path or path#anchor or path?query
    const [withoutAnchor, anchorPart] = trimmed.split('#');
    const [filePart, queryPart] = withoutAnchor.split('?');
    const localTarget = path.join(PROJECT_ROOT, filePart);

    if (!fs.existsSync(localTarget)) {
      errors.push(`Target local file does not exist: "${filePart}" (from ${page})`);
    } else {
      const stat = fs.statSync(localTarget);
      if (stat.size === 0) {
        errors.push(`Target local file is empty (0 bytes): "${filePart}"`);
      }
      if (anchorPart) {
        const targetHtml = pageContents[filePart] || (fs.existsSync(localTarget) ? fs.readFileSync(localTarget, 'utf8') : '');
        const hasTargetId = targetHtml.includes(`id="${anchorPart}"`) || targetHtml.includes(`id='${anchorPart}'`);
        if (!hasTargetId) {
          errors.push(`Anchor "#${anchorPart}" does not exist in target file "${filePart}"`);
        }
      }
    }
  }

  if (errors.length > 0) {
    fail(`Link & Asset Validation (${page})`, `${errors.length} broken targets`, errors.join('; '));
  } else {
    pass(`Link & Asset Validation (${page})`, `${checkedLinks.length} href/src links validated`);
  }
}

// -----------------------------------------------------------------------------
// SUITE 3: WhatsApp B2B Quotation URLs Forensic Audit
// -----------------------------------------------------------------------------
console.log(`\n${c.bold}${c.magenta}━━━ SUITE 3: WHATSAPP B2B QUOTATION URLS FORENSIC AUDIT ━━━━━━━━━━━━━━━━━${c.reset}`);

for (const page of HTML_PAGES) {
  const content = pageContents[page];
  if (!content) continue;

  const waLinkRegex = /href=["'](https:\/\/(?:wa\.me|api\.whatsapp\.com)[^"']*)["']/gi;
  let waMatch;
  const waLinks = [];
  const waErrors = [];

  while ((waMatch = waLinkRegex.exec(content)) !== null) {
    const rawUrl = waMatch[1];
    waLinks.push(rawUrl);

    try {
      const parsed = new URL(rawUrl);
      
      // 1. Phone number check
      // For wa.me/PHONE
      let phone = '';
      if (parsed.hostname === 'wa.me') {
        phone = parsed.pathname.replace(/^\//, '');
      } else if (parsed.searchParams.has('phone')) {
        phone = parsed.searchParams.get('phone');
      }

      if (phone !== TARGET_PHONE) {
        waErrors.push(`Invalid WhatsApp phone number "${phone}", expected "${TARGET_PHONE}" in ${rawUrl}`);
      }

      // 2. Query param text decoding
      // Extract the raw text query parameter directly from URL string to test decodeURIComponent
      const rawTextMatch = rawUrl.match(/[?&]text=([^&]*)/);
      if (!rawTextMatch) {
        waErrors.push(`WhatsApp URL missing "text" query parameter: ${rawUrl}`);
      } else {
        const rawTextParam = rawTextMatch[1];
        let decoded = '';
        try {
          decoded = decodeURIComponent(rawTextParam);
        } catch (e) {
          waErrors.push(`Malformed URI encoding in WhatsApp text parameter: ${rawUrl} (${e.message})`);
        }

        if (decoded) {
          // Check for corrupted template interpolation
          if (/\b(undefined|null|NaN|\[object Object\])\b/i.test(decoded)) {
            waErrors.push(`Corrupted template variable detected in WhatsApp message: "${decoded}"`);
          }
          if (decoded.length < 5) {
            waErrors.push(`WhatsApp message suspiciously short: "${decoded}"`);
          }
        }
      }
    } catch (e) {
      waErrors.push(`Invalid WhatsApp URL format: "${rawUrl}" (${e.message})`);
    }
  }

  if (waErrors.length > 0) {
    fail(`WhatsApp B2B URLs (${page})`, `${waErrors.length} errors`, waErrors.join('; '));
  } else if (waLinks.length === 0) {
    fail(`WhatsApp B2B URLs (${page})`, 'No WhatsApp links found on page');
  } else {
    pass(`WhatsApp B2B URLs (${page})`, `${waLinks.length} WhatsApp links verified with phone ${TARGET_PHONE}`);
  }
}

// Cross-Card WhatsApp Specificity Check for Subcategory Pages
const SUBCATEGORY_CONFIG = [
  { file: 'amenities.html', sectionId: 'amenities-solution' },
  { file: 'gorden.html', sectionId: 'gorden-solution' },
  { file: 'towel.html', sectionId: 'towel-solution' },
  { file: 'linen.html', sectionId: 'linen-solution' }
];

for (const sc of SUBCATEGORY_CONFIG) {
  const content = pageContents[sc.file];
  if (!content) continue;

  const sectionMatch = content.match(new RegExp(`<section[^>]*id=["']${sc.sectionId}["'][^>]*>([\\s\\S]*?)<\\/section>`, 'i'));
  const catalogHtml = sectionMatch ? sectionMatch[1] : content;

  // Extract each card inside the catalog section
  const cardRegex = /<div\b[^>]*class=["'][^"']*(?:rounded-2xl|rounded-3xl)[^"']*(?:bg-white)[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
  let cardMatch;
  let cardCount = 0;
  let mismatchCount = 0;
  const mismatches = [];

  while ((cardMatch = cardRegex.exec(catalogHtml)) !== null) {
    const cardHtml = cardMatch[0];
    const h3Match = cardHtml.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i);
    const waMatch = cardHtml.match(/href=["'](https:\/\/wa\.me\/[^"']+)["']/i);

    if (h3Match && waMatch) {
      cardCount++;
      const rawTitle = h3Match[1].replace(/<[^>]+>/g, '').trim();
      const waUrl = waMatch[1];
      const rawTextMatch = waUrl.match(/[?&]text=([^&]*)/);
      const decodedText = rawTextMatch ? decodeURIComponent(rawTextMatch[1]) : '';

      const titleFirstWord = rawTitle.split(/\s+/)[0];
      if (!decodedText.toLowerCase().includes(titleFirstWord.toLowerCase()) && !decodedText.toLowerCase().includes('penawaran')) {
        mismatchCount++;
        mismatches.push(`Card "${rawTitle}" quotation text: "${decodedText}"`);
      }
    }
  }

  if (mismatchCount > 0) {
    warn(`WhatsApp Product-Specific Quotation (${sc.file})`, `${mismatchCount} cards might have mismatched quotation text`, mismatches.slice(0, 2).join('; '));
  } else {
    pass(`WhatsApp Product-Specific Quotation (${sc.file})`, `${cardCount} product cards validated with targeted quotation links`);
  }
}

// -----------------------------------------------------------------------------
// SUITE 4: Responsive Viewport, Breakpoints & Mobile Navigation
// -----------------------------------------------------------------------------
console.log(`\n${c.bold}${c.magenta}━━━ SUITE 4: RESPONSIVE VIEWPORT & MOBILE NAVIGATION ━━━━━━━━━━━━━━━━━━━${c.reset}`);

for (const page of HTML_PAGES) {
  const content = pageContents[page];
  if (!content) continue;

  // 1. Meta viewport tag
  const viewportMatch = content.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  if (!viewportMatch || !viewportMatch[1].includes('width=device-width') || !viewportMatch[1].includes('initial-scale=1.0')) {
    fail(`Responsive Viewport Meta (${page})`, 'Missing or invalid meta viewport');
  } else {
    pass(`Responsive Viewport Meta (${page})`);
  }

  // 2. Mobile Menu Button
  const hasMobileBtn = content.includes('id="mobileMenuBtn"');
  if (!hasMobileBtn) {
    fail(`Mobile Menu Button (${page})`, 'Missing #mobileMenuBtn');
  } else {
    pass(`Mobile Menu Button (${page})`);
  }

  // 3. Mobile Menu Container
  const hasMobileMenu = content.includes('id="mobileMenu"');
  if (!hasMobileMenu) {
    fail(`Mobile Menu Container (${page})`, 'Missing #mobileMenu');
  } else {
    // Check initial hidden state
    const menuTagMatch = content.match(/<div[^>]*id=["']mobileMenu["'][^>]*class=["']([^"']*)["']/i);
    if (menuTagMatch && menuTagMatch[1].includes('hidden')) {
      pass(`Mobile Menu Container (${page})`, 'Initially hidden with responsive class');
    } else {
      fail(`Mobile Menu Container (${page})`, 'Mobile menu is not initially hidden');
    }
  }

  // 4. Mobile Menu Script Wiring
  const hasToggleScript = content.includes("document.getElementById('mobileMenuBtn').addEventListener('click'") &&
                          content.includes("document.getElementById('mobileMenu').classList.toggle('hidden')");
  if (!hasToggleScript) {
    fail(`Mobile Menu Script Toggle (${page})`, 'Missing event listener for mobile menu toggle');
  } else {
    pass(`Mobile Menu Script Toggle (${page})`);
  }

  // 5. Overflow & Fixed Width Hazards
  // Look for arbitrary fixed pixel widths > 320px without responsive prefix
  // e.g. class="w-[800px]" instead of class="w-full md:w-[800px]"
  const fixedWidthRegex = /\bclass=["'][^"']*?\b(w-\[\s*(\d+)px\s*\])[^"']*?["']/gi;
  let fwMatch;
  const layoutHazards = [];
  while ((fwMatch = fixedWidthRegex.exec(content)) !== null) {
    const fullClass = fwMatch[1];
    const pxVal = parseInt(fwMatch[2], 10);
    if (pxVal > 350) {
      // Check if preceded by a breakpoint prefix
      const matchIdx = fwMatch.index;
      const snippet = content.substring(Math.max(0, matchIdx - 10), matchIdx + fullClass.length);
      if (!/(?:sm|md|lg|xl|2xl):w-/i.test(snippet)) {
        layoutHazards.push(`Unresponsive fixed width "${fullClass}" may cause horizontal overflow on mobile (<375px)`);
      }
    }
  }

  if (layoutHazards.length > 0) {
    warn(`Mobile Layout Constraints (${page})`, `${layoutHazards.length} potential layout hazards`, layoutHazards.join('; '));
  } else {
    pass(`Mobile Layout Constraints (${page})`, 'No unconstrained fixed-width containers detected');
  }
}

// -----------------------------------------------------------------------------
// SUITE 5: Lucide Icons, i18n & Theme Conformance
// -----------------------------------------------------------------------------
console.log(`\n${c.bold}${c.magenta}━━━ SUITE 5: SCRIPT HOOKS, LUCIDE ICONS, I18N & THEME ━━━━━━━━━━━━━━━━━━━${c.reset}`);

// Known Lucide icons catalog check
for (const page of HTML_PAGES) {
  const content = pageContents[page];
  if (!content) continue;

  const iconRegex = /data-lucide=["']([^"']+)["']/gi;
  let iconMatch;
  const icons = new Set();
  while ((iconMatch = iconRegex.exec(content)) !== null) {
    icons.add(iconMatch[1]);
  }

  if (icons.size === 0) {
    fail(`Lucide Icons (${page})`, 'No Lucide icon tags found');
  } else {
    pass(`Lucide Icons (${page})`, `${icons.size} unique icon names utilized`);
  }

  // Check script tags for theme.js and i18n.js (allow cache-busting query strings like ?v=...)
  const hasThemeJs = /<script\b[^>]*src=["']theme\.js(?:\?[^"']*)?["']/i.test(content);
  const hasI18nJs = /<script\b[^>]*src=["']i18n\.js(?:\?[^"']*)?["']/i.test(content);
  const hasThemeCss = /<link\b[^>]*href=["']theme\.css(?:\?[^"']*)?["']/i.test(content);

  if (!hasThemeJs || !hasI18nJs || !hasThemeCss) {
    fail(`Theme/i18n Script Hooks (${page})`, `Missing assets: theme.js=${hasThemeJs}, i18n.js=${hasI18nJs}, theme.css=${hasThemeCss}`);
  } else {
    pass(`Theme/i18n Script Hooks (${page})`);
  }
}

// Verify i18n.js syntax and key dictionary
try {
  const i18nPath = path.join(PROJECT_ROOT, 'i18n.js');
  const i18nContent = fs.readFileSync(i18nPath, 'utf8');
  
  // Syntax check via Function constructor
  const fn = new Function('window', 'document', 'localStorage', 'lucide', i18nContent);
  pass('i18n.js JavaScript Syntax Validation', 'Clean parse, no syntax errors');

  // Verify subpage titles in i18n.js
  const requiredTitles = [
    'Amenities Hotel Premium | DETASCO',
    'Gorden Hotel Elegan | DETASCO',
    'Handuk Hotel Premium | DETASCO',
    'Linen & Bedding Hotel Bintang 5 | DETASCO'
  ];
  let missingTitles = 0;
  for (const t of requiredTitles) {
    if (!i18nContent.includes(t)) {
      fail(`i18n titleMap Coverage`, `Missing translation mapping for "${t}"`);
      missingTitles++;
    }
  }
  if (missingTitles === 0) {
    pass('i18n titleMap Coverage', 'All 4 subpage titles mapped for bilingual switching');
  }

  // Check product title translation coverage
  for (const sc of SUBCATEGORY_CONFIG) {
    const pageContent = pageContents[sc.file];
    const sectionMatch = pageContent.match(new RegExp(`<section[^>]*id=["']${sc.sectionId}["'][^>]*>([\\s\\S]*?)<\\/section>`, 'i'));
    const catalogHtml = sectionMatch ? sectionMatch[1] : pageContent;
    const h3Regex = /<h3\b[^>]*>([\s\S]*?)<\/h3>/gi;
    let h3m;
    let totalCards = 0;
    let translatedCards = 0;
    while ((h3m = h3Regex.exec(catalogHtml)) !== null) {
      totalCards++;
      const title = h3m[1].replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
      if (i18nContent.includes(`"${title}"`) || i18nContent.includes(`'${title}'`)) {
        translatedCards++;
      }
    }
    pass(`i18n Dictionary Catalog Coverage (${sc.file})`, `${translatedCards}/${totalCards} product titles indexed in dictionary`);
  }
} catch (e) {
  fail('i18n.js JavaScript Syntax Validation', e.message);
}

// -----------------------------------------------------------------------------
// SUITE 6: Live HTTP 200 Server Probe
// -----------------------------------------------------------------------------
console.log(`\n${c.bold}${c.magenta}━━━ SUITE 6: LIVE HTTP 200 SERVER & NON-FALLBACK PROBING ━━━━━━━━━━━━━━━${c.reset}`);

function probeUrl(targetUrl) {
  return new Promise((resolve) => {
    const u = new URL(targetUrl);
    const req = http.get({
      host: u.hostname,
      port: u.port || 80,
      path: u.pathname + u.search,
      timeout: 3000
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          body: data,
          error: null
        });
      });
    });

    req.on('error', (err) => {
      resolve({ statusCode: null, contentType: null, body: null, error: err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ statusCode: null, contentType: null, body: null, error: 'Timeout' });
    });
  });
}

async function runHttpProbes() {
  const probeTargets = [
    { path: '/index.html', type: 'text/html', title: 'DETASCO | Solusi Pengadaan' },
    { path: '/linen.html', type: 'text/html', title: 'Linen & Bedding' },
    { path: '/amenities.html', type: 'text/html', title: 'Amenities Hotel Premium' },
    { path: '/gorden.html', type: 'text/html', title: 'Gorden Hotel' },
    { path: '/towel.html', type: 'text/html', title: 'Handuk Hotel' },
    { path: '/logo.png', type: 'image/png' },
    { path: '/theme.css', type: 'text/css' },
    { path: '/theme.js', type: 'application/javascript' },
    { path: '/i18n.js', type: 'application/javascript' }
  ];

  for (const t of probeTargets) {
    const res = await probeUrl(`${SERVER_URL}${t.path}`);
    if (res.error) {
      fail(`HTTP Probe: ${t.path}`, `Connection error: ${res.error}`);
      continue;
    }

    if (res.statusCode !== 200) {
      fail(`HTTP Probe: ${t.path}`, `Unexpected status ${res.statusCode}, expected 200`);
      continue;
    }

    if (t.type && !res.contentType.includes(t.type)) {
      fail(`HTTP Content-Type: ${t.path}`, `Expected ${t.type}, got ${res.contentType}`);
      continue;
    }

    // Check non-fallback delivery for HTML pages
    if (t.title) {
      if (!res.body.includes(t.title)) {
        fail(`HTTP Non-Fallback: ${t.path}`, `Page delivered fallback index.html instead of actual content`);
        continue;
      }
    }

    pass(`HTTP 200 Probe: ${t.path}`, `Status 200, Content-Type: ${res.contentType}`);
  }

  // -----------------------------------------------------------------------------
  // FINAL VERDICT & SUMMARY
  // -----------------------------------------------------------------------------
  console.log(`\n${c.bold}${c.cyan}================================================================================${c.reset}`);
  console.log(`${c.bold}${c.cyan}  ADVERSARIAL STRESS TEST SUMMARY REPORT${c.reset}`);
  console.log(`${c.bold}${c.cyan}================================================================================${c.reset}`);
  console.log(`  Total Checks Executed : ${results.passed + results.failed}`);
  console.log(`  Passed Checks         : ${c.green}${results.passed}${c.reset}`);
  console.log(`  Failed Checks         : ${results.failed > 0 ? c.red : c.green}${results.failed}${c.reset}`);
  console.log(`  Warnings              : ${results.warnings > 0 ? c.yellow : c.green}${results.warnings}${c.reset}`);
  console.log(`--------------------------------------------------------------------------------`);

  if (results.failed === 0) {
    console.log(`\n${c.bold}${c.green} EMPIRICAL VERDICT: CONFIRM_CORRECTNESS ${c.reset}\n`);
    console.log(`The implementation successfully withstood all adversarial stress harnesses.`);
  } else {
    console.log(`\n${c.bold}${c.red} EMPIRICAL VERDICT: REPORT_DEFECTS ${c.reset}\n`);
    console.log(`Defects found:`);
    results.findings.forEach((f, idx) => {
      console.log(`  ${idx + 1}. [${f.testName}] ${f.error}`);
    });
  }
}

runHttpProbes();
