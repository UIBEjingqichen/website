import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const cssSource = path.join(__dirname, 'home-refine-v38.css');
const cssTarget = path.join(dist, 'assets', 'css', 'home-refine-v38.css');

if (!fs.existsSync(dist) || !fs.existsSync(cssSource)) process.exit(0);
fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);

function applyTo(file, href) {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/\s*<link rel="stylesheet" href="[^"]*home-refine-v38\.css">/g, '');
  html = html.replace('</head>', `  <link rel="stylesheet" href="${href}">\n</head>`);
  fs.writeFileSync(file, html, 'utf8');
}

applyTo(path.join(dist, 'index.html'), 'assets/css/home-refine-v38.css');

const rootIndex = path.join(root, 'index.html');
if (fs.existsSync(rootIndex)) {
  const html = fs.readFileSync(rootIndex, 'utf8');
  const href = html.includes('<base href="dist/">') ? 'assets/css/home-refine-v38.css' : 'dist/assets/css/home-refine-v38.css';
  applyTo(rootIndex, href);
}

console.log('Homepage V38 applied: compact news typography and light global project map.');
