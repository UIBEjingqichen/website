import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const cssSrc = path.join(__dirname, 'modal-center-fix-v27.css');
const cssDst = path.join(dist, 'assets', 'css', 'modal-center-fix-v27.css');
const mainJs = path.join(dist, 'assets', 'js', 'main.js');

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function ensureCss() {
  fs.mkdirSync(path.dirname(cssDst), { recursive: true });
  fs.copyFileSync(cssSrc, cssDst);
}

function patchHtml(file) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('data-quote-modal')) return false;
  const depth = path.relative(path.dirname(file), dist).split(path.sep).filter(Boolean).map(() => '..').join('/');
  const prefix = depth ? `${depth}/` : '';
  const href = `${prefix}assets/css/modal-center-fix-v27.css`;
  if (!html.includes('modal-center-fix-v27.css')) {
    html = html.replace('</head>', `  <link rel="stylesheet" href="${href}">\n</head>`);
  }
  fs.writeFileSync(file, html, 'utf8');
  return true;
}

function patchMainJs() {
  if (!fs.existsSync(mainJs)) return false;
  let js = fs.readFileSync(mainJs, 'utf8');
  const before = js;
  js = js.replace('bySelector("input,button,a,select,textarea", modal)?.focus();', 'bySelector("input,button,a,select,textarea", modal)?.focus({ preventScroll: true });');
  if (js !== before) fs.writeFileSync(mainJs, js, 'utf8');
  return js !== before;
}

ensureCss();
const changed = walk(dist).filter(file => file.endsWith('.html')).reduce((count, file) => count + (patchHtml(file) ? 1 : 0), 0);
const jsChanged = patchMainJs();
console.log(`V27 quote modal centering applied to ${changed} pages${jsChanged ? ' with focus-scroll fix' : ''}.`);
