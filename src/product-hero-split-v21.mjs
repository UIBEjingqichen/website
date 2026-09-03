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
  console.log("Product V21 refinement skipped: dist/products.html not found.");
  process.exit(0);
}

fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);

let productsHtml = fs.readFileSync(productsFile, "utf8");
if (!productsHtml.includes("product-hero-split-v21.css")) {
  productsHtml = productsHtml.replace("</head>", '  <link rel="stylesheet" href="assets/css/product-hero-split-v21.css">\n</head>');
}

const hero = `<section class="v3p-index-hero v21-split-hero"><div class="copy"><p class="v3p-kicker">Product Portfolio</p><h1>Transformer &amp; Prefabricated Substation Solutions</h1><p class="v3p-lead">Power, distribution and renewable-energy equipment organized by transformer role, voltage, capacity and application.</p><div class="v3p-range-strip"><a href="#power-transformers">Power Transformers</a><a href="#distribution-transformers">Distribution Transformers</a><a href="#special-transformers">Special &amp; Renewable</a><a href="#prefabricated-substations">Prefabricated Substations</a></div></div><div class="media"><div class="v21-product-showcase" aria-label="Selected Tianyu transformer products"><figure class="v21-product-slide"><img src="assets/media/products/power-transformers/oil-immersed-power-transformer-isolated-01.jpeg" alt="Oil-immersed power transformer"><figcaption class="v21-product-caption"><span>Power Transformers</span><strong>Oil-Immersed Power Transformer</strong></figcaption></figure><figure class="v21-product-slide"><img src="assets/media/products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg" alt="Cast resin dry-type transformer"><figcaption class="v21-product-caption"><span>Distribution Transformers</span><strong>Cast Resin Dry-Type Transformer</strong></figcaption></figure><figure class="v21-product-slide"><img src="assets/media/products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp" alt="Prefabricated substation"><figcaption class="v21-product-caption"><span>Prefabricated Substations</span><strong>Factory-Integrated Prefabricated Substation</strong></figcaption></figure><figure class="v21-product-slide"><img src="assets/media/products/special-transformers/dry-type-rectifier-transformer-red.jpeg" alt="Special rectifier transformer"><figcaption class="v21-product-caption"><span>Special &amp; Renewable</span><strong>Application-Specific Transformer Solutions</strong></figcaption></figure></div></div></section>`;

productsHtml = productsHtml.replace(/<section class="v3p-index-hero(?: [^"]*)?">[\s\S]*?<\/section>/, hero);
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
    let next = header;
    for (const [pattern, replacement] of linkRules) next = next.replace(pattern, replacement);
    if (next !== header) {
      changed = true;
      headerCount += 1;
    }
    return next;
  });
  if (changed) fs.writeFileSync(file, html, "utf8");
}

console.log(`Applied V21 split rotating product hero and rewired product dropdown anchors across ${headerCount} pages.`);
