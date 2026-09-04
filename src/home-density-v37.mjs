import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const cssSource = path.join(__dirname, 'home-density-v37.css');
const cssTarget = path.join(dist, 'assets', 'css', 'home-density-v37.css');

if (!fs.existsSync(cssSource)) process.exit(0);
fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);

function inject(file, href) {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/\s*<link rel="stylesheet" href="[^"]*home-density-v37\.css">/g, '');
  html = html.replace('</head>', `  <link rel="stylesheet" href="${href}">\n</head>`);
  fs.writeFileSync(file, html, 'utf8');
}

inject(path.join(dist, 'index.html'), 'assets/css/home-density-v37.css');

const rootIndex = path.join(root, 'index.html');
if (fs.existsSync(rootIndex)) {
  const rootHtml = fs.readFileSync(rootIndex, 'utf8');
  const href = rootHtml.includes('<base href="dist/">') ? 'assets/css/home-density-v37.css' : 'dist/assets/css/home-density-v37.css';
  inject(rootIndex, href);
}

console.log('Homepage V37 applied: denser company overview and smaller Technical News & Knowledge section.');
