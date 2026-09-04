import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const cssSource = path.join(__dirname, 'site-typography.css');
const cssTarget = path.join(dist, 'assets', 'css', 'site-typography.css');

if (!fs.existsSync(dist) || !fs.existsSync(cssSource)) process.exit(0);
fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);

function inject(file, rel) {
  const normalized = rel.split(path.sep).join('/');
  if (!normalized.endsWith('.html')) return;

  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/\s*<link rel="stylesheet" href="[^"]*site-typography\.css">/g, '');

  const fromDir = path.posix.dirname(normalized);
  let href = path.posix.relative(fromDir === '.' ? '' : fromDir, 'assets/css/site-typography.css');
  if (!href) href = 'assets/css/site-typography.css';
  html = html.replace('</head>', `  <link rel="stylesheet" href="${href}">\n</head>`);
  fs.writeFileSync(file, html, 'utf8');
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) inject(full, path.relative(dist, full));
  }
}

walk(dist);

const rootIndex = path.join(root, 'index.html');
if (fs.existsSync(rootIndex)) {
  let html = fs.readFileSync(rootIndex, 'utf8');
  html = html.replace(/\s*<link rel="stylesheet" href="[^"]*site-typography\.css">/g, '');
  const href = html.includes('<base href="dist/">') ? 'assets/css/site-typography.css' : 'dist/assets/css/site-typography.css';
  html = html.replace('</head>', `  <link rel="stylesheet" href="${href}">\n</head>`);
  fs.writeFileSync(rootIndex, html, 'utf8');
}

console.log('Canonical typography guardrail applied: hero, section and CTA headline scales capped site-wide.');
