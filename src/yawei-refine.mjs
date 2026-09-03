import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { categories, products, otherSolutions } from "./products-data.mjs";
import { documents } from "./documents-data.mjs";
import { projects } from "./projects-data.mjs";
import { company, companyStats, featuredProjectNames, knowledgeHighlights } from "./site-data.mjs";
import { evidenceCarousel, drawingGallery, documentsForProduct, mediaUrl } from "./evidence-render.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const esc = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));
const media = (source, depth = "") => mediaUrl(source, depth);

function copyRefineAssets() {
  const cssDir = path.join(dist, "assets", "css");
  const jsDir = path.join(dist, "assets", "js");
  fs.mkdirSync(cssDir, { recursive: true });
  fs.mkdirSync(jsDir, { recursive: true });
  fs.copyFileSync(path.join(__dirname, "yawei-refine.css"), path.join(cssDir, "yawei-refine.css"));
  fs.copyFileSync(path.join(__dirname, "yawei-refine.js"), path.join(jsDir, "yawei-refine.js"));
}

function injectAssets(html, depth = "") {
  if (!html.includes("yawei-refine.css")) {
    html = html.replace("</head>", `    <link rel="stylesheet" href="${depth}assets/css/yawei-refine.css">\n</head>`);
  }
  if (!html.includes("yawei-refine.js")) {
    html = html.replace("</body>", `    <script src="${depth}assets/js/yawei-refine.js"></script>\n</body>`);
  }
  return html;
}

function replaceMain(html, content) {
  return html.replace(/<main>[\s\S]*?<\/main>/, `<main>${content}</main>`);
}

function readHtml(relative) {
  return fs.readFileSync(path.join(dist, relative), "utf8");
}

function writeHtml(relative, html) {
  fs.writeFileSync(path.join(dist, relative), html);
}

function productCard(category, depth = "") {
  return `<a class="yw-product-card" href="${depth}products/${category.id}/">
    <div class="yw-product-image"><img src="${media(category.image, depth)}" alt="${esc(category.name)}" loading="lazy"></div>
    <div class="yw-product-card-copy"><h3>${esc(category.name)}</h3><span>EXPLORE</span></div>
  </a>`;
}

function heroWave() {
  const slides = [
    ["applications/grid-substation-yard.jpeg", "POWER TRANSFORMER & SUBSTATION SOLUTIONS", "Utility, renewable energy and industrial power projects."],
    ["evidence/sample-photo-pages/power-transformer-240mva-220kv-ssz22-sample-photo-page.webp", "UP TO 220 kV POWER TRANSFORMER REFERENCES", "Model-specific test evidence from 110 kV to 220 kV systems."],
    ["company/factory-campus-panorama.jpeg", "FROM FACTORY TO PROJECT DELIVERY", "Engineering review, manufacturing, testing and document support in one workflow."]
  ];
  return `<section class="home-wave-hero" data-wave-slider>
    <div class="home-wave-slides">${slides.map(([image, title, text], index) => `<article class="home-wave-slide${index === 0 ? " active" : ""}" data-wave-slide><img src="${media(image)}" alt="${esc(title)}"><div class="home-wave-overlay"></div><div class="home-wave-copy"><p>TIANYU ELECTRIC</p><h1>${esc(title)}</h1><span>${esc(text)}</span><div><a class="yw-outline-button" href="products.html">EXPLORE PRODUCTS</a><button class="yw-solid-button" type="button" data-quote-open>REQUEST A QUOTE</button></div></div></article>`).join("")}</div>
    <div class="home-wave-dots">${slides.map((_, index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-wave-dot="${index}" aria-label="Show hero slide ${index + 1}"></button>`).join("")}</div>
    <svg class="home-wave-edge" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0,58 C220,112 400,4 655,55 C900,104 1110,19 1440,66 L1440,120 L0,120 Z"></path></svg>
  </section>`;
}

function companyOverview() {
  return `<section class="yw-company-overview">
    <div class="yw-company-copy"><p class="yw-kicker">TIANYU ELECTRIC</p><h2>${esc(company.legalName)}</h2><p>Established in ${esc(company.established)}, Tianyu Electric provides transformer, prefabricated substation, switchgear and primary electrical equipment solutions for utility, renewable, industrial and infrastructure projects.</p><a class="yw-text-arrow" href="about.html">EXPLORE COMPANY <span>→</span></a></div>
    <div class="yw-stat-grid">${companyStats.map((stat, index) => `<article><small>${String(index + 1).padStart(2, "0")}</small><strong data-count-up="${esc(stat.value)}">0</strong><span>${esc(stat.label)}</span></article>`).join("")}</div>
  </section>`;
}

function oneStopProducts() {
  return `<section class="section yw-one-stop" id="products"><div class="yw-centered-head"><p>PRODUCTS</p><h2>TRANSFORMER CUSTOMIZED ONE-STOP SOLUTION</h2></div><div class="yw-product-grid">${categories.map((category) => productCard(category)).join("")}</div></section>`;
}

function certificateMarquee() {
  const source = documents.filter((document) => document.previewImages?.length).slice(0, 12);
  const loop = [...source, ...source];
  return `<div class="certificate-marquee-viewport" data-certificate-marquee aria-label="Certificates and test reports">
    <div class="certificate-marquee-track">${loop.map((document) => `<a class="certificate-frame" href="resources.html#certificates" aria-label="Open certificates and test reports"><img src="${media(document.previewImages[0])}" alt="${esc(document.title)}" loading="lazy" draggable="false"></a>`).join("")}</div>
  </div>`;
}

function whyChooseUs() {
  const featured = featuredProjectNames.map((name) => projects.find((project) => project.name === name)).filter(Boolean).slice(0, 3);
  return `<section class="section yw-why" id="why-us"><div class="yw-centered-head light"><p>WHY CHOOSE US</p><h2>ENGINEERING CONFIDENCE YOU CAN REVIEW</h2></div>
    <div class="yw-why-grid">
      <article><span>01</span><h3>Certification & Testing</h3><p>Independent certificates and model-specific reports are organized by tested rating and report number.</p></article>
      <article><span>02</span><h3>Project Experience</h3><p>Thirty-six recorded references span renewable energy, utility grids, industry, infrastructure and energy storage.</p></article>
      <article><span>03</span><h3>Manufacturing & Quality</h3><p>Production, assembly, testing and quality-control stages are connected to the engineering review workflow.</p></article>
    </div>
    <div class="yw-cert-block"><div class="yw-subhead"><p>CERTIFICATES & TEST REPORTS</p><a href="resources.html">VIEW ALL →</a></div>${certificateMarquee()}</div>
    <div class="yw-case-strip">${featured.map((project) => `<a href="applications.html"><span>${esc(project.country || project.application)}</span><h3>${esc(project.name)}</h3><small>${esc(project.capacity || project.application)}</small></a>`).join("")}</div>
  </section>`;
}

function newsSection() {
  return `<section class="section yw-news" id="news"><div class="yw-news-head"><div><p>NEWS</p><h2>TRANSFORMER INFORMATION NEWS</h2></div><a href="news.html">VIEW ALL NEWS →</a></div><div class="yw-news-grid">${knowledgeHighlights.map((item, index) => `<a class="yw-news-card${index === 0 ? " featured" : ""}" href="${esc(item.href)}"><div class="yw-news-number">${String(index + 1).padStart(2, "0")}</div><p>${esc(item.category)}</p><h3>${esc(item.title)}</h3><span>${esc(item.summary)}</span><strong>READ MORE →</strong></a>`).join("")}</div></section>`;
}

function industrialLandscape() {
  const images = [
    ["company/factory-campus-panorama.jpeg", "Tianyu Electric factory campus"],
    ["applications/grid-substation-yard.jpeg", "Substation and power equipment landscape"],
    ["applications/renewable-wind-solar-landscape.jpeg", "Renewable energy project landscape"],
    ["applications/utility-scale-solar-farm-aerial-02.jpeg", "Offshore renewable project landscape"],
    ["evidence/sample-photo-pages/power-transformer-240mva-220kv-ssz22-sample-photo-page.webp", "220 kV power transformer"],
    ["products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp", "Prefabricated substation"],
  ];
  return `<section class="yw-landscape"><div class="yw-centered-head"><p>TIANYU ELECTRIC</p><h2>EXCELLENT INDUSTRIAL LANDSCAPE</h2></div><div class="yw-landscape-grid">${images.map(([source, alt], index) => `<figure class="landscape-${index + 1}"><img src="${media(source)}" alt="${esc(alt)}" loading="lazy"></figure>`).join("")}</div></section>`;
}

function homeMain() {
  return `${heroWave()}${companyOverview()}${oneStopProducts()}${whyChooseUs()}${newsSection()}${industrialLandscape()}`;
}

function productIndexMain() {
  const industryCards = [
    ["Power System", "applications/grid-substation-yard.jpeg"],
    ["Industrial Field", "products/distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp"],
    ["Renewable Energy", "applications/renewable-wind-solar-landscape.jpeg"],
    ["Transportation", "applications/utility-scale-solar-farm-aerial-02.jpeg"]
  ];
  return `<section class="yw-product-banner" style="--banner:url('${media("evidence/sample-photo-pages/power-transformer-240mva-220kv-ssz22-sample-photo-page.webp")}')"><div><p>PRODUCTS</p><h1>Transformer</h1></div></section>
    <section class="section yw-product-index"><div class="yw-category-tabs">${categories.map((category) => `<a href="products/${category.id}/">${esc(category.shortName)}</a>`).join("")}</div><div class="yw-index-title"><p>PRODUCTS</p><h2>Enabling Products</h2></div><div class="yw-product-grid">${categories.map((category) => productCard(category)).join("")}</div></section>
    <section class="section pale yw-industries"><div class="yw-index-title"><p>APPLICATIONS</p><h2>Applied Industries</h2></div><div class="yw-industry-grid">${industryCards.map(([name, image]) => `<a href="applications.html"><img src="${media(image)}" alt="${esc(name)}" loading="lazy"><h3>${esc(name)}</h3></a>`).join("")}</div></section>
    <section class="section yw-other-solutions"><div class="yw-index-title"><p>MORE SOLUTIONS</p><h2>Related Transformer Solutions</h2></div><div class="yw-other-grid">${otherSolutions.map((item) => `<article><img src="${media(item.image)}" alt="${esc(item.name)}" loading="lazy"><div><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p></div></article>`).join("")}</div></section>`;
}

function gallery(product, depth) {
  return `<div class="product-gallery yw-auto-gallery" data-product-gallery data-auto-gallery><button class="gallery-main" type="button" data-gallery-open aria-label="Open product image viewer"><img src="${media(product.gallery[0][0], depth)}" alt="${esc(product.gallery[0][1])}" data-gallery-main></button><div class="gallery-thumbs">${product.gallery.map(([source, alt], index) => `<button type="button" class="${index === 0 ? "active" : ""}" data-gallery-thumb data-src="${media(source, depth)}" data-alt="${esc(alt)}"><img src="${media(source, depth)}" alt="" loading="lazy"></button>`).join("")}</div><button class="gallery-nav previous" type="button" data-gallery-prev aria-label="Previous product image">←</button><button class="gallery-nav next" type="button" data-gallery-next aria-label="Next product image">→</button></div>`;
}

function detailTable(rows) {
  return `<div class="yw-spec-table">${rows.map(([label, value]) => `<div><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("")}</div>`;
}

function productProjectCards(product, depth) {
  return projects.filter((project) => project.productIds.includes(product.id)).slice(0, 3).map((project) => `<a class="yw-reference-card" href="${depth}applications.html"><span>${esc(project.country || project.application)}</span><h3>${esc(project.name)}</h3><small>${esc(project.capacity || project.application)}</small></a>`).join("");
}

function productMain(product) {
  const depth = "../../";
  const evidence = documentsForProduct(product);
  const models = product.testedModels?.length ? product.testedModels : [product.name];
  const industries = product.applications.slice(0, 4);
  const industryImages = ["applications/grid-substation-yard.jpeg", "applications/renewable-wind-solar-landscape.jpeg", "products/distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp", "applications/utility-scale-solar-farm-aerial-02.jpeg"];
  return `<section class="yw-product-banner product-family" style="--banner:url('${media(product.gallery[0][0], depth)}')"><div><p>PRODUCTS / ${esc(product.family)}</p><h1>${esc(product.name)}</h1></div></section>
    <section class="section yw-category-layout"><aside><h3>Transformer</h3>${categories.map((category) => `<a class="${category.id === product.id ? "active" : ""}" href="${depth}products/${category.id}/">${esc(category.shortName)}</a>`).join("")}</aside><div><div class="yw-index-title"><p>PRODUCT RANGE</p><h2>Enabling Products</h2></div><div class="yw-model-grid">${models.map((model, index) => `<a href="#product-details"><img src="${media(product.gallery[index % product.gallery.length][0], depth)}" alt="${esc(model)}" loading="lazy"><div><h3>${esc(model)}</h3><span>EXPLORE</span></div></a>`).join("")}</div></div></section>
    <section class="section pale yw-industries"><div class="yw-index-title"><p>APPLICATIONS</p><h2>Applied Industries</h2></div><div class="yw-industry-grid">${industries.map((name, index) => `<a href="${depth}applications.html"><img src="${media(industryImages[index % industryImages.length], depth)}" alt="${esc(name)}" loading="lazy"><h3>${esc(name)}</h3></a>`).join("")}</div></section>
    <section class="section yw-product-detail" id="product-details"><div>${gallery(product, depth)}</div><div class="yw-detail-copy"><p class="yw-kicker">${esc(product.family)}</p><h2>${esc(product.name)}</h2><p>${esc(product.description)}</p><div class="yw-keyline-row"><span>${esc(product.seriesCapability.voltage)}</span><span>${esc(product.seriesCapability.capacity)}</span><span>${esc(product.seriesCapability.cooling)}</span></div>${detailTable(product.keyParameters.slice(0, 5))}<div class="hero-actions"><button class="btn btn-primary" type="button" data-quote-open>REQUEST A QUOTE</button><a class="btn outline-dark" href="#tested-verified">TEST REPORTS</a></div></div></section>
    <section class="section pale yw-product-tech"><div class="yw-index-title"><p>TECHNICAL DATA</p><h2>Product Parameters</h2></div>${detailTable(product.technicalParameters)}</section>
    <section class="section evidence-section" id="tested-verified"><div class="yw-index-title"><p>QUALITY EVIDENCE</p><h2>Tested & Verified</h2></div>${evidenceCarousel(evidence, depth, { compact: true, id: `evidence-${product.id}` })}</section>
    ${drawingGallery(product.drawingIds, depth)}
    <section class="section pale"><div class="yw-index-title"><p>PROJECT EXPERIENCE</p><h2>Reference Projects</h2></div><div class="yw-reference-grid">${productProjectCards(product, depth)}</div></section>
    <section class="section inquiry-cta"><div><p class="eyebrow">PROJECT INQUIRY</p><h2>Review this transformer family against your specification.</h2></div><button class="btn btn-primary" type="button" data-quote-open>REQUEST A QUOTE</button></section>`;
}

function newsMain() {
  return `<section class="yw-product-banner news-banner" style="--banner:url('${media("applications/renewable-wind-solar-landscape.jpeg")}')"><div><p>TIANYU ELECTRIC</p><h1>News & Knowledge</h1></div></section><section class="section yw-news-page"><div class="yw-index-title"><p>LATEST UPDATES</p><h2>Transformer Information News</h2></div><div class="yw-news-grid">${knowledgeHighlights.map((item, index) => `<a class="yw-news-card${index === 0 ? " featured" : ""}" href="${esc(item.href)}"><div class="yw-news-number">${String(index + 1).padStart(2, "0")}</div><p>${esc(item.category)}</p><h3>${esc(item.title)}</h3><span>${esc(item.summary)}</span><strong>READ MORE →</strong></a>`).join("")}</div></section>`;
}

function refinePage(relative, content, depth = "") {
  let html = readHtml(relative);
  html = replaceMain(html, content);
  html = injectAssets(html, depth);
  html = html.replace(/<a href="[^\"]*contact\.html">Contact<\/a>/g, `<a href="${depth}news.html">News</a>`);
  writeHtml(relative, html);
}

copyRefineAssets();
refinePage("index.html", homeMain());
refinePage("products.html", productIndexMain());
for (const product of products) refinePage(`products/${product.slug}/index.html`, productMain(product), "../../");
refinePage("news.html", newsMain());

let about = readHtml("about.html");
about = about.replace(/<section class="section company-intro">[\s\S]*?<\/section>/, `<section class="section company-intro company-intro-clean"><div><p class="eyebrow">Company Profile</p><h2>${esc(company.legalName)}</h2><p>Established in ${esc(company.established)} with registered capital of ${esc(company.registeredCapital)}. ${esc(company.groupBackground)}</p><p>${esc(company.manufacturingBase)} ${esc(company.productScope)}</p></div><img src="${media("company/factory-campus-panorama.jpeg")}" alt="Tianyu Electric factory campus" loading="lazy"></section>`);
about = injectAssets(about);
about = about.replace(/<a href="[^\"]*contact\.html">Contact<\/a>/g, `<a href="news.html">News</a>`);
writeHtml("about.html", about);

console.log("Applied Yawei-inspired homepage and product presentation refinement.");
