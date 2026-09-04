import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const aboutPage = path.join(dist, 'about.html');
const homePage = path.join(dist, 'index.html');
const rootIndex = path.join(root, 'index.html');

const cssSrc = path.join(__dirname, 'company.css');
const jsSrc = path.join(__dirname, 'company.js');
const cssDst = path.join(dist, 'assets', 'css', 'company.css');
const jsDst = path.join(dist, 'assets', 'js', 'company.js');

const oldAboutAssets = [
  'assets/css/about-page-v28.css',
  'assets/css/about-page-v29.css',
  'assets/css/about-page-v30.css',
  'assets/css/about-history-v31.css',
  'assets/css/about-metrics-history-v32.css',
  'assets/css/about-interactions-v33.css',
  'assets/js/about-metrics-v32.js',
  'assets/js/about-interactions-v33.js'
];

const homepageMetrics = `<div class="yw-stat-grid"><article><small>01</small><strong>30+</strong><span>Product Series</span></article><article><small>02</small><strong>85,243 m²</strong><span>Plant Area</span></article><article><small>03</small><strong>460</strong><span>Large Mechanical Equipment</span></article><article><small>04</small><strong>60</strong><span>Supporting Test Equipment Types</span></article></div>`;

const aboutMain = `<main>
  <section class="company-hero">
    <img src="assets/media/company/factory-campus-panorama.jpeg" alt="Tianyu Electric manufacturing campus">
    <div class="company-hero-copy">
      <p class="company-kicker">About Tianyu Electric</p>
      <h1>Transformers and prefabricated substations for power projects.</h1>
      <p class="company-hero-lead">Designed and manufactured in Fuzhou, China for utility, renewable-energy, industrial and infrastructure applications.</p>
      <a class="company-hero-link" href="#company-overview">Company profile <span>↓</span></a>
    </div>
  </section>

  <section class="company-overview" id="company-overview"><div class="company-shell">
    <div class="company-overview-head">
      <div><p class="company-kicker">Company</p><h2>Fuzhou Tianyu Electric Co., Ltd.</h2></div>
      <p class="company-overview-lead">Tianyu Electric manufactures power transformers, distribution transformers, special and renewable-energy transformers, and prefabricated substations.</p>
    </div>

    <div class="company-profile-lines">
      <div class="company-profile-line"><small>Product scope</small><p>Power, distribution and special-purpose transformers, plus prefabricated substations.</p></div>
      <div class="company-profile-line"><small>Manufacturing</small><p>Winding, core processing, assembly and transformer testing within the Fuzhou manufacturing base.</p></div>
      <div class="company-profile-line"><small>Affiliation</small><p><strong>XJ Group Corporation</strong> · China Electrical Equipment Group Co., Ltd.</p></div>
    </div>

    <div class="company-metrics" aria-label="Tianyu Electric manufacturing metrics">
      <div class="company-metric"><small>Product portfolio</small><strong data-count="30" data-suffix="+">30+</strong><span>Product series</span></div>
      <div class="company-metric"><small>Manufacturing base</small><strong data-count="85243" data-suffix=" m²">85,243 m²</strong><span>Plant area</span></div>
      <div class="company-metric"><small>Production equipment</small><strong data-count="460">460</strong><span>Large mechanical equipment in the plant</span></div>
      <div class="company-metric"><small>Testing equipment</small><strong data-count="60">60</strong><span>Supporting test equipment types</span></div>
      <div class="company-metric"><small>Large main transformers</small><strong data-count="1200">1,200</strong><span>Annual production capacity</span></div>
      <div class="company-metric"><small>Box-type substations</small><strong data-count="10000">10,000</strong><span>Annual production capacity</span></div>
      <div class="company-metric"><small>Distribution transformers</small><strong data-count="12000">12,000</strong><span>Annual production capacity</span></div>
      <div class="company-metric"><small>Complete switchgear</small><strong data-count="15000">15,000</strong><span>Annual production capacity</span></div>
    </div>
  </div></section>

  <section class="company-history"><div class="company-shell">
    <div class="company-history-head"><div><p class="company-kicker">Company History</p><h2>Key milestones</h2></div></div>
    <div class="company-history-scroll"><div class="company-history-track">
      <article class="company-time"><strong>1920</strong><p>Fuzhou Dazhong Machinery Factory was established, later becoming the predecessor of Fuzhou First Switchgear Factory.</p></article>
      <article class="company-time"><strong>1956</strong><p>Fuzhou Dazhong Machinery Factory became a public-private joint enterprise and was renamed Fuzhou Fourth Machinery Factory.</p></article>
      <article class="company-time"><strong>1959</strong><p>State-owned Fuzhou Electric Factory was divided into a transformer factory and a switchgear factory.</p></article>
      <article class="company-time"><strong>1995</strong><p>Fuzhou First Switchgear Factory, Fuzhou Transformer Factory and Fuzhou General Electric Co., Ltd. were combined to form Fuzhou Tianyu Electric Group Co., Ltd.</p></article>
      <article class="company-time"><strong>1997</strong><p>Tianyu Electric was listed on the Shenzhen Stock Exchange.</p></article>
      <article class="company-time"><strong>2001</strong><p>XJ Group became the controlling shareholder of Tianyu Electric.</p></article>
      <article class="company-time"><strong>2010</strong><p>Tianyu Electric joined State Grid together with XJ Group.</p></article>
      <article class="company-time"><strong>2016</strong><p>Tianyu Electric relocated from Jin'an District to the new Minhou manufacturing campus.</p></article>
      <article class="company-time"><strong>2021</strong><p>Tianyu Electric joined China Electrical Equipment Group together with XJ Group.</p></article>
    </div></div>
  </div></section>

  <section class="company-factory"><div class="company-shell">
    <div class="company-section-head">
      <div><p class="company-kicker">Factory Full View</p><h2>Inside the manufacturing base.</h2></div>
      <p>Workshop and equipment views cover transformer winding, core processing, dry-type manufacturing, automation and testing.</p>
    </div>
    <div class="company-gallery">
      <a class="company-shot" href="manufacturing.html"><img src="assets/media/factory/large-oil-transformer-winding-line.png" alt="Large oil-immersed transformer winding line"><span>Large transformer winding line</span></a>
      <a class="company-shot" href="manufacturing.html"><img src="assets/media/factory/automatic-core-cutting-line.png" alt="Automatic transformer core cutting line"><span>Automatic core cutting</span></a>
      <a class="company-shot" href="manufacturing.html"><img src="assets/media/factory/dry-type-transformer-intelligent-winding-line.png" alt="Dry-type transformer winding line"><span>Dry-type transformer winding</span></a>
      <a class="company-shot" href="manufacturing.html"><img src="assets/media/factory/automatic-welding-robot.png" alt="Automatic welding robot"><span>Automatic welding</span></a>
      <a class="company-shot" href="quality.html"><img src="assets/media/factory/large-transformer-test-station.png" alt="Large transformer test station"><span>Transformer testing</span></a>
    </div>
    <div class="company-factory-links"><a href="manufacturing.html">Manufacturing →</a><a href="quality.html">Quality & Testing →</a><a href="applications.html">Project References →</a><a href="resources.html#certificates">Certificates & Reports →</a></div>
  </div></section>

  <section class="company-cta"><h2>Explore Tianyu's transformer range and project references.</h2><a href="products.html">View products →</a></section>
</main>`;

function ensureCurrentAssets() {
  fs.mkdirSync(path.dirname(cssDst), { recursive: true });
  fs.mkdirSync(path.dirname(jsDst), { recursive: true });
  fs.copyFileSync(cssSrc, cssDst);
  fs.copyFileSync(jsSrc, jsDst);
  for (const rel of oldAboutAssets) {
    const file = path.join(dist, rel);
    if (fs.existsSync(file)) fs.rmSync(file, { force: true });
  }
}

function cleanAboutAssetTags(html) {
  html = html.replace(/\s*<link rel="stylesheet" href="assets\/css\/(?:about-page-v28|about-page-v29|about-page-v30|about-history-v31|about-metrics-history-v32|about-interactions-v33|company)\.css">/g, '');
  html = html.replace(/\s*<script src="assets\/js\/(?:about-metrics-v32|about-interactions-v33|company)\.js"><\/script>/g, '');
  html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/company.css">\n</head>');
  html = html.replace('</body>', '  <script src="assets/js/company.js"></script>\n</body>');
  return html;
}

function buildAbout() {
  if (!fs.existsSync(aboutPage)) return;
  let html = fs.readFileSync(aboutPage, 'utf8');
  html = cleanAboutAssetTags(html);
  html = html.replace(/<body class="([^"]*)">/, (_, cls) => {
    const classes = cls.split(/\s+/).filter(Boolean).filter((c) => !/^ab(?:28|29|30)-about$/.test(c) && c !== 'company-page');
    classes.push('company-page');
    return `<body class="${classes.join(' ')}">`;
  });
  html = html.replace(/<main>[\s\S]*?<\/main>/, aboutMain);
  fs.writeFileSync(aboutPage, html, 'utf8');
}

function buildHomepageCompany() {
  if (!fs.existsSync(homePage)) return;
  let html = fs.readFileSync(homePage, 'utf8');
  html = html.replace(/<div class="yw-stat-grid">[\s\S]*?<\/div>/, homepageMetrics);
  fs.writeFileSync(homePage, html, 'utf8');

  let rootHtml = html;
  if (!rootHtml.includes('<base href="dist/">')) {
    rootHtml = rootHtml.replace(/(<meta name="viewport"[^>]*>)/, '$1\n  <base href="dist/">');
  }
  fs.writeFileSync(rootIndex, rootHtml, 'utf8');
}

ensureCurrentAssets();
buildAbout();
buildHomepageCompany();
console.log('Canonical company build applied: one Company stylesheet, one interaction script, one About generator, one homepage metric source.');
