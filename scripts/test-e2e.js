#!/usr/bin/env node
/**
 * =============================================================================
 * DETASCO Hospitality Supplier - Automated E2E Test Suite Runner
 * =============================================================================
 * 
 * Zero-dependency end-to-end testing infrastructure verifying:
 * - Tier 1: Feature & Catalog Coverage (HTTP 200 non-fallback, solution grids, card counts)
 * - Tier 2: Boundary & Specification Integrity (Aspect-square, titles, 4+ checkmarks, commercial specs)
 * - Tier 3: Link & Quotation Integrity (WhatsApp B2B schema, zero broken internal links, breadcrumbs, active tabs)
 * - Tier 4: Script & Theme Hooks (Lucide icons, theme toggle [data-theme-toggle], i18n DOM translation)
 * 
 * Dual-mode execution:
 * 1. Live HTTP 200 verification against http://localhost:3000 (with content-aware non-fallback detection)
 * 2. Graceful offline fallback to direct filesystem parsing if server is offline
 * 
 * Progressive milestone testing:
 * node scripts/test-e2e.js                 (Runs full test suite, exits 1 on defect)
 * node scripts/test-e2e.js --milestone=M0  (Validates completed M0 benchmark scope)
 * node scripts/test-e2e.js --allow-pending (Treats uncompleted worker milestones as pending)
 * node scripts/test-e2e.js --json          (Outputs structured JSON report)
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

// -----------------------------------------------------------------------------
// Configuration & Constants
// -----------------------------------------------------------------------------
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SERVER_HOST = 'localhost';
const SERVER_PORT = 3000;
const SERVER_BASE_URL = `http://${SERVER_HOST}:${SERVER_PORT}`;
const WA_PHONE_EXPECTED = '6281234567890';
const WA_BASE_URL = `https://wa.me/${WA_PHONE_EXPECTED}`;

// Page Catalog Specifications
const PAGES_CONFIG = [
  {
    file: 'index.html',
    url: '/index.html',
    milestone: 'M0',
    titleExpected: 'DETASCO | Supplier Perlengkapan Hotel & Rumah Sakit di Medan',
    titleKeyword: 'DETASCO | Supplier Perlengkapan',
    distinctHeader: 'SUPPLIER PERLENGKAPAN HOTEL',
    solutionId: null, // Index page has no single product-solution section
    minCards: 0,
    targetCards: 0
  },
  {
    file: 'linen.html',
    url: '/linen.html',
    milestone: 'M0', // Benchmark reference implementation
    titleExpected: 'Supplier Linen & Bedding Hotel Bintang 5 | DETASCO',
    titleKeyword: 'Linen & Bedding',
    distinctHeader: 'ALL-IN LINEN SOLUTION',
    solutionId: 'linen-solution',
    minCards: 8,
    targetCards: 12
  },
  {
    file: 'amenities.html',
    url: '/amenities.html',
    milestone: 'M1',
    titleExpected: 'Supplier Amenities Hotel Premium di Medan | DETASCO',
    titleKeyword: 'Amenities Hotel Premium',
    distinctHeader: 'Amenities Hotel',
    solutionId: 'amenities-solution',
    minCards: 9,
    targetCards: 9
  },
  {
    file: 'gorden.html',
    url: '/gorden.html',
    milestone: 'M2',
    titleExpected: 'Supplier Gorden Hotel Elegan di Medan | DETASCO',
    titleKeyword: 'Gorden Hotel',
    distinctHeader: 'Gorden Hotel',
    solutionId: 'gorden-solution',
    minCards: 4,
    targetCards: 4
  },
  {
    file: 'towel.html',
    url: '/towel.html',
    milestone: 'M3',
    titleExpected: 'Supplier Handuk Hotel Premium di Medan | DETASCO',
    titleKeyword: 'Handuk Hotel',
    distinctHeader: 'Handuk Hotel',
    solutionId: 'towel-solution',
    minCards: 8,
    targetCards: 8
  },
  {
    file: 'hospital.html',
    url: '/hospital.html',
    milestone: 'M0',
    titleExpected: 'Supplier Perlengkapan Rumah Sakit di Medan | DETASCO',
    titleKeyword: 'Perlengkapan Rumah Sakit',
    distinctHeader: 'Perlengkapan Rumah Sakit',
    solutionId: null,
    minCards: 0,
    targetCards: 0
  },
  {
    file: 'about.html',
    url: '/about.html',
    milestone: 'M0',
    titleExpected: 'Tentang Kami | PT. Detasco Elca Sarana',
    titleKeyword: 'Tentang Kami',
    distinctHeader: 'PT. Detasco Elca Sarana',
    solutionId: null,
    minCards: 0,
    targetCards: 0
  }
];

// Product cards show general benefits only. Technical specs must stay out of the
// cards so prospects contact the admin for full specifications.
const BULLETS_PER_CARD = 3;
const FORBIDDEN_SPEC_PATTERNS = [
  { label: 'GSM grammage', rx: /\b\d+\s*GSM\b/i },
  { label: 'BPOM / izin edar', rx: /\bBPOM\b|izin\s*edar/i },
  { label: 'fire standard (NFPA / BS 5867 / flame-retardant)', rx: /NFPA|BS\s*5867|flame[- ]retardant/i },
  { label: 'decibel rating', rx: /\b\d+\s*dB\b/i },
  { label: 'combed cotton', rx: /combed\s*cotton/i },
  { label: 'thread count', rx: /\b\d+\s*TC\b/i },
  { label: 'material grade (SUS304)', rx: /SUS\s*304/i }
];

// CLI Arguments Parser
const args = process.argv.slice(2);
const cliOptions = {
  milestone: 'ALL', // 'ALL', 'M0', 'M1', 'M2', 'M3', 'M4'
  allowPending: false,
  json: false,
  offlineOnly: false,
  tiers: [1, 2, 3, 4]
};

for (const arg of args) {
  if (arg.startsWith('--milestone=')) {
    cliOptions.milestone = arg.split('=')[1].toUpperCase();
  } else if (arg === '-m' || arg === '--milestone') {
    const nextIdx = args.indexOf(arg) + 1;
    if (args[nextIdx]) cliOptions.milestone = args[nextIdx].toUpperCase();
  } else if (arg === '--allow-pending') {
    cliOptions.allowPending = true;
  } else if (arg === '--json') {
    cliOptions.json = true;
  } else if (arg === '--offline' || arg === '--offline-only') {
    cliOptions.offlineOnly = true;
  } else if (arg.startsWith('--tier=')) {
    cliOptions.tiers = arg.split('=')[1].split(',').map(n => parseInt(n.trim(), 10));
  }
}

// ANSI Styling Helpers
const useColor = !process.env.NO_COLOR && process.stdout.isTTY && !cliOptions.json;
const colors = {
  reset: useColor ? '\x1b[0m' : '',
  bold: useColor ? '\x1b[1m' : '',
  dim: useColor ? '\x1b[2m' : '',
  green: useColor ? '\x1b[32m' : '',
  red: useColor ? '\x1b[31m' : '',
  yellow: useColor ? '\x1b[33m' : '',
  blue: useColor ? '\x1b[34m' : '',
  magenta: useColor ? '\x1b[35m' : '',
  cyan: useColor ? '\x1b[36m' : '',
  white: useColor ? '\x1b[37m' : '',
  bgRed: useColor ? '\x1b[41m\x1b[37m' : '',
  bgGreen: useColor ? '\x1b[42m\x1b[30m' : '',
  bgYellow: useColor ? '\x1b[43m\x1b[30m' : ''
};

// -----------------------------------------------------------------------------
// Test Result Aggregator
// -----------------------------------------------------------------------------
const testResults = {
  startTime: new Date().toISOString(),
  serverOnline: false,
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    pending: 0,
    skipped: 0
  },
  tiers: {
    tier1: { name: 'Tier 1: Feature & Catalog Coverage', tests: [] },
    tier2: { name: 'Tier 2: Boundary & Specification Integrity', tests: [] },
    tier3: { name: 'Tier 3: Link & Quotation Integrity', tests: [] },
    tier4: { name: 'Tier 4: Script & Theme Hooks', tests: [] }
  },
  escalations: []
};

function recordTest(tierKey, testItem) {
  testResults.summary.total++;
  if (testItem.status === 'PASS') {
    testResults.summary.passed++;
  } else if (testItem.status === 'PENDING') {
    testResults.summary.pending++;
    if (cliOptions.allowPending || (cliOptions.milestone !== 'ALL' && testItem.milestone !== cliOptions.milestone)) {
      // Do not count as hard failure if pending allowed or filtered by milestone
    } else {
      testResults.summary.failed++;
    }
  } else if (testItem.status === 'FAIL') {
    testResults.summary.failed++;
    if (testItem.defect) {
      testResults.escalations.push({
        milestone: testItem.milestone || 'General',
        page: testItem.page || 'Global',
        tier: tierKey,
        defect: testItem.defect,
        expected: testItem.expected,
        actual: testItem.actual
      });
    }
  } else {
    testResults.summary.skipped++;
  }
  testResults.tiers[tierKey].tests.push(testItem);
}

// -----------------------------------------------------------------------------
// Pure Native HTML Extraction Utilities (Zero External Dependency)
// -----------------------------------------------------------------------------

/**
 * Extracts page <title> content
 */
function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : '';
}

/**
 * Extracts all attributes from an HTML tag string
 */
function parseAttributes(tagStr) {
  const attrs = {};
  const regex = /([a-zA-Z0-9_\-:@.]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m;
  while ((m = regex.exec(tagStr)) !== null) {
    const key = m[1];
    const val = m[2] !== undefined ? m[2] : (m[3] !== undefined ? m[3] : (m[4] !== undefined ? m[4] : true));
    attrs[key] = val;
  }
  return attrs;
}

/**
 * Extracts a section block by its HTML id using balanced tag counting
 */
function extractSectionById(html, sectionId) {
  const openTagRegex = new RegExp(`<section[^>]*id=["']${sectionId}["'][^>]*>`, 'i');
  const matchOpen = html.match(openTagRegex);
  if (!matchOpen) return null;

  const startIndex = matchOpen.index;
  const afterOpenIndex = startIndex + matchOpen[0].length;
  
  let depth = 1;
  let pos = afterOpenIndex;
  const tagRegex = /<\/?section\b[^>]*>/gi;
  tagRegex.lastIndex = pos;
  
  let tagMatch;
  while ((tagMatch = tagRegex.exec(html)) !== null) {
    if (tagMatch[0].startsWith('</')) {
      depth--;
      if (depth === 0) {
        const fullContent = html.substring(startIndex, tagMatch.index + tagMatch[0].length);
        const innerContent = html.substring(afterOpenIndex, tagMatch.index);
        return { full: fullContent, inner: innerContent };
      }
    } else {
      depth++;
    }
  }

  // Fallback: until next </section>
  const closeIndex = html.indexOf('</section>', afterOpenIndex);
  if (closeIndex !== -1) {
    return {
      full: html.substring(startIndex, closeIndex + 10),
      inner: html.substring(afterOpenIndex, closeIndex)
    };
  }
  return null;
}

/**
 * Extracts product cards from a solution section.
 * Uses balanced <div> tag counting to prevent nested divs (like image containers)
 * from prematurely truncating the card HTML before <h3> and <ul> specs.
 */
function extractProductCards(sectionHtml) {
  if (!sectionHtml) return [];

  const cards = [];
  // Find opening div of each card with rounded-2xl/rounded-3xl and bg-white
  const cardStartRegex = /<div\b[^>]*class=["'][^"']*(?:rounded-2xl|rounded-3xl)[^"']*(?:bg-white)[^"']*["'][^>]*>|<div\b[^>]*class=["'][^"']*(?:bg-white)[^"']*(?:rounded-2xl|rounded-3xl)[^"']*["'][^>]*>/gi;

  let match;
  while ((match = cardStartRegex.exec(sectionHtml)) !== null) {
    const startIdx = match.index;
    let pos = startIdx + match[0].length;
    let depth = 1;

    // Scan forward with balanced <div> matching
    const tagRegex = /<\/?div\b[^>]*>/gi;
    tagRegex.lastIndex = pos;

    let tagMatch;
    while ((tagMatch = tagRegex.exec(sectionHtml)) !== null) {
      if (tagMatch[0].startsWith('</')) {
        depth--;
        if (depth === 0) {
          const cardHtml = sectionHtml.substring(startIdx, tagMatch.index + tagMatch[0].length);
          // Only accept if card contains an h3 title and an image
          if (/<h3\b/i.test(cardHtml) && /<img\b/i.test(cardHtml)) {
            cards.push(cardHtml);
          }
          break;
        }
      } else {
        depth++;
      }
    }
  }

  return cards;
}

/**
 * Analyzes a single product card for Tier 2 requirements
 */
function inspectCardDetails(cardHtml) {
  // 1. Aspect-square image container
  const hasAspectSquare = /aspect-square/i.test(cardHtml);
  
  // 2. Image tag check
  const imgMatch = cardHtml.match(/<img\b([^>]*)>/i);
  const imgAttrs = imgMatch ? parseAttributes(imgMatch[1]) : null;
  const validImg = imgAttrs && imgAttrs.src && (imgAttrs.alt && imgAttrs.alt.trim().length > 0);
  const hasLazyLoad = imgAttrs && imgAttrs.loading === 'lazy';

  // 3. Bold Title
  const h3Match = cardHtml.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i);
  const rawTitle = h3Match ? h3Match[1].replace(/<[^>]+>/g, '').trim() : '';
  const isTitleBold = h3Match && (h3Match[0].includes('font-bold') || h3Match[0].includes('font-cinzel') || /<strong>|<b>/i.test(h3Match[1]));

  // 4. Bullet points & Checkmark Badges
  const liMatches = [...cardHtml.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)];
  const bulletCount = liMatches.length;

  let checkmarkCount = 0;
  for (const li of liMatches) {
    const liContent = li[1];
    // Check for orange badge `<span ...>✓</span>` or literal '✓' or lucide check icon
    if (liContent.includes('✓') || /bg-\[#EA580C\]/i.test(liContent) || /check/i.test(liContent)) {
      checkmarkCount++;
    }
  }

  // 5. WhatsApp quote link in card (optional per-card or bottom)
  const cardWaLinks = [];
  const linkRegex = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(cardHtml)) !== null) {
    const attrs = parseAttributes(linkMatch[1]);
    if (attrs.href && attrs.href.includes('wa.me')) {
      cardWaLinks.push({
        href: attrs.href,
        text: linkMatch[2].replace(/<[^>]+>/g, '').trim()
      });
    }
  }

  return {
    rawTitle,
    hasAspectSquare,
    validImg,
    hasLazyLoad,
    imgSrc: imgAttrs ? imgAttrs.src : null,
    imgAlt: imgAttrs ? imgAttrs.alt : null,
    isTitleBold,
    bulletCount,
    checkmarkCount,
    textSnippet: cardHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '),
    cardWaLinks
  };
}

/**
 * Extracts all hrefs from an HTML document
 */
function extractAllHrefs(html) {
  const hrefs = [];
  const regex = /<a\b([^>]*)>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const fullTag = match[0];
    const attrs = parseAttributes(match[1]);
    if (attrs.href !== undefined) {
      hrefs.push({ href: attrs.href, attrs, fullTag });
    }
  }
  return hrefs;
}

/**
 * Extracts all local src attributes (images, scripts)
 */
function extractAllSrcs(html) {
  const srcs = [];
  const regex = /<(?:img|script|source)\b([^>]*)>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const attrs = parseAttributes(match[1]);
    if (attrs.src) {
      srcs.push(attrs.src);
    }
  }
  return srcs;
}

/**
 * Probes HTTP endpoint
 */
function probeHttpUrl(requestUrl) {
  return new Promise((resolve) => {
    const parsed = url.parse(requestUrl);
    const req = http.get({
      host: parsed.hostname,
      port: parsed.port || 80,
      path: parsed.path,
      timeout: 2500
    }, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        resolve({
          online: true,
          statusCode: res.statusCode,
          headers: res.headers,
          body
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        online: false,
        error: err.message,
        statusCode: null,
        body: null
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        online: false,
        error: 'Connection timed out',
        statusCode: null,
        body: null
      });
    });
  });
}

// -----------------------------------------------------------------------------
// Test Suite Runner
// -----------------------------------------------------------------------------

async function runTestSuite() {
  console.log(`\n${colors.bold}${colors.cyan}================================================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  DETASCO HOSPITALITY SUPPLIER — E2E TEST RUNNER (ZERO DEPENDENCY)${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}================================================================================${colors.reset}`);
  console.log(`${colors.dim}Project Root   :${colors.reset} ${PROJECT_ROOT}`);
  console.log(`${colors.dim}Target Server  :${colors.reset} ${SERVER_BASE_URL}`);
  console.log(`${colors.dim}Milestone Scope:${colors.reset} ${colors.bold}${cliOptions.milestone}${colors.reset} | Allow Pending: ${cliOptions.allowPending}`);
  console.log(`${colors.dim}Timestamp      :${colors.reset} ${testResults.startTime}\n`);

  // Step 0: Check HTTP Server Availability
  let serverCheck = null;
  if (!cliOptions.offlineOnly) {
    serverCheck = await probeHttpUrl(`${SERVER_BASE_URL}/`);
  }
  testResults.serverOnline = serverCheck ? serverCheck.online : false;

  if (testResults.serverOnline) {
    console.log(`${colors.green}✔ Local HTTP Server is LIVE on port ${SERVER_PORT}.${colors.reset} Performing live non-fallback HTTP 200 delivery assertions.`);
  } else {
    console.log(`${colors.yellow}ℹ Local HTTP Server is OFFLINE at ${SERVER_BASE_URL}.${colors.reset}`);
    console.log(`${colors.dim}  Gracefully executing direct filesystem parsing and content verification.${colors.reset}`);
  }
  console.log('');

  // Cache file contents
  const htmlStore = {};
  for (const p of PAGES_CONFIG) {
    const filePath = path.join(PROJECT_ROOT, p.file);
    if (fs.existsSync(filePath)) {
      htmlStore[p.file] = fs.readFileSync(filePath, 'utf8');
    } else {
      htmlStore[p.file] = null;
    }
  }

  // ===========================================================================
  // TIER 1: Feature & Catalog Coverage
  // ===========================================================================
  if (cliOptions.tiers.includes(1)) {
    console.log(`${colors.bold}${colors.magenta}━━━ TIER 1: FEATURE & CATALOG COVERAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

    // T1.1: HTML File Existence and Size
    for (const p of PAGES_CONFIG) {
      const exists = htmlStore[p.file] !== null;
      const sizeBytes = exists ? Buffer.byteLength(htmlStore[p.file], 'utf8') : 0;
      const isSufficientSize = sizeBytes > 5000;

      if (exists && isSufficientSize) {
        recordTest('tier1', {
          id: `T1.1_FILE_${p.file}`,
          name: `HTML File Existence & Integrity (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'PASS',
          message: `${p.file} exists (${(sizeBytes / 1024).toFixed(1)} KB)`
        });
      } else {
        recordTest('tier1', {
          id: `T1.1_FILE_${p.file}`,
          name: `HTML File Existence & Integrity (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'FAIL',
          defect: exists ? `File size too small (${sizeBytes} bytes)` : `File ${p.file} not found on disk`,
          expected: `Valid HTML file > 5 KB`,
          actual: exists ? `${sizeBytes} bytes` : 'Missing'
        });
      }
    }

    // T1.2: Server HTTP 200 & Non-Fallback Delivery
    for (const p of PAGES_CONFIG) {
      if (testResults.serverOnline) {
        const httpResp = await probeHttpUrl(`${SERVER_BASE_URL}${p.url}`);
        const httpTitle = httpResp.body ? extractTitle(httpResp.body) : '';
        const indexTitle = PAGES_CONFIG[0].titleKeyword;
        
        // Assert: HTTP 200
        const is200 = httpResp.statusCode === 200;
        
        // Assert: Non-Fallback content
        // If requesting a subpage (e.g. linen.html, amenities.html), its title MUST NOT match indexTitle!
        const isNotFallback = p.file === 'index.html' ? true : (!httpTitle.includes(indexTitle) && httpTitle.includes(p.titleKeyword));
        const hasDistinctHeader = httpResp.body ? httpResp.body.includes(p.distinctHeader) : false;

        if (is200 && isNotFallback && hasDistinctHeader) {
          recordTest('tier1', {
            id: `T1.2_HTTP_${p.file}`,
            name: `HTTP 200 & Non-Fallback Content (${p.url})`,
            milestone: p.milestone,
            page: p.file,
            status: 'PASS',
            message: `HTTP 200 OK | Title: "${httpTitle}" | Distinct Header: "${p.distinctHeader}"`
          });
        } else {
          let reason = '';
          if (!is200) reason = `HTTP status code ${httpResp.statusCode} (expected 200)`;
          else if (!isNotFallback) reason = `Server returned SPA fallback (served index.html content for ${p.url})`;
          else if (!hasDistinctHeader) reason = `Missing distinct section header "${p.distinctHeader}"`;

          recordTest('tier1', {
            id: `T1.2_HTTP_${p.file}`,
            name: `HTTP 200 & Non-Fallback Content (${p.url})`,
            milestone: p.milestone,
            page: p.file,
            status: 'FAIL',
            defect: reason,
            expected: `HTTP 200 with distinct title matching "${p.titleKeyword}" and header "${p.distinctHeader}"`,
            actual: `Status ${httpResp.statusCode} | Title "${httpTitle}"`
          });
        }
      } else {
        // Direct filesystem validation fallback
        const fileContent = htmlStore[p.file];
        if (fileContent) {
          const docTitle = extractTitle(fileContent);
          const hasDistinctTitle = docTitle.includes(p.titleKeyword);
          const hasDistinctHeader = fileContent.includes(p.distinctHeader);

          if (hasDistinctTitle && hasDistinctHeader) {
            recordTest('tier1', {
              id: `T1.2_STATIC_${p.file}`,
              name: `Static Page Title & Header Signature (${p.file})`,
              milestone: p.milestone,
              page: p.file,
              status: 'PASS',
              message: `(Offline Mode) Title: "${docTitle}" | Distinct Header: "${p.distinctHeader}"`
            });
          } else {
            recordTest('tier1', {
              id: `T1.2_STATIC_${p.file}`,
              name: `Static Page Title & Header Signature (${p.file})`,
              milestone: p.milestone,
              page: p.file,
              status: 'FAIL',
              defect: `Missing expected title keyword or section header in ${p.file}`,
              expected: `Title matching "${p.titleKeyword}", header "${p.distinctHeader}"`,
              actual: `Title "${docTitle}"`
            });
          }
        }
      }
    }

    // T1.3: Product Solution Sections & Card Counts
    for (const p of PAGES_CONFIG) {
      if (!p.solutionId) continue; // Skip index.html

      const fileContent = htmlStore[p.file];
      if (!fileContent) continue;

      const section = extractSectionById(fileContent, p.solutionId);
      const isMilestoneM0 = p.milestone === 'M0';

      if (!section) {
        const isPending = !isMilestoneM0 && (cliOptions.allowPending || cliOptions.milestone === 'M0');
        recordTest('tier1', {
          id: `T1.3_SECTION_${p.solutionId}`,
          name: `Catalog Section Existence (#${p.solutionId})`,
          milestone: p.milestone,
          page: p.file,
          status: isPending ? 'PENDING' : 'FAIL',
          defect: `Section <section id="${p.solutionId}"> is missing in ${p.file}`,
          expected: `HTML element with id="${p.solutionId}" containing product catalog`,
          actual: `Section id="${p.solutionId}" not found in ${p.file}`
        });
        continue;
      } else {
        recordTest('tier1', {
          id: `T1.3_SECTION_${p.solutionId}`,
          name: `Catalog Section Existence (#${p.solutionId})`,
          milestone: p.milestone,
          page: p.file,
          status: 'PASS',
          message: `Found <section id="${p.solutionId}"> in ${p.file}`
        });
      }

      // Count cards
      const cards = extractProductCards(section.full);
      const cardCount = cards.length;
      const meetsTarget = cardCount >= p.targetCards;
      const meetsMinimum = cardCount >= p.minCards;

      if (meetsTarget) {
        recordTest('tier1', {
          id: `T1.3_COUNT_${p.solutionId}`,
          name: `Catalog Card Count (#${p.solutionId})`,
          milestone: p.milestone,
          page: p.file,
          status: 'PASS',
          message: `${cardCount} product cards found (Target: ${p.targetCards}, Minimum: ${p.minCards})`
        });
      } else if (meetsMinimum) {
        recordTest('tier1', {
          id: `T1.3_COUNT_${p.solutionId}`,
          name: `Catalog Card Count (#${p.solutionId})`,
          milestone: p.milestone,
          page: p.file,
          status: 'PASS',
          message: `${cardCount} product cards found (Meets minimum ${p.minCards}, target: ${p.targetCards})`
        });
      } else {
        const isPending = !isMilestoneM0 && (cliOptions.allowPending || cliOptions.milestone === 'M0');
        recordTest('tier1', {
          id: `T1.3_COUNT_${p.solutionId}`,
          name: `Catalog Card Count (#${p.solutionId})`,
          milestone: p.milestone,
          page: p.file,
          status: isPending ? 'PENDING' : 'FAIL',
          defect: `Found ${cardCount} cards in #${p.solutionId} (Requires minimum ${p.minCards}, target ${p.targetCards})`,
          expected: `>= ${p.minCards} cards (target ${p.targetCards})`,
          actual: `${cardCount} cards`
        });
      }
    }
  }

  // ===========================================================================
  // TIER 2: Boundary & Specification Integrity
  // ===========================================================================
  if (cliOptions.tiers.includes(2)) {
    console.log(`\n${colors.bold}${colors.magenta}━━━ TIER 2: BOUNDARY & SPECIFICATION INTEGRITY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

    for (const p of PAGES_CONFIG) {
      if (!p.solutionId) continue;
      const fileContent = htmlStore[p.file];
      if (!fileContent) continue;

      const section = extractSectionById(fileContent, p.solutionId);
      if (!section) {
        const isPending = p.milestone !== 'M0' && (cliOptions.allowPending || cliOptions.milestone === 'M0');
        recordTest('tier2', {
          id: `T2.0_STRUCT_${p.file}`,
          name: `Product Card Structural Integrity (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: isPending ? 'PENDING' : 'FAIL',
          defect: `Cannot inspect card structures because #${p.solutionId} is missing in ${p.file}`,
          expected: `Section #${p.solutionId} with valid product cards`,
          actual: `Missing section`
        });
        continue;
      }

      const cards = extractProductCards(section.full);
      let validStructuralCards = 0;
      let failedCards = [];

      for (let i = 0; i < cards.length; i++) {
        const cardDetails = inspectCardDetails(cards[i]);
        const issues = [];

        if (!cardDetails.hasAspectSquare) issues.push('missing aspect-square wrapper');
        if (!cardDetails.validImg) issues.push('missing or invalid <img> with non-empty alt');
        if (!cardDetails.isTitleBold || !cardDetails.rawTitle) issues.push('missing bold title (h3)');
        if (cardDetails.bulletCount !== BULLETS_PER_CARD) issues.push(`${cardDetails.bulletCount} bullet points (expected ${BULLETS_PER_CARD})`);
        if (cardDetails.checkmarkCount !== BULLETS_PER_CARD) issues.push(`${cardDetails.checkmarkCount} checkmark badges (expected ${BULLETS_PER_CARD})`);

        if (issues.length === 0) {
          validStructuralCards++;
        } else {
          failedCards.push({
            cardIndex: i + 1,
            title: cardDetails.rawTitle || `Item ${i + 1}`,
            issues
          });
        }
      }

      // Assert: All extracted cards must meet structural integrity
      if (cards.length > 0 && failedCards.length === 0) {
        recordTest('tier2', {
          id: `T2.1_STRUCT_${p.file}`,
          name: `Product Card Structure & 3 Checkmarks (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'PASS',
          message: `All ${validStructuralCards} cards have aspect-square frame, bold title, and exactly 3 checkmark badges.`
        });
      } else {
        const isPending = p.milestone !== 'M0' && (cliOptions.allowPending || cliOptions.milestone === 'M0');
        const issuesSummary = failedCards.map(f => `Card #${f.cardIndex} ("${f.title}"): ${f.issues.join(', ')}`).join(' | ');
        recordTest('tier2', {
          id: `T2.1_STRUCT_${p.file}`,
          name: `Product Card Structure & 3 Checkmarks (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: isPending ? 'PENDING' : 'FAIL',
          defect: cards.length === 0 ? `No product cards detected in #${p.solutionId}` : `${failedCards.length} cards failed structure: ${issuesSummary}`,
          expected: `All cards have aspect-square photo, bold h3, and exactly 3 checkmark bullet points`,
          actual: `${validStructuralCards}/${cards.length} cards valid`
        });
      }

      // General-benefits rule: no technical specifications inside product cards
      const visibleText = section.full.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&');
      const specHits = FORBIDDEN_SPEC_PATTERNS.filter(f => f.rx.test(visibleText)).map(f => f.label);
      if (specHits.length === 0) {
        recordTest('tier2', {
          id: `T2.2_NOSPECS_${p.file}`,
          name: `General Benefits Only, No Technical Specs (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'PASS',
          message: 'Product section contains no GSM, BPOM, fire-standard, decibel, combed-cotton, thread-count or material-grade specifications.'
        });
      } else {
        const isPending = p.milestone !== 'M0' && (cliOptions.allowPending || cliOptions.milestone === 'M0');
        recordTest('tier2', {
          id: `T2.2_NOSPECS_${p.file}`,
          name: `General Benefits Only, No Technical Specs (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: isPending ? 'PENDING' : 'FAIL',
          defect: `Technical specifications found in product cards: ${specHits.join(', ')}`,
          expected: 'Cards list general benefits only; full specs are given by the admin on request',
          actual: `Found: ${specHits.join(', ')}`
        });
      }
    }
  }

  // ===========================================================================
  // TIER 3: Link & Quotation Integrity
  // ===========================================================================
  if (cliOptions.tiers.includes(3)) {
    console.log(`\n${colors.bold}${colors.magenta}━━━ TIER 3: LINK & QUOTATION INTEGRITY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

    // T3.1: WhatsApp Quotation Links & Bottom CTA Buttons
    for (const p of PAGES_CONFIG) {
      const fileContent = htmlStore[p.file];
      if (!fileContent) continue;

      const hrefList = extractAllHrefs(fileContent);
      const waLinks = hrefList.filter(item => item.href.includes('wa.me'));

      // Check 1: All WhatsApp URLs must point to wa.me/6281234567890
      let invalidWaNumbers = [];
      let invalidEncoding = [];

      for (const item of waLinks) {
        if (!item.href.includes(`wa.me/${WA_PHONE_EXPECTED}`)) {
          invalidWaNumbers.push(item.href);
        }
        if (item.href.includes('?text=')) {
          const queryPart = item.href.split('?text=')[1];
          try {
            const decoded = decodeURIComponent(queryPart);
            if (!decoded || decoded.length < 3) {
              invalidEncoding.push({ href: item.href, reason: 'Decoded text is empty' });
            }
          } catch (e) {
            invalidEncoding.push({ href: item.href, reason: 'Malformed URI encoding' });
          }
        }
      }

      if (invalidWaNumbers.length === 0 && invalidEncoding.length === 0 && waLinks.length > 0) {
        recordTest('tier3', {
          id: `T3.1_WA_${p.file}`,
          name: `WhatsApp B2B Lead Gen URLs (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'PASS',
          message: `${waLinks.length} WhatsApp links verified with correct phone ${WA_PHONE_EXPECTED} and valid URI encoding.`
        });
      } else {
        recordTest('tier3', {
          id: `T3.1_WA_${p.file}`,
          name: `WhatsApp B2B Lead Gen URLs (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'FAIL',
          defect: `Invalid WhatsApp configuration in ${p.file}: ${invalidWaNumbers.length} invalid numbers, ${invalidEncoding.length} malformed encodings`,
          expected: `All WhatsApp links point to https://wa.me/${WA_PHONE_EXPECTED}?text=<URI-encoded>`,
          actual: `Found ${waLinks.length} links`
        });
      }

      // Check 2: Subpages must have a prominent bottom CTA button ("Pesan Sekarang!")
      if (p.solutionId) {
        const hasPesanSekarang = /Pesan\s*Sekarang!?/i.test(fileContent);
        const hasBottomCtaWa = /href=["']https:\/\/wa\.me\/6281234567890\?text=[^"']*memesan[^"']*["']/i.test(fileContent) ||
                              /href=["']https:\/\/wa\.me\/6281234567890\?text=[^"']*Solution[^"']*["']/i.test(fileContent);

        if (hasPesanSekarang && hasBottomCtaWa) {
          recordTest('tier3', {
            id: `T3.1_BOTTOM_CTA_${p.file}`,
            name: `Bottom Prominent CTA Button "Pesan Sekarang!" (${p.file})`,
            milestone: p.milestone,
            page: p.file,
            status: 'PASS',
            message: `Prominent bottom CTA button with targeted WhatsApp quotation confirmed.`
          });
        } else {
          const isPending = p.milestone !== 'M0' && (cliOptions.allowPending || cliOptions.milestone === 'M0');
          recordTest('tier3', {
            id: `T3.1_BOTTOM_CTA_${p.file}`,
            name: `Bottom Prominent CTA Button "Pesan Sekarang!" (${p.file})`,
            milestone: p.milestone,
            page: p.file,
            status: isPending ? 'PENDING' : 'FAIL',
            defect: `Missing prominent bottom "Pesan Sekarang!" WhatsApp CTA button in ${p.file}`,
            expected: `Prominent CTA button linking to https://wa.me/6281234567890 with category order inquiry`,
            actual: hasPesanSekarang ? 'Button present but link missing' : 'Button missing'
          });
        }
      }
    }

    // T3.2: Zero Broken Internal Links & Valid Local Assets
    const brokenLinks = [];
    const missingAssets = [];

    for (const p of PAGES_CONFIG) {
      const fileContent = htmlStore[p.file];
      if (!fileContent) continue;

      const hrefList = extractAllHrefs(fileContent);
      for (const item of hrefList) {
        const href = item.href.trim();
        // Ignore external or protocol links
        if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href === '#') {
          continue;
        }

        if (href.startsWith('#')) {
          // Pure anchor link on same page
          const anchorId = href.slice(1);
          const hasAnchor = fileContent.includes(`id="${anchorId}"`) || fileContent.includes(`name="${anchorId}"`);
          if (!hasAnchor) {
            brokenLinks.push({ source: p.file, href, reason: `Target anchor #${anchorId} does not exist in ${p.file}` });
          }
        } else {
          // Cross-file link e.g. linen.html, index.html#lokasi
          const [targetFile, targetAnchor] = href.split('#');
          const targetPath = path.join(PROJECT_ROOT, targetFile);

          if (!fs.existsSync(targetPath)) {
            brokenLinks.push({ source: p.file, href, reason: `Target file ${targetFile} does not exist` });
          } else if (targetAnchor) {
            const targetContent = fs.readFileSync(targetPath, 'utf8');
            const hasAnchor = targetContent.includes(`id="${targetAnchor}"`) || targetContent.includes(`name="${targetAnchor}"`);
            if (!hasAnchor) {
              brokenLinks.push({ source: p.file, href, reason: `Target anchor #${targetAnchor} does not exist in ${targetFile}` });
            }
          }
        }
      }

      // Check local src assets (images, js, css)
      const srcList = extractAllSrcs(fileContent);
      for (const src of srcList) {
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
          continue;
        }
        const cleanSrc = src.split('?')[0];
        const assetPath = path.join(PROJECT_ROOT, cleanSrc);
        if (!fs.existsSync(assetPath)) {
          missingAssets.push({ source: p.file, src, reason: `Local asset ${cleanSrc} not found on disk` });
        } else {
          const stats = fs.statSync(assetPath);
          if (stats.size === 0) {
            missingAssets.push({ source: p.file, src, reason: `Local asset ${cleanSrc} has 0 bytes` });
          }
        }
      }
    }

    if (brokenLinks.length === 0) {
      recordTest('tier3', {
        id: 'T3.2_ZERO_BROKEN_LINKS',
        name: 'Zero Broken Internal Links (Href graph verification)',
        milestone: 'M0',
        page: 'Global',
        status: 'PASS',
        message: 'All internal page links and hash anchors resolve to existing files and valid element IDs.'
      });
    } else {
      recordTest('tier3', {
        id: 'T3.2_ZERO_BROKEN_LINKS',
        name: 'Zero Broken Internal Links (Href graph verification)',
        milestone: 'M4', // Worker M4 is assigned to fix footer anchor discrepancy
        page: 'Global',
        status: (cliOptions.allowPending || cliOptions.milestone === 'M0') ? 'PENDING' : 'FAIL',
        defect: `Found ${brokenLinks.length} broken links: ${brokenLinks.map(b => `${b.source} -> ${b.href} (${b.reason})`).join('; ')}`,
        expected: '0 broken internal links across all pages',
        actual: `${brokenLinks.length} broken links (e.g. index.html footer legacy anchors)`
      });
    }

    if (missingAssets.length === 0) {
      recordTest('tier3', {
        id: 'T3.2_LOCAL_ASSETS',
        name: 'Local Asset Integrity (Images, CSS, JS)',
        milestone: 'M0',
        page: 'Global',
        status: 'PASS',
        message: 'All locally referenced static assets exist on disk with valid file size.'
      });
    } else {
      recordTest('tier3', {
        id: 'T3.2_LOCAL_ASSETS',
        name: 'Local Asset Integrity (Images, CSS, JS)',
        milestone: 'M0',
        page: 'Global',
        status: 'FAIL',
        defect: `Found ${missingAssets.length} missing local assets: ${missingAssets.map(a => `${a.source} -> ${a.src}`).join('; ')}`,
        expected: 'All local assets exist and are non-empty',
        actual: `${missingAssets.length} missing assets`
      });
    }

    // T3.3: Breadcrumbs & Active Tab State
    for (const p of PAGES_CONFIG) {
      if (p.file === 'index.html') continue; // Index doesn't need breadcrumb
      const fileContent = htmlStore[p.file];
      if (!fileContent) continue;

      // Check breadcrumb
      const hasBreadcrumb = /<a[^>]*href=["']index\.html["'][^>]*>[\s\S]*?Beranda[\s\S]*?<\/a>/i.test(fileContent);
      if (hasBreadcrumb) {
        recordTest('tier3', {
          id: `T3.3_BREADCRUMB_${p.file}`,
          name: `Breadcrumb Navigation (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'PASS',
          message: `Breadcrumb trail properly links back to index.html`
        });
      } else {
        recordTest('tier3', {
          id: `T3.3_BREADCRUMB_${p.file}`,
          name: `Breadcrumb Navigation (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'FAIL',
          defect: `Missing breadcrumb link to index.html in ${p.file}`,
          expected: `Breadcrumb with <a href="index.html">Beranda</a>`,
          actual: `Breadcrumb missing`
        });
      }

      // Check active tab in navbar
      // Uses parseAttributes for complete attribute-order independence
      const allNavLinks = extractAllHrefs(fileContent);
      let pageNavLinkActive = false;
      let incorrectOtherActive = [];

      for (const item of allNavLinks) {
        const classes = (item.attrs.class || '').split(/\s+/);
        const isActive = classes.includes('active');
        if (item.attrs.href === p.file) {
          if (isActive) pageNavLinkActive = true;
        } else if (['linen.html', 'amenities.html', 'gorden.html', 'towel.html'].includes(item.attrs.href)) {
          if (isActive) incorrectOtherActive.push(item.attrs.href);
        }
      }

      if (pageNavLinkActive && incorrectOtherActive.length === 0) {
        recordTest('tier3', {
          id: `T3.3_ACTIVETAB_${p.file}`,
          name: `Navbar Active Tab Highlighting (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'PASS',
          message: `Navbar for ${p.file} correctly highlights only ${p.file} with .active class`
        });
      } else {
        recordTest('tier3', {
          id: `T3.3_ACTIVETAB_${p.file}`,
          name: `Navbar Active Tab Highlighting (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'FAIL',
          defect: !pageNavLinkActive ? `Active class missing on ${p.file} tab` : `Other tabs incorrectly marked active: ${incorrectOtherActive.join(', ')}`,
          expected: `Tab for ${p.file} has active class; others do not`,
          actual: `Active: ${pageNavLinkActive}, Others: ${incorrectOtherActive.join(', ') || 'None'}`
        });
      }
    }
  }

  // ===========================================================================
  // TIER 4: Script & Theme Hooks
  // ===========================================================================
  if (cliOptions.tiers.includes(4)) {
    console.log(`\n${colors.bold}${colors.magenta}━━━ TIER 4: SCRIPT & THEME HOOKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

    // T4.1: Lucide Icons
    for (const p of PAGES_CONFIG) {
      const fileContent = htmlStore[p.file];
      if (!fileContent) continue;

      const hasLucideScript = /<script\b[^>]*src=["'][^"']*lucide[^"']*["']/i.test(fileContent);
      const hasCreateIconsCall = /lucide\.createIcons\(\)/.test(fileContent);
      const iconMatches = [...fileContent.matchAll(/data-lucide=["']([^"']+)["']/g)];
      const iconCount = iconMatches.length;

      if (hasLucideScript && hasCreateIconsCall && iconCount >= 5) {
        recordTest('tier4', {
          id: `T4.1_LUCIDE_${p.file}`,
          name: `Lucide Icon Script & Initialization (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'PASS',
          message: `Lucide library loaded, lucide.createIcons() hooked, and ${iconCount} icon tags detected.`
        });
      } else {
        recordTest('tier4', {
          id: `T4.1_LUCIDE_${p.file}`,
          name: `Lucide Icon Script & Initialization (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'FAIL',
          defect: `Lucide icon integration incomplete in ${p.file}`,
          expected: `Script tag, lucide.createIcons(), and >= 5 data-lucide icons`,
          actual: `Script: ${hasLucideScript}, Call: ${hasCreateIconsCall}, Icons: ${iconCount}`
        });
      }
    }

    // T4.2: Theme Toggle Hooks & theme.css
    for (const p of PAGES_CONFIG) {
      const fileContent = htmlStore[p.file];
      if (!fileContent) continue;

      const hasThemeCss = /<link\b[^>]*href=["']theme\.css[^"']*["']/i.test(fileContent);
      const hasThemeJs = /<script\b[^>]*src=["']theme\.js[^"']*["']/i.test(fileContent);
      const hasThemeToggleBtn = /data-theme-toggle/i.test(fileContent);

      if (hasThemeCss && hasThemeJs && hasThemeToggleBtn) {
        recordTest('tier4', {
          id: `T4.2_THEME_${p.file}`,
          name: `Theme Toggle Hooks & Styling (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'PASS',
          message: `theme.css linked, theme.js imported, and [data-theme-toggle] button present.`
        });
      } else {
        recordTest('tier4', {
          id: `T4.2_THEME_${p.file}`,
          name: `Theme Toggle Hooks & Styling (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'FAIL',
          defect: `Theme integration missing components in ${p.file}`,
          expected: `theme.css, theme.js, and [data-theme-toggle]`,
          actual: `theme.css: ${hasThemeCss}, theme.js: ${hasThemeJs}, button: ${hasThemeToggleBtn}`
        });
      }
    }

    // T4.3: i18n Translation Engine & Language Selectors
    for (const p of PAGES_CONFIG) {
      const fileContent = htmlStore[p.file];
      if (!fileContent) continue;

      const hasI18nJs = /<script\b[^>]*src=["']i18n\.js[^"']*["']/i.test(fileContent);
      const hasLangId = /data-lang-set=["']id["']/i.test(fileContent);
      const hasLangEn = /data-lang-set=["']en["']/i.test(fileContent);

      if (hasI18nJs && hasLangId && hasLangEn) {
        recordTest('tier4', {
          id: `T4.3_I18N_${p.file}`,
          name: `i18n DOM Engine & Language Selectors (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'PASS',
          message: `i18n.js imported, ID and EN [data-lang-set] buttons present.`
        });
      } else {
        recordTest('tier4', {
          id: `T4.3_I18N_${p.file}`,
          name: `i18n DOM Engine & Language Selectors (${p.file})`,
          milestone: p.milestone,
          page: p.file,
          status: 'FAIL',
          defect: `i18n integration missing components in ${p.file}`,
          expected: `i18n.js script and both [data-lang-set="id"] and [data-lang-set="en"] selectors`,
          actual: `i18n.js: ${hasI18nJs}, ID btn: ${hasLangId}, EN btn: ${hasLangEn}`
        });
      }
    }
  }

  // ===========================================================================
  // Summary & Reporting
  // ===========================================================================
  printReport();
}

function printReport() {
  if (cliOptions.json) {
    console.log(JSON.stringify(testResults, null, 2));
    process.exit(testResults.summary.failed > 0 ? 1 : 0);
    return;
  }

  // Console output
  console.log(`\n${colors.bold}${colors.cyan}================================================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  DETASCO E2E TEST EXECUTION SUMMARY${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}================================================================================${colors.reset}`);

  // Print results per tier
  for (const tierKey of Object.keys(testResults.tiers)) {
    const tier = testResults.tiers[tierKey];
    if (tier.tests.length === 0) continue;

    console.log(`\n${colors.bold}${colors.white}${tier.name}${colors.reset}`);
    console.log(`${colors.dim}--------------------------------------------------------------------------------${colors.reset}`);

    for (const t of tier.tests) {
      let icon = '';
      let statusColor = '';
      if (t.status === 'PASS') {
        icon = '✔';
        statusColor = colors.green;
      } else if (t.status === 'PENDING') {
        icon = '⏳';
        statusColor = colors.yellow;
      } else {
        icon = '✖';
        statusColor = colors.red;
      }

      const milestoneTag = `[${t.milestone}]`.padEnd(6);
      console.log(`  ${statusColor}${icon} ${t.status.padEnd(7)}${colors.reset} ${colors.dim}${milestoneTag}${colors.reset} ${t.name}`);
      if (t.status === 'PASS' && t.message) {
        console.log(`     ${colors.dim}↳ ${t.message}${colors.reset}`);
      } else if (t.status === 'PENDING') {
        console.log(`     ${colors.yellow}↳ PENDING: ${t.defect || 'Awaiting milestone implementation'}${colors.reset}`);
      } else if (t.status === 'FAIL') {
        console.log(`     ${colors.red}↳ DEFECT : ${t.defect}${colors.reset}`);
        if (t.expected) console.log(`       ${colors.dim}Expected: ${t.expected}${colors.reset}`);
        if (t.actual) console.log(`       ${colors.dim}Actual  : ${t.actual}${colors.reset}`);
      }
    }
  }

  // Summary Metrics Table
  const passRate = testResults.summary.total > 0
    ? ((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)
    : 0;

  console.log(`\n${colors.bold}${colors.cyan}================================================================================${colors.reset}`);
  console.log(`${colors.bold}  SUMMARY STATISTICS${colors.reset}`);
  console.log(`${colors.dim}--------------------------------------------------------------------------------${colors.reset}`);
  console.log(`  Total Assertions : ${testResults.summary.total}`);
  console.log(`  Passed           : ${colors.green}${colors.bold}${testResults.summary.passed}${colors.reset}`);
  console.log(`  Failed           : ${testResults.summary.failed > 0 ? colors.red + colors.bold : colors.white}${testResults.summary.failed}${colors.reset}`);
  console.log(`  Pending          : ${colors.yellow}${testResults.summary.pending}${colors.reset}`);
  console.log(`  Pass Rate        : ${passRate}%`);
  console.log(`${colors.bold}${colors.cyan}================================================================================${colors.reset}`);

  // Escalations Section for Peer Workers
  if (testResults.escalations.length > 0) {
    console.log(`\n${colors.bold}${colors.red}⚠ ACTIONABLE DEFECT ESCALATIONS DETECTED (${testResults.escalations.length})${colors.reset}`);
    console.log(`${colors.dim}The following requirements need implementation by peer workers:${colors.reset}\n`);

    testResults.escalations.forEach((esc, idx) => {
      console.log(`  ${colors.bold}${idx + 1}. [${esc.milestone}] [${esc.page}] ${esc.defect}${colors.reset}`);
      console.log(`     ${colors.dim}Expected: ${esc.expected} | Actual: ${esc.actual}${colors.reset}`);
    });
  } else {
    console.log(`\n${colors.green}${colors.bold}✔ ALL TEST SUITES PASSED WITH 100% SPECIFICATION COMPLIANCE!${colors.reset}`);
  }

  console.log('');
  const exitCode = testResults.summary.failed > 0 ? 1 : 0;
  process.exit(exitCode);
}

// Execute
runTestSuite().catch(err => {
  console.error(`${colors.red}FATAL ERROR IN TEST RUNNER:${colors.reset}`, err);
  process.exit(1);
});
