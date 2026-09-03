import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const file = path.join(root, "dist", "index.html");

if (!fs.existsSync(file)) {
  console.log("Homepage UI finalization skipped: dist/index.html not found.");
  process.exit(0);
}

let html = fs.readFileSync(file, "utf8");

html = html.replace(
  "<p>Wholly-owned subsidiary of XJ Group Corporation under China Electrical Equipment Group Co., Ltd. A southern manufacturing base for primary electrical equipment of China Electrical Equipment Group Co., Ltd.</p>",
  ""
);

html = html.replace(
  /<h2 class="v3p-title">Browse by engineering family, then by voltage class<\/h2><p class="v3p-lead">Power transformers now open into 35, 66, 110 and 220 kV product pages\. Distribution, dry-type and prefabricated products use the same platform-based structure\.<\/p>/,
  '<h2 class="v3p-title">Browse by engineering family</h2>'
);

html = html.replace(
  'assets/media/applications/renewable-wind-solar-landscape.jpeg" alt="Tianyu Electric project reference"',
  'assets/media/applications/catalog-brazil-pv-export-project.png" alt="Tianyu Electric Brazil photovoltaic export project team"'
);

fs.writeFileSync(file, html, "utf8");
console.log("Homepage image, copy and product heading finalized.");
