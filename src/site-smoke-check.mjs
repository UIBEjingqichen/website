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
  "assets/css/visual-system.css",
  "assets/css/product-directory.css",
  "assets/css/product-detail.css",
  "assets/js/visual-behavior.js",
  "products/110kv-power-transformer/index.html",
  "products/cast-resin-dry-type-transformer/index.html",
  "products/dry-type-distribution-transformer/index.html",
  "products/oil-immersed-rectifier-transformer/index.html",
  "products/24-pulse-phase-shifting-transformer/index.html",
];
required.forEach(requireFile);

for (const text of ["Power Transformers", "Oil-Immersed Transformers", "Dry-Type Transformers", "Prefabricated Substations", "24-Pulse Phase-Shifting Transformer"]) {
  requireText("products.html", text);
}
const directory = read("products.html");
if (directory.includes('href="#special-transformers"') || directory.includes('id="special-transformers"')) {
  throw new Error("Products directory still exposes Special & Renewable as an active top-level family.");
}

requireText("products/cast-resin-dry-type-transformer/index.html", "Special Configurations");
requireText("products/cast-resin-dry-type-transformer/index.html", "24-Pulse Phase-Shifting Transformer");
requireText("products/oil-immersed-rectifier-transformer/index.html", 'id="24-pulse"');

const pulseRel = "products/24-pulse-phase-shifting-transformer/index.html";
for (const text of [
  "24-Pulse Phase-Shifting Transformer",
  "Dry-Type Reference Platform",
  "Project Engineered",
  "Representative dry-type family platform",
  "not provide a complete model-specific 24-pulse rating table or certificate",
]) requireText(pulseRel, text);
if (read(pulseRel).includes("Actual 24-Pulse Transformer")) {
  throw new Error("24-pulse page presents representative imagery as an actual model photograph.");
}

const detailCss = read("assets/css/product-detail.css");
if (!detailCss.includes("v42: product imagery lives in the hero carousel")) {
  throw new Error("Product-detail CSS is missing the v42 hero-carousel styles.");
}

const productsRoot = path.join(dist, "products");
let detailCount = 0;
for (const entry of fs.readdirSync(productsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const rel = `products/${entry.name}/index.html`;
  if (!exists(rel)) continue;
  const html = read(rel);
  if (!html.includes('<section class="v3p-hero">') || html.includes('v3p-family-hero')) continue;
  detailCount += 1;

  const styles = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]);
  const expectedStyles = ["../../assets/css/visual-system.css", "../../assets/css/product-detail.css"];
  if (styles.length !== 2) throw new Error(`${rel} should load exactly two detail stylesheets; found ${styles.length}.`);
  for (const href of expectedStyles) if (!styles.includes(href)) throw new Error(`${rel} missing unified stylesheet: ${href}`);
  for (const marker of ["phase1-detail", "vs-detail-jump", 'id="ratings"', 'id="applications"', 'id="engineering"', 'id="documents"', 'id="related"', 'id="contact-rfq"', "data-product-hero", "data-product-slide", "data-v41-reference-parameters", "visual-behavior.js"]) {
    if (!html.includes(marker)) throw new Error(`${rel} missing unified detail-layout marker: ${marker}`);
  }
  for (const retired of ['id="drawings"', 'href="#drawings"', "Product &amp; Engineering Views", "Product & Engineering Views", "Product Images &amp; Engineering Drawings", "Product Images & Engineering Drawings"]) {
    if (html.includes(retired)) throw new Error(`${rel} still contains retired lower-gallery content: ${retired}`);
  }
}
if (detailCount < 10) throw new Error(`Expected at least 10 concrete product detail pages; found ${detailCount}.`);

const detail110 = read("products/110kv-power-transformer/index.html");
for (const text of ["SSZ-6300~63000/110", "21M2078-S", "SZ22-50000/110-NX1", "Reference outline drawing"]) {
  if (!detail110.includes(text)) throw new Error(`110 kV reference page lost source-backed content: ${text}`);
}
const ratingTable = detail110.match(/<h3[^>]*>Rating Range<\/h3>[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/)?.[1] || "";
const ratingRows = (ratingTable.match(/<tr>/g) || []).length;
if (ratingRows !== 11) throw new Error(`110 kV Rating Range should retain 11 rows; found ${ratingRows}.`);

const rootIndex = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (!rootIndex.includes('<base href="dist/">')) throw new Error("Root index mirror is missing the dist base path.");

console.log(`Smoke check passed: four-family taxonomy, source-labeled parameter tables, ${detailCount} hero-carousel product pages, retired lower galleries, and preserved 110 kV ratings.`);
