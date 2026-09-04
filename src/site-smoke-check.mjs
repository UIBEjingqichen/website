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
  ["about.html", "85,243 m²"],
  ["manufacturing.html", "85,243 m²"],
  ["products.html", "Power Transformers"],
  ["products.html", "Distribution Transformers"],
  ["products.html", "Dry-Type Transformers"],
  ["products.html", "Prefabricated Substations"],
  ["products/35kv-power-transformer/index.html", "8–31.5 MVA"],
  ["products/66kv-power-transformer/index.html", "6.3–63 MVA"],
  ["products/110kv-power-transformer/index.html", "SSZ-6300~63000/110"],
  ["products/220kv-power-transformer/index.html", "240,000 kVA"],
  ["catalog.html", "Tianyu Electric Export Product Catalog 2026"],
  ["index.html", "rel=\"canonical\""],
];
for (const [rel, needle] of checks) {
  if (!read(rel).includes(needle)) throw new Error(`${rel} is missing expected content: ${needle}`);
}

for (const rel of ["products.html", "applications.html", "about.html"]) {
  if (read(rel).includes("images.unsplash.com")) throw new Error(`${rel} still references Unsplash.`);
}

console.log(`Smoke check passed: ${requiredFiles.length} files and ${checks.length} content checks.`);
