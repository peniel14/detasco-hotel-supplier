#!/usr/bin/env node
/**
 * Quick structural check for the DETASCO static site.
 *
 * Manual:  node scripts/check-html.js index.html i18n.js
 * Hook:    registered as a Claude Code PostToolUse hook (see .claude/settings.json).
 *          Reads the tool call JSON from stdin, checks the edited file only,
 *          and exits with code 2 (message on stderr) when something is broken.
 *
 * Catches the mistakes that have actually happened in this project:
 *   - a truncated page (missing </html>, footer lost)
 *   - unbalanced <div> / <section> / <ul>
 *   - broken JSON-LD
 *   - several <h1> or a missing <title>
 *   - a JavaScript syntax error in i18n.js / theme.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function stripNonMarkup(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');
}

function count(re, s) {
  return (s.match(re) || []).length;
}

function checkHtml(file, src) {
  const problems = [];
  const body = stripNonMarkup(src);

  if (!/<\/html>\s*$/i.test(src)) problems.push('file does not end with </html> (truncated?)');
  if (!/<footer[\s>]/i.test(src) && !/index\.html$/.test(file)) problems.push('no <footer> found');
  if (count(/<title>[^<]+<\/title>/gi, src) !== 1) problems.push('expected exactly one non-empty <title>');
  if (count(/<h1[\s>]/gi, body) !== 1) problems.push('expected exactly one <h1>, found ' + count(/<h1[\s>]/gi, body));

  for (const tag of ['div', 'section', 'ul', 'footer', 'header', 'nav']) {
    const open = count(new RegExp('<' + tag + '[\\s>]', 'gi'), body);
    const close = count(new RegExp('</' + tag + '>', 'gi'), body);
    if (open !== close) problems.push('<' + tag + '> opens ' + open + ' times but closes ' + close + ' times');
  }

  const ld = [...src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  ld.forEach((m, i) => {
    try { JSON.parse(m[1]); } catch (e) { problems.push('JSON-LD block #' + (i + 1) + ' is not valid JSON'); }
  });

  if (count(/property="og:title"/g, src) > 1) problems.push('duplicate og:title tags');
  if (count(/rel="canonical"/g, src) > 1) problems.push('duplicate canonical links');
  return problems;
}

function checkJs(src, file) {
  try {
    new vm.Script(src, { filename: file });
    return [];
  } catch (e) {
    return ['JavaScript syntax error: ' + e.message];
  }
}

function checkFile(abs) {
  const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
  if (rel.startsWith('..') || !fs.existsSync(abs)) return null;
  const ext = path.extname(abs).toLowerCase();
  const src = fs.readFileSync(abs, 'utf8');
  if (ext === '.html' && !rel.includes('/')) return { rel, problems: checkHtml(rel, src) };
  if (ext === '.js' && ['i18n.js', 'theme.js', 'server.js'].includes(rel)) return { rel, problems: checkJs(src, rel) };
  return null;
}

function report(results) {
  const bad = results.filter((r) => r && r.problems.length);
  if (!bad.length) return 0;
  const lines = bad.map((r) => r.rel + ':\n  - ' + r.problems.join('\n  - '));
  process.stderr.write('check-html found problems:\n' + lines.join('\n') + '\n');
  return 2;
}

function readStdin() {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) return resolve('');
    let data = '';
    const timer = setTimeout(() => resolve(data), 1500);
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => { clearTimeout(timer); resolve(data); });
  });
}

(async () => {
  const args = process.argv.slice(2);
  if (args.length) {
    const results = args.map((a) => checkFile(path.resolve(process.cwd(), a)));
    const code = report(results);
    if (code === 0) console.log('check-html: OK (' + results.filter(Boolean).length + ' file(s) checked)');
    process.exit(code);
  }
  const raw = await readStdin();
  let file = '';
  try {
    const payload = JSON.parse(raw || '{}');
    file = (payload.tool_input && (payload.tool_input.file_path || payload.tool_input.path)) || '';
  } catch (e) { /* not a hook call */ }
  if (!file) process.exit(0);
  process.exit(report([checkFile(path.resolve(file))]));
})();
