import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { categories, products } from "./products-data.mjs";
import { documents } from "./documents-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const esc = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));
const slugify = (value = "") => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const media = (source, depth = "") => `${depth}assets/media/${source}`;
const docType = (type) => ({
  certificate: "Certificate",
  "type-test": "Type Test Report",
  "test-report": "Test Report",
  "ce-verification": "CE / Ecodesign",
  "efficiency-report": "Efficiency Report"
}[type] || "Technical Document");

function injectAssets(html, depth = "") {
  if (!html.includes("ux-refine-v5.css")) html = html.replace("</head>", `    <link rel="stylesheet" href="${depth}assets/css/ux-refine-v5.css">\n</head>`);
  if (!html.includes("ux-refine-v5.js")) html = html.replace("</body>", `    <script src="${depth}assets/js/ux-refine-v5.js"></script>\n</body>`);
  return html;
}

function replaceMain(html, content) {
  return html.replace(/<main>[\s\S]*?<\/main>/, `<main>${content}</main>`);
}

function fixMeta(html, title, description, canonical) {
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(description)}">`);
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${esc(canonical)}">`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(description)}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${esc(canonical)}">`);
  return html;
}

function productDocuments(product) {
  const ids = new Set(product.evidenceIds || []);
  return documents.filter((document) => ids.has(document.id));
}

function variantsFor(product) {
  const grouped = new Map();
  for (const document of productDocuments(product)) {
    const model = document.testedModel || "";
    if (!model) continue;
    if (!grouped.has(model)) grouped.set(model, []);
    grouped.get(model).push(document);
  }

  let models = [...grouped.keys()];
  const preferred = product.testedModels || [];
  models.sort((a, b) => {
    const ai = preferred.indexOf(a);
    const bi = preferred.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  if (!models.length) {
    const recorded = (product.productRange || []).find(([label]) => /recorded model/i.test(label))?.[1] || product.name;
    return [{ model: recorded, slug: slugify(recorded), documents: productDocuments(product), image: product.gallery?.[0]?.[0] }];
  }

  return models.map((model) => {
    const modelDocs = grouped.get(model);
    const representative = modelDocs.find((document) => document.previewImages?.some((image) => image.includes("product-photo"))) || modelDocs[0];
    const image = representative.previewImages?.find((item) => item.includes("product-photo")) || product.gallery?.[preferred.indexOf(model)]?.[0] || product.gallery?.[0]?.[0];
    return { model, slug: slugify(model), documents: modelDocs, representative, image };
  });
}

function familySidebar(currentId, depth = "../../") {
  return `<aside class="v5-family-sidebar"><h3>Transformer</h3>${categories.map((category) => `<a class="${category.id === currentId ? "active" : ""}" href="${depth}products/${category.id}/">${esc(category.shortName)}</a>`).join("")}</aside>`;
}

function familyMain(product) {
  const depth = "../../";
  const variants = variantsFor(product);
  const applicationImages = ["applications/grid-substation-yard.jpeg", "applications/renewable-wind-solar-landscape.jpeg", "products/distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp", "applications/utility-scale-solar-farm-aerial-02.jpeg"];
  return `<section class="yw-product-banner product-family v5-family-banner" style="--banner:url('${media(product.gallery[0][0], depth)}')"><div><p>PRODUCTS / ${esc(product.family)}</p><h1>${esc(product.name)}</h1></div></section>
    <section class="section v5-family-layout">${familySidebar(product.id, depth)}<div class="v5-family-content">
      <div class="v5-family-heading"><p>PRODUCT RANGE</p><h2>Enabling Products</h2><div class="v5-family-capability"><span>${esc(product.seriesCapability.voltage)}</span><span>${esc(product.seriesCapability.capacity)}</span><span>${esc(product.seriesCapability.cooling)}</span></div></div>
      <div class="v5-model-grid">${variants.map((variant) => `<a class="v5-model-card" href="${esc(variant.slug)}.html"><div class="v5-model-image"><img src="${media(variant.image, depth)}" alt="${esc(variant.model)}" loading="lazy"></div><div class="v5-model-copy"><h3>${esc(variant.model)}</h3><p>${esc(variant.representative?.ratedPower || "Configured model")} · ${esc(variant.representative?.ratedVoltage || product.seriesCapability.voltage)}</p><span>EXPLORE →</span></div></a>`).join("")}</div>
    </div></section>
    <section class="section pale v5-family-applications"><div class="v5-family-heading"><p>APPLICATIONS</p><h2>Applied Industries</h2></div><div class="yw-industry-grid">${product.applications.slice(0,4).map((name,index) => `<a href="${depth}applications.html"><img src="${media(applicationImages[index % applicationImages.length], depth)}" alt="${esc(name)}" loading="lazy"><h3>${esc(name)}</h3></a>`).join("")}</div></section>
    <section class="section inquiry-cta"><div><p class="eyebrow">PROJECT INQUIRY</p><h2>Need a different rating or project configuration?</h2></div><button class="btn btn-primary" type="button" data-quote-open>REQUEST A QUOTE</button></section>`;
}

function compactEvidence(document, depth) {
  const cover = document.previewImages?.[0];
  const content = cover ? `<img src="${media(cover, depth)}" alt="${esc(document.title)}" loading="lazy">` : `<div class="v5-evidence-pending">Asset pending</div>`;
  const href = document.pdf ? media(document.pdf, depth) : "";
  const wrapOpen = href ? `<a class="v5-evidence-card" href="${href}" target="_blank" rel="noopener">` : `<div class="v5-evidence-card">`;
  const wrapClose = href ? `</a>` : `</div>`;
  return `${wrapOpen}<div class="v5-evidence-cover">${content}</div><div class="v5-evidence-meta"><strong>${esc(docType(document.type))}</strong><span>${esc(document.reportNo || document.ratedVoltage || "Reference document")}</span></div>${wrapClose}`;
}

function modelMain(product, variant) {
  const depth = "../../";
  const representative = variant.representative || variant.documents[0];
  const image = variant.image || product.gallery[0][0];
  const specs = [
    ["Model", variant.model],
    ["Rated capacity", representative?.ratedPower],
    ["Rated voltage", representative?.ratedVoltage],
    ["Cooling", product.seriesCapability.cooling],
    ["Installation", product.seriesCapability.installation],
    ["Frequency", product.seriesCapability.frequency]
  ].filter(([, value]) => value);
  const gallery = [image, ...product.gallery.map(([src]) => src)].filter((value, index, array) => value && array.indexOf(value) === index).slice(0,4);

  return `<section class="v5-model-hero"><div class="v5-model-breadcrumb"><a href="index.html">${esc(product.name)}</a><span>/</span><strong>${esc(variant.model)}</strong></div><div class="v5-model-hero-grid"><div class="v5-model-gallery"><img class="v5-model-main-image" src="${media(gallery[0], depth)}" alt="${esc(variant.model)}"><div class="v5-model-thumbs">${gallery.map((src, index) => `<button type="button" class="${index === 0 ? "active" : ""}" data-v5-model-thumb data-src="${media(src, depth)}"><img src="${media(src, depth)}" alt="" loading="lazy"></button>`).join("")}</div></div><div class="v5-model-summary"><p>${esc(product.family)}</p><h1>${esc(variant.model)}</h1><div class="v5-model-specs">${specs.map(([label, value]) => `<div><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("")}</div><div class="hero-actions"><button class="btn btn-primary" type="button" data-quote-open>REQUEST A QUOTE</button><a class="btn outline-dark" href="#documents">TEST REPORTS</a></div></div></div></section>
    <section class="section v5-model-overview"><div class="v5-model-overview-copy"><p class="eyebrow">PRODUCT OVERVIEW</p><h2>${esc(product.name)}</h2><p>${esc(product.description)}</p></div><div class="v5-feature-grid">${product.features.slice(0,4).map((feature,index) => `<article><span>${String(index+1).padStart(2,"0")}</span><p>${esc(feature)}</p></article>`).join("")}</div></section>
    <section class="section pale v5-model-documents" id="documents"><div class="v5-family-heading"><p>QUALITY EVIDENCE</p><h2>Certificates & Test Reports</h2><span class="v5-section-note">Documents shown below apply to this exact model only.</span></div><div class="v5-evidence-grid">${variant.documents.map((document) => compactEvidence(document, depth)).join("")}</div></section>
    <section class="section v5-model-apps"><div class="v5-family-heading"><p>APPLICATIONS</p><h2>Typical Applications</h2></div><div class="v5-app-chip-row">${product.applications.map((application) => `<a href="${depth}applications.html">${esc(application)}</a>`).join("")}</div></section>
    <section class="section inquiry-cta"><div><p class="eyebrow">PROJECT INQUIRY</p><h2>Review ${esc(variant.model)} against your project specification.</h2></div><button class="btn btn-primary" type="button" data-quote-open>REQUEST A QUOTE</button></section>`;
}

function certificateCoverflow() {
  const preferredIds = [
    "oil-distribution-1600kva-tuv",
    "power-transformer-50mva-110kv",
    "power-transformer-150mva-132kv",
    "power-transformer-240mva-220kv-ssz20",
    "dry-type-scb18-2500kva-10kv",
    "european-substation-12500kva-35kv",
    "china-substation-12500kva-35kv",
    "oil-distribution-630kva-ce"
  ];
  const source = preferredIds.map((id) => documents.find((document) => document.id === id)).filter((document) => document?.previewImages?.[0]);
  return `<div class="v5-certificate-coverflow" data-v5-coverflow aria-label="Certificates and test reports"><button class="v5-coverflow-arrow previous" type="button" data-v5-coverflow-prev aria-label="Previous certificate">←</button><div class="v5-coverflow-stage" data-v5-coverflow-stage>${source.map((document, index) => `<a class="v5-coverflow-card" data-v5-coverflow-card data-index="${index}" href="resources.html#certificates" aria-label="${esc(document.title)}"><img src="${media(document.previewImages[0])}" alt="${esc(document.title)}" loading="lazy" draggable="false"></a>`).join("")}</div><button class="v5-coverflow-arrow next" type="button" data-v5-coverflow-next aria-label="Next certificate">→</button></div>`;
}

function whyChooseUs() {
  return `<section class="section yw-why v5-why" id="why-us"><div class="yw-centered-head light"><p>WHY CHOOSE US</p><h2>ENGINEERING CONFIDENCE YOU CAN REVIEW</h2><div class="v5-why-links"><a href="applications.html">VIEW CASES →</a><a href="manufacturing.html">VIEW MANUFACTURING →</a></div></div>
    <div class="yw-why-grid"><article><span>01</span><h3>Certification & Testing</h3><p>Independent certificates and model-specific reports organized by exact tested model.</p></article><article><span>02</span><h3>Project Experience</h3><p>Reference projects across renewable energy, utility grids, industry and infrastructure.</p></article><article><span>03</span><h3>Manufacturing & Quality</h3><p>Production, assembly, testing and quality-control capability connected to engineering delivery.</p></article></div>
    <div class="yw-cert-block v5-cert-block"><div class="yw-subhead"><p>CERTIFICATES & TEST REPORTS</p><a href="resources.html">VIEW ALL →</a></div>${certificateCoverflow()}</div>
    <div class="v5-proof-grid"><a class="v5-proof-card" href="applications.html"><div class="v5-proof-image"><img src="${media("applications/renewable-wind-solar-landscape.jpeg")}" alt="Tianyu Electric project reference" loading="lazy"></div><div><p>PROJECT CASES</p><h3>From renewable energy to utility and industrial power projects</h3><span>Explore recorded project references by application and product family.</span><strong>VIEW CASES →</strong></div></a><a class="v5-proof-card" href="manufacturing.html"><div class="v5-proof-image"><img src="${media("company/factory-campus-panorama.jpeg")}" alt="Tianyu Electric manufacturing base" loading="lazy"></div><div><p>MANUFACTURING</p><h3>Production, assembly, testing and quality control in one workflow</h3><span>Review the manufacturing base and the equipment behind project delivery.</span><strong>VIEW MANUFACTURING →</strong></div></a></div>
  </section>`;
}

function updateHome() {
  const target = path.join(dist, "index.html");
  let html = fs.readFileSync(target, "utf8");
  html = html.replace(/<section class="section yw-why"[\s\S]*?<\/section>(?=<section class="section yw-news")/, whyChooseUs());
  html = injectAssets(html);
  fs.writeFileSync(target, html);

  const productsPath = path.join(dist, "products.html");
  if (fs.existsSync(productsPath)) {
    let productsHtml = fs.readFileSync(productsPath, "utf8");
    productsHtml = productsHtml.replace('class="section yw-product-index"', 'class="section yw-product-index" id="products"');
    fs.writeFileSync(productsPath, productsHtml);
  }
}

function updateFamilyPagesAndCreateModels() {
  for (const product of products) {
    const familyPath = path.join(dist, "products", product.slug, "index.html");
    if (!fs.existsSync(familyPath)) continue;
    let familyHtml = fs.readFileSync(familyPath, "utf8");
    familyHtml = replaceMain(familyHtml, familyMain(product));
    familyHtml = injectAssets(familyHtml, "../../");
    fs.writeFileSync(familyPath, familyHtml);

    for (const variant of variantsFor(product)) {
      let modelHtml = fs.readFileSync(familyPath, "utf8");
      modelHtml = replaceMain(modelHtml, modelMain(product, variant));
      const title = `${variant.model} | ${product.name} | Tianyu Electric`;
      const description = `${variant.model} ${variant.representative?.ratedPower || ""} ${variant.representative?.ratedVoltage || ""} transformer product page with model-specific test documents and project inquiry.`.replace(/\s+/g, " ").trim();
      modelHtml = fixMeta(modelHtml, title, description, `/products/${product.slug}/${variant.slug}.html`);
      fs.writeFileSync(path.join(dist, "products", product.slug, `${variant.slug}.html`), modelHtml);
    }
  }
}

function walkHtml(directory, callback) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walkHtml(full, callback);
    else if (entry.isFile() && entry.name.endsWith(".html")) callback(full);
  }
}

function fixProductLinksAndInject() {
  walkHtml(dist, (file) => {
    let html = fs.readFileSync(file, "utf8");
    html = html.replace(/(\.\.\/)*products\.html#prefabricated-substation/g, (match) => match.replace("#prefabricated-substation", "#products"));
    const relative = path.relative(dist, file).replaceAll("\\", "/");
    const depth = relative.startsWith("products/") && relative.split("/").length >= 3 ? "../../" : relative.startsWith("knowledge/") ? "../".repeat(relative.split("/").length - 1) : "";
    html = injectAssets(html, depth);
    fs.writeFileSync(file, html);
  });
}

const cssDir = path.join(dist, "assets", "css");
const jsDir = path.join(dist, "assets", "js");
fs.mkdirSync(cssDir, { recursive: true });
fs.mkdirSync(jsDir, { recursive: true });
fs.copyFileSync(path.join(__dirname, "ux-refine-v5.css"), path.join(cssDir, "ux-refine-v5.css"));
fs.copyFileSync(path.join(__dirname, "ux-refine-v5.js"), path.join(jsDir, "ux-refine-v5.js"));

updateHome();
updateFamilyPagesAndCreateModels();
fixProductLinksAndInject();

console.log("Applied V5 coverflow certificates, proof links and model-level product navigation.");
