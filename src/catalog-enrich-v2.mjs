import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { products } from "./products-data.mjs";
import { documents } from "./documents-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const catalogPath = path.join(dist, "catalog.html");
const manifestPath = path.join(root, "source-media", "catalog-assets", "manifest.json");
const cssTarget = path.join(dist, "assets", "css", "catalog-enrich-v2.css");

const esc = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));
const media = (source) => `assets/media/${source}`;

const displayNames = {
  "oil-immersed-distribution-transformer": "Oil-Immersed Distribution Transformer",
  "high-voltage-power-transformer": "High-Voltage Power Transformer",
  "cast-resin-dry-type-transformer": "Cast Resin Dry-Type Transformer",
  "dry-type-prefabricated-substation": "European-Type Prefabricated Substation",
  "oil-immersed-prefabricated-substation": "Compact Prefabricated Substation",
  "american-type-combined-transformer": "Pad-Mounted Transformer"
};

const zgsEvidence = {
  id: "american-combined-transformer-24xb0336",
  title: "ZGS22-4000/35/0.8 Renewable Energy Combined Transformer Type Test Report",
  type: "type-test",
  productIds: ["american-type-combined-transformer"],
  issuer: "Suzhou Electrical Apparatus Science Research Institute",
  reportNo: "24XB0336-S",
  testedModel: "ZGS22-4000/35/0.8",
  ratedPower: "4000 kVA",
  ratedVoltage: "37 / 0.8 kV",
  standards: ["IEC 60076-1", "IEC 60076-2", "IEC 60076-3", "IEC 60076-5", "IEC 60076-10", "IEC/IEEE 60076-16"],
  tags: ["TYPE TEST", "IEC", "RENEWABLE ENERGY"],
  featured: true
};

const effectiveDocuments = [
  ...documents.filter((item) => item.id !== "american-combined-transformer-pending"),
  zgsEvidence
];

const standardsByDocument = {
  "oil-distribution-1600kva-tuv": ["IEC 60076-1/-2/-3/-5/-10", "EN 50708", "EN 50464"],
  "oil-distribution-630kva-tuv": ["IEC 60076-1/-2/-3/-5/-10", "EN 50708", "EN 50464"],
  "oil-distribution-1600kva-type-test": ["IEC 60076 series"],
  "oil-distribution-630kva-type-test": ["IEC 60076 series"],
  "oil-distribution-1600kva-efficiency": ["EN 50708-2-1", "EU Ecodesign Tier 2"],
  "oil-distribution-630kva-efficiency": ["EN 50708-2-1", "EU Ecodesign Tier 2"],
  "oil-distribution-1600kva-ce": ["Directive 2009/125/EC", "Regulation (EU) 2019/1783"],
  "oil-distribution-630kva-ce": ["Directive 2009/125/EC", "Regulation (EU) 2019/1783"],
  "dry-type-scb18-1000kva-10kv": ["IEC 60076-1/-3/-5/-10/-11"],
  "dry-type-scb18-2500kva-10kv": ["IEC 60076-1/-3/-5/-10/-11"],
  "european-substation-6300kva-35kv": ["IEC 62271-202:2022"],
  "european-substation-10000kva-35kv": ["IEC 62271-202:2022"],
  "european-substation-12500kva-35kv": ["IEC 62271-202:2022"],
  "china-substation-10000kva-35kv": ["IEC 62271-202:2022"],
  "china-substation-12500kva-35kv": ["IEC 62271-202:2022"],
  "american-combined-transformer-24xb0336": ["IEC 60076-1/-2/-3/-5/-10", "IEC/IEEE 60076-16"]
};

const documentTypeNames = {
  certificate: "Certificate of Conformity",
  "type-test": "Type Test Report",
  "test-report": "Test Report",
  "efficiency-report": "Efficiency Test Report",
  "ce-verification": "CE / Ecodesign Verification"
};

const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : { document_count: 20, documents: [] };
const manifestById = new Map((manifest.documents || []).map((item) => [item.id, item]));

function productNameById(id) {
  return displayNames[id] || products.find((item) => item.id === id)?.name || id;
}

function productById(id) {
  return products.find((item) => item.id === id);
}

function assetImagePath(file) {
  return media(`catalog-assets/${file}`);
}

function fallbackPhoto(document) {
  const product = productById(document.productIds?.[0]);
  return media(product?.gallery?.[0]?.[0] || "hero-home-substation-grid.jpeg");
}

function certificationPreview(document) {
  const manifestDoc = manifestById.get(document.id);
  const first = manifestDoc?.assets?.certifications?.[0]?.file;
  return first ? assetImagePath(first) : fallbackPhoto(document);
}

function standardsFor(document) {
  return standardsByDocument[document.id] || document.standards || [];
}

function completeEvidenceRegister() {
  const grouped = new Map();
  for (const document of effectiveDocuments) {
    const productId = document.productIds?.[0] || "other";
    if (!grouped.has(productId)) grouped.set(productId, []);
    grouped.get(productId).push(document);
  }

  const groups = [...grouped.entries()].map(([productId, docs]) => `<section class="complete-evidence-group">
    <div class="appendix-group-head"><p>${esc(productNameById(productId))}</p><strong>${docs.length} document${docs.length > 1 ? "s" : ""}</strong></div>
    <div class="complete-evidence-grid">${docs.map((document) => `<article class="complete-evidence-card">
      <div class="complete-evidence-cover"><img src="${certificationPreview(document)}" alt="${esc(document.title)}" loading="lazy"></div>
      <div class="complete-evidence-copy">
        <p>${esc(documentTypeNames[document.type] || document.type)}</p>
        <h3>${esc(document.testedModel || document.title)}</h3>
        <dl>
          <dt>Rating</dt><dd>${esc([document.ratedPower, document.ratedVoltage].filter(Boolean).join(" · ") || "Project-specific")}</dd>
          <dt>Report</dt><dd>${esc(document.reportNo || "Reference record")}</dd>
          ${document.issuer ? `<dt>Issuer</dt><dd>${esc(document.issuer)}</dd>` : ""}
        </dl>
        ${standardsFor(document).length ? `<div class="complete-evidence-standards">${standardsFor(document).map((standard) => `<span>${esc(standard)}</span>`).join("")}</div>` : ""}
      </div>
    </article>`).join("")}</div>
  </section>`).join("");

  return `<section class="catalog-appendix evidence-register" id="complete-evidence">
    <div class="appendix-title"><p>COMPLETE TECHNICAL EVIDENCE REGISTER</p><h2>All 20 current certificate and test-report records</h2><span>No representative subset is used here. Every current document record is listed and tied to its exact model where available.</span></div>
    <div class="appendix-summary"><div><strong>20</strong><span>Document Records</span></div><div><strong>6</strong><span>Product Families</span></div><div><strong>IEC / EN / EU</strong><span>Standards & Market Evidence</span></div><div><strong>Model-Specific</strong><span>Traceable Report Mapping</span></div></div>
    ${groups}
  </section>`;
}

function assetGroups(kind, heading, intro) {
  const groups = [];
  for (const manifestDoc of manifest.documents || []) {
    const assets = manifestDoc.assets?.[kind] || [];
    if (!assets.length) continue;
    const document = effectiveDocuments.find((item) => item.id === manifestDoc.id);
    groups.push(`<section class="asset-document-group">
      <div class="asset-document-head"><div><p>${esc(document?.testedModel || manifestDoc.id)}</p><h3>${esc(document?.title || manifestDoc.pdf || manifestDoc.id)}</h3></div><span>${assets.length} asset${assets.length > 1 ? "s" : ""}</span></div>
      <div class="asset-gallery">${assets.map((asset) => `<figure><img src="${assetImagePath(asset.file)}" alt="${esc(`${document?.testedModel || manifestDoc.id} page ${asset.page}`)}" loading="lazy"><figcaption>Page ${String(asset.page).padStart(3, "0")}</figcaption></figure>`).join("")}</div>
    </section>`);
  }
  return `<section class="catalog-appendix asset-appendix" id="asset-${kind}">
    <div class="appendix-title"><p>COMPLETE SOURCE ASSET LIBRARY</p><h2>${esc(heading)}</h2><span>${esc(intro)}</span></div>
    ${groups.join("\n")}
  </section>`;
}

function zgsHighlight() {
  return `<section class="catalog-sheet catalog-zgs-update" id="zgs22-validated-reference">
    <div class="sheet-head"><p>NEW VALIDATED REFERENCE</p><h2>ZGS22-4000/35/0.8 Renewable Energy Combined Transformer</h2><span>Type-tested 4 MVA renewable-energy configuration with integrated switching and protection functions.</span></div>
    <div class="zgs-update-grid"><div><img src="${fallbackPhoto(zgsEvidence)}" alt="ZGS22-4000/35/0.8 Pad-Mounted Transformer"></div><div>
      <div class="catalog-spec-grid"><div><span>Rated power</span><strong>4000 kVA</strong></div><div><span>Rated voltage</span><strong>37 / 0.8 kV</strong></div><div><span>Frequency</span><strong>50 Hz</strong></div><div><span>Vector group</span><strong>Dy11</strong></div><div><span>Cooling</span><strong>ONAN</strong></div><div><span>Report</span><strong>24XB0336-S</strong></div></div>
      <h3>Verified Test Scope Highlights</h3><ul><li>IEC 60076-1/-2/-3/-5/-10 and IEC/IEEE 60076-16 referenced in the supplied type-test report.</li><li>Short-circuit withstand test and lightning impulse test included in the report.</li><li>Protection-degree evidence includes IP65 for HV/LV compartments and IP68 for the transformer section.</li><li>High-altitude evaluation includes a 5000 m reference condition.</li><li>Designed and tested as an outdoor renewable-energy combined transformer configuration.</li></ul>
    </div></div>
  </section>`;
}

if (!fs.existsSync(catalogPath)) throw new Error("dist/catalog.html is missing. Run catalog-build.mjs first.");
let html = fs.readFileSync(catalogPath, "utf8");

if (!html.includes("catalog-enrich-v2.css")) {
  html = html.replace("</head>", `  <link rel="stylesheet" href="assets/css/catalog-enrich-v2.css">\n</head>`);
}

html = html.replace("Tianyu Export Catalog V1", "Tianyu Export Catalog V2");
html = html.replace("<a href=\"#projects\">Applications & Projects</a>", `<a href="#complete-evidence">Complete Evidence Register</a><a href="#asset-certifications">Certification Pages</a><a href="#asset-images">Product & Test Images</a><a href="#asset-drawings">Engineering Drawings</a><a href="#projects">Applications & Projects</a>`);

const evidenceMarker = '<section class="catalog-sheet product-overview-sheet" id="product-oil-immersed-distribution-transformer">';
if (html.includes(evidenceMarker) && !html.includes('id="complete-evidence"')) {
  html = html.replace(evidenceMarker, `${completeEvidenceRegister()}\n${evidenceMarker}`);
}

const projectsMarker = '<section class="catalog-sheet projects-sheet" id="projects">';
if (html.includes(projectsMarker) && !html.includes('id="zgs22-validated-reference"')) {
  html = html.replace(projectsMarker, `${zgsHighlight()}\n${projectsMarker}`);
}

if (!html.includes('id="asset-certifications"')) {
  html = html.replace("</main>", `${assetGroups("certifications", "Certification & Report Pages", "Every extracted official certificate/report cover page is retained, including multi-page TÜV certificate records.")}\n${assetGroups("images", "Product & Test Image Library", "Every page classified as a potentially reusable product, test, assembly or inspection image is included without selecting a representative subset.")}\n${assetGroups("drawings", "Engineering Drawing Library", "Every extracted drawing, diagram, connection figure or layout page is retained with source-document and page traceability.")}\n</main>`);
}

fs.copyFileSync(path.join(__dirname, "catalog-enrich-v2.css"), cssTarget);
fs.writeFileSync(catalogPath, html);
console.log(`Enriched catalog with ${effectiveDocuments.length} document records and exhaustive extracted asset appendices.`);