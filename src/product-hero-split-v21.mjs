import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const productsFile = path.join(dist, "products.html");
const cssSource = path.join(__dirname, "product-hero-split-v21.css");
const cssTarget = path.join(dist, "assets", "css", "product-hero-split-v21.css");

if (!fs.existsSync(productsFile)) {
  console.log("Product hero refinement skipped: dist/products.html not found.");
  process.exit(0);
}

fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);

let productsHtml = fs.readFileSync(productsFile, "utf8");
if (!productsHtml.includes("product-hero-split-v21.css")) {
  productsHtml = productsHtml.replace("</head>", '  <link rel="stylesheet" href="assets/css/product-hero-split-v21.css">\n</head>');
}

const hero = `<section class="v3p-index-hero v22-yawei-hero" data-product-hero>
  <div class="copy">
    <p class="v3p-kicker">Product Portfolio</p>
    <h1>Transformer &amp; Prefabricated Substation Solutions</h1>
    <p class="v3p-lead">Power, distribution and renewable-energy equipment organized by transformer role, voltage, capacity and application.</p>
    <div class="v22-selector-head"><span>Selected product families</span><span class="v22-selector-count" data-product-count>01 / 05</span></div>
    <nav class="v22-product-selector" aria-label="Selected transformer products">
      <a class="v22-product-tab is-active" href="#power-transformers" data-product-tab="0" aria-current="true"><span class="v22-tab-index">01</span><span class="v22-tab-copy"><strong>Power Transformers</strong><small>35–220 kV main transformer platforms</small></span><span class="v22-tab-action">EXPLORE ↗</span></a>
      <a class="v22-product-tab" href="#distribution-transformers" data-product-tab="1"><span class="v22-tab-index">02</span><span class="v22-tab-copy"><strong>Oil-Immersed Distribution</strong><small>6–35 kV distribution transformer range</small></span><span class="v22-tab-action">EXPLORE ↗</span></a>
      <a class="v22-product-tab" href="#distribution-transformers" data-product-tab="2"><span class="v22-tab-index">03</span><span class="v22-tab-copy"><strong>Dry-Type Distribution</strong><small>Cast-resin and low-loss dry-type platforms</small></span><span class="v22-tab-action">EXPLORE ↗</span></a>
      <a class="v22-product-tab" href="#special-transformers" data-product-tab="3"><span class="v22-tab-index">04</span><span class="v22-tab-copy"><strong>Special &amp; Renewable</strong><small>Renewable step-up and rectifier solutions</small></span><span class="v22-tab-action">EXPLORE ↗</span></a>
      <a class="v22-product-tab" href="#prefabricated-substations" data-product-tab="4"><span class="v22-tab-index">05</span><span class="v22-tab-copy"><strong>Prefabricated Substations</strong><small>Factory-integrated compact substation platforms</small></span><span class="v22-tab-action">EXPLORE ↗</span></a>
    </nav>
  </div>
  <div class="media">
    <div class="v22-product-stage" data-product-stage>
      <a class="v22-product-visual is-active" href="#power-transformers" data-product-panel="0" aria-hidden="false"><img src="assets/media/products/power-transformers/oil-immersed-power-transformer-isolated-01.jpeg" alt="Oil-immersed power transformer"><div class="v22-visual-meta"><span>01 · Power Transformers</span><strong>Oil-Immersed Power Transformer</strong></div></a>
      <a class="v22-product-visual" href="#distribution-transformers" data-product-panel="1" aria-hidden="true"><img src="assets/media/products/distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp" alt="Oil-immersed distribution transformer"><div class="v22-visual-meta"><span>02 · Distribution Transformers</span><strong>Oil-Immersed Distribution Transformer</strong></div></a>
      <a class="v22-product-visual" href="#distribution-transformers" data-product-panel="2" aria-hidden="true"><img src="assets/media/products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg" alt="Cast resin dry-type transformer"><div class="v22-visual-meta"><span>03 · Distribution Transformers</span><strong>Cast Resin Dry-Type Transformer</strong></div></a>
      <a class="v22-product-visual" href="#special-transformers" data-product-panel="3" aria-hidden="true"><img src="assets/media/products/special-transformers/dry-type-rectifier-transformer-red.jpeg" alt="Special rectifier transformer"><div class="v22-visual-meta"><span>04 · Special &amp; Renewable</span><strong>Application-Specific Transformer Solutions</strong></div></a>
      <a class="v22-product-visual" href="#prefabricated-substations" data-product-panel="4" aria-hidden="true"><img src="assets/media/products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp" alt="Prefabricated substation"><div class="v22-visual-meta"><span>05 · Prefabricated Substations</span><strong>Factory-Integrated Prefabricated Substation</strong></div></a>
      <div class="v22-stage-controls" aria-label="Product image controls"><button type="button" data-product-prev aria-label="Previous product">←</button><div class="v22-stage-progress" aria-hidden="true"><i class="is-active"></i><i></i><i></i><i></i><i></i></div><button type="button" data-product-next aria-label="Next product">→</button></div>
    </div>
  </div>
</section>`;

productsHtml = productsHtml.replace(/<section class="v3p-index-hero(?: [^"]*)?">[\s\S]*?<\/section>/, hero);

const heroScript = `<script>
(() => {
  const root = document.querySelector('[data-product-hero]');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[data-product-tab]')];
  const panels = [...root.querySelectorAll('[data-product-panel]')];
  const dots = [...root.querySelectorAll('.v22-stage-progress i')];
  const count = root.querySelector('[data-product-count]');
  const prev = root.querySelector('[data-product-prev]');
  const next = root.querySelector('[data-product-next]');
  let active = 0;
  let timer;
  let paused = false;

  const select = (index, restart = true) => {
    active = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === active);
      if (i === active) tab.setAttribute('aria-current', 'true'); else tab.removeAttribute('aria-current');
    });
    panels.forEach((panel, i) => {
      panel.classList.toggle('is-active', i === active);
      panel.setAttribute('aria-hidden', i === active ? 'false' : 'true');
    });
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === active));
    if (count) count.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(tabs.length).padStart(2, '0');
    if (restart) start();
  };

  const start = () => {
    clearInterval(timer);
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(() => select(active + 1, false), 5200);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('mouseenter', () => select(i));
    tab.addEventListener('focus', () => select(i));
  });
  prev?.addEventListener('click', () => select(active - 1));
  next?.addEventListener('click', () => select(active + 1));

  root.addEventListener('mouseenter', () => { paused = true; clearInterval(timer); });
  root.addEventListener('mouseleave', () => { paused = false; start(); });
  root.addEventListener('focusin', () => { paused = true; clearInterval(timer); });
  root.addEventListener('focusout', () => { setTimeout(() => { if (!root.contains(document.activeElement)) { paused = false; start(); } }, 0); });
  start();
})();
</script>`;

if (!productsHtml.includes("data-product-hero")) {
  // no-op: the hero replacement above should always add it
}
if (!productsHtml.includes("data-product-prev")) {
  console.log("Product hero controls were not generated.");
}
if (!productsHtml.includes("const root = document.querySelector('[data-product-hero]')")) {
  productsHtml = productsHtml.replace("</body>", `${heroScript}\n</body>`);
}

fs.writeFileSync(productsFile, productsHtml, "utf8");

const linkRules = [
  [/href="((?:\.\.\/)*?)products\/high-voltage-power-transformer\/"/g, 'href="$1products.html#power-transformers"'],
  [/href="((?:\.\.\/)*?)products\/oil-immersed-distribution-transformer\/"/g, 'href="$1products.html#distribution-transformers"'],
  [/href="((?:\.\.\/)*?)products\/special-renewable-solutions\/"/g, 'href="$1products.html#special-transformers"'],
  [/href="((?:\.\.\/)*?)products\/prefabricated-substations\/"/g, 'href="$1products.html#prefabricated-substations"']
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.isFile() && entry.name.endsWith(".html") ? [full] : [];
  });
}

let headerCount = 0;
for (const file of walk(dist)) {
  let html = fs.readFileSync(file, "utf8");
  let changed = false;
  html = html.replace(/<header class="site-header">[\s\S]*?<\/header>/, (header) => {
    let nextHeader = header;
    for (const [pattern, replacement] of linkRules) nextHeader = nextHeader.replace(pattern, replacement);
    if (nextHeader !== header) {
      changed = true;
      headerCount += 1;
    }
    return nextHeader;
  });
  if (changed) fs.writeFileSync(file, html, "utf8");
}

console.log(`Applied Yawei-inspired selector hero and rewired product dropdown anchors across ${headerCount} pages.`);
