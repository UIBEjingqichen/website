import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "dist", "catalog.html");
const cssTarget = path.join(root, "dist", "assets", "css", "catalog-layout-v7.css");

if (!fs.existsSync(catalogPath)) throw new Error("dist/catalog.html is missing.");
let html = fs.readFileSync(catalogPath, "utf8");

if (!html.includes("catalog-layout-v7.css")) {
  html = html.replace("</head>", `  <link rel="stylesheet" href="assets/css/catalog-layout-v7.css">\n</head>`);
}

// Marketing photography must use workbook/company media, not report sample screenshots.
html = html
  .replaceAll("assets/media/products/power-transformer-220kv-240mva-ssz22.webp", "assets/media/product-oil-immersed-power-transformer.png")
  .replaceAll("assets/media/products/power-transformer-132kv-150mva.webp", "assets/media/product-oil-immersed-energy-saving-transformer.jpeg")
  .replaceAll("assets/media/products/dry-type-transformer-scb18-2500.webp", "assets/media/product-dry-type-transformer-red.jpeg")
  .replaceAll("assets/media/products/dry-type-transformer-scb18-1000.webp", "assets/media/product-cast-resin-dry-type-transformer.jpeg")
  .replaceAll(
    "Product pages present series ratings, tested reference configurations, certificates and test reports, engineering drawings and project applications together with the technical information required for quotation.",
    "Product pages present series ratings, tested reference configurations, engineering drawings and project applications together with the technical information required for quotation. Certificates and test reports are presented once in the Quality & Certification section."
  );

// Remove every previously generated certificate section. Certificates are shown only once near the front.
html = html.replace(/<section class="catalog-sheet quality-sheet[^"]*"[^>]*>[\s\S]*?<\/section>\s*/g, "");
html = html.replace(/<section class="catalog-sheet catalog-certificate-sheet">[\s\S]*?<\/section>\s*/g, "");

const certificates = [
  ["oil-distribution-1600kva-tuv-p001.webp", "TÜV Certificate of Conformity", "S-M-1600/22-Tier2", "AK 50683814 0001", "1600 kVA · 22 / 0.42 kV"],
  ["oil-distribution-1600kva-type-test-p001.webp", "IEC Complete Type Test Report", "S-M-1600/22-Tier2", "CN25ZJN4 001", "1600 kVA · 22 / 0.42 kV"],
  ["oil-distribution-1600kva-efficiency-p001.webp", "Tier 2 Efficiency Test Report", "S-M-1600/22-Tier2", "CN25NEY4 001", "1600 kVA · 22 / 0.42 kV"],
  ["oil-distribution-1600kva-ce-p001.webp", "CE / Ecodesign Verification", "S-M-1600/22-Tier2", "CN25NEY4 001", "1600 kVA · 22 / 0.42 kV"],
  ["power-transformer-50mva-110kv-p001.webp", "Power Transformer Test Report", "SZ22-50000/110-NX1", "21M2078-S", "50 MVA · 110 kV"],
  ["power-transformer-150mva-132kv-p001.webp", "Power Transformer Test Report", "SFZ-150000/132", "21M2079-S", "150 MVA · 132 kV"],
  ["power-transformer-240mva-220kv-ssz20-p001.webp", "Power Transformer Type Test Report", "SSZ20-240000/220", "21M0905-S", "240 MVA · 220 kV"],
  ["power-transformer-240mva-220kv-ssz22-p001.webp", "Power Transformer Test Report", "SSZ22-240000/220-NX1", "23M1317-S", "240 MVA · 220 kV"],
  ["dry-type-scb18-2500kva-10kv-p001.webp", "Dry-Type Transformer Type Test Report", "SCB18-2500/10", "26N0286-S", "2500 kVA · 10 kV"],
  ["european-substation-12500kva-35kv-p001.webp", "Prefabricated Substation Type Test Report", "YB-40.5/1.14-12500", "26XB0131-S", "12500 kVA · 35 kV"],
  ["china-substation-12500kva-35kv-p001.webp", "GY Series Substation Type Test Report", "YB-40.5/1.14-12500 (GY)", "23XB0332-S", "12500 kVA · 35 kV"],
  ["china-substation-10000kva-35kv-p001.webp", "GY Series Substation Type Test Report", "YB-40.5-10000", "26XB0129-S", "10000 kVA · 35 kV"]
];

const certCard = ([file, type, model, report, rating]) => `<article class="catalog-front-certificate"><figure><img src="assets/media/catalog-assets/certifications/${file}" alt="${type} ${model}" loading="lazy"></figure><div><strong>${type}</strong><span>${model}</span><small>${rating}<br>${report}</small></div></article>`;
const certPages = [0, 1, 2].map((page) => {
  const group = certificates.slice(page * 4, page * 4 + 4);
  return `<section class="catalog-sheet catalog-front-certificate-sheet"${page === 0 ? ' id="quality"' : ''}>
    <span class="catalog-page-no">C${page + 1}</span>
    <div class="sheet-head compact-sheet-head"><p>QUALITY &amp; CERTIFICATION</p><h2>Certificates &amp; Test Reports</h2><span>Selected independent certificates and test reports for tested reference configurations.</span></div>
    <div class="catalog-front-certificate-grid">${group.map(certCard).join("")}</div>
  </section>`;
}).join("\n");

// Insert the three certificate pages once, immediately after manufacturing.
const manufacturingMarker = 'id="manufacturing"';
const manufacturingAt = html.indexOf(manufacturingMarker);
if (manufacturingAt >= 0) {
  const manufacturingEndTag = html.indexOf("</section>", manufacturingAt);
  if (manufacturingEndTag >= 0) {
    const insertAt = manufacturingEndTag + "</section>".length;
    html = html.slice(0, insertAt) + "\n" + certPages + html.slice(insertAt);
  }
}

// Split every existing engineering-drawing sheet so that one drawing occupies one page.
html = html.replace(/<section class="catalog-sheet catalog-drawing-sheet">([\s\S]*?)<\/section>/g, (section, body) => {
  const title = body.match(/<h2>([\s\S]*?)<\/h2>/)?.[1] || "Engineering Drawing";
  const figures = body.match(/<figure>[\s\S]*?<\/figure>/g) || [];
  if (!figures.length) return section;
  return figures.map((figure, index) => `<section class="catalog-sheet catalog-drawing-sheet catalog-single-drawing-sheet">
    <div class="sheet-head compact-sheet-head"><p>ENGINEERING DRAWING</p><h2>${title}</h2><span>Reference drawing · ${index + 1} / ${figures.length}</span></div>
    <div class="catalog-single-drawing">${figure}</div>
  </section>`).join("\n");
});

fs.copyFileSync(path.join(__dirname, "catalog-layout-v7.css"), cssTarget);
fs.writeFileSync(catalogPath, html);
console.log("Catalog V7: 3 front certificate pages, no product-level certificate duplication, smaller marketing images, and one drawing per page.");
