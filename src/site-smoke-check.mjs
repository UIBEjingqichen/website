import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const read = (rel) => fs.readFileSync(path.join(dist, rel), "utf8");

const requiredFiles = [
  "index.html",
  "products.html",
  "manufacturing.html",
  "about.html",
  "applications.html",
  "catalog.html",
  "knowledge/index.html",
  "product-range-pages.json",
  "assets/css/site-typography.css",
  "assets/css/visual-system.css",
  "assets/css/home.css",
  "assets/css/product-directory.css",
  "assets/css/product-detail.css",
  "assets/css/manufacturing.css",
  "assets/js/visual-behavior.js",
  "assets/media/catalog-v3/ga-power-transformers.webp",
  "assets/media/catalog-v3/ga-distribution-renewable.webp",
  "products/35kv-power-transformer/index.html",
  "products/66kv-power-transformer/index.html",
  "products/110kv-power-transformer/index.html",
  "products/220kv-power-transformer/index.html",
  "products/12kv-oil-immersed-distribution-transformer/index.html",
  "products/dry-type-distribution-transformer/index.html",
  "products/zgs-prefabricated-substation/index.html",
  "products/pv-ess-integrated-substation/index.html",
];

for (const rel of requiredFiles) {
  if (!fs.existsSync(path.join(dist, rel))) throw new Error(`Missing generated file: ${rel}`);
}

const checks = [
  ["index.html", "85,243 m²"],
  ["index.html", "phase1-home"],
  ["index.html", "data-ty16-filter"],
  ["index.html", "data-phase1-evidence-shelf"],
  ["about.html", "85,243 m²"],
  ["manufacturing.html", "85,243 m²"],
  ["manufacturing.html", "phase1-manufacturing"],
  ["manufacturing.html", "Routine Tests"],
  ["manufacturing.html", "Witness FAT"],
  ["products.html", "Power Transformers"],
  ["products.html", "Distribution Transformers"],
  ["products.html", "Special &amp; Renewable Transformers"],
  ["products.html", "Prefabricated Substations"],
  ["products.html", "phase1-products"],
  ["products.html", "data-product-toggle"],
  ["products/35kv-power-transformer/index.html", "8–31.5 MVA"],
  ["products/66kv-power-transformer/index.html", "6.3–63 MVA"],
  ["products/110kv-power-transformer/index.html", "SSZ-6300~63000/110"],
  ["products/110kv-power-transformer/index.html", "110 / 115 / 121 kV"],
  ["products/110kv-power-transformer/index.html", "6.3–63 MVA"],
  ["products/110kv-power-transformer/index.html", "21M2078-S"],
  ["products/110kv-power-transformer/index.html", "SZ22-50000/110-NX1"],
  ["products/110kv-power-transformer/index.html", "phase1-detail"],
  ["products/220kv-power-transformer/index.html", "240,000 kVA"],
  ["catalog.html", "Tianyu Electric Export Product Catalog 2026"],
  ["index.html", "rel=\"canonical\""],
  ["about.html", "site-typography.css"],
  ["knowledge/index.html", "site-typography.css"],
];
for (const [rel, needle] of checks) {
  if (!read(rel).includes(needle)) throw new Error(`${rel} is missing expected content: ${needle}`);
}

const migratedPages = [
  ["index.html", ["assets/css/visual-system.css", "assets/css/home.css"]],
  ["products.html", ["assets/css/visual-system.css", "assets/css/product-directory.css"]],
  ["products/110kv-power-transformer/index.html", ["../../assets/css/visual-system.css", "../../assets/css/product-detail.css"]],
  ["manufacturing.html", ["assets/css/visual-system.css", "assets/css/manufacturing.css"]],
];

for (const [rel, expected] of migratedPages) {
  const html = read(rel);
  const styles = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
  if (styles.length !== 2) throw new Error(`${rel} should load exactly two stylesheets, found ${styles.length}`);
  for (const href of expected) if (!styles.includes(href)) throw new Error(`${rel} missing stylesheet ${href}`);
  if (html.includes("site-typography.css")) throw new Error(`${rel} still loads the legacy typography override`);
  if (!html.includes("visual-behavior.js")) throw new Error(`${rel} missing phase-one interaction script`);
}

const home = read("index.html");
const homeH1Count = (home.match(/<h1\b/g) || []).length;
if (homeH1Count !== 1) throw new Error(`Homepage should contain one semantic H1, found ${homeH1Count}`);

const detail = read("products/110kv-power-transformer/index.html");
const ratingTable = detail.match(/<h3[^>]*>Rating Range<\/h3>[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/)?.[1] || "";
const ratingRows = (ratingTable.match(/<tr>/g) || []).length;
if (ratingRows !== 11) throw new Error(`110 kV Rating Range should retain 11 rows, found ${ratingRows}`);
if (!detail.includes("Reference outline drawing")) throw new Error("110 kV detail lost reference-drawing labeling");
if (!detail.includes("not presented as certification of the full 110 kV product family")) throw new Error("110 kV model-specific report scope note is missing");

if (read("manufacturing.html").includes("manufacturing-v34.js")) throw new Error("Manufacturing counter-animation script is still loaded");

for (const rel of ["products.html", "applications.html", "about.html"]) {
  if (read(rel).includes("images.unsplash.com")) throw new Error(`${rel} still references Unsplash.`);
}

const rootIndex = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (!rootIndex.includes('<base href="dist/">')) throw new Error("Root index mirror is missing the dist base path");
const normalizedRoot = rootIndex.replace(/\s*<base href="dist\/">/, "");
if (normalizedRoot !== home) throw new Error("Root index mirror does not match generated homepage content");

console.log(`Smoke check passed: ${requiredFiles.length} required files, ${checks.length} content checks, four migrated stylesheet contracts and 11-row 110 kV rating table.`);
