import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const homepageMetrics = `<div class="yw-stat-grid"><article><small>01</small><strong>30+</strong><span>Product Series</span></article><article><small>02</small><strong>85,243 m²</strong><span>Plant Area</span></article><article><small>03</small><strong>460</strong><span>Large Mechanical Equipment</span></article><article><small>04</small><strong>60</strong><span>Supporting Test Equipment Types</span></article></div>`;

const aboutMetrics = `    <div class="ab30-metrics" aria-label="Tianyu Electric manufacturing metrics">
      <div class="ab30-metric"><small>Product portfolio</small><strong data-count="30" data-suffix="+">30+</strong><span>Product series</span></div>
      <div class="ab30-metric"><small>Manufacturing base</small><strong data-count="85243" data-suffix=" m²">85,243 m²</strong><span>Plant area</span></div>
      <div class="ab30-metric"><small>Production equipment</small><strong data-count="460">460</strong><span>Large mechanical equipment in the plant</span></div>
      <div class="ab30-metric"><small>Testing equipment</small><strong data-count="60">60</strong><span>Supporting test equipment types</span></div>
      <div class="ab30-metric"><small>Large main transformers</small><strong data-count="1200">1,200</strong><span>Annual production capacity</span></div>
      <div class="ab30-metric"><small>Box-type substations</small><strong data-count="10000">10,000</strong><span>Annual production capacity</span></div>
      <div class="ab30-metric"><small>Distribution transformers</small><strong data-count="12000">12,000</strong><span>Annual production capacity</span></div>
      <div class="ab30-metric"><small>Complete switchgear</small><strong data-count="15000">15,000</strong><span>Annual production capacity</span></div>
    </div>`;

function stabilizeHomepage() {
  const page = path.join(dist, 'index.html');
  if (!fs.existsSync(page)) return;
  let html = fs.readFileSync(page, 'utf8');
  html = html.replace(/<div class="yw-stat-grid">[\s\S]*?<\/div>/, homepageMetrics);
  fs.writeFileSync(page, html, 'utf8');

  // Keep the root GitHack preview synchronized with the built homepage.
  let rootHtml = html;
  if (!rootHtml.includes('<base href="dist/">')) {
    rootHtml = rootHtml.replace(/(<meta name="viewport"[^>]*>)/, '$1\n  <base href="dist/">');
  }
  fs.writeFileSync(path.join(root, 'index.html'), rootHtml, 'utf8');
}

function stabilizeAbout() {
  const page = path.join(dist, 'about.html');
  if (!fs.existsSync(page)) return;

  const cssSrc = path.join(__dirname, 'about-interactions-v33.css');
  const jsSrc = path.join(__dirname, 'about-interactions-v33.js');
  const cssDst = path.join(dist, 'assets', 'css', 'about-interactions-v33.css');
  const jsDst = path.join(dist, 'assets', 'js', 'about-interactions-v33.js');
  fs.mkdirSync(path.dirname(cssDst), { recursive: true });
  fs.mkdirSync(path.dirname(jsDst), { recursive: true });
  if (fs.existsSync(cssSrc)) fs.copyFileSync(cssSrc, cssDst);
  if (fs.existsSync(jsSrc)) fs.copyFileSync(jsSrc, jsDst);

  let html = fs.readFileSync(page, 'utf8');
  html = html.replace(/    <div class="ab30-metrics"[\s\S]*?\n    <\/div>\n  <\/div><\/section>/, `${aboutMetrics}\n  </div></section>`);

  html = html.replace(/\s*<link rel="stylesheet" href="assets\/css\/(?:about-metrics-history-v32|about-interactions-v33)\.css">/g, '');
  html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/about-interactions-v33.css">\n</head>');
  html = html.replace(/\s*<script src="assets\/js\/(?:about-metrics-v32|about-interactions-v33)\.js"><\/script>/g, '');
  html = html.replace('</body>', '  <script src="assets/js/about-interactions-v33.js"></script>\n</body>');

  fs.writeFileSync(page, html, 'utf8');
}

stabilizeHomepage();
stabilizeAbout();
console.log('Company V39 final pass applied after all legacy builders: homepage company metrics and About interactions are pinned to the current design.');
