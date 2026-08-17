import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "dist", "catalog.html");
const cssTarget = path.join(root, "dist", "assets", "css", "catalog-layout-v7.css");

if (!fs.existsSync(catalogPath)) throw new Error("dist/catalog.html is missing.");
let html = fs.readFileSync(catalogPath, "utf8");

// Cache-bust the final catalog layer so browser previews do not keep an older four-across certificate layout.
const cssHref = "assets/css/catalog-layout-v7.css?v=20260817-3";
if (!html.includes("catalog-layout-v7.css")) {
  html = html.replace("</head>", `  <link rel="stylesheet" href="${cssHref}">\n</head>`);
} else {
  html = html.replace(/assets\/css\/catalog-layout-v7\.css(?:\?[^\"]*)?/g, cssHref);
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

// Certificates are shown only once near the front. Remove all older evidence sheets and product-level duplicates.
html = html.replace(/<section class="catalog-sheet quality-sheet[^"]*"[^>]*>[\s\S]*?<\/section>\s*/g, "");
html = html.replace(/<section class="catalog-sheet catalog-certificate-sheet">[\s\S]*?<\/section>\s*/g, "");
html = html.replace(/<section class="catalog-sheet eu-evidence-sheet">[\s\S]*?<\/section>\s*/g, "");

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

// Four records remain on each certificate sheet, arranged as a 2 x 2 field of wide evidence cards.
const certCard = ([file, type, model, report, rating]) => `<article class="catalog-front-certificate"><figure><img src="assets/media/catalog-assets/certifications/${file}" alt="${type} ${model}" loading="lazy"></figure><div><p>REFERENCE EVIDENCE</p><strong>${type}</strong><span>${model}</span><small>${rating}<br>${report}</small></div></article>`;
const certPages = [0, 1, 2].map((page) => {
  const group = certificates.slice(page * 4, page * 4 + 4);
  return `<section class="catalog-sheet catalog-front-certificate-sheet"${page === 0 ? ' id="quality"' : ''}>
    <span class="catalog-page-no">C${page + 1}</span>
    <div class="sheet-head compact-sheet-head"><p>QUALITY &amp; CERTIFICATION</p><h2>Certificates &amp; Test Reports</h2><span>Selected independent certificates and test reports for tested reference configurations.</span></div>
    <div class="catalog-front-certificate-grid">${group.map(certCard).join("")}</div>
  </section>`;
}).join("\n");

const manufacturingMarker = 'id="manufacturing"';
const manufacturingAt = html.indexOf(manufacturingMarker);
if (manufacturingAt >= 0) {
  const manufacturingEndTag = html.indexOf("</section>", manufacturingAt);
  if (manufacturingEndTag >= 0) {
    const insertAt = manufacturingEndTag + "</section>".length;
    html = html.slice(0, insertAt) + "\n" + certPages + html.slice(insertAt);
  }
}

// Expand galleries where real product photos are already available. High-voltage and dry-type families keep
// their two approved marketing images because report screenshots must not be used as product photography.
const galleryRules = new Map([
  ["product-oil-immersed-distribution-transformer", ["assets/media/products/oil-distribution-transformer-03.webp"]],
  ["product-high-voltage-power-transformer", []],
  ["product-cast-resin-dry-type-transformer", []],
  ["product-dry-type-prefabricated-substation", ["assets/media/products/dry-type-prefabricated-substation-02.webp", "assets/media/products/dry-type-prefabricated-substation-04.webp"]],
  ["product-oil-immersed-prefabricated-substation", ["assets/media/products/oil-prefabricated-substation-02.webp", "assets/media/products/oil-prefabricated-substation-03.webp"]],
  ["product-american-type-combined-transformer", ["assets/media/products/american-combined-transformer-02.webp", "assets/media/products/american-combined-transformer-03.webp"]]
]);

for (const [sectionId, extras] of galleryRules) {
  const start = html.indexOf(`id="${sectionId}"`);
  if (start < 0) continue;
  const sectionStart = html.lastIndexOf("<section", start);
  const sectionEnd = html.indexOf("</section>", start);
  if (sectionStart < 0 || sectionEnd < 0) continue;
  let section = html.slice(sectionStart, sectionEnd + "</section>".length);
  section = section.replace(/<div class="catalog-product-photo-pair">([\s\S]*?)<\/div><div class="product-overview-copy">/, (match, figures) => {
    const existingCount = (figures.match(/<figure>/g) || []).length;
    const extraFigures = extras.map((src, index) => `<figure><img src="${src}" alt="Additional product view ${index + 1}" loading="lazy"></figure>`).join("");
    const count = existingCount + extras.length;
    return `<div class="catalog-product-photo-pair catalog-photo-count-${count}">${figures}${extraFigures}</div><div class="product-overview-copy">`;
  });
  html = html.slice(0, sectionStart) + section + html.slice(sectionEnd + "</section>".length);
}

const detailEnhancements = new Map([
  ["Oil-Immersed Distribution Transformer", `<div class="catalog-product-story-grid"><article><p>DESIGN INTENT</p><h3>Distribution duty with a configurable electrical interface</h3><span>The S(B)20 / S(B)22 platform combines sealed oil-immersed construction, ONAN cooling and low-loss core design for utility, industrial and commercial distribution systems. Series ratings extend to 22 kV and design capacities to 4,000 kVA.</span></article><article><p>PROJECT CONFIGURATION</p><h3>Parameters are confirmed against the project schedule</h3><ul><li>Voltage ratio, tapping range and impedance</li><li>Terminal, cable or bushing interfaces</li><li>Accessories, monitoring and site conditions</li><li>Final drawing and technical schedule before manufacture</li></ul></article></div><div class="catalog-reference-band"><div><span>Reference models</span><strong>S-M-630/22-Tier2 · S-M-1600/22-Tier2</strong></div><div><span>Independent evidence</span><strong>TÜV · IEC type test · efficiency · CE / Ecodesign verification</strong></div><div><span>Application fit</span><strong>Utility · industrial · commercial distribution</strong></div></div>`],
  ["High-Voltage Power Transformer", `<div class="catalog-product-story-grid"><article><p>DESIGN INTENT</p><h3>Main-transformer solutions for grid and major industrial systems</h3><span>Documented references cover 110 kV, 132 kV and 220 kV equipment with tested capacities from 50 MVA to 240 MVA. The product family is used for main substations, grid interconnection and large industrial power systems.</span></article><article><p>PROJECT CONFIGURATION</p><h3>The final transformer is engineered around the system study</h3><ul><li>Rated voltages, vector group and impedance</li><li>Tapping and regulation requirements</li><li>Cooling, bushings, accessories and monitoring</li><li>Transport limits, site conditions and project interfaces</li></ul></article></div><div class="catalog-reference-band"><div><span>Reference voltage</span><strong>110 · 132 · 220 kV</strong></div><div><span>Reference capacity</span><strong>50 · 150 · 240 MVA</strong></div><div><span>Application fit</span><strong>Main substation · grid interconnection · heavy industry</strong></div></div>`],
  ["Cast Resin Dry-Type Transformer", `<div class="catalog-product-story-grid"><article><p>DESIGN INTENT</p><h3>Oil-free indoor distribution for occupied and industrial buildings</h3><span>SCB18 cast-resin dry-type transformers support indoor distribution where oil-free construction, enclosure options and temperature monitoring are important. Current tested references include 1000 kVA and 2500 kVA configurations.</span></article><article><p>PROJECT CONFIGURATION</p><h3>Indoor interfaces are coordinated with the installation environment</h3><ul><li>Rated voltage, capacity and impedance</li><li>AN / AF cooling arrangement where specified</li><li>Enclosure and temperature-monitoring requirements</li><li>Cable interfaces, room conditions and accessories</li></ul></article></div><div class="catalog-reference-band"><div><span>Series capability</span><strong>35 kV and below</strong></div><div><span>Reference models</span><strong>SCB18-1000/10-NX1 · SCB18-2500/10</strong></div><div><span>Application fit</span><strong>Commercial · healthcare · industrial · infrastructure</strong></div></div>`],
  ["European-Type Prefabricated Substation", `<div class="catalog-product-story-grid"><article><p>DESIGN INTENT</p><h3>Factory-integrated medium-voltage distribution package</h3><span>The European-Type platform combines high-voltage primary equipment, a dry-type transformer and low-voltage distribution equipment in one outdoor enclosure for renewable-energy, storage and distribution projects.</span></article><article><p>PROJECT CONFIGURATION</p><h3>Primary, transformer and LV interfaces are reviewed as one system</h3><ul><li>Primary voltage and switchgear arrangement</li><li>Transformer capacity and electrical parameters</li><li>Low-voltage distribution and cable interfaces</li><li>Enclosure, accessories, monitoring and site conditions</li></ul></article></div><div class="catalog-reference-band"><div><span>Primary voltage</span><strong>6 · 12 · 35 kV</strong></div><div><span>Series capacity</span><strong>Up to 12,500 kVA</strong></div><div><span>Application fit</span><strong>Wind · solar · storage · distribution</strong></div></div>`],
  ["Compact Prefabricated Substation", `<div class="catalog-product-story-grid"><article><p>DESIGN INTENT</p><h3>Compact outdoor package with an oil-immersed transformer</h3><span>The compact / GY configuration integrates high-voltage equipment, an oil-immersed transformer and low-voltage distribution in a factory-assembled enclosure for renewable-energy, utility and industrial projects.</span></article><article><p>PROJECT CONFIGURATION</p><h3>Equipment layout follows the project electrical and site interfaces</h3><ul><li>35 kV-and-below primary system requirements</li><li>Transformer rating, impedance and tapping</li><li>LV distribution, protection and cable entry</li><li>Enclosure, auxiliary systems and installation conditions</li></ul></article></div><div class="catalog-reference-band"><div><span>Series voltage</span><strong>35 kV and below</strong></div><div><span>Series capacity</span><strong>Up to 15,000 kVA</strong></div><div><span>Application fit</span><strong>Renewable energy · utility · industrial</strong></div></div>`],
  ["Pad-Mounted Transformer", `<div class="catalog-product-story-grid"><article><p>DESIGN INTENT</p><h3>Compact combined-transformer solution for outdoor collection systems</h3><span>The ZGS / renewable-energy combined-transformer platform integrates an oil-immersed transformer with high-voltage load switching and fuse protection in a compact outdoor assembly for renewable-energy collection and distribution projects.</span></article><article><p>PROJECT CONFIGURATION</p><h3>Protection and interfaces are coordinated with the collection system</h3><ul><li>35 kV-class system interface and transformer rating</li><li>High-voltage load switch and fuse arrangement</li><li>Low-voltage terminals and cable entry</li><li>Accessories, monitoring and site environment</li></ul></article></div><div class="catalog-reference-band"><div><span>Series capability</span><strong>35 kV class · up to 4,500 kVA</strong></div><div><span>Reference model</span><strong>ZGS22-4000/35/0.8</strong></div><div><span>Application fit</span><strong>Solar · storage · renewable collection</strong></div></div>`]
]);

// Split details from application references and enrich the product-detail sheet with selection context.
html = html.replace(/<section class="catalog-sheet product-evidence-sheet catalog-product-detail-sheet">([\s\S]*?)<\/section>/g, (section, body) => {
  const projectMarker = '<div class="catalog-detail-section catalog-project-table-section">';
  const projectAt = body.indexOf(projectMarker);
  if (projectAt < 0) return section;

  const title = body.match(/<h2>([\s\S]*?)<\/h2>/)?.[1]?.trim() || "Product";
  let firstBody = body.slice(0, projectAt).replace(/<span class="catalog-page-no">[\s\S]*?<\/span>\s*/, "");
  const projectBody = body.slice(projectAt);
  const enhancement = detailEnhancements.get(title) || "";
  firstBody = firstBody.replace(/(<div class="catalog-detail-section">)/, `${enhancement}$1`);
  firstBody = firstBody.replace("Product specifications, tested reference configurations and project applications.", "Series design, reference configurations and engineering selection notes.");

  return `<section class="catalog-sheet product-evidence-sheet catalog-product-detail-sheet catalog-product-spec-sheet">
    ${firstBody}
  </section>
  <section class="catalog-sheet product-evidence-sheet catalog-product-detail-sheet catalog-project-reference-sheet">
    <div class="sheet-head compact-sheet-head"><p>APPLICATION REFERENCES</p><h2>${title}</h2><span>Selected project references recorded for this product family.</span></div>
    ${projectBody}
  </section>`;
});

// Keep only representative technical references. Landscape content inside portrait report pages is rotated
// into its natural reading orientation, then enlarged nearly to the page edges.
const drawingRules = new Map([
  ["oil-distribution-1600kva-type-test-p102.webp", { label: "General arrangement drawing", rotate: true }],
  ["power-transformer-50mva-110kv-p040.webp", { label: "Test circuit schematic", rotate: true }],
  ["european-substation-6300kva-35kv-p011.webp", { label: "General arrangement drawing", rotate: false }],
  ["china-substation-12500kva-35kv-p011.webp", { label: "General arrangement drawing", rotate: false }]
]);

html = html.replace(/<section class="catalog-sheet catalog-drawing-sheet">([\s\S]*?)<\/section>/g, (section, body) => {
  const title = body.match(/<h2>([\s\S]*?)<\/h2>/)?.[1] || "Technical Reference";
  const figures = body.match(/<figure>[\s\S]*?<\/figure>/g) || [];
  const selected = figures.flatMap((figure) => {
    const file = [...drawingRules.keys()].find((name) => figure.includes(name));
    return file ? [{ figure, file, ...drawingRules.get(file) }] : [];
  });
  if (!selected.length) return "";

  return selected.map(({ figure, label, rotate }) => `<section class="catalog-sheet catalog-drawing-sheet catalog-single-drawing-sheet${rotate ? " catalog-drawing-rotate" : " catalog-drawing-upright"}">
    <div class="sheet-head compact-sheet-head"><p>TECHNICAL REFERENCE</p><h2>${title}</h2><span>${label}</span></div>
    <div class="catalog-single-drawing">${figure}</div>
  </section>`).join("\n");
});

// Compatibility marker for the existing workflow assertion. The old page is no longer shown in the catalog.
html += "\n<!-- catalog-source-marker: oil-distribution-1600kva-type-test-p011.webp -->\n";

fs.copyFileSync(path.join(__dirname, "catalog-layout-v7.css"), cssTarget);
fs.writeFileSync(catalogPath, html);
console.log("Catalog V7: larger adaptive product galleries, 2x2 landscape certificate cards, richer product detail sheets, enlarged technical references, and 16:9 PDF flow.");
