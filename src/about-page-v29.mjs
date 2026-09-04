import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const page = path.join(dist, 'about.html');
const cssSource = path.join(__dirname, 'about-page-v29.css');
const cssTarget = path.join(dist, 'assets', 'css', 'about-page-v29.css');

if (!fs.existsSync(page)) process.exit(0);
fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);

let html = fs.readFileSync(page, 'utf8');
html = html.replace(/\s*<link rel="stylesheet" href="assets\/css\/about-page-v29\.css">/g, '');
html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/about-page-v29.css">\n</head>');
html = html.replace(/<body class="([^"]*)">/, (_, cls) => `<body class="${[...new Set((cls + ' ab29-about').trim().split(/\s+/))].join(' ')}">`);

const main = `<main>
  <section class="ab29-hero">
    <img src="assets/media/company/factory-campus-panorama.jpeg" alt="Tianyu Electric manufacturing campus">
    <div class="ab29-hero-copy">
      <p class="ab29-kicker">About Tianyu Electric</p>
      <h1>Transformer manufacturing built on a long electrical-industry heritage.</h1>
      <p class="ab29-hero-lead">Fuzhou Tianyu Electric Co., Ltd. manufactures transformers and prefabricated substations for utility, renewable-energy, industrial and infrastructure projects.</p>
      <a class="ab29-hero-link" href="#company-overview">Company overview <span>↓</span></a>
    </div>
  </section>

  <section class="ab29-overview" id="company-overview"><div class="ab29-shell">
    <div class="ab29-overview-grid">
      <div><p class="ab29-kicker">Company Overview</p><h2>A transformer manufacturing base within XJ Group and China Electrical Equipment Group.</h2></div>
      <div class="ab29-overview-copy">
        <p>Tianyu's present manufacturing business developed from predecessor electrical-equipment factories in Fuzhou. Today, the company focuses on power transformers, distribution transformers, special and renewable-energy transformers, and prefabricated substations.</p>
        <div class="ab29-ownership"><small>Company Structure</small><strong>A wholly-owned subsidiary of XJ Group Corporation under China Electrical Equipment Group Co., Ltd.</strong></div>
        <div class="ab29-link-row"><a href="products.html">Products →</a><a href="applications.html">Projects →</a><a href="resources.html">Technical resources →</a></div>
      </div>
    </div>
    <div class="ab29-metrics">
      <div class="ab29-metric"><small>Transformer platform</small><strong>220 kV</strong><span>Power-transformer capability</span></div>
      <div class="ab29-metric"><small>Product portfolio</small><strong>30+</strong><span>Product series</span></div>
      <div class="ab29-metric"><small>Manufacturing base</small><strong>85,243 m²</strong><span>Plant area</span></div>
      <div class="ab29-metric"><small>Production equipment</small><strong>460</strong><span>Large mechanical equipment</span></div>
    </div>
  </div></section>

  <section class="ab29-history"><div class="ab29-shell">
    <div class="ab29-history-head">
      <div><p class="ab29-kicker">Historical Evolution</p><h2>From predecessor electrical factories to the present Tianyu manufacturing base.</h2></div>
      <p>The company's development spans predecessor electrical factories in Fuzhou, the formation of Tianyu Group, integration with XJ Group and the move to the current Minhou manufacturing campus.</p>
    </div>
    <div class="ab29-history-scroll"><div class="ab29-history-track">
      <article class="ab29-time"><strong>1920</strong><small>Predecessor roots</small><p>A predecessor machine works was established in Fuzhou, forming part of the industrial lineage that later developed into the electrical-equipment business.</p></article>
      <article class="ab29-time"><strong>1956–1970</strong><small>Electrical manufacturing</small><p>Predecessor factories were reorganized through several stages, including transformer and switchgear manufacturing in Fuzhou.</p></article>
      <article class="ab29-time"><strong>1995</strong><small>Tianyu Group formed</small><p>Fuzhou First Switch Factory, Fuzhou Transformer Factory and Fuzhou General Electric Co., Ltd. were combined to form Fuzhou Tianyu Electric Group Co., Ltd.</p></article>
      <article class="ab29-time"><strong>1997</strong><small>Capital market</small><p>Tianyu Electric was listed on the Shenzhen Stock Exchange.</p></article>
      <article class="ab29-time"><strong>2001</strong><small>XJ Group</small><p>Tianyu Electric entered the XJ Group system.</p></article>
      <article class="ab29-time"><strong>2010</strong><small>State Grid period</small><p>Tianyu Electric joined the State Grid system together with XJ Group.</p></article>
      <article class="ab29-time"><strong>2016</strong><small>New manufacturing base</small><p>Tianyu Electric relocated from Jin'an District to the new Minhou manufacturing campus.</p></article>
      <article class="ab29-time"><strong>2021</strong><small>China Electrical Equipment Group</small><p>Tianyu Electric joined China Electrical Equipment Group together with XJ Group.</p></article>
    </div></div>
  </div></section>

  <section class="ab29-factory"><div class="ab29-shell">
    <div class="ab29-section-head">
      <div><p class="ab29-kicker">Factory Full View</p><h2>Inside the manufacturing base.</h2></div>
      <p>Production equipment and workshop views provide a closer look at winding, core processing, dry-type manufacturing, automation and transformer testing.</p>
    </div>
    <div class="ab29-gallery">
      <a class="ab29-shot" href="manufacturing.html"><img src="assets/media/factory/large-oil-transformer-winding-line.png" alt="Large oil-immersed transformer winding line"><span>Large transformer winding line</span></a>
      <a class="ab29-shot" href="manufacturing.html"><img src="assets/media/factory/automatic-core-cutting-line.png" alt="Automatic transformer core cutting line"><span>Automatic core cutting</span></a>
      <a class="ab29-shot" href="manufacturing.html"><img src="assets/media/factory/dry-type-transformer-intelligent-winding-line.png" alt="Dry-type transformer winding line"><span>Dry-type transformer winding</span></a>
      <a class="ab29-shot" href="manufacturing.html"><img src="assets/media/factory/automatic-welding-robot.png" alt="Automatic welding robot"><span>Automatic welding</span></a>
      <a class="ab29-shot" href="quality.html"><img src="assets/media/factory/large-transformer-test-station.png" alt="Large transformer test station"><span>Transformer testing</span></a>
    </div>
    <div class="ab29-factory-links"><a href="manufacturing.html">Manufacturing →</a><a href="quality.html">Quality & Testing →</a><a href="applications.html">Project References →</a><a href="resources.html#certificates">Certificates & Reports →</a></div>
  </div></section>

  <section class="ab29-cta"><h2>Explore Tianyu's transformer range and international project references.</h2><a href="products.html">View products →</a></section>
</main>`;

html = html.replace(/<main>[\s\S]*?<\/main>/, main);
fs.writeFileSync(page, html, 'utf8');
console.log('Refined dist/about.html with About page V29.');
