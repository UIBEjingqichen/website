import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const exists = (rel) => fs.existsSync(path.join(dist, rel));
const read = (rel) => fs.readFileSync(path.join(dist, rel), "utf8");
const requireFile = (rel) => { if (!exists(rel)) throw new Error(`Missing generated file: ${rel}`); };
const requireText = (rel, text) => { if (!read(rel).includes(text)) throw new Error(`${rel} is missing expected content: ${text}`); };

const required = [
  "index.html",
  "products.html",
  "manufacturing.html",
  "applications.html",
  "about.html",
  "catalog.html",
  "assets/css/ty-home.css",
  "assets/css/ty-product.css",
  "assets/css/ty-knowledge.css",
  "assets/css/ty-resources.css",
  "assets/css/ty-general.css",
  "assets/js/visual-behavior.js",
  "products/high-voltage-power-transformer/index.html",
  "products/oil-immersed-distribution-transformer/index.html",
  "products/prefabricated-substations/index.html",
  "products/110kv-power-transformer/index.html",
  "products/dry-type-distribution-transformer/index.html",
  "products/pv-ess-integrated-substation/index.html",
];
required.forEach(requireFile);

const directory = read("products.html");
for (const text of ["Power Transformers", "Distribution Transformers", "Prefabricated Substations"]) requireText("products.html", text);
for (const retired of ['id="oil-immersed-transformers"', 'id="dry-type-transformers"', ">Oil-Immersed Transformers<", ">Dry-Type Transformers<"]) {
  if (directory.includes(retired)) throw new Error(`Products directory still exposes retired top-level family: ${retired}`);
}
if ((directory.match(/data-product-slide=/g) || []).length !== 3) throw new Error("Products landing hero must contain exactly three family slides.");
for (const familyId of ["power-transformers", "distribution-transformers", "prefabricated-substations"]) {
  if (!directory.includes(`id="${familyId}"`)) throw new Error(`Products directory missing family section: ${familyId}`);
}
if (directory.includes('id="catalog-2026-additions"') || directory.includes('Additional product platforms')) {
  throw new Error('Catalog products must be placed inside existing product families.');
}
const powerGroup = directory.split('id="power-transformers"')[1]?.split('id="distribution-transformers"')[0] || '';
const distributionGroup = directory.split('id="distribution-transformers"')[1]?.split('id="prefabricated-substations"')[0] || '';
if (!powerGroup.includes('oil-immersed-split-winding-transformer/')) throw new Error('Split-winding transformer is missing from Power Transformers.');
for (const slug of ['sz20-on-load-oil-immersed-transformer','intelligent-low-noise-dry-type-transformer','zbs-rectifier-transformer']) {
  if (!distributionGroup.includes(`products/${slug}/`)) throw new Error(`${slug} is missing from Distribution Transformers.`);
}
for (const slug of ['oil-immersed-split-winding-transformer','sz20-on-load-oil-immersed-transformer','intelligent-low-noise-dry-type-transformer','zbs-rectifier-transformer']) {
  const image=`assets/media/products/catalog-v8/${slug}.webp`;
  if (!directory.includes(image) || !exists(image)) throw new Error(`${slug} is missing its catalog product image.`);
}
if (directory.includes("Choose between power transformers, distribution transformers and prefabricated substations")) {
  throw new Error("Products directory still contains the removed product-family explainer.");
}
if (!directory.includes("Oil-immersed and dry-type transformers up to 35 kV")) {
  throw new Error("Products directory is missing the consolidated up-to-35-kV distribution-family description.");
}

const distributionFamilyRel = "products/oil-immersed-distribution-transformer/index.html";
const distributionFamily = read(distributionFamilyRel);
for (const text of [
  "Oil-Immersed Distribution Transformer",
  "Dry-Type Distribution Transformer",
  "Representative Parameters",
  "35 kV-class / renewable collection range",
  "30 kVA–12.5 MVA",
]) {
  if (!distributionFamily.includes(text)) throw new Error(`${distributionFamilyRel} missing consolidated oil-distribution content: ${text}`);
}
if ((distributionFamily.match(/data-product-slide/g) || []).length !== 7) {
  throw new Error("Consolidated oil-immersed distribution page should expose all seven mapped product images.");
}
if (!distributionFamily.includes("width:auto!important") || !distributionFamily.includes("height:auto!important") || !distributionFamily.includes("object-fit:contain!important")) {
  throw new Error("Oil-distribution carousel images must preserve intrinsic aspect ratio in the generated HTML.");
}
if (/12 kV Oil-Immersed Distribution Transformer|40\.5 kV-Class Renewable Oil-Immersed/i.test(distributionFamily)) {
  throw new Error("Consolidated oil-distribution page still uses a voltage-defined product identity.");
}
if (/includes 22 kV tested reference/i.test(distributionFamily)) {
  throw new Error("Oil-distribution hero still over-emphasizes the 22 kV tested reference.");
}

const pageCss = ['ty-home.css', 'ty-product.css', 'ty-knowledge.css', 'ty-resources.css', 'ty-general.css']
  .map((name) => read(`assets/css/${name}`)).join('');
if (!pageCss.includes("object-fit:contain")) throw new Error("Product images must preserve their complete-image fit rules.");

const prohibitedSource = path.join(root, "source-media", "products", "products", "小型油浸式配变 (1).JPG");
if (fs.existsSync(prohibitedSource)) throw new Error("Prohibited small oil distribution transformer source image still exists.");
if (exists("assets/media/products/classified/12kv-oil-immersed-distribution-transformer/01.jpg")) {
  throw new Error("Generated site still contains the prohibited small oil distribution transformer as the first classified image.");
}
if (exists("assets/media/applications/floating-solar-combined-transformer-site.webp")) {
  throw new Error("Forbidden floating-solar combined-transformer photograph remains in generated assets.");
}
const oilMediaDir = path.join(dist, "assets", "media", "products", "classified", "oil-immersed-distribution-transformer");
if (!fs.existsSync(oilMediaDir) || fs.readdirSync(oilMediaDir).filter((name) => /\.(?:png|jpe?g|webp)$/i.test(name)).length !== 7) {
  throw new Error("Oil-distribution media directory should contain all seven mapped product images.");
}
for (const expected of ["01.png", "02.webp", "03.webp", "04.webp", "05.jpeg", "06.jpeg", "07.jpeg"]) {
  if (!fs.existsSync(path.join(oilMediaDir, expected))) throw new Error(`Oil-distribution media is missing restored source image: ${expected}`);
}

for (const redCover of [
  "assets/media/products/classified/zgs-prefabricated-substation/01.png",
  "assets/media/products/classified/yb-prefabricated-substation/01.png",
  "assets/media/products/classified/ybh-prefabricated-substation/01.png",
]) {
  if (directory.includes(redCover)) throw new Error(`Products directory still uses captioned prefabricated-substation cover: ${redCover}`);
}
const prefabFamily = read("products/prefabricated-substations/index.html");
for (const cleanCover of [
  "classified/zgs-prefabricated-substation/02.webp",
  "classified/yb-prefabricated-substation/02.webp",
  "classified/ybh-prefabricated-substation/02.jpeg",
]) {
  if (!prefabFamily.includes(cleanCover)) throw new Error(`Prefabricated-substation family is missing restored clean media: ${cleanCover}`);
}
for (const slug of ["zgs-prefabricated-substation", "yb-prefabricated-substation", "ybh-prefabricated-substation"]) {
  const rel = `products/${slug}/index.html`;
  const html = read(rel);
  if (html.includes(`classified/${slug}/01.png`)) throw new Error(`${rel} still uses the captioned catalog image in its hero carousel.`);
}

const productsRoot = path.join(dist, "products");
const supplementalDetails = new Map([
  ['sz20-on-load-oil-immersed-transformer', ['SZ20 published series parameters', '<td>2,500</td>', '16,960', '±4 × 2.5%']],
  ['oil-immersed-split-winding-transformer', ['SZ-50000/110', '110 / 6.3 / 6.3 kV', 'YNd11d11', 'Contract example']],
  ['intelligent-low-noise-dry-type-transformer', ['intelligent terminal', 'Family-level dry-type catalog reference', 'sound level']],
  ['zbs-rectifier-transformer', ['ZS-8000/10-0.66', '8,000 / 4,000 / 4,000 kVA', 'Dy11d0', 'Contract example']]
]);
for (const [slug, facts] of supplementalDetails) {
  const rel = `products/${slug}/index.html`;
  const html = read(rel);
  for (const marker of ['ty-product.css', 'class="ty-product__hero c8d-hero"', 'ty-system__detail-jump', 'id="ratings"', 'id="engineering"', 'id="applications"', 'id="documents"', 'id="contact-rfq"', ...facts]) {
    if (!html.includes(marker)) throw new Error(`${rel} missing source-backed product detail: ${marker}`);
  }
  if (html.includes('>Product Overview<') || html.includes('21M2078-S')) throw new Error(`${rel} has a removed or inherited section.`);
}
let detailCount = 0;
for (const entry of fs.readdirSync(productsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const rel = `products/${entry.name}/index.html`;
  if (!exists(rel)) continue;
  const html = read(rel);
  if (html.includes('id="product-overview"') || html.includes('catalog-v8-intro') || html.includes('>Product Overview<')) {
    throw new Error(`${rel} still contains the removed Product Overview section.`);
  }
  if (!html.includes('<section class="ty-product__hero">') || html.includes("ty-product__family-hero")) continue;
  detailCount += 1;
  const catalogV8 = new Set(["sz20-on-load-oil-immersed-transformer", "oil-immersed-split-winding-transformer", "intelligent-low-noise-dry-type-transformer", "zbs-rectifier-transformer"]);
  if (catalogV8.has(entry.name)) {
    for (const marker of ['id="ratings"', 'id="applications"', 'id="documents"', 'id="contact-rfq"', "visual-behavior.js"]) {
      if (!html.includes(marker)) throw new Error(`${rel} missing catalog detail marker: ${marker}`);
    }
    if (html.includes("21M2078-S")) throw new Error(`${rel} incorrectly inherits 110 kV tested-model evidence.`);
    continue;
  }
  const styles = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]);
  for (const href of ["../../assets/css/ty-product.css"]) {
    if (!styles.includes(href)) throw new Error(`${rel} missing unified stylesheet: ${href}`);
  }
  for (const marker of ["phase1-detail", "ty-system__detail-jump", 'id="ratings"', 'id="applications"', 'id="engineering"', 'id="documents"', 'id="related"', 'id="contact-rfq"', "data-product-hero", "data-product-slide", "visual-behavior.js"]) {
    if (!html.includes(marker)) throw new Error(`${rel} missing detail-layout marker: ${marker}`);
  }
  if (!/<img\b[^>]*src="[^"]*assets\/media\//i.test(html)) throw new Error(`${rel} is missing product media.`);
  for (const forbidden of ["floating-solar-combined-transformer-site", "american-combined-transformer-03", "小型油浸式配变 (1)"]) {
    if (html.includes(forbidden)) throw new Error(`${rel} references forbidden product media: ${forbidden}`);
  }
}
if (detailCount < 20) throw new Error(`Expected at least 20 concrete product detail pages; found ${detailCount}.`);

const mergedChildren = [
  "66kv-offshore-wind-nacelle-transformer",
  "220kv-double-split-booster-transformer",
  "40-5kv-new-energy-dry-type-transformer",
  "24-pulse-phase-shifting-transformer",
];
for (const slug of mergedChildren) {
  const re = new RegExp(`<a\\b[^>]*class=["'][^"']*ty-product__platform-card[^"']*["'][^>]*href=["'][^"']*${slug}\\/?["']`, "i");
  if (re.test(directory)) throw new Error(`Products directory still exposes merged child ${slug} as a standalone image card.`);
}
for (const [parent, text] of [
  ["66kv-power-transformer", "66 kV Offshore Wind Configuration"],
  ["220kv-power-transformer", "Double-Split Booster Configuration"],
  ["cast-resin-dry-type-transformer", "Configurations available within the parent product"],
]) {
  requireText(`products/${parent}/index.html`, text);
}

const detail110 = read("products/110kv-power-transformer/index.html");
for (const text of ["SSZ-6300~63000/110", "21M2078-S", "SZ22-50000/110-NX1", "Reference outline drawing"]) {
  if (!detail110.includes(text)) throw new Error(`110 kV reference page lost source-backed content: ${text}`);
}
const ratingTable = detail110.match(/<h3[^>]*>Rating Range<\/h3>[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/)?.[1] || "";
if ((ratingTable.match(/<tr>/g) || []).length !== 11) throw new Error("110 kV Rating Range should retain 11 rows.");

const rootIndex = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (!rootIndex.includes('<base href="dist/">')) throw new Error("Root index mirror is missing the dist base path.");
if (!rootIndex.includes('<head><base href="dist/">')) throw new Error("Root index mirror must set its base path before stylesheet links.");
for (const [label, html] of [["dist homepage", read("index.html")], ["root homepage", rootIndex]]) {
  for (const marker of ['data-energy-flow', 'class="ty-editorial__hero"', 'class="ty-editorial__hero-media"', 'assets/css/ty-home.css']) {
    if (!html.includes(marker)) throw new Error(`${label} is missing Industrial Editorial marker: ${marker}`);
  }
}
if (!exists('assets/css/ty-home.css')) throw new Error('Homepage stylesheet is missing.');
const homeHtml = read("index.html");
const localWorldMap = "assets/media/applications/blank-world-map-robinson.svg";
if (!homeHtml.includes(`class="ty-proof__world-base" src="${localWorldMap}"`)) throw new Error("Homepage world map is not using its local base image.");
if (!exists(localWorldMap)) throw new Error("Homepage world map base image is missing.");
for (const [label, html] of [["dist homepage", homeHtml], ["root homepage", rootIndex]]) {
  for (const marker of ['class="ty-editorial__home-products"', 'class="ty-editorial__family-links"', 'class="ty-editorial__feature-grid"']) {
    if (!html.includes(marker)) throw new Error(`${label} is missing product-led homepage marker: ${marker}`);
  }
  if ((html.match(/class="ty-editorial__feature-grid"/g) || []).length !== 1) throw new Error(`${label} should have one curated product feature grid.`);
  if (html.includes('data-product-showcase')) throw new Error(`${label} still has the moving product row.`);
}

// The site is also opened directly from index.html as a local file. In that
// mode, Chromium shows a directory listing instead of opening its index.html.
const htmlFiles = [];
function collectHtml(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const absolute = path.join(folder, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "assets") collectHtml(absolute);
    } else if (entry.name.endsWith(".html")) htmlFiles.push(absolute);
  }
}
collectHtml(dist);
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const [, href] of html.matchAll(/\bhref="([^"?#]+\/)"/g)) {
    if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith("//")) continue;
    const target = path.resolve(path.dirname(file), href);
    if (target.startsWith(dist + path.sep) && fs.existsSync(path.join(target, "index.html"))) {
      throw new Error(`Local-file navigation would open a directory: ${path.relative(dist, file)} -> ${href}`);
    }
  }
}
for (const [, href] of directory.matchAll(/<a class="(?:ty-product__platform-card|catalog-v8-family-card)" href="([^"]+)"/g)) {
  if (!fs.existsSync(path.resolve(dist, href))) throw new Error(`Product card has no target file: ${href}`);
}

console.log(`Smoke check passed: three-family product architecture, consolidated oil/dry distribution family, restored 7-image oil-distribution carousel with intrinsic-ratio protection, expanded voltage coverage, complete-image detail heroes, clean prefabricated-substation media, prohibited-image removal, ${detailCount} detail pages, and preserved 110 kV ratings.`);
