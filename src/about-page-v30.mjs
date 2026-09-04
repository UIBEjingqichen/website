import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const page = path.join(dist, 'about.html');
const cssSource = path.join(__dirname, 'about-page-v30.css');
const cssTarget = path.join(dist, 'assets', 'css', 'about-page-v30.css');

if (!fs.existsSync(page)) process.exit(0);
fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);

let html = fs.readFileSync(page, 'utf8');
html = html.replace(/\s*<link rel="stylesheet" href="assets\/css\/about-page-v30\.css">/g, '');
html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/about-page-v30.css">\n</head>');
html = html.replace(/<body class="([^"]*)">/, (_, cls) => `<body class="${[...new Set((cls + ' ab30-about').trim().split(/\s+/))].join(' ')}">`);

const main = `<main>
  <section class="ab30-hero">
    <img src="assets/media/company/factory-campus-panorama.jpeg" alt="Tianyu Electric manufacturing campus">
    <div class="ab30-hero-copy">
      <p class="ab30-kicker">About Tianyu Electric</p>
      <h1>Transformers and prefabricated substations for power projects.</h1>
      <p class="ab30-hero-lead">Designed and manufactured in Fuzhou, China for utility, renewable-energy, industrial and infrastructure applications.</p>
      <a class="ab30-hero-link" href="#company-overview">Company profile <span>↓</span></a>
    </div>
  </section>

  <section class="ab30-overview" id="company-overview"><div class="ab30-shell">
    <div class="ab30-overview-head">
      <div><p class="ab30-kicker">Company</p><h2>Fuzhou Tianyu Electric Co., Ltd.</h2></div>
      <p class="ab30-overview-lead">Tianyu Electric manufactures power transformers, distribution transformers, special and renewable-energy transformers, and prefabricated substations.</p>
    </div>

    <div class="ab30-profile-lines">
      <div class="ab30-profile-line"><small>Product scope</small><p>Power, distribution and special-purpose transformers, plus prefabricated substations.</p></div>
      <div class="ab30-profile-line"><small>Manufacturing</small><p>Winding, core processing, assembly and transformer testing within the Fuzhou manufacturing base.</p></div>
      <div class="ab30-profile-line"><small>Affiliation</small><p><strong>XJ Group Corporation</strong> · China Electrical Equipment Group Co., Ltd.</p></div>
    </div>

    <div class="ab30-metrics" aria-label="Tianyu Electric manufacturing metrics">
      <div class="ab30-metric"><small>Product portfolio</small><strong data-count="30" data-suffix="+">30+</strong><span>Product series</span></div>
      <div class="ab30-metric"><small>Manufacturing base</small><strong data-count="85243" data-suffix=" m²">85,243 m²</strong><span>Plant area</span></div>
      <div class="ab30-metric"><small>Production equipment</small><strong data-count="460">460</strong><span>Large mechanical equipment in the plant</span></div>
      <div class="ab30-metric"><small>Testing equipment</small><strong data-count="60">60</strong><span>Supporting test equipment types</span></div>
      <div class="ab30-metric"><small>Large main transformers</small><strong data-count="1200">1,200</strong><span>Annual production capacity</span></div>
      <div class="ab30-metric"><small>Box-type substations</small><strong data-count="10000">10,000</strong><span>Annual production capacity</span></div>
      <div class="ab30-metric"><small>Distribution transformers</small><strong data-count="12000">12,000</strong><span>Annual production capacity</span></div>
      <div class="ab30-metric"><small>Complete switchgear</small><strong data-count="15000">15,000</strong><span>Annual production capacity</span></div>
    </div>
  </div></section>

  <section class="ab30-history"><div class="ab30-shell">
    <div class="ab30-history-head">
      <div><p class="ab30-kicker">Historical Evolution</p><h2>From predecessor electrical factories to the present manufacturing base.</h2></div>
      <p>Tianyu's development spans predecessor electrical-equipment factories, corporate restructuring and the relocation of its modern manufacturing base.</p>
    </div>
    <div class="ab30-history-scroll"><div class="ab30-history-track">
      <article class="ab30-time"><strong>1920</strong><small>Predecessor roots</small><p>A predecessor machine works was established in Fuzhou, forming part of the industrial lineage that later developed into the electrical-equipment business.</p></article>
      <article class="ab30-time"><strong>1956–1970</strong><small>Electrical manufacturing</small><p>Predecessor factories were reorganized through several stages, including transformer and switchgear manufacturing in Fuzhou.</p></article>
      <article class="ab30-time"><strong>1995</strong><small>Tianyu Group formed</small><p>Fuzhou First Switch Factory, Fuzhou Transformer Factory and Fuzhou General Electric Co., Ltd. were combined to form Fuzhou Tianyu Electric Group Co., Ltd.</p></article>
      <article class="ab30-time"><strong>1997</strong><small>Capital market</small><p>Tianyu Electric was listed on the Shenzhen Stock Exchange.</p></article>
      <article class="ab30-time"><strong>2001</strong><small>XJ Group</small><p>Tianyu Electric entered the XJ Group system.</p></article>
      <article class="ab30-time"><strong>2010</strong><small>State Grid period</small><p>Tianyu Electric joined the State Grid system together with XJ Group.</p></article>
      <article class="ab30-time"><strong>2016</strong><small>New manufacturing base</small><p>Tianyu Electric relocated from Jin'an District to the new Minhou manufacturing campus.</p></article>
      <article class="ab30-time"><strong>2021</strong><small>China Electrical Equipment Group</small><p>Tianyu Electric joined China Electrical Equipment Group together with XJ Group.</p></article>
    </div></div>
  </div></section>

  <section class="ab30-factory"><div class="ab30-shell">
    <div class="ab30-section-head">
      <div><p class="ab30-kicker">Factory Full View</p><h2>Inside the manufacturing base.</h2></div>
      <p>Workshop and equipment views cover transformer winding, core processing, dry-type manufacturing, automation and testing.</p>
    </div>
    <div class="ab30-gallery">
      <a class="ab30-shot" href="manufacturing.html"><img src="assets/media/factory/large-oil-transformer-winding-line.png" alt="Large oil-immersed transformer winding line"><span>Large transformer winding line</span></a>
      <a class="ab30-shot" href="manufacturing.html"><img src="assets/media/factory/automatic-core-cutting-line.png" alt="Automatic transformer core cutting line"><span>Automatic core cutting</span></a>
      <a class="ab30-shot" href="manufacturing.html"><img src="assets/media/factory/dry-type-transformer-intelligent-winding-line.png" alt="Dry-type transformer winding line"><span>Dry-type transformer winding</span></a>
      <a class="ab30-shot" href="manufacturing.html"><img src="assets/media/factory/automatic-welding-robot.png" alt="Automatic welding robot"><span>Automatic welding</span></a>
      <a class="ab30-shot" href="quality.html"><img src="assets/media/factory/large-transformer-test-station.png" alt="Large transformer test station"><span>Transformer testing</span></a>
    </div>
    <div class="ab30-factory-links"><a href="manufacturing.html">Manufacturing →</a><a href="quality.html">Quality & Testing →</a><a href="applications.html">Project References →</a><a href="resources.html#certificates">Certificates & Reports →</a></div>
  </div></section>

  <section class="ab30-cta"><h2>Explore Tianyu's transformer range and project references.</h2><a href="products.html">View products →</a></section>
</main>`;

html = html.replace(/<main>[\s\S]*?<\/main>/, main);
fs.writeFileSync(page, html, 'utf8');
console.log('Refined dist/about.html with About page V30.');
