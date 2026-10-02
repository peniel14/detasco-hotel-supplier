const fs = require('fs');
const path = require('path');

const i18nContent = fs.readFileSync(path.join(__dirname, '../i18n.js'), 'utf8');
const dictMatch = i18nContent.match(/var DICTIONARY = {([\s\S]*?)};\s*var textNodes/);
let existingKeys = new Set();
if (dictMatch) {
  const dictStr = '{' + dictMatch[1] + '}';
  try {
    const fn = new Function('return ' + dictStr);
    const obj = fn();
    existingKeys = new Set(Object.keys(obj));
  } catch (e) {
    console.error('Failed to parse existing dictionary:', e.message);
  }
}

const files = ['linen.html', 'amenities.html', 'gorden.html', 'towel.html'];
const missing = new Set();

files.forEach(file => {
  let html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  // Strip style and script tags
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  
  const textMatches = html.match(/>([^<]+)</g) || [];
  textMatches.forEach(raw => {
    let text = raw.slice(1, -1).trim();
    if (text && text.length > 1 && !/^[0-9+–\-.,/%✓\s&rarr;]+$/.test(text)) {
      const decoded = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&copy;/g, '©');
      if (!existingKeys.has(decoded) && !existingKeys.has(text)) {
        missing.add(decoded);
      }
    }
  });
});

console.log('Total UI missing strings:', missing.size);
Array.from(missing).sort().forEach(s => console.log(JSON.stringify(s)));
