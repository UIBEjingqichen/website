import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const page = path.join(dist, 'manufacturing.html');
const cssSource = path.join(__dirname, 'manufacturing-v34.css');
const cssTarget = path.join(dist, 'assets', 'css', 'manufacturing-v34.css');
const jsSource = path.join(__dirname, 'manufacturing-v34.js');
const jsTarget = path.join(dist, 'assets', 'js', 'manufacturing-v34.js');

if (!fs.existsSync(page)) process.exit(0);
fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.mkdirSync(path.dirname(jsTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);
fs.copyFileSync(jsSource, jsTarget);

let html = fs.readFileSync(page, 'utf8');
html = html.replace(/\s*<link rel="stylesheet" href="assets\/css\/manufacturing-v34\.css">/g, '');
html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/manufacturing-v34.css">\n</head>');
html = html.replace(/<body(?: class="([^"]*)")?>/, (_, cls='') => `<body class="${[...new Set((cls + ' mfg34').trim().split(/\s+/).filter(Boolean))].join(' ')}">`);
html = html.replace(/\s*<script src="assets\/js\/manufacturing-v34\.js"><\/script>/g, '');
html = html.replace('</body>', '  <script src="assets/js/manufacturing-v34.js"></script>\n</body>');

const main = `<main>
  <section class="mfg34-hero" id="top">
    <img src="assets/media/company/factory-campus-panorama.jpeg" alt="Tianyu Electric manufacturing campus">
    <div class="mfg34-hero-inner">
      <div class="mfg34-hero-copy">
        <p class="mfg34-kicker">Manufacturing Excellence</p>
        <h1>Transformer Manufacturing &amp; Testing</h1>
        <p class="mfg34-hero-lead">Integrated transformer manufacturing from incoming materials to final assembly and testing, supported by digital production systems and documented quality controls.</p>
        <div class="mfg34-hero-actions">
          <a class="mfg34-btn primary" href="#process">Explore the process →</a>
          <button class="mfg34-btn" type="button" data-quote-open>Request a factory visit</button>
        </div>
      </div>
      <div class="mfg34-hero-stats" aria-label="Manufacturing capability highlights">
        <div class="mfg34-hero-stat"><strong>85,243 m²</strong><span>Plant area</span></div>
        <div class="mfg34-hero-stat"><strong>460</strong><span>Large mechanical equipment</span></div>
        <div class="mfg34-hero-stat"><strong>60 types</strong><span>Supporting test equipment</span></div>
      </div>
    </div>
  </section>

  <nav class="mfg34-jump" aria-label="Manufacturing page sections">
    <div class="mfg34-shell mfg34-jump-inner">
      <a class="is-active" href="#overview">Overview</a>
      <a href="#process">Process</a>
      <a href="#digital">Digital Systems</a>
      <a href="#testing">Testing</a>
      <a href="#gallery">Gallery</a>
      <a href="#faq">FAQ</a>
      <a href="#contact">Contact</a>
    </div>
  </nav>

  <section class="mfg34-section soft" id="overview">
    <div class="mfg34-shell">
      <div class="mfg34-head">
        <div><p class="mfg34-kicker">Factory at a Glance</p><h2 class="mfg34-title">Scale, capacity and equipment in one view.</h2></div>
        <p class="mfg34-copy">The manufacturing base combines transformer production, prefabricated-substation assembly and supporting test resources in a single industrial campus.</p>
      </div>
      <div class="mfg34-metrics" aria-label="Tianyu manufacturing metrics">
        <div class="mfg34-metric"><small>Total investment</small><strong>≈ RMB 250m</strong><span>Manufacturing-base investment</span></div>
        <div class="mfg34-metric"><small>Plant area</small><strong>85,243 m²</strong><span>Manufacturing campus</span></div>
        <div class="mfg34-metric"><small>Large mechanical equipment</small><strong>460</strong><span>Production equipment in the plant</span></div>
        <div class="mfg34-metric"><small>Supporting test equipment</small><strong>60 types</strong><span>Testing-equipment categories</span></div>
        <div class="mfg34-metric"><small>Large main transformers</small><strong>1,200 / yr</strong><span>Annual production capacity</span></div>
        <div class="mfg34-metric"><small>Distribution transformers</small><strong>12,000 / yr</strong><span>Annual production capacity</span></div>
        <div class="mfg34-metric"><small>Box-type substations</small><strong>10,000 / yr</strong><span>Annual production capacity</span></div>
        <div class="mfg34-metric"><small>Complete switchgear</small><strong>15,000 / yr</strong><span>Annual production capacity</span></div>
      </div>
    </div>
  </section>

  <section class="mfg34-section white" id="process">
    <div class="mfg34-shell">
      <div class="mfg34-head">
        <div><p class="mfg34-kicker">End-to-End Manufacturing Flow</p><h2 class="mfg34-title">From incoming materials to tested transformer.</h2></div>
        <p class="mfg34-copy">Eight production and release stages connect material control, core and coil work, active-part assembly, drying, final assembly and testing.</p>
      </div>
      <div class="mfg34-process" aria-label="Transformer manufacturing process">
        <article class="mfg34-step"><div class="mfg34-step-no">01</div><div class="mfg34-step-copy"><h3>Material Inspection</h3><p>Incoming conductor, core and insulation materials.</p></div></article>
        <article class="mfg34-step has-media"><div class="mfg34-step-no">02</div><div class="mfg34-step-copy"><h3>Core Cutting</h3><p>Core cutting, stacking and dimensional control.</p></div><div class="mfg34-step-media"><img src="assets/media/factory/automatic-core-cutting-line.png" alt="Automatic transformer core cutting line" loading="lazy"></div></article>
        <article class="mfg34-step has-media"><div class="mfg34-step-no">03</div><div class="mfg34-step-copy"><h3>Coil Winding</h3><p>HV and LV winding to approved design data.</p></div><div class="mfg34-step-media"><img src="assets/media/factory/large-oil-transformer-winding-line.png" alt="Large transformer winding line" loading="lazy"></div></article>
        <article class="mfg34-step"><div class="mfg34-step-no">04</div><div class="mfg34-step-copy"><h3>Insulation &amp; Leads</h3><p>Insulation build and lead connection work.</p></div></article>
        <article class="mfg34-step has-media"><div class="mfg34-step-no">05</div><div class="mfg34-step-copy"><h3>Active Part Assembly</h3><p>Core, coils, leads and clamping integration.</p></div><div class="mfg34-step-media"><img src="assets/media/factory/combined-transformer-wiring-assembly.webp" alt="Transformer wiring and assembly work" loading="lazy"></div></article>
        <article class="mfg34-step"><div class="mfg34-step-no">06</div><div class="mfg34-step-copy"><h3>Vacuum Drying</h3><p>Insulation drying before oil processing and final assembly.</p></div></article>
        <article class="mfg34-step"><div class="mfg34-step-no">07</div><div class="mfg34-step-copy"><h3>Tanking &amp; Final Assembly</h3><p>Tank, radiators, bushings and accessories.</p></div></article>
        <article class="mfg34-step has-media"><div class="mfg34-step-no">08</div><div class="mfg34-step-copy"><h3>Routine Test / FAT</h3><p>Inspection, agreed testing and release records.</p></div><div class="mfg34-step-media"><img src="assets/media/factory/large-transformer-test-station.png" alt="Large transformer test station" loading="lazy"></div></article>
      </div>
    </div>
  </section>

  <section class="mfg34-section soft" id="digital">
    <div class="mfg34-shell">
      <div class="mfg34-head">
        <div><p class="mfg34-kicker">Digital Manufacturing Systems</p><h2 class="mfg34-title">Supply, production, quality and logistics controls.</h2></div>
        <p class="mfg34-copy">SRM, MOM, QMS and WMS support supplier coordination, production execution, quality traceability and material flow.</p>
      </div>
      <div class="mfg34-systems">
        <article class="mfg34-system"><div class="mfg34-system-icon">SRM</div><div><h3>Supplier Relationship Management</h3><p>Supplier coordination, material delivery and procurement collaboration.</p></div></article>
        <article class="mfg34-system"><div class="mfg34-system-icon">MOM</div><div><h3>Manufacturing Operations Management</h3><p>Production planning, process execution and shop-floor coordination.</p></div></article>
        <article class="mfg34-system"><div class="mfg34-system-icon">QMS</div><div><h3>Quality Management System</h3><p>Quality-control records and traceability through the manufacturing process.</p></div></article>
        <article class="mfg34-system"><div class="mfg34-system-icon">WMS</div><div><h3>Warehouse Management System</h3><p>Warehouse, inventory and material-flow management.</p></div></article>
      </div>
      <figure class="mfg34-digital-visual"><img src="assets/media/factory/digital-manufacturing-dashboard.png" alt="Digital manufacturing management system display" loading="lazy"><figcaption>Digital manufacturing management display.</figcaption></figure>
    </div>
  </section>

  <section class="mfg34-section white" id="testing">
    <div class="mfg34-shell">
      <div class="mfg34-head">
        <div><p class="mfg34-kicker">Testing &amp; Quality Assurance</p><h2 class="mfg34-title">Routine testing, FAT and traceable release records.</h2></div>
        <p class="mfg34-copy">Testing scope depends on the product, applicable specification and project contract. Routine, special and witness activities are defined against the agreed inspection and test scope.</p>
      </div>
      <div class="mfg34-test-grid">
        <div class="mfg34-test-list">
          <article class="mfg34-test-item"><div class="mfg34-test-icon">01</div><div><h3>Routine Tests</h3><p>Routine tests and inspection points completed before release according to the applicable product and project requirements.</p></div></article>
          <article class="mfg34-test-item"><div class="mfg34-test-icon">02</div><div><h3>Type / Special Tests</h3><p>Type or project-specific tests are arranged when required by the specification or contract.</p></div></article>
          <article class="mfg34-test-item"><div class="mfg34-test-icon">03</div><div><h3>Witness FAT</h3><p>Customer or third-party witness arrangements can be defined for agreed FAT and inspection activities.</p></div></article>
          <article class="mfg34-test-item"><div class="mfg34-test-icon">04</div><div><h3>Traceable Records</h3><p>Inspection and test records form part of the project document chain where required.</p></div></article>
        </div>
        <figure class="mfg34-test-photo"><img src="assets/media/factory/large-transformer-test-station.png" alt="Large transformer test station" loading="lazy"><figcaption>Large transformer test station.</figcaption></figure>
      </div>
    </div>
  </section>

  <section class="mfg34-section soft" id="gallery">
    <div class="mfg34-shell">
      <p class="mfg34-kicker">Factory Gallery</p>
      <h2 class="mfg34-title">Workshop and assembly evidence.</h2>
      <div class="mfg34-gallery">
        <figure><img src="assets/media/factory/dry-type-prefabricated-substation-assembly-01.webp" alt="Dry-type prefabricated substation assembly" loading="lazy"><figcaption>Prefabricated substation assembly</figcaption></figure>
        <figure><img src="assets/media/factory/dry-type-prefabricated-substation-assembly-02.webp" alt="Prefabricated substation workshop assembly" loading="lazy"><figcaption>Workshop assembly</figcaption></figure>
        <figure><img src="assets/media/factory/oil-prefabricated-substation-assembly.webp" alt="Oil-immersed prefabricated substation assembly" loading="lazy"><figcaption>Oil-immersed substation integration</figcaption></figure>
        <figure><img src="assets/media/factory/combined-transformer-wiring-assembly.webp" alt="Combined transformer wiring assembly" loading="lazy"><figcaption>Transformer wiring and assembly</figcaption></figure>
      </div>
    </div>
  </section>

  <section class="mfg34-section white" id="faq">
    <div class="mfg34-shell">
      <div class="mfg34-head">
        <div><p class="mfg34-kicker">Manufacturing FAQ</p><h2 class="mfg34-title">Questions for factory and tender review.</h2></div>
        <p class="mfg34-copy">Final scope is governed by the project specification and contract.</p>
      </div>
      <div class="mfg34-faq">
        <details><summary>Can FAT be witnessed by the customer or a third party?</summary><p>Witness arrangements can be included where required by the project and agreed in the inspection and testing scope.</p></details>
        <details><summary>What manufacturing documents can be discussed during tender review?</summary><p>Typical requirements may include approved drawings, inspection and test records, FAT documentation, packing information and project-specific handover documents.</p></details>
        <details><summary>Can customers arrange a factory visit?</summary><p>Factory-visit requirements can be submitted through the inquiry form so the relevant product, project stage and visit purpose can be reviewed in advance.</p></details>
      </div>
    </div>
  </section>

  <section class="mfg34-cta" id="contact">
    <div class="mfg34-shell mfg34-cta-inner">
      <div><p class="mfg34-kicker">Factory &amp; Engineering Review</p><h2>Review the manufacturing capability behind your project.</h2></div>
      <div class="mfg34-cta-actions"><button class="mfg34-btn primary" type="button" data-quote-open>Request a Factory Visit</button><button class="mfg34-btn" type="button" data-quote-open>Discuss Your Specification</button></div>
    </div>
  </section>
</main>`;

html = html.replace(/<main>[\s\S]*?<\/main>/, main);
fs.writeFileSync(page, html, 'utf8');
console.log('Manufacturing V34 applied: compact hero metrics, eight-stage process with adjacent evidence, digital systems, testing, gallery, FAQ and CTA.');
