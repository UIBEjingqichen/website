import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "dist", "catalog.html");
const cssTarget = path.join(root, "dist", "assets", "css", "catalog-layout-v10.css");

if (!fs.existsSync(catalogPath)) throw new Error("dist/catalog.html is missing.");
let html = fs.readFileSync(catalogPath, "utf8");

const cssHref = "assets/css/catalog-layout-v10.css?v=20260819-1";
if (!html.includes("catalog-layout-v10.css")) {
  html = html.replace("</head>", `  <link rel="stylesheet" href="${cssHref}">\n</head>`);
} else {
  html = html.replace(/assets\/css\/catalog-layout-v10\.css(?:\?[^\"]*)?/g, cssHref);
}

html = html
  .replace('catalog-v9-overview"', 'catalog-v9-overview catalog-v10-overview"')
  .replace('catalog-v9-details"', 'catalog-v9-details catalog-v10-details"')
  .replace('catalog-v9-params"', 'catalog-v9-params catalog-v10-params"');

// Use the full-height product image in the reference panel instead of the tighter crop.
html = html.replace(
  /(<section class="catalog-sheet product-evidence-sheet catalog-product-detail-sheet catalog-product-spec-sheet catalog-v9-details catalog-v10-details">[\s\S]*?<figure><img src=")assets\/media\/products\/oil-distribution-transformer-01\.webp("[^>]*>)/,
  '$1assets/media/products/oil-distribution-transformer-02.webp$2'
);

// Replace internal-looking gap language with customer-facing reference coverage wording.
html = html.replace(
  /<div><span>Series data gap<\/span><strong>Full Tianyu capacity-by-capacity S\(B\)20 \/ S\(B\)22 performance table is not yet in the uploaded evidence set\.<\/strong><\/div>/,
  '<div><span>Reference coverage</span><strong>Third-party evidence applies to the stated tested configurations; project variants are confirmed separately against the technical schedule.</strong></div>'
);

// Use the remaining technical-page space for relevant test standards instead of leaving a blank lower field.
if (!html.includes('class="v10-standards-band"')) {
  html = html.replace(
    /(<section class="catalog-sheet catalog-core-params-sheet catalog-v9-params catalog-v10-params">[\s\S]*?<div class="v9-evidence-footer">[\s\S]*?<\/div><\/div>)(\s*<\/section>)/,
    `$1
  <div class="v10-standards-band"><div><span>Applicable test scope</span><strong>Oil-immersed transformer reference standards</strong></div><div class="v10-standard-list"><span>IEC 60076-1</span><span>IEC 60076-2</span><span>IEC 60076-3</span><span>IEC 60076-5</span><span>IEC 60076-10</span><span>EN 50708-2-4</span></div></div>$2`
  );
}

fs.copyFileSync(path.join(__dirname, "catalog-layout-v10.css"), cssTarget);
fs.writeFileSync(catalogPath, html);
console.log("Catalog V10: tightened overview footer, continuous detail grid, full product reference image, protected model-card widths and standards band.");
