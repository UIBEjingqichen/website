import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const page = path.join(dist, 'about.html');
const cssSource = path.join(__dirname, 'about-history-v31.css');
const cssTarget = path.join(dist, 'assets', 'css', 'about-history-v31.css');

if (!fs.existsSync(page)) process.exit(0);
fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);

let html = fs.readFileSync(page, 'utf8');
html = html.replace(/\s*<link rel="stylesheet" href="assets\/css\/about-history-v31\.css">/g, '');
html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/about-history-v31.css">\n</head>');

const history = `<section class="ab30-history"><div class="ab30-shell">
    <div class="ab30-history-head">
      <div><p class="ab30-kicker">Company History</p><h2>Key milestones</h2></div>
    </div>
    <div class="ab30-history-scroll"><div class="ab30-history-track">
      <article class="ab30-time"><strong>1920</strong><p>Fuzhou Dazhong Machinery Factory was established, later becoming the predecessor of Fuzhou First Switchgear Factory.</p></article>
      <article class="ab30-time"><strong>1956</strong><p>Fuzhou Dazhong Machinery Factory became a public-private joint enterprise and was renamed Fuzhou Fourth Machinery Factory.</p></article>
      <article class="ab30-time"><strong>1959</strong><p>State-owned Fuzhou Electric Factory was divided into a transformer factory and a switchgear factory.</p></article>
      <article class="ab30-time"><strong>1995</strong><p>Fuzhou First Switchgear Factory, Fuzhou Transformer Factory and Fuzhou General Electric Co., Ltd. were combined to form Fuzhou Tianyu Electric Group Co., Ltd.</p></article>
      <article class="ab30-time"><strong>1997</strong><p>Tianyu Electric was listed on the Shenzhen Stock Exchange.</p></article>
      <article class="ab30-time"><strong>2001</strong><p>XJ Group became the controlling shareholder of Tianyu Electric.</p></article>
      <article class="ab30-time"><strong>2010</strong><p>Tianyu Electric joined State Grid together with XJ Group.</p></article>
      <article class="ab30-time"><strong>2016</strong><p>Tianyu Electric relocated from Jin'an District to the new Minhou manufacturing campus.</p></article>
      <article class="ab30-time"><strong>2021</strong><p>Tianyu Electric joined China Electrical Equipment Group together with XJ Group.</p></article>
    </div></div>
  </div></section>`;

html = html.replace(/<section class="ab30-history">[\s\S]*?<\/section>/, history);
fs.writeFileSync(page, html, 'utf8');
console.log('Updated About history with catalog-grounded milestones plus verified 2016 relocation.');
