import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { products } from "./products-data.mjs";
import { documents } from "./documents-data.mjs";
import { projects } from "./projects-data.mjs";
import { factoryCapabilities } from "./factory-data.mjs";
import { company, companyStats } from "./site-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const cssDir = path.join(dist, "assets", "css");
const jsDir = path.join(dist, "assets", "js");

const esc = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));
const media = (source) => `assets/media/${source}`;
const unique = (values) => [...new Set(values.filter(Boolean))];

const displayNames = {
  "oil-immersed-distribution-transformer": "Oil-Immersed Distribution Transformer",
  "high-voltage-power-transformer": "High-Voltage Power Transformer",
  "cast-resin-dry-type-transformer": "Cast Resin Dry-Type Transformer",
  "dry-type-prefabricated-substation": "European-Type Prefabricated Substation",
  "oil-immersed-prefabricated-substation": "Compact Prefabricated Substation",
  "american-type-combined-transformer": "Pad-Mounted Transformer"
};

const subtitles = {
  "oil-immersed-distribution-transformer": "Energy-Efficient Distribution Platform",
  "high-voltage-power-transformer": "110 kV · 132 kV · 220 kV Reference Range",
  "cast-resin-dry-type-transformer": "SCB18 Cast-Resin Indoor Distribution",
  "dry-type-prefabricated-substation": "Dry-Type Transformer Configuration",
  "oil-immersed-prefabricated-substation": "Oil-Immersed Transformer Configuration",
  "american-type-combined-transformer": "American-Type / Renewable Energy Configuration"
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
  featured: true,
  tags: ["TYPE TEST", "IEC", "RENEWABLE"]
};

const effectiveDocuments = [
  ...documents.filter((item) => item.id !== "american-combined-transformer-pending"),
  zgsEvidence
];

function productName(product) {
  return displayNames[product.id] || product.name;
}

function productDocs(product) {
  return effectiveDocuments.filter((document) => document.productIds?.includes(product.id));
}

function productProjects(product) {
  return projects.filter((project) => project.productIds?.includes(product.id));
}

function previewFor(document, product) {
  return document.previewImages?.[0] || product.gallery?.[0]?.[0] || "hero-home-substation-grid.jpeg";
}

function pageNo(index) {
  return `<span class="catalog-page-no">${String(index).padStart(2, "0")}</span>`;
}

function sheet({ id = "", className = "", eyebrow = "", title = "", intro = "", body = "", page = null }) {
  return `<section class="catalog-sheet ${className}"${id ? ` id="${id}"` : ""}>
    ${page ? pageNo(page) : ""}
    <div class="sheet-head">${eyebrow ? `<p>${esc(eyebrow)}</p>` : ""}${title ? `<h2>${esc(title)}</h2>` : ""}${intro ? `<span>${esc(intro)}</span>` : ""}</div>
    ${body}
  </section>`;
}

function specGrid(rows) {
  return `<div class="catalog-spec-grid">${rows.filter(([, value]) => value).map(([label, value]) => `<div><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("")}</div>`;
}

function chips(items) {
  return `<div class="catalog-chips">${unique(items).map((item) => `<span>${esc(item)}</span>`).join("")}</div>`;
}

function projectCards(items, fallbackImage) {
  return `<div class="catalog-project-grid">${items.map((project) => `<article class="catalog-project-card"><img src="${media(project.image || fallbackImage)}" alt="${esc(project.name)}" loading="lazy"><div><p>${esc(project.country || project.application || "Project")}</p><h3>${esc(project.name)}</h3><span>${esc([project.capacity, project.industry].filter(Boolean).join(" · "))}</span></div></article>`).join("")}</div>`;
}

function evidenceCards(items, product) {
  return `<div class="catalog-evidence-grid">${items.map((document) => `<article class="catalog-evidence-card"><div class="catalog-evidence-image"><img src="${media(previewFor(document, product))}" alt="${esc(document.title)}" loading="lazy"></div><div><p>${esc((document.tags || [document.type]).slice(0, 2).join(" · "))}</p><h3>${esc(document.testedModel || document.title)}</h3><dl><dt>Rating</dt><dd>${esc([document.ratedPower, document.ratedVoltage].filter(Boolean).join(" · "))}</dd><dt>Report</dt><dd>${esc(document.reportNo || "Reference record")}</dd>${document.issuer ? `<dt>Issuer</dt><dd>${esc(document.issuer)}</dd>` : ""}</dl></div></article>`).join("")}</div>`;
}

function modelCards(product) {
  const docs = productDocs(product);
  const models = new Map();
  for (const document of docs) {
    if (!document.testedModel) continue;
    if (!models.has(document.testedModel)) models.set(document.testedModel, []);
    models.get(document.testedModel).push(document);
  }
  if (!models.size) {
    for (const model of product.testedModels || []) models.set(model, []);
  }
  return `<div class="catalog-model-grid">${[...models.entries()].map(([model, modelDocs]) => {
    const reference = modelDocs[0] || {};
    const photo = modelDocs.flatMap((item) => item.previewImages || []).find((image) => image.includes("product-photo")) || product.gallery?.[0]?.[0];
    return `<article class="catalog-model-card"><img src="${media(photo)}" alt="${esc(model)}" loading="lazy"><div><p>Validated Reference Model</p><h3>${esc(model)}</h3><span>${esc([reference.ratedPower, reference.ratedVoltage].filter(Boolean).join(" · ") || product.seriesCapability?.voltage || "Project configuration")}</span><strong>${modelDocs.length ? `${modelDocs.length} evidence record${modelDocs.length > 1 ? "s" : ""}` : "Reference model"}</strong></div></article>`;
  }).join("")}</div>`;
}

function productOverviewSheet(product, page) {
  const standards = unique([...(product.standards || []), ...productDocs(product).flatMap((document) => document.standards || [])]);
  return sheet({
    id: `product-${product.id}`,
    className: "product-overview-sheet",
    eyebrow: product.family,
    title: productName(product),
    intro: subtitles[product.id] || product.strapline,
    page,
    body: `<div class="product-overview-grid"><div class="product-hero-image"><img src="${media(product.gallery?.[0]?.[0] || "hero-home-substation-grid.jpeg")}" alt="${esc(productName(product))}"></div><div class="product-overview-copy"><p>${esc(product.description)}</p>${specGrid([
      ["Series voltage", product.seriesCapability?.voltage],
      ["Series capacity", product.seriesCapability?.capacity],
      ["Frequency", product.seriesCapability?.frequency],
      ["Cooling", product.seriesCapability?.cooling],
      ["Installation", product.seriesCapability?.installation]
    ])}<h3>Key Features</h3><ul>${(product.features || []).slice(0, 6).map((feature) => `<li>${esc(feature)}</li>`).join("")}</ul>${standards.length ? `<h3>Standards / Test Scope</h3>${chips(standards)}` : ""}</div></div>`
  });
}

function productEvidenceSheet(product, page) {
  const docs = productDocs(product);
  const relatedProjects = productProjects(product).slice(0, 6);
  return sheet({
    className: "product-evidence-sheet",
    eyebrow: "Tested Models & Applications",
    title: `${productName(product)} Reference Evidence`,
    intro: "Series capability and tested reference models are presented separately.",
    page,
    body: `${modelCards(product)}<div class="catalog-two-column"><div><h3>Typical Application Areas</h3>${chips(product.applications || [])}</div><div><h3>Selected Project References</h3><ul class="project-list">${relatedProjects.map((project) => `<li><strong>${esc(project.name)}</strong><span>${esc([project.country, project.capacity].filter(Boolean).join(" · "))}</span></li>`).join("")}</ul></div></div>`
  });
}

function distributionEuropeSheet(product, page) {
  const docs = productDocs(product).filter((document) => ["certificate", "ce-verification", "efficiency-report", "type-test"].includes(document.type));
  return sheet({
    className: "eu-evidence-sheet",
    eyebrow: "European Market Evidence",
    title: "630 kVA & 1600 kVA Tier 2 Reference Configurations",
    intro: "Independent TÜV / IEC / EN evidence tied to exact tested models.",
    page,
    body: `<div class="eu-evidence-lead"><div><strong>630 kVA</strong><span>S-M-630/22-Tier2 · 22/0.42 kV · 50 Hz · ONAN</span></div><div><strong>1600 kVA</strong><span>S-M-1600/22-Tier2 · 22/0.42 kV · 50 Hz · ONAN</span></div></div>${evidenceCards(docs, product)}<p class="catalog-note">EU conformity remains configuration-specific. The catalog presents the evidence attached to the tested reference models rather than claiming blanket certification for the entire configurable series.</p>`
  });
}

function qualitySheet(page) {
  const featured = effectiveDocuments.filter((document) => document.featured).slice(0, 8);
  const fallback = products[0];
  return sheet({
    id: "quality",
    className: "quality-sheet",
    eyebrow: "Quality & Certification",
    title: "Engineering confidence you can review",
    intro: "Independent evidence is organized by exact model, rating and report number.",
    page,
    body: `${evidenceCards(featured, fallback)}<div class="quality-principles"><div><strong>01</strong><span>Model-specific evidence</span></div><div><strong>02</strong><span>Routine and type-test scope separated</span></div><div><strong>03</strong><span>Project-specific configurations reviewed before order</span></div></div>`
  });
}

function manufacturingSheet(page) {
  return sheet({
    id: "manufacturing",
    className: "manufacturing-sheet",
    eyebrow: "Manufacturing & Testing",
    title: "From magnetic core to final verification",
    intro: "A concise overview of the manufacturing and testing chain currently documented for the website.",
    page,
    body: `<div class="catalog-capability-grid">${factoryCapabilities.slice(0, 6).map((item) => `<article><img src="${media(item.photo)}" alt="${esc(item.name)}"><div><p>Manufacturing / Testing</p><h3>${esc(item.name)}</h3><span>${esc(item.purpose)}</span></div></article>`).join("")}</div><p class="catalog-note">Third-party type tests and certifications are identified separately from in-house manufacturing and routine-test capability.</p>`
  });
}

function projectSectionSheets(startPage) {
  const groups = [
    ["Renewable Energy & Storage", projects.filter((item) => ["Renewable Energy", "Energy Storage"].includes(item.application)).slice(0, 8), "case-renewable-energy-base.jpeg"],
    ["Industrial & Utility", projects.filter((item) => ["Industrial", "Utility Grid"].includes(item.application)).slice(0, 8), "hero-home-substation-grid.jpeg"],
    ["Infrastructure & Public Projects", projects.filter((item) => item.application === "Infrastructure").slice(0, 8), "company-factory-campus.jpeg"],
    ["Selected International References", projects.filter((item) => item.country && item.country !== "China").slice(0, 8), "case-renewable-energy-base.jpeg"]
  ];
  return groups.map(([title, items, fallback], index) => sheet({
    id: index === 0 ? "projects" : "",
    className: "projects-sheet",
    eyebrow: "Applications & Project References",
    title,
    intro: "Selected records from the current project database.",
    page: startPage + index,
    body: projectCards(items, fallback)
  }));
}

function engineeringSheet(page) {
  const options = ["Rated voltage", "Rated capacity", "Frequency", "Vector group", "Impedance", "Tap range", "Cooling", "Core design", "Loss level", "Noise level", "Altitude", "Ambient conditions", "Enclosure / IP", "Monitoring", "Cable / bushing interfaces"];
  return sheet({
    id: "engineering",
    className: "engineering-sheet",
    eyebrow: "Engineering & Customization",
    title: "Standard platforms. Engineered configurations.",
    intro: "A tested reference model provides a proven starting point; final configuration is reviewed against the project specification.",
    page,
    body: `<div class="engineering-grid"><div><h3>Common Engineering Variables</h3>${chips(options)}<p>Changes that affect rated performance, losses, insulation, winding arrangement, magnetic design or applicable market requirements must be reviewed for their impact on testing and compliance.</p></div><div class="workflow"><div><span>01</span><strong>RFQ</strong><small>Ratings, application, destination, standards</small></div><div><span>02</span><strong>Technical Review</strong><small>Configuration, losses, accessories, drawings</small></div><div><span>03</span><strong>Proposal</strong><small>Technical schedule and commercial offer</small></div><div><span>04</span><strong>Drawing Confirmation</strong><small>GA / SLD / interfaces</small></div><div><span>05</span><strong>Manufacturing & Test</strong><small>Production, routine tests, documentation</small></div><div><span>06</span><strong>Delivery Support</strong><small>Packing and technical document handover</small></div></div></div>`
  });
}

function rfqSheet(page) {
  const rows = [
    ["Rated power", "e.g. 1600 kVA"],
    ["HV / LV voltage", "e.g. 22 / 0.42 kV"],
    ["Frequency", "50 Hz / 60 Hz"],
    ["Vector group", "e.g. Dyn11 / Dy11"],
    ["Impedance", "Project requirement"],
    ["Tap range", "Project requirement"],
    ["Installation", "Indoor / Outdoor"],
    ["Ambient temperature", "Site maximum / minimum"],
    ["Altitude", "Site elevation"],
    ["Applicable standard", "IEC / EN / project specification"],
    ["Loss / efficiency requirement", "If applicable"],
    ["Accessories", "Protection, monitoring, interfaces"],
    ["Quantity & delivery schedule", "Project plan"]
  ];
  return sheet({
    id: "rfq",
    className: "rfq-sheet",
    eyebrow: "RFQ Guide",
    title: "Information required for quotation",
    intro: "The more complete the input, the faster engineering can compare the project against a suitable platform.",
    page,
    body: `<div class="rfq-grid"><div>${rows.map(([label, example]) => `<div><strong>${esc(label)}</strong><span>${esc(example)}</span></div>`).join("")}</div><aside><h3>Helpful Attachments</h3><ul><li>Single-line diagram</li><li>Transformer technical specification</li><li>Load profile</li><li>Harmonic spectrum / THDi when relevant</li><li>Site layout and cable interface information</li><li>Applicable utility or tender specification</li></ul></aside></div>`
  });
}

function coverSheet() {
  return `<section class="catalog-sheet catalog-cover" id="cover"><img class="cover-bg" src="${media("hero-home-substation-grid.jpeg")}" alt="Power substation"><div class="cover-shade"></div><div class="cover-copy"><p>TIANYU ELECTRIC</p><h1>Transformer &<br>Substation Solutions</h1><span>Distribution · Power · Dry-Type · Prefabricated · Pad-Mounted</span><small>${esc(company.legalName)}</small></div><div class="cover-year">EXPORT PRODUCT CATALOG · 2026</div></section>`;
}

function portfolioSheet(page) {
  return sheet({
    id: "contents",
    className: "portfolio-sheet",
    eyebrow: "Product Portfolio",
    title: "A practical map of Tianyu's current export product range",
    intro: "Product families are grouped by engineering function. Tested models and reports are shown inside each family.",
    page,
    body: `<div class="portfolio-columns"><div><h3>Transformers</h3>${products.filter((p) => ["oil-immersed-distribution-transformer", "high-voltage-power-transformer", "cast-resin-dry-type-transformer", "american-type-combined-transformer"].includes(p.id)).map((product) => `<a href="#product-${product.id}"><span>${esc(subtitles[product.id] || product.family)}</span><strong>${esc(productName(product))}</strong></a>`).join("")}</div><div><h3>Prefabricated Substations</h3>${products.filter((p) => ["dry-type-prefabricated-substation", "oil-immersed-prefabricated-substation"].includes(p.id)).map((product) => `<a href="#product-${product.id}"><span>${esc(subtitles[product.id])}</span><strong>${esc(productName(product))}</strong></a>`).join("")}<h3>Catalog Sections</h3><a href="#quality"><strong>Quality & Certification</strong></a><a href="#projects"><strong>Applications & Projects</strong></a><a href="#engineering"><strong>Engineering & Customization</strong></a><a href="#rfq"><strong>RFQ Guide</strong></a></div></div>`
  });
}

function companySheet(page) {
  return sheet({
    id: "company",
    className: "company-sheet",
    eyebrow: "Company Overview",
    title: company.legalName,
    intro: company.tagline,
    page,
    body: `<div class="company-grid"><div><p class="company-lead">${esc(company.productScope)}</p><p>${esc(company.groupBackground)}</p><p>${esc(company.manufacturingBase)}</p>${specGrid(companyStats.map((item) => [item.label, item.value]))}</div><img src="${media("company-factory-campus.jpeg")}" alt="Tianyu Electric factory campus"></div>`
  });
}

function serviceSheet(page) {
  const services = [
    ["Technical Review", "Product-family and reference-model matching against project ratings."],
    ["Engineering Documents", "Technical schedules, drawings and available test evidence organized for project review."],
    ["Manufacturing Documentation", "Production and routine-test documentation prepared for the agreed order scope."],
    ["Delivery Support", "Packing and technical document handover aligned to the project delivery plan."]
  ];
  return sheet({
    className: "service-sheet",
    eyebrow: "Project Support",
    title: "From inquiry to documented delivery",
    intro: "Only service items already supported by the current website information are included in this V1 catalog.",
    page,
    body: `<div class="service-grid">${services.map(([title, text], index) => `<article><span>0${index + 1}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join("")}</div>`
  });
}

function backCover() {
  return `<section class="catalog-sheet back-cover"><img class="cover-bg" src="${media("company-factory-campus.jpeg")}" alt="Tianyu Electric"><div class="cover-shade"></div><div class="back-cover-copy"><p>TIANYU ELECTRIC</p><h2>Built around the project.<br>Backed by evidence.</h2><span>${esc(company.legalName)}</span><small>Technical Inquiry · Product Selection · Project Review</small><a href="index.html">Visit the Tianyu Electric website →</a></div></section>`;
}

let page = 1;
const parts = [coverSheet()];
parts.push(portfolioSheet(++page));
parts.push(companySheet(++page));
parts.push(manufacturingSheet(++page));
parts.push(qualitySheet(++page));

for (const product of products) {
  parts.push(productOverviewSheet(product, ++page));
  parts.push(productEvidenceSheet(product, ++page));
  if (product.id === "oil-immersed-distribution-transformer") parts.push(distributionEuropeSheet(product, ++page));
}

parts.push(...projectSectionSheets(++page));
page += 3;
parts.push(engineeringSheet(++page));
parts.push(rfqSheet(++page));
parts.push(serviceSheet(++page));
parts.push(backCover());

const html = `<!doctype html><html lang="en"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Tianyu Electric Export Product Catalog 2026</title>
  <meta name="description" content="Tianyu Electric transformer and prefabricated substation export product catalog with tested models, project references and engineering guidance.">
  <link rel="stylesheet" href="assets/css/catalog.css">
</head><body>
  <div class="catalog-toolbar"><a href="index.html">← Website</a><strong>Tianyu Export Catalog V1</strong><div><button type="button" data-catalog-contents>Contents</button><button type="button" data-catalog-print>Print / Save PDF</button></div></div>
  <aside class="catalog-nav" data-catalog-nav aria-hidden="true"><button type="button" data-catalog-close>×</button><a href="#cover">Cover</a><a href="#contents">Product Portfolio</a><a href="#company">Company</a><a href="#manufacturing">Manufacturing</a><a href="#quality">Quality & Certification</a>${products.map((product) => `<a href="#product-${product.id}">${esc(productName(product))}</a>`).join("")}<a href="#projects">Applications & Projects</a><a href="#engineering">Engineering & Customization</a><a href="#rfq">RFQ Guide</a></aside>
  <main class="catalog">${parts.join("\n")}</main>
  <script src="assets/js/catalog.js"></script>
</body></html>`;

fs.mkdirSync(cssDir, { recursive: true });
fs.mkdirSync(jsDir, { recursive: true });
fs.copyFileSync(path.join(__dirname, "catalog.css"), path.join(cssDir, "catalog.css"));
fs.copyFileSync(path.join(__dirname, "catalog.js"), path.join(jsDir, "catalog.js"));
fs.writeFileSync(path.join(dist, "catalog.html"), html);
console.log(`Built export catalog: ${parts.length} HTML sheets`);
