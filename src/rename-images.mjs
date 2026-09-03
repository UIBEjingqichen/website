import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const mediaDir = path.join(root, "source-media");

// V3 media library is canonical. This command validates names; it never recreates legacy imageXX aliases.
const requiredMedia = [
  "branding/og-tianyu-electric.png",
  "company/factory-campus-panorama.jpeg",
  "factory/combined-transformer-wiring-assembly.webp",
  "factory/dry-type-prefabricated-substation-assembly-01.webp",
  "factory/dry-type-prefabricated-substation-assembly-02.webp",
  "factory/oil-prefabricated-substation-assembly.webp",
  "products/combined-transformers/american-type-combined-transformer-busbar-interior.webp",
  "products/combined-transformers/american-type-combined-transformer-exterior-01.webp",
  "products/combined-transformers/american-type-combined-transformer-exterior-02.webp",
  "products/combined-transformers/american-type-combined-transformer-lv-cabinet-interior.webp",
  "products/distribution-transformers/oil-immersed-distribution-transformer-blue.jpeg",
  "products/distribution-transformers/oil-immersed-distribution-transformer-cable-connected-01.webp",
  "products/distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp",
  "products/distribution-transformers/oil-immersed-distribution-transformer-conservator-white.jpeg",
  "products/distribution-transformers/oil-immersed-distribution-transformer-green.jpeg",
  "products/distribution-transformers/oil-immersed-distribution-transformer-sealed-01.webp",
  "products/dry-type-transformers/amorphous-alloy-dry-type-transformer-with-fans.jpeg",
  "products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg",
  "products/dry-type-transformers/cast-resin-dry-type-transformer-red-02.jpeg",
  "products/dry-type-transformers/cast-resin-transformer-core-coil-assembly.jpeg",
  "products/dry-type-transformers/dry-type-transformer-coil-assembly-beige.jpeg",
  "products/dry-type-transformers/dry-type-transformer-red-tall-01.jpeg",
  "products/power-transformers/oil-immersed-power-transformer-installed.png",
  "products/power-transformers/oil-immersed-power-transformer-isolated-01.jpeg",
  "products/prefabricated-substations/compact-substation-blue-01.jpeg",
  "products/prefabricated-substations/compact-substation-green-01.jpeg",
  "products/prefabricated-substations/compact-substation-with-transformer-render.jpeg",
  "products/prefabricated-substations/containerized-substation-industrial-exterior.jpeg",
  "products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp",
  "products/prefabricated-substations/dry-type-prefabricated-substation-interior.webp",
  "products/prefabricated-substations/dry-type-prefabricated-substation-lineup.webp",
  "products/prefabricated-substations/integrated-prefabricated-substation-render.jpeg",
  "products/prefabricated-substations/integrated-substation-modules-render.jpeg",
  "products/prefabricated-substations/integrated-substation-white-exterior-01.jpeg",
  "products/prefabricated-substations/oil-prefabricated-substation-exterior-01.webp",
  "products/prefabricated-substations/oil-prefabricated-substation-hv-compartment-interior.webp",
  "products/prefabricated-substations/oil-prefabricated-substation-lv-cabinet-interior.webp",
  "products/prefabricated-substations/prefabricated-substation-white-showroom-01.jpeg",
  "products/prefabricated-substations/substation-complex-render.jpeg",
  "products/special-transformers/dry-type-rectifier-transformer-red.jpeg",
  "products/switchgear/control-cabinet-white-red-panel.jpeg",
  "products/switchgear/low-voltage-switchgear-gray.jpeg",
  "products/switchgear/medium-voltage-switchgear-cabinet-01.jpeg",
  "products/switchgear/medium-voltage-switchgear-cabinet-02.jpeg",
  "products/switchgear/medium-voltage-switchgear-three-panel.jpeg",
  "products/switchgear/ring-main-unit-blue-white.jpeg",
  "products/switchgear/ring-main-unit-orange.jpeg",
  "products/switchgear/ring-main-unit-white-01.jpeg",
  "products/switchgear/switchgear-cabinet-blue-gray.jpeg",
  "products/switchgear/switchgear-cabinet-white-03.jpeg",
  "products/switchgear/switchgear-cabinet-white-04.jpeg",
  "products/switchgear/switchgear-cabinet-white-black-panel.jpeg",
  "products/switchgear/switchgear-cabinet-white-blue-01.jpeg",
  "products/switchgear/switchgear-cabinet-white-green-01.jpeg",
  "products/switchgear/switchgear-cabinet-wide-white-01.jpeg",
  "products/switchgear/vacuum-circuit-breaker-compact-01.jpeg",
  "products/switchgear/vacuum-circuit-breaker-panel-01.jpeg",
  "products/switchgear/withdrawable-vacuum-circuit-breaker-01.jpeg"
];

const missing = requiredMedia.filter((relativePath) => !fs.existsSync(path.join(mediaDir, relativePath)));
if (missing.length) {
  throw new Error(`Missing canonical media: ${missing.join(", ")}`);
}

const legacy = fs.readdirSync(mediaDir).filter((name) => /^image\d+\.(?:jpe?g|png|webp)$/i.test(name));
if (legacy.length) {
  throw new Error(`Legacy root image aliases remain: ${legacy.join(", ")}`);
}

console.log(`Canonical media validation complete. Verified ${requiredMedia.length} marketing-capable assets.`);
