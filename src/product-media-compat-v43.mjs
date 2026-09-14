import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const safeSource = path.join(root, "source-media", "products", "prefabricated-substations", "catalog-energy-storage-converter-booster-system.png");
const legacyTarget = path.join(root, "dist", "assets", "media", "applications", "floating-solar-combined-transformer-site.webp");

if (!fs.existsSync(safeSource)) {
  throw new Error(`Missing safe PV/ESS compatibility source: ${safeSource}`);
}

// site-v3-upgrade still validates the historical path before the final v43 media pass.
// Supply safe Tianyu catalog product artwork there temporarily. The final v43 pass
// replaces the hero with classified product media and removes this compatibility alias.
fs.mkdirSync(path.dirname(legacyTarget), { recursive: true });
fs.copyFileSync(safeSource, legacyTarget);
console.log("v43 compatibility: supplied safe PV/ESS product artwork at the legacy pre-finalization media path.");
