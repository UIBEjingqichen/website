import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const files = walk(dist);
const pages = files.filter((file) => file.endsWith('.html'));
const css = files.filter((file) => file.endsWith('.css'));
const scripts = files.filter((file) => file.endsWith('.js'));
const cssText = css.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const htmlText = pages.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const failures = [];
const report = (label, value, limit, pass) => {
  console.log(`${pass ? 'PASS' : 'FAIL'} ${label}: ${value} (${limit})`);
  if (!pass) failures.push(label);
};
const atMost = (label, value, max) => report(label, value, `≤ ${max}`, value <= max);
const atLeast = (label, value, min) => report(label, value, `≥ ${min}`, value >= min);
const readAttrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)].map((m) => [m[1].toLowerCase(), m[3]]));
const local = (value, page) => {
  if (!value || /^(?:[a-z]+:|\/\/|#|data:)/i.test(value)) return null;
  const clean = value.split(/[?#]/)[0];
  if (!clean) return null;
  return path.resolve(clean.startsWith('/') ? dist : path.dirname(page), clean.replace(/^\//, ''));
};

let brokenAssets = 0;
let brokenPages = 0;
let badHeadings = 0;
let lazyPriority = 0;
let blockingScripts = 0;
let noIcon = 0;
let noFoundation = 0;
let noDimensions = 0;
let brokenImages = 0;
const usedAssets = new Set();
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const heads = (html.match(/<h1\b/gi) || []).length;
  if (heads !== 1 && !(heads === 0 && /http-equiv="refresh"/i.test(html))) badHeadings++;
  if (!/rel="(?:shortcut )?icon"/i.test(html)) noIcon++;
  if (!html.includes('ty-foundation.css')) noFoundation++;
  for (const tag of html.match(/<(?:script|link|a|img)\b[^>]*>/gi) || []) {
    const attrs = readAttrs(tag);
    if (/^<img\b/i.test(tag)) {
      if (attrs.fetchpriority === 'high' && attrs.loading === 'lazy') lazyPriority++;
      if (attrs.src && (!attrs.width || !attrs.height)) noDimensions++;
      const image = local(attrs.src, page);
      if (image && !fs.existsSync(image)) brokenImages++;
    }
    if (/^<script\b/i.test(tag) && attrs.src && !/\b(?:defer|async)\b/i.test(tag) && attrs.type !== 'module') blockingScripts++;
    if (/^<a\b/i.test(tag) && attrs.href?.split(/[?#]/)[0].endsWith('.html')) {
      const target = local(attrs.href, page);
      if (target && !fs.existsSync(target)) brokenPages++;
    }
    if (/^<(?:script|link)\b/i.test(tag)) {
      const url = attrs.src || (attrs.rel === 'stylesheet' ? attrs.href : null);
      const target = local(url, page);
      if (target) {
        usedAssets.add(path.normalize(target));
        if (!fs.existsSync(target)) brokenAssets++;
      }
    }
  }
}
atMost('Broken CSS/JS links', brokenAssets, 0);
atMost('Broken internal HTML links', brokenPages, 0);
atMost('Unreferenced CSS/JS', css.concat(scripts).filter((file) => !usedAssets.has(path.normalize(file))).length, 0);
atMost('Pages with invalid h1 count', badHeadings, 0);
atMost('High-priority lazy images', lazyPriority, 0);
atMost('Blocking scripts', blockingScripts, 0);
atMost('Pages without favicon', noIcon, 0);
atMost('Pages without foundation CSS', noFoundation, 0);
atMost('Images missing dimensions', noDimensions, 0);
atMost('Broken image links', brokenImages, 0);
atLeast('@font-face declarations', (cssText.match(/@font-face\b/g) || []).length, 12);
atMost('CSS files', css.length, 34);
atMost('CSS KB', Math.ceil(Buffer.byteLength(cssText) / 1024), 550);
atMost('!important', (cssText.match(/!important\b/gi) || []).length, 2200);
atMost('Distinct hex colours', new Set((cssText.match(/#[a-f\d]{3,8}\b/gi) || []).map((value) => value.toLowerCase())).size, 60);
atMost('Distinct font sizes', new Set((cssText.match(/font-size\s*:[^;}]*/gi) || []).map((value) => value.toLowerCase())).size, 20);
atMost('Distinct shadows', new Set((cssText.match(/box-shadow\s*:[^;}]*/gi) || []).map((value) => value.toLowerCase())).size, 6);
atMost('CSS files declaring :root', css.filter((file) => /:root\b/.test(fs.readFileSync(file, 'utf8'))).length, 1);
const images = files.filter((file) => /\.(?:png|jpe?g|webp|gif)$/i.test(file));
atMost('Heaviest shipped image KB', Math.ceil(Math.max(...images.map((file) => fs.statSync(file).size)) / 1024), 600);
console.log(`Checked ${pages.length} pages, ${css.length} CSS files and ${images.length} images.`);
if (failures.length) process.exitCode = 1;
