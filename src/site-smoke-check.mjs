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
for (const marker of ['data-v44-media-sync="true"', 'data-v45-product-media="true"', 'data-v46-three-family="true"']) {
  if (!directory.includes(marker)) throw new Error(`Products directory is missing architecture marker: ${marker}`);
}
if ((directory.match(/data-product-slide=/g) || []).length !== 3) throw new Error("Products landing hero must contain exactly three family slides.");
for (const familyId of ["power-transformers", "distribution-transformers", "prefabricated-substations"]) {
  if (!directory.includes(`id="${familyId}"`)) throw new Error(`Products directory missing family section: ${familyId}`);
}

const distributionFamilyRel = "products/oil-immersed-distribution-transformer/index.html";
const distributionFamily = read(distributionFamilyRel);
for (const text of ["Distribution Transformers", "Oil-Immersed Distribution Transformer", "Dry-Type Distribution Transformer", "v46-distribution-family", 'data-v46-three-family="true"']) {
  if (!distributionFamily.includes(text)) throw new Error(`${distributionFamilyRel} missing merged distribution-family content: ${text}`);
}
if ((distributionFamily.match(/class="v3p-platform-card"/g) || []).length !== 2) {
  throw new Error("Distribution family should expose exactly two image cards: oil-immersed and dry-type.");
}

for (const cssRel of ["assets/css/visual-system.css", "assets/css/product-directory.css", "assets/css/product-detail.css"]) {
  const css = read(cssRel);
  if (!css.includes("v45: full-bleed product media")) throw new Error(`${cssRel} is missing v45 media rules.`);
  if (!css.includes("v46: three-family architecture")) throw new Error(`${cssRel} is missing v46 three-family media rules.`);
}
const detailCss = read("assets/css/product-detail.css");
if (!detailCss.includes("height:500px")) throw new Error("Product detail hero media did not receive the larger v46 image stage.");

const prohibitedSource = path.join(root, "source-media", "products", "products", "小型油浸式配变 (1).JPG");
if (fs.existsSync(prohibitedSource)) throw new Error("Prohibited small oil distribution transformer source image still exists.");
if (exists("assets/media/products/classified/12kv-oil-immersed-distribution-transformer/01.jpg")) {
  throw new Error("Generated site still contains the prohibited small oil distribution transformer as the first classified image.");
}
if (exists("assets/media/applications/floating-solar-combined-transformer-site.webp")) {
  throw new Error("Forbidden floating-solar combined-transformer photograph remains in generated assets.");
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
let detailCount = 0;
for (const entry of fs.readdirSync(productsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const rel = `products/${entry.name}/index.html`;
  if (!exists(rel)) continue;
  const html = read(rel);
  if (!html.includes('<section class="v3p-hero">') || html.includes("v3p-family-hero")) continue;
  detailCount += 1;
  const styles = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]);
  for (const href of ["../../assets/css/visual-system.css", "../../assets/css/product-detail.css"]) {
    if (!styles.includes(href)) throw new Error(`${rel} missing unified stylesheet: ${href}`);
  }
  for (const marker of ["phase1-detail", "vs-detail-jump", 'id="ratings"', 'id="applications"', 'id="engineering"', 'id="documents"', 'id="related"', 'id="contact-rfq"', "data-product-hero", "data-product-slide", "data-v41-reference-parameters", "data-v43-classified-media", "visual-behavior.js"]) {
    if (!html.includes(marker)) throw new Error(`${rel} missing detail-layout marker: ${marker}`);
  }
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
  const re = new RegExp(`<a\\b[^>]*class=["'][^"']*v3p-platform-card[^"']*["'][^>]*href=["'][^"']*${slug}\\/?["']`, "i");
  if (re.test(directory)) throw new Error(`Products directory still exposes merged child ${slug} as a standalone image card.`);
}
for (const [parent, text] of [
  ["66kv-power-transformer", "66 kV Offshore Wind Configuration"],
  ["220kv-power-transformer", "Double-Split Booster Configuration"],
  ["cast-resin-dry-type-transformer", "Configurations grouped under the parent product"],
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

console.log(`Smoke check passed: three-family product architecture, merged oil/dry distribution family, enlarged detail imagery, clean prefabricated-substation media, prohibited-image removal, ${detailCount} detail pages, and preserved 110 kV ratings.`);
