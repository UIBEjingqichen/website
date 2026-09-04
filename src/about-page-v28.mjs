import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const page = path.join(dist, 'about.html');
const cssSource = path.join(__dirname, 'about-page-v28.css');
const cssTarget = path.join(dist, 'assets', 'css', 'about-page-v28.css');

if (!fs.existsSync(page)) process.exit(0);
fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);

let html = fs.readFileSync(page, 'utf8');
html = html.replace(/\s*<link rel="stylesheet" href="assets\/css\/about-page-v28\.css">/g, '');
html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/about-page-v28.css">\n</head>');
html = html.replace(/<body class="([^"]*)">/, (_, cls) => `<body class="${[...new Set((cls + ' ab28-about').trim().split(/\s+/))].join(' ')}">`);

const main = `<main>
  <section class="ab28-hero">
    <img src="assets/media/company/factory-campus-panorama.jpeg" alt="Tianyu Electric manufacturing campus">
    <div class="ab28-hero-copy">
      <p class="ab28-kicker">About Tianyu Electric</p>
      <h1>Transformer manufacturing built on electrical-industry experience.</h1>
      <p class="ab28-hero-lead">Fuzhou Tianyu Electric Co., Ltd. manufactures transformers and prefabricated substations for utility, renewable-energy, industrial and infrastructure projects.</p>
      <a class="ab28-hero-link" href="manufacturing.html">Explore manufacturing <span>→</span></a>
    </div>
  </section>

  <div class="ab28-stats-wrap"><div class="ab28-shell"><div class="ab28-stats">
    <div class="ab28-stat"><small>Established</small><strong>1996</strong><span>Company foundation</span></div>
    <div class="ab28-stat"><small>Product portfolio</small><strong>30+</strong><span>Product series</span></div>
    <div class="ab28-stat"><small>Manufacturing base</small><strong>85,243 m²</strong><span>Plant area</span></div>
    <div class="ab28-stat"><small>Production equipment</small><strong>460</strong><span>Large mechanical equipment</span></div>
  </div></div></div>

  <section class="ab28-intro"><div class="ab28-shell"><div class="ab28-intro-grid">
    <div><p class="ab28-kicker">Company Overview</p><h2>A manufacturing base focused on transformers and primary electrical equipment.</h2></div>
    <div class="ab28-intro-copy">
      <p>Tianyu Electric was formed in 1996 from predecessor electrical-equipment factories. Today, the company manufactures power transformers, distribution transformers, special and renewable-energy transformers, and prefabricated substations for projects across utility, industrial and infrastructure applications.</p>
      <div class="ab28-ownership"><small>Company Structure</small><strong>A wholly-owned subsidiary of XJ Group Corporation under China Electrical Equipment Group Co., Ltd.</strong></div>
      <div class="ab28-link-row"><a href="products.html">Product portfolio →</a><a href="applications.html">Project references →</a><a href="resources.html">Technical resources →</a></div>
    </div>
  </div></div></section>

  <section class="ab28-manufacturing">
    <div class="ab28-manufacturing-media"><img src="assets/media/factory/large-oil-transformer-winding-line.png" alt="Tianyu transformer winding production line"></div>
    <div class="ab28-manufacturing-copy">
      <p class="ab28-kicker">Manufacturing Base</p>
      <h2>From winding and core processing to assembly and testing.</h2>
      <p>The manufacturing system brings transformer production, process control and verification into one coordinated industrial base.</p>
      <div class="ab28-facts"><span>Transformer winding and core processing</span><span>Assembly and controlled production processes</span><span>Dedicated transformer testing and FAT support</span></div>
      <a class="ab28-white-link" href="manufacturing.html">View manufacturing capability <b>→</b></a>
    </div>
  </section>

  <section class="ab28-portfolio"><div class="ab28-shell">
    <div class="ab28-section-head"><div><p class="ab28-kicker">Product Scope</p><h2>Four core product families.</h2></div><p>Product selection is organized by engineering role, voltage class, capacity and application, from utility power transformers to compact prefabricated substations.</p></div>
    <div class="ab28-portfolio-grid">
      <a class="ab28-portfolio-card" href="products.html#power-transformers"><span>01</span><h3>Power Transformers</h3><p>Oil-immersed transformer platforms for substations, grid interconnection and industrial main power systems.</p><b>EXPLORE →</b></a>
      <a class="ab28-portfolio-card" href="products.html#distribution-transformers"><span>02</span><h3>Distribution Transformers</h3><p>Oil-immersed and dry-type platforms for distribution networks and project power supply.</p><b>EXPLORE →</b></a>
      <a class="ab28-portfolio-card" href="products.html#special-transformers"><span>03</span><h3>Special & Renewable</h3><p>Transformer solutions for renewable-energy, rectifier, mobile and project-specific applications.</p><b>EXPLORE →</b></a>
      <a class="ab28-portfolio-card" href="products.html#prefabricated-substations"><span>04</span><h3>Prefabricated Substations</h3><p>Factory-integrated substation systems for utility, renewable, industrial and infrastructure projects.</p><b>EXPLORE →</b></a>
    </div>
  </div></section>

  <section class="ab28-history"><div class="ab28-shell">
    <div class="ab28-history-head"><p class="ab28-kicker">Development</p><h2>Key milestones in Tianyu's development.</h2></div>
    <div class="ab28-timeline">
      <article class="ab28-time"><small>Foundation</small><strong>1996</strong><p>Tianyu Electric was established through the combination of predecessor electrical-equipment factories.</p></article>
      <article class="ab28-time"><small>Manufacturing expansion</small><strong>2016</strong><p>The new Tianyu factory area was completed and entered production.</p></article>
      <article class="ab28-time"><small>Group development</small><strong>2021</strong><p>XJ Group became part of China Electrical Equipment Group.</p></article>
      <article class="ab28-time"><small>Today</small><strong>Now</strong><p>Transformer and prefabricated-substation manufacturing supports utility, renewable, industrial and infrastructure projects.</p></article>
    </div>
  </div></section>

  <section class="ab28-explore"><div class="ab28-shell">
    <div class="ab28-section-head"><div><p class="ab28-kicker">Explore Capability</p><h2>Go deeper into manufacturing and quality.</h2></div><p>Separate capability pages provide a closer view of production systems, test facilities, inspection and technical documentation.</p></div>
    <div class="ab28-explore-grid">
      <a class="ab28-explore-card" href="manufacturing.html"><img src="assets/media/factory/large-oil-transformer-winding-line.png" alt="Tianyu manufacturing line"><div class="ab28-explore-copy"><small>Manufacturing</small><h3>Production, assembly and manufacturing systems</h3><span>EXPLORE MANUFACTURING →</span></div></a>
      <a class="ab28-explore-card" href="quality.html"><img src="assets/media/factory/large-transformer-test-station.png" alt="Tianyu transformer testing facility"><div class="ab28-explore-copy"><small>Quality & Testing</small><h3>Transformer testing, inspection and verification</h3><span>EXPLORE QUALITY →</span></div></a>
    </div>
  </div></section>

  <section class="ab28-cta"><h2>Explore Tianyu's products and international project references.</h2><a href="applications.html">View projects →</a></section>
</main>`;

html = html.replace(/<main>[\s\S]*?<\/main>/, main);
fs.writeFileSync(page, html, 'utf8');
console.log('Refined dist/about.html with About page V28.');
