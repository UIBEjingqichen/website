import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { nav, companyMenu, company, companyStats, applications, cases, certificates, news } from "./site-data.mjs";
import { products, categories } from "./products-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const productDir = path.join(dist, "products");

const assetMap = {
  "source-media/image30.png": "assets/images/product-oil-power.jpeg",
  "source-media/image48.jpeg": "assets/images/product-oil-distribution.jpeg",
  "source-media/image42.jpeg": "assets/images/product-dry-type-red.jpeg",
  "source-media/image53.jpeg": "assets/images/product-dry-type-cast.jpeg",
  "source-media/image36.jpeg": "assets/images/product-amorphous-dry.jpeg",
  "source-media/image37.jpeg": "assets/images/product-rectifier.jpeg",
  "source-media/image133.jpeg": "assets/images/product-special-container.jpeg",
  "source-media/image4.jpeg": "assets/images/factory-campus.jpeg",
  "source-media/image58.jpeg": "assets/images/factory-substation.jpeg",
  "source-media/image117.jpeg": "assets/images/case-renewable-base.jpeg",
  "source-media/image64.jpeg": "assets/images/case-booster-substation.jpeg",
  "source-media/image28.jpeg": "assets/images/case-offshore-wind.jpeg"
};

const categoryImages = {
  "Oil-Immersed Power Transformer": "assets/images/product-oil-power.jpeg",
  "Oil-Immersed Distribution Transformer": "assets/images/product-oil-distribution.jpeg",
  "Dry-Type Transformer": "assets/images/product-dry-type-red.jpeg",
  "Rectifier Transformer": "assets/images/product-rectifier.jpeg",
  "Special Transformer": "assets/images/product-special-container.jpeg"
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyAssets() {
  for (const [from, to] of Object.entries(assetMap)) {
    const src = path.join(root, from);
    const dest = path.join(dist, to);
    ensureDir(path.dirname(dest));
    if (fs.existsSync(src)) fs.copyFileSync(src, dest);
  }
}

function esc(value = "") {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function dropdown(label, href, active, depth, items) {
  const menu = items.map(([name, itemHref]) => `<a href="${depth}${itemHref}">${esc(name)}</a>`).join("");
  return `<div class="nav-item nav-dropdown"><a class="${active === label ? "active" : ""}" href="${depth}${href}">${esc(label)}</a><div class="dropdown-menu">${menu}</div></div>`;
}

function renderNav(active, depth = "") {
  return nav.map(([label, href]) => {
    if (label === "Products") {
      return dropdown(label, href, active, depth, categories.map((c) => [c.name, `products.html#${c.slug}`]));
    }
    if (label === "Company") {
      return dropdown(label, href, active, depth, companyMenu);
    }
    return `<a class="${active === label ? "active" : ""}" href="${depth}${href}">${label}</a>`;
  }).join("");
}

function page({ title, description, active, content, canonical = "" }) {
  const depth = canonical.startsWith("products/") ? "../" : "";
  const navHtml = renderNav(active, depth);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="stylesheet" href="${depth}assets/css/styles.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="${depth}index.html"><span class="brand-mark">TY</span><span><strong>Tianyu Electric</strong><small>Power Primary Equipment</small></span></a>
    <button class="menu-toggle" aria-label="Open navigation" data-menu-toggle>Menu</button>
    <nav class="main-nav" data-nav>${navHtml}</nav>
    <div class="header-actions"><span class="language">EN</span><a class="btn btn-primary" href="${depth}contact.html#quote">Get a Quote</a></div>
  </header>
  <main>${content}</main>
  ${footer(depth)}
  <script src="${depth}assets/js/main.js"></script>
</body>
</html>`;
}

function footer(depth = "") {
  return `<footer class="footer">
    <div class="footer-grid">
      <div><h2>Tianyu Electric</h2><p>${esc(company.tagline)}. Transformer-focused B2B website first version.</p></div>
      <div><h3>Products</h3>${categories.map((c) => `<a href="${depth}products.html#${c.slug}">${esc(c.name)}</a>`).join("")}</div>
      <div><h3>Applications & Projects</h3>${applications.slice(0, 4).map((a) => `<a href="${depth}applications.html">${esc(a)}</a>`).join("")}</div>
      <div><h3>Company</h3>${companyMenu.map(([name, href]) => `<a href="${depth}${href}">${esc(name)}</a>`).join("")}<p>Email: ${esc(company.email)}</p></div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} Tianyu Electric</span><a href="${depth}privacy.html">Privacy Policy</a></div>
  </footer>`;
}

function quoteForm(compact = false) {
  return `<form class="quote-form ${compact ? "compact" : ""}" id="quote">
    <label>Name<input name="name" required></label>
    <label>Email<input name="email" type="email" required></label>
    <label>Company Name<input name="company"></label>
    <label>Transformer Type<select name="type">${categories.map((c) => `<option>${esc(c.name)}</option>`).join("")}</select></label>
    <label>Rated Capacity<input name="capacity" placeholder="e.g. 630 kVA"></label>
    <label>Rated Voltage<input name="voltage" placeholder="e.g. 10/0.4 kV"></label>
    <label>Country<input name="country"></label>
    <label class="full">Message<textarea name="message" rows="4"></textarea></label>
    <label class="full">Upload File<input name="file" type="file"></label>
    <button class="btn btn-primary" type="submit">Submit Inquiry</button>
  </form>`;
}

function table(data) {
  if (!data?.rows?.length) return `<p class="muted">Technical Data To Be Confirmed</p>`;
  return `<div class="table-wrap"><p class="table-note">${esc(data.note || "")}</p><table><tbody>${data.rows.map((r) => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("")}</tbody></table></div>`;
}

function productCard(p, depth = "") {
  return `<a class="product-card" href="${depth}products/${p.slug}.html" aria-label="View ${esc(p.name)}">
    <img src="${depth}${p.images.hero}" alt="${esc(p.name)}">
    <div><p class="eyebrow">${esc(p.category)}</p><h3>${esc(p.name)}</h3><p>${esc(p.shortDescription)}</p>
    <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div></div>
  </a>`;
}

function categoryTile(c, depth = "") {
  const image = categoryImages[c.name] || "assets/images/factory-substation.jpeg";
  return `<a id="${c.slug}" class="category-tile" href="${depth}products.html#${c.slug}" aria-label="View ${esc(c.name)}">
    <img src="${depth}${image}" alt="${esc(c.name)}">
    <h3>${esc(c.name)}</h3>
  </a>`;
}

function caseCard(c) {
  return `<article class="case-card"><img src="${c.image}" alt="${esc(c.name)}"><div><p class="eyebrow">${esc(c.type)}</p><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p><dl><dt>Location</dt><dd>${esc(c.location)}</dd><dt>Scale</dt><dd>${esc(c.scale)}</dd><dt>Product Used</dt><dd>${esc(c.productUsed)}</dd><dt>Disclosure</dt><dd>${esc(c.disclosure)}</dd></dl></div></article>`;
}

function homeImageStrip() {
  const images = [
    ["assets/images/factory-substation.jpeg", "Substation and transformer project scene"],
    ["assets/images/product-oil-power.jpeg", "Oil-immersed power transformer"],
    ["assets/images/case-offshore-wind.jpeg", "Offshore wind engineering application"],
    ["assets/images/case-renewable-base.jpeg", "Renewable energy base application"]
  ];
  return `<section class="home-image-strip">${images.map(([src, alt]) => `<img src="${src}" alt="${esc(alt)}">`).join("")}</section>`;
}

function companySnapshot() {
  return `<section class="section company-snapshot">
    <div class="company-copy"><p class="eyebrow">Company</p><h2>Professional Manufacturer of Power Primary Equipment</h2><p>${esc(company.legalName)} focuses on power primary equipment for substations, distribution systems, transmission lines and project-based transformer solutions.</p><a class="btn outline-dark" href="about.html">Explore Company</a></div>
    <div class="company-stats">${companyStats.map((s) => `<article><p>${esc(s.label)}</p><small>${esc(s.source)}</small><strong>${esc(s.value)}${s.suffix ? ` <em>${esc(s.suffix)}</em>` : ""}</strong></article>`).join("")}</div>
  </section>`;
}

function cultureSection() {
  const pillars = [
    ["01", "Service First", "Fast response, practical engineering review and clear document follow-up."],
    ["02", "Reliable Engineering", "Product selection, drawings, tests and parameters are handled with disciplined project logic."],
    ["03", "Quality & Safety", "Safety, quality, compliance and continuous improvement are built into the workflow."],
    ["04", "Long-Term Partnership", "Transparent communication and accountable support for utilities, EPCs and industrial clients."]
  ];
  return `<section class="section culture-section">
    <div class="culture-intro"><p class="eyebrow">Why Us</p><h2>Service Culture for Engineering Projects</h2><p>Transformer projects require more than a product list. Tianyu should present a culture of service, documentation, accountability and long-term technical cooperation.</p><a class="text-link" href="about.html">Read company culture</a></div>
    <div class="culture-pillar-list">${pillars.map(([n, title, text]) => `<article><span>${n}</span><div><h3>${esc(title)}</h3><p>${esc(text)}</p></div></article>`).join("")}</div>
  </section>`;
}

function applicationsProjectsSection() {
  return `<section class="section pale"><div class="section-head"><div><p class="eyebrow">Applications & Projects</p><h2>Applications Backed by Engineering Experience</h2></div><a class="text-link" href="applications.html">View All</a></div>
    <div class="merged-ap-grid">
      <div class="application-panel">${applications.map((a) => `<article><h3>${esc(a)}</h3><p>Transformer selection and configuration should be confirmed according to project load, voltage level and installation environment.</p></article>`).join("")}</div>
      <div class="case-feature">${cases.slice(0, 1).map(caseCard).join("")}<a class="btn btn-primary" href="applications.html#projects">View Project Experience</a></div>
    </div>
  </section>`;
}

function newsSection() {
  return `<section class="section"><div class="section-head"><p class="eyebrow">News</p><h2>News & Knowledge</h2><a class="text-link" href="news.html">View News</a></div><div class="news-grid">${news.map((n) => `<article><p class="eyebrow">${esc(n.category)}</p><h3>${esc(n.title)}</h3><small>${esc(n.date)}</small><p>${esc(n.summary)}</p></article>`).join("")}</div></section>`;
}

function home() {
  const content = `<section class="hero" style="background-image:linear-gradient(90deg,rgba(6,31,58,.82),rgba(6,31,58,.38)),url('assets/images/factory-substation.jpeg')">
    <div class="hero-inner"><p class="eyebrow">Fuzhou Tianyu Electric Co., Ltd.</p><h1>Power & Distribution Transformer Solutions</h1>
    <p>Oil-immersed, dry-type, rectifier and special transformers for utility, industrial and renewable energy projects.</p>
    <div class="hero-actions"><a class="btn btn-primary" href="contact.html#quote">Get a Quote</a><a class="btn btn-secondary" href="products.html">View Products</a><a class="btn btn-secondary" href="c725877080548664e85823f7bb5daa2b.docx">Download Catalog</a></div></div>
  </section>
  ${homeImageStrip()}
  ${companySnapshot()}
  <section class="section"><div class="section-head"><p class="eyebrow">Product Matrix</p><h2>Transformer Solutions by Category</h2><a class="text-link" href="products.html">View All Products</a></div><div class="category-tile-grid">${categories.map((c) => categoryTile(c)).join("")}</div></section>
  ${cultureSection()}
  ${applicationsProjectsSection()}
  ${newsSection()}`;
  return page({ title: "Tianyu Electric | Power & Distribution Transformer Solutions", description: "English B2B transformer website for Tianyu Electric, covering oil-immersed, dry-type, rectifier and special transformers.", active: "Home", content, canonical: "index.html" });
}

function productsPage() {
  const grouped = categories.map((c) => {
    const groupProducts = products.filter((p) => p.category === c.name);
    return `<section class="section product-category-section" id="${c.slug}"><div class="section-head"><div><p class="eyebrow">${esc(c.name)}</p><h2>${esc(c.name)}</h2><p>${esc(c.description)}</p></div></div><div class="product-grid">${groupProducts.map((p) => productCard(p)).join("")}</div></section>`;
  }).join("");
  const content = `<section class="page-hero"><p class="eyebrow">Products</p><h1>Transformer Product Matrix</h1><p>Five category groups with nine brochure-sourced transformer products. Click any product card to open its detail page.</p><a class="btn btn-primary" href="contact.html#quote">Get a Quote</a></section>
  <section class="section"><div class="category-tile-grid compact">${categories.map((c) => categoryTile(c)).join("")}</div></section>
  ${grouped}`;
  return page({ title: "Transformer Products | Tianyu Electric", description: "Oil-immersed, dry-type, rectifier and special transformer product categories from Tianyu Electric.", active: "Products", content, canonical: "products.html" });
}

function productPage(p) {
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 3);
  const content = `<section class="product-hero"><div><p class="eyebrow">${esc(p.category)}</p><h1>${esc(p.name)}</h1><p>${esc(p.shortDescription)}</p><div class="hero-actions"><a class="btn btn-primary" href="../contact.html#quote">Get a Quote</a><a class="btn btn-secondary" href="#quote">Product Inquiry</a></div></div><img src="../${p.images.hero}" alt="${esc(p.name)}"></section>
  <section class="section product-layout"><aside><h2>Product Tags</h2><div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div><a class="text-link" href="../products.html">Back to product matrix</a></aside><div class="product-content">
    <h2>Overview</h2><p>${esc(p.overview)}</p>
    <h2>Applications</h2><ul>${p.applications.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    <h2>Key Features</h2><ul>${p.features.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    <h2>Product Advantages</h2><ul>${p.advantages.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    <h2>Technical Parameters</h2>${table(p.technicalParameters)}
    <h2>Performance Indicators</h2>${table(p.performanceIndicators)}
    <h2>Configuration Options</h2><div class="option-grid"><article><h3>Standard Configuration</h3><ul>${p.configurationOptions.standard.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></article><article><h3>Optional Configuration</h3><ul>${p.configurationOptions.optional.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></article><article><h3>Project-Customized Configuration</h3><ul>${p.configurationOptions.customized.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></article></div>
    <h2>Drawings & Documents</h2><div class="doc-grid">${p.drawings.map((d) => `<article><strong>${esc(d.name)}</strong><span>${esc(d.status)}</span></article>`).join("")}</div>
    <h2>Standards & Tests</h2><ul>${p.standards.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    <h2>Related Cases</h2><ul>${p.relatedCases.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    <h2>Quote Form</h2>${quoteForm(true)}
    <p class="source-note">Source note: ${esc(p.sourceNote)}</p>
  </div></section>
  ${related.length ? `<section class="section pale"><div class="section-head"><p class="eyebrow">Related Products</p><h2>${esc(p.category)}</h2></div><div class="product-grid">${related.map((x) => productCard(x, "../")).join("")}</div></section>` : ""}`;
  return page({ title: `${p.name} | Tianyu Electric`, description: `${p.shortDescription} Applications, features, technical parameters, documents and inquiry form.`, active: "Products", content, canonical: `products/${p.slug}.html` });
}

function simplePage(active, title, intro, body, canonicalName) {
  const canonical = canonicalName || `${active.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}.html`;
  return page({ title: `${title} | Tianyu Electric`, description: intro, active, content: `<section class="page-hero"><p class="eyebrow">${active}</p><h1>${title}</h1><p>${intro}</p><a class="btn btn-primary" href="contact.html#quote">Get a Quote</a></section>${body}`, canonical });
}

function applicationsPage() {
  return simplePage("Applications & Projects", "Applications & Projects", "Application scenarios and project experience are combined here to show where Tianyu transformer solutions can be used and how project references should be organized.", `<section class="section"><div class="application-grid">${applications.map((a) => `<article><h2>${esc(a)}</h2><p>Product selection should be confirmed according to voltage level, load profile, installation environment, protection requirements and applicable standards.</p></article>`).join("")}</div></section><section class="section pale" id="projects"><div class="section-head"><p class="eyebrow">Projects</p><h2>Engineering Experience</h2></div><div class="case-grid">${cases.map(caseCard).join("")}</div></section>`, "applications.html");
}

function newsPage() {
  return simplePage("News", "News & Knowledge", "Company news, website launch updates and technical knowledge articles for transformer project communication.", `<section class="section"><div class="news-grid">${news.map((n) => `<article><p class="eyebrow">${esc(n.category)}</p><h2>${esc(n.title)}</h2><small>${esc(n.date)}</small><p>${esc(n.summary)}</p></article>`).join("")}</div></section>`, "news.html");
}

function writeAll() {
  fs.rmSync(dist, { recursive: true, force: true });
  ensureDir(productDir);
  copyAssets();
  fs.copyFileSync(path.join(root, "c725877080548664e85823f7bb5daa2b.docx"), path.join(dist, "c725877080548664e85823f7bb5daa2b.docx"));
  ensureDir(path.join(dist, "assets/css"));
  ensureDir(path.join(dist, "assets/js"));
  fs.copyFileSync(path.join(root, "src/styles.css"), path.join(dist, "assets/css/styles.css"));
  fs.copyFileSync(path.join(root, "src/main.js"), path.join(dist, "assets/js/main.js"));
  fs.writeFileSync(path.join(dist, "index.html"), home());
  fs.writeFileSync(path.join(dist, "products.html"), productsPage());
  for (const p of products) fs.writeFileSync(path.join(productDir, `${p.slug}.html`), productPage(p));
  fs.writeFileSync(path.join(dist, "applications.html"), applicationsPage());
  fs.writeFileSync(path.join(dist, "projects.html"), applicationsPage());
  fs.writeFileSync(path.join(dist, "news.html"), newsPage());
  fs.writeFileSync(path.join(dist, "quality.html"), simplePage("Company", "Quality & Certificates", "Only brochure-confirmed certificate and test references are shown; missing certificates remain marked to be confirmed.", `<section class="section"><div class="certificate-grid">${certificates.map((c) => `<article><h2>${esc(c.name)}</h2><p>${esc(c.scope)}</p><span>${esc(c.status)}</span></article>`).join("")}</div><p class="note">Products can be designed and tested according to project-specific requirements. Certificates and test reports can be provided upon request where applicable.</p></section>`, "quality.html"));
  fs.writeFileSync(path.join(dist, "factory.html"), simplePage("Company", "Factory & Testing", "Factory visuals are brochure-derived temporary assets. Capacity data, equipment quantity and detailed test capability remain to be confirmed.", `<section class="section split"><div><h2>Manufacturing Base</h2><p>${esc(company.manufacturingBase)}</p><div class="fact-grid"><div class="fact"><strong>Factory Area</strong><span>To be confirmed</span></div><div class="fact"><strong>Annual Capacity</strong><span>To be confirmed</span></div><div class="fact"><strong>Production Equipment</strong><span>To be confirmed</span></div><div class="fact"><strong>Testing Equipment</strong><span>To be confirmed</span></div></div></div><div class="image-grid"><img src="assets/images/factory-campus.jpeg" alt="Factory campus"><img src="assets/images/factory-substation.jpeg" alt="Substation"></div></section>`, "factory.html"));
  fs.writeFileSync(path.join(dist, "about.html"), simplePage("Company", "About Tianyu Electric", "Fuzhou Tianyu Electric Co., Ltd. is a professional manufacturer of power primary equipment.", `<section class="section"><div class="prose"><h2>Company Profile</h2><p>${esc(company.legalName)} was established in 1996 by the former Fuzhou No.1 Switch Factory, Fuzhou No.2 Switch Factory and Fuzhou Electronic Transformer Factory, with registered capital of ${esc(company.registeredCapital)}.</p><p>${esc(company.groupBackground)} ${esc(company.manufacturingBase)}</p><p>${esc(company.productScope)}</p><h2>Corporate Culture</h2><p>Tianyu Electric presents a practical engineering culture built around integrity, safety, accountability, respect and long-term partnership. In international B2B cooperation, the company should emphasize transparent communication, reliable documentation, continuous improvement, responsible manufacturing and customer-focused service from early inquiry to after-sales support.</p><div class="culture-grid"><article><strong>Integrity</strong><span>Clear information, responsible commitments and honest technical communication.</span></article><article><strong>Safety</strong><span>Product quality, workplace safety and project risk control come first.</span></article><article><strong>Partnership</strong><span>Long-term cooperation with utilities, industrial users and renewable energy developers.</span></article><article><strong>Continuous Improvement</strong><span>Better process, better documentation and better customer service through every project.</span></article></div><h2>Factory & Quality Access</h2><p>Factory capability and quality certificates are organized under the Company navigation so international buyers can review corporate credibility, manufacturing capability and certificates from one menu.</p><div class="company-link-grid"><a href="factory.html">Factory & Testing</a><a href="quality.html">Quality & Certificates</a></div><h2>Historical Evolution</h2><div class="timeline"><div><strong>1958</strong><span>Fuzhou No.1 and No.2 Switch Factory and Fuzhou Electronic Transformer Factory were established.</span></div><div><strong>1996</strong><span>Tianyu Electric was established through reorganization.</span></div><div><strong>1997</strong><span>Tianyu Electric was listed on Shenzhen Stock Exchange.</span></div><div><strong>2001</strong><span>Tianyu Electric joined XJ Group Corporation.</span></div><div><strong>2016</strong><span>New factory was completed and put into operation.</span></div><div><strong>2021</strong><span>XJ Group Corporation merged into China Electrical Equipment Group Co., Ltd.</span></div></div></div></section>`, "about.html"));
  fs.writeFileSync(path.join(dist, "contact.html"), simplePage("Contact", "Contact Tianyu Electric", "Send transformer requirements, drawings or project conditions for engineering review.", `<section class="section quote-band"><div><h2>Inquiry Details</h2><p>Email, phone, WhatsApp and address are placeholders until confirmed by Tianyu Electric.</p><div class="fact-grid"><div class="fact"><strong>Email</strong><span>${esc(company.email)}</span></div><div class="fact"><strong>Phone</strong><span>${esc(company.phone)}</span></div><div class="fact"><strong>WhatsApp</strong><span>${esc(company.whatsapp)}</span></div><div class="fact"><strong>Address</strong><span>${esc(company.address)}</span></div></div></div>${quoteForm()}</section>`, "contact.html"));
  fs.writeFileSync(path.join(dist, "privacy.html"), simplePage("Company", "Privacy Policy", "Placeholder privacy policy for first-version website.", `<section class="section prose"><p>To be confirmed. This first-version page is a placeholder and should be reviewed before public launch.</p></section>`, "privacy.html"));
}

writeAll();
console.log(`Built ${dist}`);
