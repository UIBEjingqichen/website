import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const productsFile = path.join(dist, "products.html");
const cssSource = path.join(__dirname, "product-hero-split-v21.css");
const cssTarget = path.join(dist, "assets", "css", "product-hero-split-v21.css");
const carouselCssSource = path.join(__dirname, "product-portfolio-carousel.css");
const carouselCssTarget = path.join(dist, "assets", "css", "product-portfolio-carousel.css");

if (!fs.existsSync(productsFile)) {
  console.log("Product portfolio refinement skipped: dist/products.html not found.");
  process.exit(0);
}

fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);
if (fs.existsSync(carouselCssSource)) fs.copyFileSync(carouselCssSource, carouselCssTarget);

let productsHtml = fs.readFileSync(productsFile, "utf8");
productsHtml = productsHtml.replace(/\s*<link rel="stylesheet" href="assets\/css\/product-hero-interaction-v25\.css">/g, "");
productsHtml = productsHtml.replace(/\s*<link rel="stylesheet" href="assets\/css\/product-portfolio-carousel\.css">/g, "");
if (!productsHtml.includes("product-hero-split-v21.css")) {
  productsHtml = productsHtml.replace("</head>", '  <link rel="stylesheet" href="assets/css/product-hero-split-v21.css">\n</head>');
}
productsHtml = productsHtml.replace("</head>", '  <link rel="stylesheet" href="assets/css/product-portfolio-carousel.css">\n</head>');

const hero = `<section class="v3p-index-hero v23-product-hero" data-product-hero>
  <div class="copy">
    <p class="v3p-kicker">Product Portfolio</p>
    <h1>Transformer &amp; Substation Products</h1>
    <p class="v3p-lead">Power, distribution and special-purpose transformers, plus prefabricated substations for utility, renewable-energy and industrial projects.</p>
    <div class="v23-hero-facts" aria-label="Product range summary">
      <span><small>Power</small><strong>35–220 kV</strong></span>
      <span><small>Distribution</small><strong>6–35 kV</strong></span>
      <span><small>Dry-type</small><strong>Up to 35 kV</strong></span>
      <span><small>Substations</small><strong>Project engineered</strong></span>
    </div>
    <a class="v23-hero-link" href="#product-families">Explore product families <span>↓</span></a>
  </div>
  <div class="media">
    <div class="v23-product-carousel" aria-label="Selected Tianyu product portfolio">
      <figure class="v23-product-slide is-active" data-product-slide="0" aria-hidden="false">
        <img src="assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png" alt="Tianyu oil-immersed power transformer installed at a substation">
        <figcaption><span>Power Transformers</span><strong>35–220 kV main transformer platforms</strong></figcaption>
      </figure>
      <figure class="v23-product-slide" data-product-slide="1" aria-hidden="true">
        <img src="assets/media/products/distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp" alt="Tianyu oil-immersed distribution transformer">
        <figcaption><span>Distribution Transformers</span><strong>Oil-immersed distribution platforms</strong></figcaption>
      </figure>
      <figure class="v23-product-slide" data-product-slide="2" aria-hidden="true">
        <img src="assets/media/products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg" alt="Tianyu cast resin dry-type transformer">
        <figcaption><span>Dry-Type Transformers</span><strong>Cast-resin and project-specific dry-type platforms</strong></figcaption>
      </figure>
      <figure class="v23-product-slide" data-product-slide="3" aria-hidden="true">
        <img src="assets/media/products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp" alt="Tianyu prefabricated substation">
        <figcaption><span>Prefabricated Substations</span><strong>Factory-integrated compact substations</strong></figcaption>
      </figure>
      <div class="v23-carousel-nav" aria-label="Product image controls">
        <span class="v23-carousel-count" data-product-count>01 / 04</span>
        <div class="v23-carousel-dots">
          <button class="v23-carousel-dot is-active" type="button" data-product-dot="0" aria-label="Show power transformer" aria-current="true"></button>
          <button class="v23-carousel-dot" type="button" data-product-dot="1" aria-label="Show distribution transformer" aria-current="false"></button>
          <button class="v23-carousel-dot" type="button" data-product-dot="2" aria-label="Show dry-type transformer" aria-current="false"></button>
          <button class="v23-carousel-dot" type="button" data-product-dot="3" aria-label="Show prefabricated substation" aria-current="false"></button>
        </div>
      </div>
    </div>
  </div>
</section>`;

const familyNavigation = `<section class="v23-family-section" id="product-families"><div class="v3p-shell">
  <div class="v23-family-heading"><div><p class="v3p-kicker">Product Families</p><h2>Choose by transformer role</h2></div><p>Start with the equipment role, then move into voltage class, capacity and project-specific configuration.</p></div>
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
productsHtml = productsHtml.replace(/<script data-product-carousel>[\s\S]*?<\/script>\s*/g, "");

const heroScript = `<script data-product-carousel>
(() => {
  const root = document.querySelector('[data-product-hero]');
  if (!root) return;
  const slides = [...root.querySelectorAll('[data-product-slide]')];
  const dots = [...root.querySelectorAll('[data-product-dot]')];
  const count = root.querySelector('[data-product-count]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0;
  let timer = null;
  let paused = false;

  const select = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const current = i === active;
      slide.classList.toggle('is-active', current);
      slide.setAttribute('aria-hidden', current ? 'false' : 'true');
    });
    dots.forEach((dot, i) => {
      const current = i === active;
      dot.classList.toggle('is-active', current);
      dot.setAttribute('aria-current', current ? 'true' : 'false');
    });
    if (count) count.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
  };

  const start = () => {
    clearInterval(timer);
    if (reduced || paused || slides.length < 2) return;
    timer = setInterval(() => select(active + 1), 5200);
  };

  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    select(index);
    start();
  }));

  root.addEventListener('mouseenter', () => { paused = true; clearInterval(timer); });
  root.addEventListener('mouseleave', () => { paused = false; start(); });
  root.addEventListener('focusin', () => { paused = true; clearInterval(timer); });
  root.addEventListener('focusout', () => setTimeout(() => {
    if (!root.contains(document.activeElement)) { paused = false; start(); }
  }, 0));

  select(0);
  start();
})();
</script>`;
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

console.log(`Applied compact product portfolio with rotating media, normalized family links across ${headerCount} pages, and refined ${detailCount} product detail pages.`);
