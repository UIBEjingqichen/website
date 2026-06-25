import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const mediaDir = path.join(root, "source-media");

const imageRenameMap = [
  ["image58.jpeg", "hero-home-substation-grid.jpeg", "Home hero image and Why Us grid image"],
  ["image4.jpeg", "company-factory-campus.jpeg", "Company / Factory campus image"],
  ["image30.png", "product-oil-immersed-power-transformer.png", "Oil-Immersed Power Transformer category and product image"],
  ["image48.jpeg", "product-oil-immersed-energy-saving-transformer.jpeg", "Oil-Immersed Energy-Saving Transformer category and S20/SZ20 image"],
  ["image42.jpeg", "product-dry-type-transformer-red.jpeg", "Dry-Type Transformer category image"],
  ["image53.jpeg", "product-cast-resin-dry-type-transformer.jpeg", "Cast resin dry-type transformer detail image"],
  ["image36.jpeg", "product-amorphous-alloy-dry-type-transformer.jpeg", "Amorphous alloy dry-type transformer image"],
  ["image37.jpeg", "product-rectifier-transformer.jpeg", "Rectifier Transformer category and product image"],
  ["image133.jpeg", "product-special-transformer-container.jpeg", "Special Transformer category image"],
  ["image28.jpeg", "case-offshore-wind-project.jpeg", "Offshore wind project case image"],
  ["image117.jpeg", "case-renewable-energy-base.jpeg", "Renewable energy base case image"],
  ["image64.jpeg", "case-booster-substation.jpeg", "Booster substation case image"]
];

function copyIfNeeded(from, to) {
  const oldPath = path.join(mediaDir, from);
  const semanticPath = path.join(mediaDir, to);
  if (fs.existsSync(semanticPath)) {
    fs.copyFileSync(semanticPath, oldPath);
    console.log(`synced semantic -> legacy: ${to} -> ${from}`);
    return;
  }
  if (fs.existsSync(oldPath)) {
    fs.copyFileSync(oldPath, semanticPath);
    console.log(`created semantic copy: ${from} -> ${to}`);
    return;
  }
  console.warn(`missing both files: ${from} and ${to}`);
}

if (!fs.existsSync(mediaDir)) {
  throw new Error(`source-media folder not found: ${mediaDir}`);
}

for (const [legacyName, semanticName] of imageRenameMap) {
  copyIfNeeded(legacyName, semanticName);
}

console.log("Image naming sync complete. Edit the semantic filenames in source-media, then run this script before build.");
