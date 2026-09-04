import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const page = path.join(dist, 'about.html');
const cssSource = path.join(__dirname, 'about-interactions-v33.css');
const cssTarget = path.join(dist, 'assets', 'css', 'about-interactions-v33.css');
const jsSource = path.join(__dirname, 'about-interactions-v33.js');
const jsTarget = path.join(dist, 'assets', 'js', 'about-interactions-v33.js');

if (!fs.existsSync(page)) process.exit(0);
fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.mkdirSync(path.dirname(jsTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);
fs.copyFileSync(jsSource, jsTarget);

let html = fs.readFileSync(page, 'utf8');

/* Remove superseded About interaction assets, then insert V33 last so it wins the cascade. */
html = html.replace(/\s*<link rel="stylesheet" href="assets\/css\/about-metrics-history-v32\.css">/g, '');
html = html.replace(/\s*<link rel="stylesheet" href="assets\/css\/about-interactions-v33\.css">/g, '');
html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/about-interactions-v33.css">\n</head>');
html = html.replace(/\s*<script src="assets\/js\/about-metrics-v32\.js"><\/script>/g, '');
html = html.replace(/\s*<script src="assets\/js\/about-interactions-v33\.js"><\/script>/g, '');
html = html.replace('</body>', '  <script src="assets/js/about-interactions-v33.js"></script>\n</body>');

const metrics = `    <div class="ab30-metrics" aria-label="Tianyu Electric manufacturing metrics">
      <div class="ab30-metric"><small>Product portfolio</small><strong data-count="30" data-suffix="+">30+</strong><span>Product series</span></div>
      <div class="ab30-metric"><small>Manufacturing base</small><strong data-count="85243" data-suffix=" m²">85,243 m²</strong><span>Plant area</span></div>
      <div class="ab30-metric"><small>Production equipment</small><strong data-count="460">460</strong><span>Large mechanical equipment in the plant</span></div>
      <div class="ab30-metric"><small>Testing equipment</small><strong data-count="60">60</strong><span>Supporting test equipment types</span></div>
      <div class="ab30-metric"><small>Large main transformers</small><strong data-count="1200">1,200</strong><span>Annual production capacity</span></div>
      <div class="ab30-metric"><small>Box-type substations</small><strong data-count="10000">10,000</strong><span>Annual production capacity</span></div>
      <div class="ab30-metric"><small>Distribution transformers</small><strong data-count="12000">12,000</strong><span>Annual production capacity</span></div>
      <div class="ab30-metric"><small>Complete switchgear</small><strong data-count="15000">15,000</strong><span>Annual production capacity</span></div>
    </div>`;

html = html.replace(/    <div class="ab30-metrics"[\s\S]*?\n    <\/div>\n  <\/div><\/section>/, `${metrics}\n  </div></section>`);

fs.writeFileSync(page, html, 'utf8');
console.log('About V33: 8 count-up metrics plus an auto-scrolling milestone rail that can be dragged directly with mouse or touch.');
