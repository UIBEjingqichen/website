import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.resolve(__dirname, "..", "dist", "catalog.html");
if (!fs.existsSync(catalogPath)) throw new Error("dist/catalog.html is missing.");

let html = fs.readFileSync(catalogPath, "utf8");

const replacements = new Map([
  ["A practical map of Tianyu&#39;s current export product range", "Transformer & Prefabricated Substation Product Portfolio"],
  ["Product families are grouped by engineering function. Tested models and reports are shown inside each family.", "Transformer and prefabricated substation solutions for utility, renewable-energy, industrial and infrastructure applications."],
  ["A concise overview of the manufacturing and testing chain currently documented for the website.", "Manufacturing and testing processes supporting transformer production and final verification."],
  ["Independent certificates and test reports are presented by tested model, rating and report number. This makes the evidence useful for technical review without implying that one report automatically covers every possible customized configuration.", "Independent certificates and test reports are identified by tested model, rating and report number. Product configurations are confirmed against the applicable technical specification and destination-market requirements."],
  ["Continuation of the model-specific certificate and test-report previews.", "Model-specific certificate and test-report records for the 630 kVA reference configuration."],
  ["Full-page previews are shown without cropping. Each record is tied to the model and report number printed below it.", "Certificates and test reports are identified by model, rating and report number."],
  ["Two drawings per page for legibility. These drawings reproduce reference configurations from the available report set.", "Engineering drawings reproduced from tested reference configurations. Final project drawings are issued after technical confirmation."],
]);

for (const [from, to] of replacements) html = html.replaceAll(from, to);

fs.writeFileSync(catalogPath, html);
console.log("Catalog V6.1: removed remaining author-facing catalog commentary.");
