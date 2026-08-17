import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const manifestPath = path.join(root, "source-media", "catalog-assets", "manifest.json");
const outDir = path.join(root, "catalog-content", "data");
const outPath = path.join(outDir, "drawings.generated.yaml");

if (!fs.existsSync(manifestPath)) {
  console.log("Catalog content sync skipped: certificate asset manifest is missing.");
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const productForDocument = (id) => {
  if (id.startsWith("oil-distribution-")) return "oil-immersed-distribution-transformer";
  if (id.startsWith("power-transformer-")) return "high-voltage-power-transformer";
  if (id.startsWith("dry-type-scb18-")) return "cast-resin-dry-type-transformer";
  if (id.startsWith("european-substation-")) return "dry-type-prefabricated-substation";
  if (id.startsWith("china-substation-")) return "oil-immersed-prefabricated-substation";
  if (id.startsWith("american-combined-")) return "american-type-combined-transformer";
  return "unmapped";
};

const quote = (value) => JSON.stringify(String(value));
const rows = [];
for (const doc of manifest.documents || []) {
  const drawings = doc.assets?.drawings || doc.drawings || [];
  for (const item of drawings) {
    const page = typeof item === "number" ? item : item.page;
    const file = typeof item === "number"
      ? `drawings/${doc.id}-p${String(item).padStart(3, "0")}.webp`
      : item.file;
    if (!file) continue;
    rows.push({
      id: `${doc.id}-p${String(page).padStart(3, "0")}`,
      productId: productForDocument(doc.id),
      documentId: doc.id,
      page,
      image: `../../source-media/catalog-assets/${file}`
    });
  }
}

const yaml = ["# Generated from source-media/catalog-assets/manifest.json", "drawings:"];
for (const row of rows) {
  yaml.push(`  - id: ${quote(row.id)}`);
  yaml.push(`    product_id: ${quote(row.productId)}`);
  yaml.push(`    document_id: ${quote(row.documentId)}`);
  yaml.push(`    source_page: ${row.page}`);
  yaml.push(`    image: ${quote(row.image)}`);
  yaml.push("    include_in_catalog: false");
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, yaml.join("\n") + "\n");
console.log(`Catalog content sync: wrote ${rows.length} drawing records to ${path.relative(root, outPath)}.`);
