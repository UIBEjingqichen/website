import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { products } from "./products-data.mjs";
import { documents } from "./documents-data.mjs";
import { projects } from "./projects-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const catalogPath = path.join(dist, "catalog.html");
const manifestPath = path.join(root, "source-media", "catalog-assets", "manifest.json");
const cssTarget = path.join(dist, "assets", "css", "catalog-refine-v4.css");

if (!fs.existsSync(catalogPath)) throw new Error("dist/catalog.html is missing.");

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
  previewImages: [],
  tags: ["TYPE TEST", "IEC", "RENEWABLE ENERGY"]
};

const effectiveDocuments = [
  ...documents.filter((item) => item.id !== "american-combined-transformer-pending"),
  zgsEvidence
];

const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : { documents: [] };
const manifestById = new Map((manifest.documents || []).map((item) => [item.id, item]));

const typeLabels = {
  certificate: "Certificate of Conformity",
  "type-test": "Type Test Report",
  "test-report": "Test Report",
  "efficiency-report": "Efficiency Test Report",
  "ce-verification": "CE / Ecodesign Verification"
};

const detailCopy = {
  "oil-immersed-distribution-transformer": [
    "Tianyu's S(B)20 / S(B)22 oil-immersed distribution transformer platform is intended for medium-voltage utility and industrial distribution where energy efficiency, sealed construction, low acoustic output and dependable outdoor service are required. The current published family covers voltage levels up to 22 kV and design capacities up to 4,000 kVA.",
    "For export review, the 630 kVA and 1,600 kVA 22 kV configurations are the most completely documented references. They are supported by TÜV certificates, complete IEC type-test reports, efficiency reports and CE / Ecodesign verification documents. These records apply to the identified tested configurations; project-specific voltage, tapping, impedance, accessories, losses and interfaces remain subject to engineering confirmation.",
    "The report set also contains engineering drawings and test figures. Representative drawings are reproduced below so a buyer can review the physical and electrical reference configuration together with the certification evidence rather than treating the certificate as a stand-alone marketing item."
  ],
  "high-voltage-power-transformer": [
    "Tianyu high-voltage power transformers are project-engineered main transformers for substations, grid interconnection and major industrial power systems. Current independently documented references span 110 kV, 132 kV and 220 kV, with tested capacities of 50 MVA, 150 MVA and 240 MVA.",
    "Because this class of equipment is designed around the power system, the final transformer is defined by more than voltage and MVA. Impedance, tap-changing range, cooling, insulation levels, guaranteed losses, monitoring, accessories, transport limits and site conditions are reviewed together before the technical schedule is frozen. The listed reports therefore demonstrate specific validated designs and manufacturing capability rather than a universal specification for every project."
  ],
  "cast-resin-dry-type-transformer": [
    "The SCB18 cast-resin dry-type transformer family is designed for indoor distribution and locations where fire performance, oil-free insulation and reduced maintenance are important. Typical applications include hospitals, commercial buildings, charging infrastructure, industrial plants and public infrastructure.",
    "The current evidence set covers 10 kV SCB18 configurations at 1,000 kVA and 2,500 kVA. Cooling arrangement, enclosure, ventilation, temperature monitoring, vector group and installation environment can be reviewed for each project while the tested models provide a documented reference baseline."
  ],
  "dry-type-prefabricated-substation": [
    "The European-Type Prefabricated Substation is a complete outdoor substation package rather than a transformer alone. High-voltage primary equipment, a dry-type transformer and low-voltage distribution are integrated into a factory-assembled enclosure to reduce site integration work.",
    "The published range covers primary voltages up to 35 kV and capacities up to 12.5 MVA. Current tested references at 6.3 MVA, 10 MVA and 12.5 MVA support renewable-energy, energy-storage, urban-distribution and environmentally sensitive applications. Protection, metering, auxiliary power, cable entry, monitoring and enclosure arrangement remain project-specific."
  ],
  "oil-immersed-prefabricated-substation": [
    "The Compact Prefabricated Substation combines an oil-immersed transformer with high-voltage and low-voltage equipment in a compact factory-assembled outdoor package. The family is intended for renewable-energy, utility and industrial projects that require high capacity with a reduced site footprint.",
    "The published series extends up to 15 MVA, with current tested references at 10 MVA and 12.5 MVA. Coastal or harsh-environment projects require project review of corrosion protection, sealing, ventilation, structural loading, protection level, monitoring and cable interfaces."
  ],
  "american-type-combined-transformer": [
    "The Pad-Mounted Transformer integrates the transformer body with high-voltage switching and fuse protection in a compact outdoor assembly. This architecture is particularly suited to renewable-energy collection systems and distribution sites where field space and the amount of separate equipment should be reduced.",
    "The current validated reference is ZGS22-4000/35/0.8, rated 4,000 kVA at 37 / 0.8 kV. The supplied type-test report references the IEC 60076 series and IEC/IEEE 60076-16 and includes short-circuit, lightning-impulse and protection-degree evidence. Final cable arrangement, switching scheme, protection, enclosure and site conditions remain subject to project engineering."
  ]
};

function productName(product) {
  return displayNames[product.id] || product.name;
}

function docsFor(product) {
  return effectiveDocuments.filter((document) => document.productIds?.includes(product.id));
}

function projectsFor(product) {
  return projects.filter((project) => project.productIds?.includes(product.id));
}

function certImage(document, product) {
  const item = manifestById.get(document.id);
  const certification = item?.assets?.certifications?.[0]?.file;
  if (certification) return media(`catalog-assets/${certification}`);
  const preview = document.previewImages?.[0];
  if (preview) return media(preview);
  return media(product.gallery?.[0]?.[0] || "hero-home-substation-grid.jpeg");
}

function drawingsFor(product) {
  const result = [];
  for (const document of docsFor(product)) {
    const item = manifestById.get(document.id);
    for (const drawing of item?.assets?.drawings || []) {
      const key = drawing.file;
      if (!result.some((existing) => existing.file === key)) {
        result.push({ ...drawing, documentId: document.id, reportNo: document.reportNo || "" });
      }
    }
  }
  return result;
}

function modelsFor(product) {
  const grouped = new Map();
  for (const document of docsFor(product)) {
    if (!document.testedModel) continue;
    if (!grouped.has(document.testedModel)) grouped.set(document.testedModel, []);
    grouped.get(document.testedModel).push(document);
  }
  for (const model of product.testedModels || []) {
    if (!grouped.has(model)) grouped.set(model, []);
  }
  return [...grouped.entries()];
}

function validationLabel(document) {
  return typeLabels[document.type] || document.title || "Technical report";
}

function modelTable(product) {
  const rows = modelsFor(product);
  return `<div class="catalog-detail-section"><h3>Tested Reference Configurations</h3><table class="catalog-model-table"><thead><tr><th>Model</th><th>Rated Power</th><th>Rated Voltage</th><th>Available Validation</th></tr></thead><tbody>${rows.map(([model, modelDocs]) => {
    const reference = modelDocs[0] || {};
    const validations = modelDocs.length ? [...new Set(modelDocs.map(validationLabel))].join(" · ") : "Reference configuration";
    return `<tr><td><strong>${esc(model)}</strong></td><td>${esc(reference.ratedPower || "Project-specific")}</td><td>${esc(reference.ratedVoltage || product.seriesCapability?.voltage || "Project-specific")}</td><td>${esc(validations)}</td></tr>`;
  }).join("")}</tbody></table></div>`;
}

function certificationGrid(product) {
  const docs = docsFor(product);
  if (!docs.length) return "";
  return `<div class="catalog-detail-section"><h3>Certificates & Test Reports</h3><p class="catalog-section-intro">The documents below are tied to the exact model and report number shown. They should be read together with the project specification when a new configuration is proposed.</p><div class="catalog-product-cert-grid">${docs.map((document) => `<article><figure><img src="${certImage(document, product)}" alt="${esc(document.title)}" loading="lazy"></figure><div><span>${esc(validationLabel(document))}</span><strong>${esc(document.testedModel || productName(product))}</strong><small>${esc([document.reportNo, document.ratedPower, document.ratedVoltage].filter(Boolean).join(" · "))}</small></div></article>`).join("")}</div></div>`;
}

function drawingGrid(product) {
  const all = drawingsFor(product);
  if (!all.length) return "";
  const limit = product.id === "oil-immersed-distribution-transformer" ? 6 : 4;
  const selected = all.slice(0, limit);
  return `<div class="catalog-detail-section"><h3>Engineering Drawings</h3><p class="catalog-section-intro">Representative drawings are reproduced from the available report set to show the tested reference configuration. Final project drawings are issued after technical confirmation.</p><div class="catalog-drawing-grid">${selected.map((drawing) => `<figure><img src="${media(`catalog-assets/${drawing.file}`)}" alt="Engineering drawing from ${esc(drawing.reportNo || drawing.documentId)}" loading="lazy"><figcaption>${esc(drawing.reportNo || drawing.documentId)} · report page ${drawing.page}</figcaption></figure>`).join("")}</div></div>`;
}

function projectTable(product) {
  const rows = projectsFor(product);
  if (!rows.length) return "";
  return `<div class="catalog-detail-section catalog-project-table-section"><h3>Applications & Project References</h3><p class="catalog-section-intro">The table follows the current export project workbook and keeps each reference with the product family under which it was supplied or recorded.</p><div class="catalog-table-wrap"><table class="catalog-project-table"><thead><tr><th>Project Reference</th><th>Application</th><th>Industry</th><th>Country</th><th>Project Scale</th></tr></thead><tbody>${rows.map((project) => `<tr><td><strong>${esc(project.name)}</strong></td><td>${esc(project.application || "—")}</td><td>${esc(project.industry || "—")}</td><td>${esc(project.country || "—")}</td><td>${esc(project.capacity || "—")}</td></tr>`).join("")}</tbody></table></div></div>`;
}

function detailedProductPage(product, page) {
  const paragraphs = detailCopy[product.id] || [product.description];
  return `<section class="catalog-sheet product-evidence-sheet catalog-product-detail-sheet">
    ${page ? `<span class="catalog-page-no">${esc(page)}</span>` : ""}
    <div class="sheet-head"><p>PRODUCT DETAILS</p><h2>${esc(productName(product))}</h2><span>Tested configurations, certification, drawings and project applications.</span></div>
    <div class="catalog-product-detail-prose">${paragraphs.map((text) => `<p>${esc(text)}</p>`).join("")}</div>
    ${modelTable(product)}
    ${certificationGrid(product)}
    ${drawingGrid(product)}
    ${projectTable(product)}
  </section>`;
}

function replaceQualityProse(source) {
  const start = source.indexOf('id="quality"');
  if (start < 0) return source;
  const next = source.indexOf('<section class="', start + 20);
  const end = next > 0 ? next : source.length;
  let segment = source.slice(start, end);
  segment = segment.replace(/<div class="catalog-editorial-prose">[\s\S]*?<\/div>/, `<div class="catalog-quality-note"><p>Independent certificates and test reports are presented by tested model, rating and report number. This makes the evidence useful for technical review without implying that one report automatically covers every possible customized configuration.</p></div>`);
  return source.slice(0, start) + segment + source.slice(end);
}

let html = fs.readFileSync(catalogPath, "utf8");

if (!html.includes("catalog-refine-v4.css")) {
  html = html.replace("</head>", `  <link rel="stylesheet" href="assets/css/catalog-refine-v4.css">\n</head>`);
}

// Remove the technical-register and raw-asset appendices from the customer-facing catalog.
const registerStart = html.indexOf('<section class="catalog-appendix evidence-register" id="complete-evidence">');
const firstProductStart = html.indexOf('<section class="catalog-sheet product-overview-sheet" id="product-oil-immersed-distribution-transformer">');
if (registerStart >= 0 && firstProductStart > registerStart) {
  html = html.slice(0, registerStart) + html.slice(firstProductStart);
}
const assetStart = html.indexOf('<section class="catalog-appendix asset-appendix" id="asset-certifications">');
const mainEnd = html.indexOf('</main>', assetStart >= 0 ? assetStart : 0);
if (assetStart >= 0 && mainEnd > assetStart) {
  html = html.slice(0, assetStart) + html.slice(mainEnd);
}

// The ZGS evidence is now shown inside its product page, so remove the duplicate standalone update sheet.
html = html.replace(/<section class="catalog-sheet catalog-zgs-update"[\s\S]*?<\/section>/g, "");

// Applications belong with the relevant product, so remove the separate application/project chapter.
html = html.replace(/<section class="catalog-sheet projects-sheet"[\s\S]*?<\/section>/g, "");

// Remove appendix and global-project navigation entries.
html = html
  .replace(/<a href="#complete-evidence">[\s\S]*?<\/a>/g, "")
  .replace(/<a href="#asset-certifications">[\s\S]*?<\/a>/g, "")
  .replace(/<a href="#asset-images">[\s\S]*?<\/a>/g, "")
  .replace(/<a href="#asset-drawings">[\s\S]*?<\/a>/g, "")
  .replace(/<a href="#projects">Applications &amp; Projects<\/a>/g, "")
  .replace(/<a href="#projects"><strong>Applications &amp; Projects<\/strong><\/a>/g, "");

// Do not market an arbitrary file count to customers.
html = html
  .replace(/<span>Evidence Records<\/span><strong>20<\/strong>/g, '<span>Power Transformer Reference</span><strong>220 kV</strong>')
  .replace(/<span>Evidence Files<\/span><strong>19<\/strong>/g, '<span>Power Transformer Reference</span><strong>220 kV</strong>')
  .replace(/The current evidence library contains twenty certificate and test-report records[^<]*\./g, "Independent certificates and test reports are mapped to exact tested models and ratings.");

html = replaceQualityProse(html);

// Replace the sparse web-like evidence pages with catalog-style product detail pages.
let productIndex = 0;
html = html.replace(/<section class="catalog-sheet product-evidence-sheet"[\s\S]*?<\/section>/g, (match) => {
  const product = products[productIndex++];
  if (!product) return match;
  const pageMatch = match.match(/<span class="catalog-page-no">([^<]+)<\/span>/);
  return detailedProductPage(product, pageMatch?.[1] || "");
});

// The table inside each product now carries application references, so remove the old generic chips if any survived earlier transforms.
html = html.replace(/<h3>Typical Application Areas<\/h3>[\s\S]*?(?=<\/div><div>|<\/section>)/g, "");

fs.copyFileSync(path.join(__dirname, "catalog-refine-v4.css"), cssTarget);
fs.writeFileSync(catalogPath, html);
console.log("Catalog V4: product-led pages, integrated project tables, drawings and certification, no raw appendices.");
