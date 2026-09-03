import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { categories, products, otherSolutions, productById } from "./products-data.mjs";
import { documents, drawings, documentTypes } from "./documents-data.mjs";
import { projects, projectApplications } from "./projects-data.mjs";
import { factoryCapabilities, factorySections } from "./factory-data.mjs";
import { navigation, company, companyStats, applications, featuredProjectNames, knowledgeHighlights } from "./site-data.mjs";
import {
  drawingGallery,
  drawingViewer,
  documentsForProduct,
  evidenceCard,
  evidenceCarousel,
  evidenceModal,
  evidenceTemplates,
  mediaUrl
} from "./evidence-render.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const siteUrl = (process.env.SITE_URL || "").replace(/\/$/, "");

const esc = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

const ensureDir = (directory) => fs.mkdirSync(directory, { recursive: true });
const href = (target, depth = "") => target.startsWith("#") ? target : `${depth}${target}`;
const canonicalHref = (canonical) => siteUrl ? `${siteUrl}/${canonical}` : `/${canonical}`;

function copyDirectory(source, target) {
  ensureDir(target);
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) copyDirectory(from, to);
    else fs.copyFileSync(from, to);
  }
}

function prepareOutput() {
  fs.rmSync(dist, { recursive: true, force: true });
  ensureDir(path.join(dist, "assets", "css"));
  ensureDir(path.join(dist, "assets", "js"));
  fs.copyFileSync(path.join(__dirname, "styles.css"), path.join(dist, "assets", "css", "styles.css"));
  fs.copyFileSync(path.join(__dirname, "main.js"), path.join(dist, "assets", "js", "main.js"));
  copyDirectory(path.join(root, "source-media"), path.join(dist, "assets", "media"));
}

function nav(active, depth = "") {
  return navigation.map((item) => {
    const link = `<a class="${active === item.label ? "active" : ""}" href="${href(item.href, depth)}">${esc(item.label)}</a>`;
    if (!item.items) return `<div class="nav-item">${link}</div>`;
    return `<div class="nav-item nav-dropdown">${link}<div class="dropdown-menu">${item.items.map(([label, target]) => `<a href="${href(target, depth)}">${esc(label)}</a>`).join("")}</div></div>`;
  }).join("");
}

function quoteForm(compact = false) {
  return `<form class="quote-form${compact ? " compact" : ""}">
    <label>Name<input name="name" autocomplete="name" required></label>
    <label>Email<input name="email" type="email" autocomplete="email" required></label>
    <label>Company<input name="company" autocomplete="organization"></label>
    <label>Destination Country<input name="country" autocomplete="country-name"></label>
    <label>Product Family<select name="product"><option value="">Select a product</option>${categories.map((category) => `<option value="${esc(category.id)}">${esc(category.name)}</option>`).join("")}</select></label>
    <label>Capacity / Voltage<input name="rating" placeholder="e.g. 2500 kVA, 35/0.8 kV"></label>
    <label class="full">Project Requirements<textarea name="message" rows="5" placeholder="Application, standard, installation environment, quantity and required delivery schedule"></textarea></label>
    <label class="full">Technical File<input name="file" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.dxf,.jpg,.jpeg,.png"></label>
    <button class="btn btn-primary" type="submit">Send Inquiry</button>
    <p class="form-message" aria-live="polite"></p>
  </form>`;
}

function quoteModal() {
  return `<div class="quote-modal" data-quote-modal aria-hidden="true"><div class="modal-backdrop" data-quote-close></div><section class="quote-panel" role="dialog" aria-modal="true" aria-labelledby="quote-title"><button class="modal-close" type="button" aria-label="Close quote form" data-quote-close>×</button><p class="eyebrow">Engineering Inquiry</p><h2 id="quote-title">Request a Technical Review</h2><p>Share the key electrical, site and document requirements for model selection.</p>${quoteForm(true)}</section></div>`;
}

function footer(depth = "") {
  return `<footer class="footer"><div class="footer-grid">
    <div><h2>Tianyu Electric</h2><p>${esc(company.tagline)}</p><p>${esc(company.groupBackground)}</p></div>
    <div><h3>Products</h3>${categories.slice(0, 5).map((category) => `<a href="${href(`products/${category.id}/`, depth)}">${esc(category.shortName)}</a>`).join("")}</div>
    <div><h3>Resources</h3><a href="${href("resources.html#certificates", depth)}">Certificates & Test Reports</a><a href="${href("resources.html#drawings", depth)}">Engineering Drawings</a><a href="${href("knowledge/index.html", depth)}">Knowledge Center</a></div>
    <div><h3>Company</h3><a href="${href("about.html", depth)}">About Tianyu</a><a href="${href("manufacturing.html", depth)}">Manufacturing</a><a href="${href("quality.html", depth)}">Quality</a><a href="${href("contact.html", depth)}">Contact</a></div>
  </div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Tianyu Electric</span><a href="${href("privacy.html", depth)}">Privacy Policy</a></div></footer>`;
}

function page({ title, description, active, canonical, content, depth = "" }) {
  const socialImage = siteUrl ? `${siteUrl}/assets/media/branding/og-tianyu-electric.png` : "/assets/media/branding/og-tianyu-electric.png";
  return `<!doctype html><html lang="en"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${esc(title)}</title><meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${canonicalHref(canonical)}">
    <meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonicalHref(canonical)}"><meta property="og:image" content="${socialImage}"><meta name="twitter:card" content="summary_large_image">
    <link rel="stylesheet" href="${depth}assets/css/styles.css">
  </head><body>
    <header class="site-header"><a class="brand" href="${depth}index.html"><span class="brand-mark">TY</span><span><strong>Tianyu Electric</strong><small>Transformer Solutions</small></span></a><button class="menu-toggle" type="button" aria-label="Open navigation" data-menu-toggle>Menu</button><nav class="main-nav" data-nav>${nav(active, depth)}</nav><div class="header-actions"><span class="language">EN</span><button class="btn btn-primary" type="button" data-quote-open>Request a Quote</button></div></header>
    <main>${content}</main>${footer(depth)}${quoteModal()}${evidenceModal()}${drawingViewer()}
    <script src="${depth}assets/js/main.js"></script>
  </body></html>`;
}

const sectionHead = (eyebrow, title, action = "") => `<div class="section-head"><div><p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(title)}</h2></div>${action}</div>`;
const tags = (items) => `<div class="tags">${items.map((item) => `<span>${esc(item)}</span>`).join("")}</div>`;
const media = (source, depth = "") => mediaUrl(source, depth);

function categoryCard(category, depth = "") {
  return `<a class="category-tile" href="${href(`products/${category.id}/`, depth)}"><img src="${media(category.image, depth)}" alt="${esc(category.name)}" loading="lazy"><div><p>Product Family</p><h3>${esc(category.name)}</h3><span>${esc(category.description)}</span></div></a>`;
}

function projectCard(project, depth = "") {
  const product = productById.get(project.productIds[0]);
  return `<article class="project-card" data-project-card data-application="${esc(project.application)}" data-product="${esc(project.productIds[0])}">
    ${project.image ? `<img src="${media(project.image, depth)}" alt="${esc(project.name)}" loading="lazy">` : `<div class="project-mark"><span>${esc(project.application)}</span><strong>${esc(project.capacity || product?.family || "Project")}</strong></div>`}
    <div><p class="eyebrow">${esc(project.country || project.application)}</p><h3>${esc(project.name)}</h3><dl>${project.capacity ? `<dt>Scale</dt><dd>${esc(project.capacity)}</dd>` : ""}<dt>Application</dt><dd>${esc(project.application)}</dd><dt>Product</dt><dd>${esc(product?.name || "")}</dd></dl></div>
  </article>`;
}

function capabilityCard(item, depth = "") {
  return `<article class="factory-card"><img src="${media(item.photo, depth)}" alt="${esc(item.name)} manufacturing capability" loading="lazy"><div><p class="eyebrow">Manufacturing & Testing</p><h3>${esc(item.name)}</h3><p>${esc(item.purpose)}</p><small>${esc(item.applicableProducts.join(" · "))}</small></div></article>`;
}

function table(rows, note = "") {
  if (!rows?.length) return "";
  return `<div class="table-wrap">${note ? `<p class="table-note">${esc(note)}</p>` : ""}<table><tbody>${rows.map(([label, value]) => `<tr><th>${esc(label)}</th><td>${esc(value)}</td></tr>`).join("")}</tbody></table></div>`;
}

function homePage() {
  const evidence = documents.filter((document) => document.featured).slice(0, 8);
  const featuredProjects = featuredProjectNames.map((name) => projects.find((project) => project.name === name)).filter(Boolean);
  return page({
    title: "Power Transformers & Prefabricated Substations | Tianyu Electric",
    description: "Explore Tianyu Electric transformer families, independent test reports, engineering drawings and verified project records.",
    active: "Home",
    canonical: "index.html",
    content: `
      <section class="hero" style="background-image:linear-gradient(90deg,rgba(4,28,50,.9),rgba(4,28,50,.24)),url('${media("applications/grid-substation-yard.jpeg")}')"><div class="hero-inner"><p class="eyebrow">Transformer Evidence, Not Just Claims</p><h1>Power equipment built for real projects.</h1><p>Six core product families backed by model-specific reports, engineering previews and 36 documented project references.</p><div class="hero-actions"><a class="btn btn-primary" href="products.html">Explore Products</a><a class="btn btn-secondary" href="resources.html">View Test Reports</a></div><div class="hero-proof"><span>TÜV</span><span>IEC</span><span>220 kV</span><span>240 MVA</span></div></div></section>
      <section class="section product-matrix">${sectionHead("Product Matrix", "Six core transformer and substation families", '<a class="text-link" href="products.html">View full product index →</a>')}<div class="category-tile-grid">${categories.map((category) => categoryCard(category)).join("")}</div></section>
      <section class="section pale evidence-section" id="tested-verified">${sectionHead("Tested & Verified", "Browse the exact model behind each report", '<a class="text-link" href="resources.html">All documents →</a>')}${evidenceCarousel(evidence)}${evidenceTemplates([], "")}</section>
      <section class="section project-experience">${sectionHead("Project Experience", "Across renewable, grid and industrial systems", '<a class="text-link" href="applications.html">Explore 36 projects →</a>')}<div class="project-grid">${featuredProjects.map((project) => projectCard(project)).join("")}</div></section>
      <section class="section pale">${sectionHead("Manufacturing & Testing", "A capability chain from coil to verification", '<a class="text-link" href="manufacturing.html">Manufacturing overview →</a>')}<div class="factory-grid">${factoryCapabilities.slice(0, 4).map((item) => capabilityCard(item)).join("")}</div></section>
      <section class="section why-grid"><div><p class="eyebrow">Why Tianyu</p><h2>Evidence-led project collaboration</h2><p>Product selection, tested-model evidence, project references and manufacturing steps are connected through structured data so procurement and engineering teams can review the right scope quickly.</p><div class="proof-list"><span>Independent reports tied to exact models</span><span>Series capability kept separate from tested ratings</span><span>Reference drawings labeled as project-dependent</span><span>Missing assets hidden or clearly identified</span></div></div><img src="${media("company/factory-campus-panorama.jpeg")}" alt="Tianyu Electric factory campus" loading="lazy"></section>
      <section class="section pale">${sectionHead("Featured Products", "Start with proven product families")}<div class="featured-product-grid">${products.slice(0, 3).map((product) => `<a class="featured-product" href="products/${product.slug}/"><img src="${media(product.gallery[0][0])}" alt="${esc(product.gallery[0][1])}" loading="lazy"><div><p class="eyebrow">${esc(product.family)}</p><h3>${esc(product.name)}</h3><p>${esc(product.strapline)}</p></div></a>`).join("")}</div></section>
      <section class="section">${sectionHead("News & Knowledge", "Engineering answers for project decisions", '<a class="text-link" href="knowledge/index.html">Knowledge Center →</a>')}<div class="knowledge-grid">${knowledgeHighlights.map((item) => `<a href="${esc(item.href)}"><p class="eyebrow">${esc(item.category)}</p><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p></a>`).join("")}</div></section>
      <section class="section inquiry-cta"><div><p class="eyebrow">Project Inquiry</p><h2>Send the ratings. We will organize the review.</h2><p>Share capacity, voltage, application, destination, standards and any available single-line diagram or specification.</p></div><button class="btn btn-primary" type="button" data-quote-open>Request a Quote</button></section>
    `
  });
}

function productsPage() {
  return page({
    title: "Transformer Product Database | Tianyu Electric",
    description: "Filter Tianyu transformer families by product type, voltage level and application.",
    active: "Products",
    canonical: "products.html",
    content: `
      <section class="page-hero"><p class="eyebrow">Product Database</p><h1>Find the right transformer family</h1><p>Filter by product type, verified voltage range and application, then open the detailed evidence-backed product page.</p></section>
      <section class="section"><div class="filter-panel product-filter" data-product-filter>
        <label>Product Type<select data-filter-type><option value="all">All product types</option>${categories.map((category) => `<option value="${category.id}">${esc(category.shortName)}</option>`).join("")}</select></label>
        <label>Voltage Level<select data-filter-voltage><option value="all">All voltage levels</option><option value="10">≤ 10 kV</option><option value="35">35 kV</option><option value="110">110 kV</option><option value="132">132 kV</option><option value="220">220 kV</option></select></label>
        <label>Application<select data-filter-application><option value="all">All applications</option>${applications.map((item) => `<option value="${esc(item)}">${esc(item)}</option>`).join("")}</select></label>
      </div><div class="product-index-grid">${products.map((product) => {
        const volts = product.seriesCapability.voltage.match(/\d+/g)?.join(" ") || "";
        return `<a class="product-index-card" href="products/${product.slug}/" data-product-index data-type="${product.id}" data-voltage="${esc(volts)}" data-application="${esc(product.applications.join(" "))}"><img src="${media(product.gallery[0][0])}" alt="${esc(product.gallery[0][1])}" loading="lazy"><div><p class="eyebrow">${esc(product.family)}</p><h2>${esc(product.name)}</h2><p>${esc(product.description)}</p>${tags([product.seriesCapability.voltage, product.seriesCapability.capacity])}</div></a>`;
      }).join("")}</div></section>
      <section class="section pale" id="other-solutions">${sectionHead("Other Transformer Solutions", "Specialized and legacy product families")}<div class="other-solutions-grid">${otherSolutions.map((solution) => `<article><img src="${media(solution.image)}" alt="${esc(solution.name)}" loading="lazy"><div><h3>${esc(solution.name)}</h3><p>${esc(solution.description)}</p>${tags(solution.tags)}</div></article>`).join("")}</div></section>
    `
  });
}

function gallery(product, depth) {
  return `<div class="product-gallery" data-product-gallery><button class="gallery-main" type="button" data-gallery-open aria-label="Open product image viewer"><img src="${media(product.gallery[0][0], depth)}" alt="${esc(product.gallery[0][1])}" data-gallery-main></button><div class="gallery-thumbs">${product.gallery.map(([source, alt], index) => `<button type="button" class="${index === 0 ? "active" : ""}" data-gallery-thumb data-src="${media(source, depth)}" data-alt="${esc(alt)}"><img src="${media(source, depth)}" alt="" loading="lazy"></button>`).join("")}</div><button class="gallery-nav previous" type="button" data-gallery-prev aria-label="Previous product image">←</button><button class="gallery-nav next" type="button" data-gallery-next aria-label="Next product image">→</button></div>`;
}

function quickFacts(product) {
  const labels = [["Voltage", "voltage"], ["Capacity", "capacity"], ["Frequency", "frequency"], ["Cooling", "cooling"], ["Installation", "installation"], ["Standard", "standard"]];
  return `<section class="quick-specs">${labels.map(([label, key]) => `<div><span>${label}</span><strong>${esc(product.seriesCapability[key])}</strong></div>`).join("")}</section>`;
}

function productPage(product) {
  const depth = "../../";
  const evidence = documentsForProduct(product);
  const relatedProjects = projects.filter((project) => project.productIds.includes(product.id));
  const availableEvidence = evidence.filter((document) => document.previewImages.length);
  return page({
    title: `${product.name} | Tianyu Electric`,
    description: product.description,
    active: "Products",
    canonical: `products/${product.slug}/`,
    depth,
    content: `
      <section class="product-hero-v2"><div class="product-hero-copy"><p class="eyebrow">${esc(product.family)}</p><h1>${esc(product.name)}</h1><p>${esc(product.strapline)}</p><div class="hero-keylines"><strong>${esc(product.seriesCapability.voltage)}</strong><strong>${esc(product.seriesCapability.capacity)}</strong><strong>${esc(product.seriesCapability.standard)}</strong></div><div class="hero-actions"><button class="btn btn-primary" type="button" data-quote-open>Request a Quote</button><a class="btn outline-dark" href="#tested-verified">View Test Reports</a></div></div>${gallery(product, depth)}</section>
      ${quickFacts(product)}
      <nav class="product-anchor-nav" aria-label="Product page sections"><a href="#overview">Overview</a><a href="#advantages">Key Advantages</a><a href="#range">Product Range</a><a href="#parameters">Parameters</a><a href="#tested-verified">Tested & Verified</a>${product.drawingIds.length ? '<a href="#drawings">Drawings</a>' : ""}<a href="#projects">Projects</a><a href="#manufacturing">Manufacturing</a><a href="#faq">FAQ</a></nav>
      <div class="product-page-body">
        <section class="product-section" id="overview"><p class="eyebrow">Overview</p><h2>${esc(product.name)}</h2><p class="lead">${esc(product.description)}</p><div class="two-column-list"><div><h3>Applications</h3><ul>${product.applications.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div><div id="advantages"><h3>Key Advantages</h3><ul>${product.features.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div></div></section>
        <section class="product-section pale-block" id="range"><p class="eyebrow">Product Range</p><h2>Series Capability</h2><p>Series capability describes the configurable family; it is not a claim that every rating below was covered by the same report.</p>${table(product.productRange)}</section>
        <section class="product-section" id="parameters"><p class="eyebrow">Technical Parameters</p><h2>Configuration Framework</h2>${table(product.technicalParameters, "Final values are confirmed against the approved project specification.")}</section>
        <section class="product-section evidence-section" id="tested-verified">${sectionHead("Tested & Verified", availableEvidence.length ? "Model-specific evidence" : "Recorded certification item")}${evidenceCarousel(evidence, depth, { compact: true, id: `evidence-${product.id}` })}</section>
        ${drawingGallery(product.drawingIds, depth)}
        <section class="product-section" id="projects">${sectionHead("Project References", "Six recorded applications")}<div class="project-grid">${relatedProjects.map((project) => projectCard(project, depth)).join("")}</div></section>
        <section class="product-section pale-block" id="manufacturing"><p class="eyebrow">Manufacturing Capability</p><h2>From component preparation to final verification</h2><div class="factory-grid">${factoryCapabilities.slice(0, 4).map((item) => capabilityCard(item, depth)).join("")}</div></section>
        <section class="product-section faq-section" id="faq"><p class="eyebrow">FAQ</p><h2>Product Review Questions</h2>${product.faq.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join("")}</section>
        <section class="product-section inquiry-cta"><div><p class="eyebrow">Request a Quote</p><h2>Review this family against your specification</h2><p>Send ratings, standards, destination, quantities and available drawings.</p></div><button class="btn btn-primary" type="button" data-quote-open>Start an Inquiry</button></section>
      </div>
    `
  });
}

function applicationsPage() {
  return page({
    title: "Applications & Projects | Tianyu Electric",
    description: "Filter 36 recorded transformer and substation projects by application and product family.",
    active: "Applications & Projects",
    canonical: "applications.html",
    content: `
      <section class="page-hero"><p class="eyebrow">Applications & Projects</p><h1>36 project records across five application groups</h1><p>Missing locations, capacities and project images remain unfilled. The database presents only the information available in the supplied project index.</p></section>
      <section class="section" id="projects"><div class="filter-panel project-filter" data-project-filter><label>Application<select data-project-application><option value="all">All applications</option>${projectApplications.map((item) => `<option value="${esc(item)}">${esc(item)}</option>`).join("")}</select></label><label>Product<select data-project-product><option value="all">All products</option>${categories.map((category) => `<option value="${category.id}">${esc(category.shortName)}</option>`).join("")}</select></label><p><strong data-project-count>${projects.length}</strong> matching projects</p></div><div class="project-grid all-projects">${projects.map((project) => projectCard(project)).join("")}</div></section>
    `
  });
}

function resourcesPage() {
  return page({
    title: "Certificates, Test Reports & Drawings | Tianyu Electric",
    description: "Filter model-specific certificates, independent test reports and engineering drawing previews.",
    active: "Resources",
    canonical: "resources.html",
    content: `
      <section class="page-hero"><p class="eyebrow">Resources</p><h1>Certificates, test reports and engineering previews</h1><p>Each record is tied to a product family, tested model, voltage and issuing organization where the source file provides that information.</p></section>
      <section class="section evidence-section" id="certificates">${sectionHead("Certificates & Test Reports", "Filter the evidence database")}<div class="filter-panel document-filter" data-document-filter>
        <label>Product<select data-document-product><option value="all">All products</option>${categories.map((category) => `<option value="${category.id}">${esc(category.shortName)}</option>`).join("")}</select></label>
        <label>Document Type<select data-document-type><option value="all">All document types</option>${documentTypes.slice(0, 5).map(([value, label]) => `<option value="${value}">${esc(label)}</option>`).join("")}</select></label>
        <label>Voltage<select data-document-voltage><option value="all">All voltages</option>${["10 kV", "22 kV", "35 kV", "110 kV", "132 kV", "220 kV"].map((value) => `<option value="${value}">${value}</option>`).join("")}</select></label>
        <label>Issuer<select data-document-issuer><option value="all">All issuers</option><option value="TÜV Rheinland">TÜV Rheinland</option><option value="Suzhou Electrical Apparatus Science Research Institute">Suzhou Electrical Apparatus Science Research Institute</option></select></label>
      </div><div class="evidence-grid">${documents.map((document) => evidenceCard(document)).join("")}</div>${evidenceTemplates(documents)}</section>
      <section class="section pale" id="drawings">${sectionHead("Engineering Drawings", "Reference outlines from supplied reports")}<div class="drawing-grid">${drawings.map((drawing) => `<article class="drawing-card"><button type="button" data-drawing-open data-drawing-src="${media(drawing.image)}" data-drawing-title="${esc(drawing.title)}"><img src="${media(drawing.image)}" alt="${esc(drawing.title)} preview" loading="lazy"><span>${esc(drawing.type)}</span><strong>${esc(drawing.title)}</strong></button><p>${esc(drawing.note)}</p></article>`).join("")}</div></section>
    `
  });
}

function aboutPage() {
  return page({
    title: "About Tianyu Electric | Transformer Manufacturer",
    description: "Company profile, product scope, manufacturing and evidence-led quality approach.",
    active: "Company",
    canonical: "about.html",
    content: `
      <section class="page-image-hero"><img src="${media("company/factory-campus-panorama.jpeg")}" alt="Tianyu Electric factory campus"><div><p class="eyebrow">Company</p><h1>About Tianyu Electric</h1><p>${esc(company.tagline)}</p></div></section>
      <section class="section company-intro"><div><p class="eyebrow">Company Profile</p><h2>${esc(company.legalName)}</h2><p>Established in ${esc(company.established)} with registered capital of ${esc(company.registeredCapital)}. ${esc(company.groupBackground)}</p><p>${esc(company.manufacturingBase)} ${esc(company.productScope)}</p></div><div class="company-stats">${companyStats.map((stat) => `<article><strong>${esc(stat.value)}</strong><span>${esc(stat.label)}</span></article>`).join("")}</div></section>
      <section class="section pale company-paths"><a href="products.html"><span>01</span><h3>Product Database</h3><p>Six product families with series capability and tested models separated.</p></a><a href="manufacturing.html"><span>02</span><h3>Manufacturing</h3><p>Production and verification workflow framework.</p></a><a href="quality.html"><span>03</span><h3>Quality</h3><p>Third-party reports, standards and quality controls.</p></a><a href="applications.html"><span>04</span><h3>Projects</h3><p>36 recorded project references across five application groups.</p></a></section>
    `
  });
}

function manufacturingPage() {
  return page({
    title: "Manufacturing & Testing | Tianyu Electric",
    description: "Transformer manufacturing, testing, quality control and production capacity framework.",
    active: "Company",
    canonical: "manufacturing.html",
    content: `
      <section class="page-image-hero"><img src="${media("applications/grid-substation-yard.jpeg")}" alt="Transformer factory and substation equipment"><div><p class="eyebrow">Manufacturing</p><h1>Manufacturing & Testing Capability</h1><p>A structured view of production, verification and quality-control stages.</p></div></section>
      <section class="section"><div class="factory-section-grid">${factorySections.map(([title, description]) => `<article><h2>${esc(title)}</h2><p>${esc(description)}</p></article>`).join("")}</div></section>
      <section class="section pale">${sectionHead("Capability Stages", "From winding to final tests")}<div class="factory-grid">${factoryCapabilities.map((item) => capabilityCard(item)).join("")}</div><p class="reference-note">Specific equipment models and numeric production capacities will be published only after the verified equipment register is available.</p></section>
    `
  });
}

function qualityPage() {
  const available = documents.filter((document) => document.previewImages.length);
  return page({
    title: "Quality Assurance & Third-Party Reports | Tianyu Electric",
    description: "Browse Tianyu Electric third-party certificates, model-specific test reports and quality assurance framework.",
    active: "Company",
    canonical: "quality.html",
    content: `
      <section class="page-hero"><p class="eyebrow">Quality Assurance</p><h1>Quality evidence tied to the tested model</h1><p>Independent reports are presented with report numbers, rated values, exact models and key-page previews.</p></section>
      <section class="section evidence-section">${sectionHead("Third-Party Evidence", "19 supplied report files")}${evidenceCarousel(available)}${evidenceTemplates([], "")}</section>
      <section class="section pale quality-grid"><article><p class="eyebrow">Third-Party Test Reports</p><h2>Model-specific review</h2><p>Reports cover distribution, high-voltage power, cast-resin dry-type and prefabricated substation models.</p></article><article><p class="eyebrow">International Standards</p><h2>Standards by project scope</h2><p>Applicable IEC, national and customer standards are confirmed in the technical schedule and test program.</p></article><article><p class="eyebrow">Testing Capability</p><h2>Routine and type tests</h2><p>Loss, insulation, temperature-rise, impulse and other tests are selected for the exact product and contract scope.</p></article><article><p class="eyebrow">Quality Management</p><h2>Traceable inspection flow</h2><p>Incoming, in-process and final checks organize product and document traceability for each project.</p></article></section>
    `
  });
}

function knowledgePage() {
  return page({
    title: "News & Knowledge | Tianyu Electric",
    description: "Transformer selection guides and engineering knowledge from Tianyu Electric.",
    active: "Resources",
    canonical: "news.html",
    content: `<section class="page-hero"><p class="eyebrow">Knowledge</p><h1>Engineering guides and practical FAQs</h1><p>Use the Knowledge Center for product selection, ratings, cooling, vector groups and inquiry preparation.</p></section><section class="section"><div class="knowledge-grid">${knowledgeHighlights.map((item) => `<a href="${esc(item.href)}"><p class="eyebrow">${esc(item.category)}</p><h2>${esc(item.title)}</h2><p>${esc(item.summary)}</p></a>`).join("")}</div></section>`
  });
}

function contactPage() {
  return page({
    title: "Contact Tianyu Electric | Transformer Inquiry",
    description: "Send transformer ratings, project conditions and technical files for engineering review.",
    active: "Contact",
    canonical: "contact.html",
    content: `<section class="page-hero"><p class="eyebrow">Contact</p><h1>Send a transformer or substation inquiry</h1><p>Provide the electrical ratings, application, destination, standard, quantity and available project documents.</p></section><section class="section quote-band"><div><h2>What helps the review</h2><ul class="check-list"><li>Rated power and voltage ratio</li><li>Frequency, phases and vector group</li><li>Impedance, tapping and loss requirements</li><li>Installation environment and altitude</li><li>Applicable standards and test scope</li><li>Single-line diagram or technical specification</li></ul></div>${quoteForm()}</section>`
  });
}

function privacyPage() {
  return page({
    title: "Privacy Policy | Tianyu Electric",
    description: "Privacy information for technical inquiries submitted through the Tianyu Electric website.",
    active: "Company",
    canonical: "privacy.html",
    content: `<section class="page-hero"><p class="eyebrow">Privacy</p><h1>Privacy Policy</h1><p>Information submitted through an inquiry is used to review product requirements and respond to the requested business communication.</p></section><section class="section prose"><h2>Inquiry information</h2><p>Contact details, company information, project parameters and uploaded technical files are used for engineering and commercial review. Do not upload personal or confidential information that is not needed for the inquiry.</p><h2>Document handling</h2><p>Technical documents may be shared with relevant engineering, quality and commercial personnel for the purpose of responding to the project request.</p><h2>Your request</h2><p>You may ask the receiving business contact to correct or remove inquiry information when applicable.</p></section>`
  });
}

function redirectPage(target) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="${canonicalHref(target)}"><title>Page moved | Tianyu Electric</title></head><body><p>This page has moved to <a href="${target}">${target}</a>.</p><script>location.replace(${JSON.stringify(target)});</script></body></html>`;
}

function write(relative, content) {
  const target = path.join(dist, relative);
  ensureDir(path.dirname(target));
  fs.writeFileSync(target, content);
}

function build() {
  prepareOutput();
  write("index.html", homePage());
  write("products.html", productsPage());
  for (const product of products) {
    write(`products/${product.slug}/index.html`, productPage(product));
    write(`products/${product.slug}.html`, redirectPage(`${product.slug}/`));
  }
  write("applications.html", applicationsPage());
  write("projects.html", applicationsPage());
  write("resources.html", resourcesPage());
  write("about.html", aboutPage());
  write("manufacturing.html", manufacturingPage());
  write("factory.html", manufacturingPage());
  write("quality.html", qualityPage());
  write("news.html", knowledgePage());
  write("contact.html", contactPage());
  write("privacy.html", privacyPage());
  write("data/products.json", JSON.stringify(products, null, 2));
  write("data/documents.json", JSON.stringify(documents, null, 2));
  write("data/projects.json", JSON.stringify(projects, null, 2));
}

build();
console.log(`Built Tianyu V2: ${products.length} product families, ${documents.length} document records, ${projects.length} project records.`);
