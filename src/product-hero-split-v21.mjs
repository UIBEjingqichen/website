import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const productsFile = path.join(dist, "products.html");
const cssSource = path.join(__dirname, "product-hero-split-v21.css");
const cssTarget = path.join(dist, "assets", "css", "product-hero-split-v21.css");
const interactionCssSource = path.join(__dirname, "product-hero-interaction-v25.css");
const interactionCssTarget = path.join(dist, "assets", "css", "product-hero-interaction-v25.css");

if (!fs.existsSync(productsFile)) {
  console.log("Product hero refinement skipped: dist/products.html not found.");
  process.exit(0);
}

fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);
if (fs.existsSync(interactionCssSource)) fs.copyFileSync(interactionCssSource, interactionCssTarget);

let productsHtml = fs.readFileSync(productsFile, "utf8");
if (!productsHtml.includes("product-hero-split-v21.css")) {
  productsHtml = productsHtml.replace("</head>", '  <link rel="stylesheet" href="assets/css/product-hero-split-v21.css">\n</head>');
}
if (!productsHtml.includes("product-hero-interaction-v25.css")) {
  productsHtml = productsHtml.replace("</head>", '  <link rel="stylesheet" href="assets/css/product-hero-interaction-v25.css">\n</head>');
}

const hero = `<section class="v3p-index-hero v23-product-hero" data-product-hero>
  <div class="copy">
    <p class="v3p-kicker">Product Portfolio</p>
    <h1>Transformer &amp; Prefabricated Substation Solutions</h1>
    <p class="v3p-lead">Transformer solutions for utility, industrial and renewable-energy projects, organized by product role, voltage and application.</p>
    <a class="v23-hero-link" href="#product-families">Explore products <span>↓</span></a>
  </div>
  <div class="media">
    <div class="v23-product-stage" aria-label="Selected Tianyu transformer products">
      <figure class="v23-product-visual is-active" data-product-panel="0" aria-hidden="false"><img src="assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png" alt="Oil-immersed power transformer"></figure>
      <figure class="v23-product-visual" data-product-panel="1" aria-hidden="true"><img src="assets/media/products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg" alt="Cast resin dry-type transformer"></figure>
      <figure class="v23-product-visual" data-product-panel="2" aria-hidden="true"><img src="assets/media/products/special-transformers/dry-type-rectifier-transformer-red.jpeg" alt="Special rectifier transformer"></figure>
      <figure class="v23-product-visual" data-product-panel="3" aria-hidden="true"><img src="assets/media/products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp" alt="Prefabricated substation"></figure>
      <div class="v23-stage-status" aria-label="Product image position"><span data-product-count>01 / 04</span><div class="v23-stage-dots" aria-label="Choose product image"><button class="is-active" type="button" data-product-dot="0" aria-label="Show product image 1" aria-current="true"></button><button type="button" data-product-dot="1" aria-label="Show product image 2" aria-current="false"></button><button type="button" data-product-dot="2" aria-label="Show product image 3" aria-current="false"></button><button type="button" data-product-dot="3" aria-label="Show product image 4" aria-current="false"></button></div></div>
    </div>
  </div>
</section>`;

const familyNavigation = `<section class="v23-family-section" id="product-families"><div class="v3p-shell">
  <div class="v23-family-heading"><div><p class="v3p-kicker">Product Families</p><h2>Explore our product portfolio</h2></div><p>Choose a product family to move directly to the relevant transformer or substation range.</p></div>
  <nav class="v23-family-grid" aria-label="Product family navigation">
    <a href="#power-transformers"><span>01</span><strong>Power Transformers</strong><small>35–220 kV main transformer platforms</small><b>View range →</b></a>
    <a href="#distribution-transformers"><span>02</span><strong>Distribution Transformers</strong><small>Oil-immersed and dry-type distribution platforms</small><b>View range →</b></a>
    <a href="#special-transformers"><span>03</span><strong>Special &amp; Renewable</strong><small>Renewable, rectifier and application-specific solutions</small><b>View range →</b></a>
    <a href="#prefabricated-substations"><span>04</span><strong>Prefabricated Substations</strong><small>Factory-integrated compact and project-specific substations</small><b>View range →</b></a>
  </nav>
</div></section>`;

productsHtml = productsHtml.replace(/<section class="v3p-index-hero[^"]*"[^>]*>[\s\S]*?<\/section>/, hero);
productsHtml = productsHtml.replace(/<nav class="v20-product-jump"[\s\S]*?<\/nav>\s*/g, "");
productsHtml = productsHtml.replace(/<section class="v3p-section"><div class="v3p-shell">\s*<p class="v3p-kicker">Browse by Product Family<\/p>[\s\S]*?<\/section>\s*(?=<section class="v3p-section v3p-soft" id="all-platforms">)/, `${familyNavigation}\n`);

const heroScript = `<script>
(() => {
  const root = document.querySelector('[data-product-hero]');
  if (!root) return;
  const panels = [...root.querySelectorAll('[data-product-panel]')];
  const dots = [...root.querySelectorAll('[data-product-dot]')];
  const count = root.querySelector('[data-product-count]');
  let active = 0;
  let timer;
  let paused = false;

  const select = (index) => {
    active = (index + panels.length) % panels.length;
    panels.forEach((panel, i) => {
      panel.classList.toggle('is-active', i === active);
      panel.setAttribute('aria-hidden', i === active ? 'false' : 'true');
    });
    dots.forEach((dot, i) => {
      const current = i === active;
      dot.classList.toggle('is-active', current);
      dot.setAttribute('aria-current', current ? 'true' : 'false');
    });
    if (count) count.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(panels.length).padStart(2, '0');
  };

  const start = () => {
    clearInterval(timer);
    if (paused || panels.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(() => select(active + 1), 5600);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      select(index);
      start();
    });
  });

  root.addEventListener('mouseenter', () => { paused = true; clearInterval(timer); });
  root.addEventListener('mouseleave', () => { paused = false; start(); });
  root.addEventListener('focusin', () => { paused = true; clearInterval(timer); });
  root.addEventListener('focusout', () => { setTimeout(() => { if (!root.contains(document.activeElement)) { paused = false; start(); } }, 0); });
  start();
})();
</script>`;

productsHtml = productsHtml.replace(/<script>\s*\(\(\) => \{\s*const root = document\.querySelector\('\[data-product-hero\]'\);[\s\S]*?<\/script>\s*/g, "");
productsHtml = productsHtml.replace("</body>", `${heroScript}\n</body>`);

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
let detailCount = 0;
for (const file of walk(dist)) {
  let html = fs.readFileSync(file, "utf8");
  let changed = false;
  html = html.replace(/<header class="site-header">[\s\S]*?<\/header>/, (header) => {
    let nextHeader = header;
    for (const [pattern, replacement] of linkRules) nextHeader = nextHeader.replace(pattern, replacement);
    nextHeader = nextHeader.replace(/<a href="(?:\.\.\/)*products\.html#all-platforms">All Transformer &amp; Substation Products<\/a>/g, "");
    if (nextHeader !== header) {
      changed = true;
      headerCount += 1;
    }
    return nextHeader;
  });

  const productsRoot = path.join(dist, "products") + path.sep;
  const isProductDetail = file.startsWith(productsRoot);
  if (isProductDetail && !html.includes("product-hero-split-v21.css")) {
    const relCss = path.relative(path.dirname(file), cssTarget).split(path.sep).join("/");
    html = html.replace("</head>", `  <link rel="stylesheet" href="${relCss}">\n</head>`);
    changed = true;
    detailCount += 1;
  }

  if (changed) fs.writeFileSync(file, html, "utf8");
}

console.log(`Applied enlarged interactive product showcase hero, removed redundant all-products dropdown entry across ${headerCount} pages, and refined ${detailCount} product detail pages.`);
