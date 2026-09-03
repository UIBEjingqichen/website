import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.resolve(__dirname, "..", "dist", "catalog.html");
if (!fs.existsSync(catalogPath)) throw new Error("dist/catalog.html is missing.");

let html = fs.readFileSync(catalogPath, "utf8");

html = html
  .replaceAll('<a href="#projects">Applications & Projects</a>', '')
  .replaceAll('<a href="#projects">Applications &amp; Projects</a>', '')
  .replaceAll('<a href="#projects"><strong>Applications & Projects</strong></a>', '')
  .replaceAll('<a href="#projects"><strong>Applications &amp; Projects</strong></a>', '');

html = html.replace(
  'An integrated transformer package placing the transformer body, high-voltage load switch and fuse components within a compact oil-filled assembly. The workbook records a ZGS22-4000/35/0.8 certificate item, but the separate PDF asset has not been supplied.',
  'An integrated outdoor transformer package combining the transformer body, high-voltage switching and fuse protection in a compact oil-filled assembly. The ZGS22-4000/35/0.8 reference configuration is supported by Type Test Report 24XB0336-S.'
);

html = html.replace(
  'The current validated reference is ZGS22-4000/35/0.8, rated 4,000 kVA at 37 / 0.8 kV. The supplied type-test report references the IEC 60076 series and IEC/IEEE 60076-16 and includes short-circuit, lightning-impulse and protection-degree evidence. Final cable arrangement, switching scheme, protection, enclosure and site conditions remain subject to project engineering.',
  'The current validated reference is ZGS22-4000/35/0.8, rated 4,000 kVA at 37 / 0.8 kV. Type Test Report 24XB0336-S references the IEC 60076 series and IEC/IEEE 60076-16, and includes short-circuit and lightning-impulse testing. The report also records IP65 protection for the high- and low-voltage compartments, IP68 for the transformer section, and high-altitude evaluation using a 5,000 m reference condition. Final cable arrangement, switching scheme, protection, enclosure and site conditions remain subject to project engineering.'
);

fs.writeFileSync(catalogPath, html);
console.log("Catalog V4.1 cleanup: removed obsolete global project links and updated pad-mounted evidence copy.");
