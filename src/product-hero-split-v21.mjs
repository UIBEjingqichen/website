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
  console.log("Product portfolio refinement skipped: dist/products.html not found.");
  process.exit(0);
}

fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);

let productsHtml = fs.readFileSync(productsFile, "utf8");
productsHtml = productsHtml.replace(/\s*<link rel="stylesheet" href="assets\/css\/product-hero-interaction-v25\.css">/g, "");
if (!productsHtml.includes("product-hero-split-v21.css")) {
  productsHtml = productsHtml.replace("</head>", '  <link rel="stylesheet" href="assets/css/product-hero-split-v21.css">\n</head>');
}

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
    <figure class="v23-product-feature">
      <img src="assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png" alt="Tianyu oil-immersed power transformer installed at a substation">
      <figcaption><span>Featured application</span><strong>Power transformer installation</strong></figcaption>
    </figure>
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
productsHtml = productsHtml.replace(/<script>\s*\(\(\) => \{\s*const root = document\.querySelector\('\[data-product-hero\]'\);[\s\S]*?<\/script>\s*/g, "");
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

console.log(`Applied compact technical product portfolio header, normalized family links across ${headerCount} pages, and refined ${detailCount} product detail pages.`);
