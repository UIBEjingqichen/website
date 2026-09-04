import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const cssSource = path.join(__dirname, 'site-density-v36.css');
const cssTarget = path.join(dist, 'assets', 'css', 'site-density-v36.css');

if (!fs.existsSync(dist) || !fs.existsSync(cssSource)) process.exit(0);
fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);

const excludedTopLevel = new Set(['manufacturing.html', 'catalog.html']);

function applyDensity(file, rel) {
  const normalized = rel.split(path.sep).join('/');
  if (!normalized.endsWith('.html')) return;
  if (normalized.startsWith('knowledge/')) return;
  if (!normalized.includes('/') && excludedTopLevel.has(normalized)) return;

  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/\s*<link rel="stylesheet" href="[^"]*site-density-v36\.css">/g, '');

  const fromDir = path.posix.dirname(normalized);
  let href = path.posix.relative(fromDir === '.' ? '' : fromDir, 'assets/css/site-density-v36.css');
  if (!href) href = 'assets/css/site-density-v36.css';
  html = html.replace('</head>', `  <link rel="stylesheet" href="${href}">\n</head>`);

  html = html.replace(/<body(?: class="([^"]*)")?>/, (_, cls='') => {
    const classes = [...new Set((cls + ' site36-density').trim().split(/\s+/).filter(Boolean))];
    return `<body class="${classes.join(' ')}">`;
  });

  fs.writeFileSync(file, html, 'utf8');
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) applyDensity(full, path.relative(dist, full));
  }
}

walk(dist);

// Root index mirrors the built site and uses <base href="dist/"> in this project.
const rootIndex = path.join(root, 'index.html');
if (fs.existsSync(rootIndex)) {
  let html = fs.readFileSync(rootIndex, 'utf8');
  html = html.replace(/\s*<link rel="stylesheet" href="[^"]*site-density-v36\.css">/g, '');
  const href = html.includes('<base href="dist/">') ? 'assets/css/site-density-v36.css' : 'dist/assets/css/site-density-v36.css';
  html = html.replace('</head>', `  <link rel="stylesheet" href="${href}">\n</head>`);
  html = html.replace(/<body(?: class="([^"]*)")?>/, (_, cls='') => {
    const classes = [...new Set((cls + ' site36-density').trim().split(/\s+/).filter(Boolean))];
    return `<body class="${classes.join(' ')}">`;
  });
  fs.writeFileSync(rootIndex, html, 'utf8');
}

console.log('Site V36 applied: Manufacturing V35 typography and density extended across primary site pages, product pages and project pages.');
