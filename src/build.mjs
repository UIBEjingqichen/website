import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { nav, companyMenu, company, companyStats, applications, cases, certificates, news } from "./site-data.mjs";
import { products, categories } from "./products-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const productDir = path.join(dist, "products");
const catalogFile = "c725877080548664e85823f7bb5daa2b.docx";
const catalogSource = path.join(root, catalogFile);

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
  "Oil-Immersed Energy-Saving Transformer": "assets/images/product-oil-distribution.jpeg",
  "Dry-Type Transformer": "assets/images/product-dry-type-red.jpeg",
  "Rectifier Transformer": "assets/images/product-rectifier.jpeg",
  "Special Transformer": "assets/images/product-special-container.jpeg"
};

const pageHeroImages = {
  products: "assets/images/product-oil-power.jpeg",
  applications: "assets/images/case-renewable-base.jpeg",
  news: "assets/images/case-offshore-wind.jpeg",
  company: "assets/images/factory-campus.jpeg",
  contact: "assets/images/factory-substation.jpeg"
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
    if (label === "Products") return dropdown(label, href, active, depth, categories.map((c) => [c.name, `products.html#${c.slug}`]));
    if (label === "Company") return dropdown(label, href, active, depth, companyMenu);
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
    <div class="header-actions"><span class="language">EN</span><button class="btn btn-primary quote-open" type="button" data-quote-open>Get a Free Quote</button></div>
  </header>
  <main>${content}</main>
  ${footer(depth)}
  ${quoteModal(depth)}
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
  return `<form class="quote-form ${compact ? "compact" : ""}">
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

function quoteModal(depth = "") {
  return `<div class="quote-modal" data-quote-modal aria-hidden="true">
    <div class="quote-backdrop" data-quote-close></div>
    <section class="quote-panel" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title">
      <button class="quote-close" type="button" aria-label="Close quote form" data-quote-close>×</button>
      <p class="eyebrow">Quick Inquiry</p>
      <h2 id="quote-modal-title">Get a Free Quote</h2>
      <p>Send transformer type, capacity, voltage, country and project notes. Drawings or specifications can be uploaded if available.</p>
      ${quoteForm(true)}
    </section>
  </div>`;
}

function catalogButton() {
  if (fs.existsSync(catalogSource)) return `<a class="btn outline-dark" href="${catalogFile}">Download Catalog</a>`;
  return `<button class="btn outline-dark" type="button" data-quote-open>Request Catalog</button>`;
}

function imageHero({ eyebrow, title, intro, image }) {
  return `<section class="page-image-hero"><img src="${image}" alt="${esc(title)}"><div class="image-hero-caption"><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1><p>${esc(intro)}</p></div></section>`;
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

function categoryTile(c, href, depth = "") {
  const image = categoryImages[c.name] || "assets/images/factory-substation.jpeg";
  return `<a class="category-tile" href="${esc(href)}" aria-label="View ${esc(c.name)}">
    <img src="${depth}${image}" alt="${esc(c.name)}">
    <h3>${esc(c.name)}</h3>
  </a>`;
}

function caseCard(c) {
  return `<article class="case-card"><img src="${c.image}" alt="${esc(c.name)}"><div><p class="eyebrow">${esc(c.type)}</p><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p><dl><dt>Location</dt><dd>${esc(c.location)}</dd><dt>Scale</dt><dd>${esc(c.scale)}</dd><dt>Product Used</dt><dd>${esc(c.productUsed)}</dd><dt>Disclosure</dt><dd>${esc(c.disclosure)}</dd></dl></div></article>`;
}

function heroSlider() {
  const slides = [
    ["assets/images/factory-substation.jpeg", "Substation and transformer project scene"],
    ["assets/images/product-oil-power.jpeg", "Oil-immersed power transformer"],
    ["assets/images/case-renewable-base.jpeg", "Renewable energy base application"]
  ];
  return `<section class="clean-hero-slider" data-hero-slider>${slides.map(([src, alt], index) => `<figure class="hero-slide ${index === 0 ? "active" : ""}"><img src="${src}" alt="${esc(alt)}"></figure>`).join("")}<div class="hero-dots">${slides.map((_, index) => `<button class="${index === 0 ? "active" : ""}" data-slide-dot="${index}" aria-label="Show slide ${index + 1}"></button>`).join("")}</div></section>`;
}

function heroIntro() {
  return `<section class="hero-intro"><p class="eyebrow">Fuzhou Tianyu Electric Co., Ltd.</p><h1>Power & Distribution Transformer Solutions</h1><p>Oil-immersed, dry-type, rectifier and special transformers for utility, industrial and renewable energy projects.</p><div class="hero-actions"><a class="btn outline-dark" href="products.html">View Products</a>${catalogButton()}</div></section>`;
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
    ["02", "Reliable Engineering", "Drawings, tests and parameters are handled with disciplined project logic."],
    ["03", "Quality & Safety", "Safety, quality, compliance and continuous improvement are built into the workflow."],
    ["04", "Long-Term Partnership", "Transparent communication and accountable support for utilities, EPCs and industrial clients."]
  ];
  return `<section class="section why-showcase">
    <a class="why-image-card" href="about.html#culture"><img src="assets/images/factory-substation.jpeg" alt="Power grid and substation application"><div><p class="eyebrow">Why Us</p><h2>Service Culture for Engineering Projects</h2><p>Company culture and engineering service principles.</p></div></a>
    <div class="why-service-grid">${pillars.map(([n, title, text]) => `<article><span>${n}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join("")}</div>
  </section>`;
}

function applicationsProjectsSection() {
  return `<section class="section pale ap-showcase"><div class="section-head"><div><p class="eyebrow">Applications & Projects</p><h2>Applications Backed by Engineering Experience</h2></div></div>
    <div class="ap-grid">
      <div class="application-panel">${applications.map((a) => `<a href="applications.html"><h3>${esc(a)}</h3><p>Selection is confirmed according to load, voltage level and installation environment.</p></a>`).join("")}</div>
      <a class="project-image-card" href="applications.html#projects"><img src="${cases[0].image}" alt="${esc(cases[0].name)}"><div><p class="eyebrow">Project Experience</p><h3>${esc(cases[0].name)}</h3><p>${esc(cases[0].description)}</p></div></a>
    </div>
  </section>`;
}

function newsSection() {
  const newsImages = ["assets/images/case-renewable-base.jpeg", "assets/images/product-oil-power.jpeg", "assets/images/product-dry-type-red.jpeg"];
  return `<section class="section news-showcase"><div class="section-head"><p class="eyebrow">News</p><h2>News & Knowledge</h2></div><div class="news-list home-news-list">${news.map((n, index) => `<a class="news-row" href="news.html"><img src="${newsImages[index % newsImages.length]}" alt="${esc(n.title)}"><div><p class="eyebrow">${esc(n.category)}</p><h3>${esc(n.title)}</h3><small>${esc(n.date)}</small><p>${esc(n.summary)}</p></div></a>`).join("")}</div></section>`;
}

function home() {
  const content = `${heroSlider()}
  ${heroIntro()}
  ${companySnapshot()}
  <section class="section product-matrix"><div class="section-head"><p class="eyebrow">Product Matrix</p><h2>Transformer Solutions by Category</h2></div><div class="category-tile-grid">${categories.map((c) => categoryTile(c, `products.html#${c.slug}`)).join("")}</div></section>
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
  const content = `${imageHero({ eyebrow: "Products", title: "Transformer Products", intro: "Oil-immersed, dry-type, rectifier and special transformers organized by project use and product family.", image: pageHeroImages.products })}
  <section class="section product-jump"><div class="category-tile-grid compact">${categories.map((c) => categoryTile(c, `#${c.slug}`)).join("")}</div></section>
  ${grouped}`;
  return page({ title: "Transformer Products | Tianyu Electric", description: "Oil-immersed, dry-type, rectifier and special transformer product categories from Tianyu Electric.", active: "Products", content, canonical: "products.html" });
}

function productPage(p) {
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 3);
  const content = `<section class="product-hero"><div><p class="eyebrow">${esc(p.category)}</p><h1>${esc(p.name)}</h1><p>${esc(p.shortDescription)}</p></div><img src="../${p.images.hero}" alt="${esc(p.name)}"></section>
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
    <p class="source-note">Source note: ${esc(p.sourceNote)}</p>
  </div></section>
  ${related.length ? `<section class="section pale"><div class="section-head"><p class="eyebrow">Related Products</p><h2>${esc(p.category)}</h2></div><div class="product-grid">${related.map((x) => productCard(x, "../")).join("")}</div></section>` : ""}`;
  return page({ title: `${p.name} | Tianyu Electric`, description: `${p.shortDescription} Applications, features, technical parameters and documents.`, active: "Products", content, canonical: `products/${p.slug}.html` });
}

function simplePage(active, title, intro, body, canonicalName) {
  const canonical = canonicalName || `${active.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}.html`;
  return page({ title: `${title} | Tianyu Electric`, description: intro, active, content: `<section class="page-hero"><p class="eyebrow">${active}</p><h1>${title}</h1><p>${intro}</p></section>${body}`, canonical });
}

function applicationsPage() {
  return page({ title: "Applications & Projects | Tianyu Electric", description: "Transformer applications and engineering experience for utility, renewable, industrial and infrastructure projects.", active: "Applications & Projects", canonical: "applications.html", content: `${imageHero({ eyebrow: "Applications & Projects", title: "Applications & Projects", intro: "Transformer solutions for utility grid, renewable energy, industrial power and infrastructure projects.", image: pageHeroImages.applications })}<section class="section"><div class="application-grid">${applications.map((a) => `<article><h2>${esc(a)}</h2><p>Product selection should be confirmed according to voltage level, load profile, installation environment, protection requirements and applicable standards.</p></article>`).join("")}</div></section><section class="section pale" id="projects"><div class="section-head"><p class="eyebrow">Projects</p><h2>Engineering Experience</h2></div><div class="case-grid">${cases.map(caseCard).join("")}</div></section>` });
}

function newsPage() {
  const newsImages = ["assets/images/case-renewable-base.jpeg", "assets/images/product-oil-power.jpeg", "assets/images/product-dry-type-red.jpeg"];
  return page({ title: "News & Knowledge | Tianyu Electric", description: "Company news, website launch updates and technical knowledge articles for transformer project communication.", active: "News", canonical: "news.html", content: `${imageHero({ eyebrow: "News", title: "News & Knowledge", intro: "Technical articles, company updates and transformer project insights.", image: pageHeroImages.news })}<section class="section"><div class="news-list">${news.map((n, index) => `<a class="news-row" href="news.html"><img src="${newsImages[index % newsImages.length]}" alt="${esc(n.title)}"><div><p class="eyebrow">${esc(n.category)}</p><h2>${esc(n.title)}</h2><small>${esc(n.date)}</small><p>${esc(n.summary)}</p></div></a>`).join("")}</div></section>` });
}

function companyPage(canonicalName = "about.html") {
  return page({ title: "About Tianyu Electric | Tianyu Electric", description: "Company profile, factory capability and quality references are organized on one page for easier review.", active: "Company", canonical: canonicalName, content: `${imageHero({ eyebrow: "Company", title: "About Tianyu Electric", intro: "Professional manufacturer of power primary equipment for transformer, substation and distribution projects.", image: pageHeroImages.company })}<section class="section company-page-grid" id="about"><div><p class="eyebrow">About Us</p><h2>Company Profile</h2><p>${esc(company.legalName)} was established in 1996 by the former Fuzhou No.1 Switch Factory, Fuzhou No.2 Switch Factory and Fuzhou Electronic Transformer Factory, with registered capital of ${esc(company.registeredCapital)}.</p><p>${esc(company.groupBackground)} ${esc(company.manufacturingBase)}</p><p>${esc(company.productScope)}</p></div><img src="assets/images/factory-campus.jpeg" alt="Tianyu factory campus"></section><section class="section pale company-page-grid" id="factory"><div><p class="eyebrow">Factory</p><h2>Factory & Testing</h2><p>${esc(company.manufacturingBase)}</p><div class="fact-grid"><div class="fact"><strong>Factory Area</strong><span>To be confirmed</span></div><div class="fact"><strong>Annual Capacity</strong><span>To be confirmed</span></div><div class="fact"><strong>Production Equipment</strong><span>To be confirmed</span></div><div class="fact"><strong>Testing Equipment</strong><span>To be confirmed</span></div></div></div><img src="assets/images/factory-substation.jpeg" alt="Factory and substation scene"></section><section class="section" id="quality"><div class="section-head"><div><p class="eyebrow">Quality</p><h2>Quality & Certificates</h2></div></div><div class="certificate-grid">${certificates.map((c) => `<article><h2>${esc(c.name)}</h2><p>${esc(c.scope)}</p><span>${esc(c.status)}</span></article>`).join("")}</div><p class="note">Products can be designed and tested according to project-specific requirements. Certificates and test reports can be provided upon request where applicable.</p></section><section class="section pale" id="culture"><div class="prose"><h2>Corporate Culture</h2><p>Tianyu Electric presents a practical engineering culture built around integrity, safety, accountability, respect and long-term partnership. In international B2B cooperation, the company should emphasize transparent communication, reliable documentation, continuous improvement, responsible manufacturing and customer-focused service from early inquiry to after-sales support.</p><div class="culture-grid"><article><strong>Integrity</strong><span>Clear information, responsible commitments and honest technical communication.</span></article><article><strong>Safety</strong><span>Product quality, workplace safety and project risk control come first.</span></article><article><strong>Partnership</strong><span>Long-term cooperation with utilities, industrial users and renewable energy developers.</span></article><article><strong>Continuous Improvement</strong><span>Better process, better documentation and better customer service through every project.</span></article></div><h2>Historical Evolution</h2><div class="timeline"><div><strong>1958</strong><span>Fuzhou No.1 and No.2 Switch Factory and Fuzhou Electronic Transformer Factory were established.</span></div><div><strong>1996</strong><span>Tianyu Electric was established through reorganization.</span></div><div><strong>1997</strong><span>Tianyu Electric was listed on Shenzhen Stock Exchange.</span></div><div><strong>2001</strong><span>Tianyu Electric joined XJ Group Corporation.</span></div><div><strong>2016</strong><span>New factory was completed and put into operation.</span></div><div><strong>2021</strong><span>XJ Group Corporation merged into China Electrical Equipment Group Co., Ltd.</span></div></div></div></section>` });
}

function writeAll() {
  fs.rmSync(dist, { recursive: true, force: true });
  ensureDir(productDir);
  copyAssets();
  if (fs.existsSync(catalogSource)) fs.copyFileSync(catalogSource, path.join(dist, catalogFile));
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
  fs.writeFileSync(path.join(dist, "about.html"), companyPage("about.html"));
  fs.writeFileSync(path.join(dist, "factory.html"), companyPage("factory.html"));
  fs.writeFileSync(path.join(dist, "quality.html"), companyPage("quality.html"));
  fs.writeFileSync(path.join(dist, "contact.html"), simplePage("Contact", "Contact Tianyu Electric", "Send transformer requirements, drawings or project conditions for engineering review.", `<section class="section quote-band"><div><h2>Inquiry Details</h2><p>Email, phone, WhatsApp and address are placeholders until confirmed by Tianyu Electric.</p><div class="fact-grid"><div class="fact"><strong>Email</strong><span>${esc(company.email)}</span></div><div class="fact"><strong>Phone</strong><span>${esc(company.phone)}</span></div><div class="fact"><strong>WhatsApp</strong><span>${esc(company.whatsapp)}</span></div><div class="fact"><strong>Address</strong><span>${esc(company.address)}</span></div></div></div>${quoteForm()}</section>`, "contact.html"));
  fs.writeFileSync(path.join(dist, "privacy.html"), simplePage("Company", "Privacy Policy", "Placeholder privacy policy for first-version website.", `<section class="section prose"><p>To be confirmed. This first-version page is a placeholder and should be reviewed before public launch.</p></section>`, "privacy.html"));
}

writeAll();
console.log(`Built ${dist}`);
