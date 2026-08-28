import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const manufacturingPath = path.join(dist, "manufacturing.html");
const factoryPath = path.join(dist, "factory.html");
const catalogPath = path.join(dist, "catalog.html");

const oldCapacityNote = '<p class="reference-note">Specific equipment models and numeric production capacities will be published only after the verified equipment register is available.</p>';
const newCapacityNote = '<p class="reference-note">Published manufacturing and test-capability figures on this page are sourced from the 2026 Tianyu catalog. Project-specific production allocation and final test scope remain subject to engineering confirmation.</p>';

if (fs.existsSync(manufacturingPath)) {
  let html = fs.readFileSync(manufacturingPath, "utf8");
  html = html.replace(oldCapacityNote, newCapacityNote);
  fs.writeFileSync(manufacturingPath, html);
  // factory.html is a legacy alias. Keep it visually identical to the canonical manufacturing page.
  fs.writeFileSync(factoryPath, html);
}

if (fs.existsSync(catalogPath)) {
  let html = fs.readFileSync(catalogPath, "utf8");
  // Keep internal V3 naming out of the customer-facing toolbar.
  html = html.replaceAll("Tianyu Export Catalog V3", "Tianyu Export Catalog 2026");
  fs.writeFileSync(catalogPath, html);
}

for (const file of ["README2.txt", ".keep"]) {
  const generated = path.join(dist, "assets", "media", "catalog-v3", file);
  if (fs.existsSync(generated)) fs.rmSync(generated, { force: true });
}

console.log("Catalog V3 final QA normalization complete.");
