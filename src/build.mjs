import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { nav, company, applications, cases, certificates } from "./site-data.mjs";
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

function page({ title, description, active, content, canonical = "" }) {
  const depth = canonical.startsWith("products/") ? "../" : "";
  const navHtml = nav.map(([label, href]) => `<a class="${active === label ? "active" : ""}" href="${depth}${href}">${label}</a>`).join("");
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
      <div><h3>Applications</h3>${applications.slice(0, 4).map((a) => `<a href="${depth}applications.html">${esc(a)}</a>`).join("")}</div>
      <div><h3>Contact</h3><p>Email: ${esc(company.email)}</p><p>Phone: ${esc(company.phone)}</p><p>WhatsApp: ${esc(company.whatsapp)}</p><p>Address: ${esc(company.address)}</p></div>
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
  return `<article class="product-card">
    <img src="${depth}${p.images.hero}" alt="${esc(p.name)}">
    <div><p class="eyebrow">${esc(p.category)}</p><h3>${esc(p.name)}</h3><p>${esc(p.shortDescription)}</p>
    <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
    <a class="text-link" href="${depth}products/${p.slug}.html">View details</a></div>
  </article>`;
}

function home() {
  const content = `<section class="hero" style="background-image:linear-gradient(90deg,rgba(6,31,58,.86),rgba(6,31,58,.46)),url('assets/images/factory-substation.jpeg')">
    <div class="hero-inner"><p class="eyebrow">Fuzhou Tianyu Electric Co., Ltd.</p><h1>Power & Distribution Transformer Solutions</h1>
    <p>Oil-immersed, dry-type, rectifier and special transformers for utility, industrial and renewable energy projects.</p>
    <div class="hero-actions"><a class="btn btn-primary" href="contact.html#quote">Get a Quote</a><a class="btn btn-secondary" href="products.html">View Products</a><a class="btn btn-secondary" href="c725877080548664e85823f7bb5daa2b.docx">Download Catalog</a></div></div>
  </section>
  <section class="section quote-band"><div><p class="eyebrow">Quick Quote</p><h2>Send transformer requirements</h2><p>Share capacity, voltage, application and drawings if available. Final specifications will be confirmed by project engineering.</p></div>${quoteForm(true)}</section>
  <section class="section"><div class="section-head"><p class="eyebrow">Product Matrix</p><h2>Transformer Categories</h2></div><div class="category-grid">${categories.map((c) => `<article id="${c.slug}" class="category-card"><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p><div class="tags">${c.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div></article>`).join("")}</div></section>
  <section class="section pale"><div class="section-head"><p class="eyebrow">Why Tianyu Electric</p><h2>Confirmed Company Profile</h2></div><div class="fact-grid">
    ${[
      ["Established", company.established],
      ["Group Background", company.groupBackground],
      ["Registered Capital", company.registeredCapital],
      ["Production Capacity", "To be confirmed"],
      ["Testing Capability", "CESI and type/special test references shown for dry-type transformers; other test capacity to be confirmed"],
      ["Export Markets", "Southeast Asia, Africa, Europe and beyond are referenced in brochure"]
    ].map(([k, v]) => `<div class="fact"><strong>${esc(k)}</strong><span>${esc(v)}</span></div>`).join("")}
  </div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">Applications</p><h2>Where Transformers Are Used</h2></div><div class="application-grid">${applications.map((a) => `<article><h3>${esc(a)}</h3><p>Transformer selection and configuration to be confirmed according to project load, voltage level and installation environment.</p></article>`).join("")}</div></section>
  <section class="section pale"><div class="section-head"><p class="eyebrow">Projects</p><h2>Engineering Experience</h2><a class="text-link" href="projects.html">View Projects</a></div><div class="case-grid">${cases.map(caseCard).join("")}</div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">Quality & Certificates</p><h2>Verified and To-Be-Confirmed Items</h2></div><div class="certificate-grid">${certificates.map((c) => `<article><h3>${esc(c.name)}</h3><p>${esc(c.scope)}</p><span>${esc(c.status)}</span></article>`).join("")}</div></section>
  <section class="section split"><div><p class="eyebrow">Factory & Testing</p><h2>Manufacturing Capability</h2><p>Tianyu Electric is described in the brochure as a southern manufacturing base for primary electrical equipment. Factory area, annual output, equipment quantities and detailed testing capacity are to be confirmed.</p><a class="btn btn-primary" href="factory.html">View Factory</a></div><div class="image-grid"><img src="assets/images/factory-campus.jpeg" alt="Factory campus"><img src="assets/images/factory-substation.jpeg" alt="Substation product scene"></div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">News / Knowledge</p><h2>Technical Articles</h2></div><div class="article-grid">${["How to Prepare Transformer Inquiry Data","Oil-Immersed vs Dry-Type Transformer Selection","Understanding Energy-Efficiency Transformer Standards"].map((t) => `<article><p class="eyebrow">Knowledge</p><h3>${t}</h3><p>Placeholder article. Technical content to be confirmed before publishing.</p></article>`).join("")}</div></section>`;
  return page({ title: "Tianyu Electric | Power & Distribution Transformer Solutions", description: "English B2B transformer website for Tianyu Electric, covering oil-immersed, dry-type, rectifier and special transformers.", active: "Home", content, canonical: "index.html" });
}

function caseCard(c) {
  return `<article class="case-card"><img src="${c.image}" alt="${esc(c.name)}"><div><p class="eyebrow">${esc(c.type)}</p><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p><dl><dt>Location</dt><dd>${esc(c.location)}</dd><dt>Scale</dt><dd>${esc(c.scale)}</dd><dt>Product Used</dt><dd>${esc(c.productUsed)}</dd><dt>Disclosure</dt><dd>${esc(c.disclosure)}</dd></dl></div></article>`;
}

function productsPage() {
  const content = `<section class="page-hero"><p class="eyebrow">Products</p><h1>Transformer Product Matrix</h1><p>Five category groups with nine brochure-sourced transformer products.</p><a class="btn btn-primary" href="contact.html#quote">Get a Quote</a></section>
  <section class="section"><div class="category-grid">${categories.map((c) => `<article id="${c.slug}" class="category-card"><h2>${esc(c.name)}</h2><p>${esc(c.description)}</p><div class="tags">${c.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div></article>`).join("")}</div></section>
  <section class="section pale"><div class="product-grid">${products.map((p) => productCard(p)).join("")}</div></section>`;
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

function simplePage(active, title, intro, body) {
  return page({ title: `${title} | Tianyu Electric`, description: intro, active, content: `<section class="page-hero"><p class="eyebrow">${active}</p><h1>${title}</h1><p>${intro}</p><a class="btn btn-primary" href="contact.html#quote">Get a Quote</a></section>${body}`, canonical: `${active.toLowerCase().replaceAll(" ", "-")}.html` });
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
  fs.writeFileSync(path.join(dist, "applications.html"), simplePage("Applications", "Applications", "Application scenarios for utility, renewable, industrial and infrastructure transformer projects.", `<section class="section"><div class="application-grid">${applications.map((a) => `<article><h2>${esc(a)}</h2><p>Product selection should be confirmed according to voltage level, load profile, installation environment, protection requirements and applicable standards.</p></article>`).join("")}</div></section>`));
  fs.writeFileSync(path.join(dist, "projects.html"), simplePage("Projects", "Projects & Engineering Experience", "Brochure-highlighted engineering applications are shown as experience references unless product supply details are confirmed.", `<section class="section"><div class="case-grid">${cases.map(caseCard).join("")}</div></section>`));
  fs.writeFileSync(path.join(dist, "quality.html"), simplePage("Quality", "Quality & Certificates", "Only brochure-confirmed certificate and test references are shown; missing certificates remain marked to be confirmed.", `<section class="section"><div class="certificate-grid">${certificates.map((c) => `<article><h2>${esc(c.name)}</h2><p>${esc(c.scope)}</p><span>${esc(c.status)}</span></article>`).join("")}</div><p class="note">Products can be designed and tested according to project-specific requirements. Certificates and test reports can be provided upon request where applicable.</p></section>`));
  fs.writeFileSync(path.join(dist, "factory.html"), simplePage("Factory", "Factory & Testing", "Factory visuals are brochure-derived temporary assets. Capacity data, equipment quantity and detailed test capability remain to be confirmed.", `<section class="section split"><div><h2>Manufacturing Base</h2><p>${esc(company.manufacturingBase)}</p><div class="fact-grid"><div class="fact"><strong>Factory Area</strong><span>To be confirmed</span></div><div class="fact"><strong>Annual Capacity</strong><span>To be confirmed</span></div><div class="fact"><strong>Production Equipment</strong><span>To be confirmed</span></div><div class="fact"><strong>Testing Equipment</strong><span>To be confirmed</span></div></div></div><div class="image-grid"><img src="assets/images/factory-campus.jpeg" alt="Factory campus"><img src="assets/images/factory-substation.jpeg" alt="Substation"></div></section>`));
  fs.writeFileSync(path.join(dist, "about.html"), simplePage("About Us", "About Tianyu Electric", "Fuzhou Tianyu Electric Co., Ltd. is a professional manufacturer of power primary equipment.", `<section class="section"><div class="prose"><h2>Company Profile</h2><p>${esc(company.legalName)} was established in 1996 by the former Fuzhou No.1 Switch Factory, Fuzhou No.2 Switch Factory and Fuzhou Electronic Transformer Factory, with registered capital of ${esc(company.registeredCapital)}.</p><p>${esc(company.groupBackground)} ${esc(company.manufacturingBase)}</p><p>${esc(company.productScope)}</p><h2>Historical Evolution</h2><div class="timeline"><div><strong>1958</strong><span>Fuzhou No.1 and No.2 Switch Factory and Fuzhou Electronic Transformer Factory were established.</span></div><div><strong>1996</strong><span>Tianyu Electric was established through reorganization.</span></div><div><strong>1997</strong><span>Tianyu Electric was listed on Shenzhen Stock Exchange.</span></div><div><strong>2001</strong><span>Tianyu Electric joined XJ Group Corporation.</span></div><div><strong>2016</strong><span>New factory was completed and put into operation.</span></div><div><strong>2021</strong><span>XJ Group Corporation merged into China Electrical Equipment Group Co., Ltd.</span></div></div></div></section>`));
  fs.writeFileSync(path.join(dist, "contact.html"), simplePage("Contact", "Contact Tianyu Electric", "Send transformer requirements, drawings or project conditions for engineering review.", `<section class="section quote-band"><div><h2>Inquiry Details</h2><p>Email, phone, WhatsApp and address are placeholders until confirmed by Tianyu Electric.</p><div class="fact-grid"><div class="fact"><strong>Email</strong><span>${esc(company.email)}</span></div><div class="fact"><strong>Phone</strong><span>${esc(company.phone)}</span></div><div class="fact"><strong>WhatsApp</strong><span>${esc(company.whatsapp)}</span></div><div class="fact"><strong>Address</strong><span>${esc(company.address)}</span></div></div></div>${quoteForm()}</section>`));
  fs.writeFileSync(path.join(dist, "privacy.html"), simplePage("Company", "Privacy Policy", "Placeholder privacy policy for first-version website.", `<section class="section prose"><p>To be confirmed. This first-version page is a placeholder and should be reviewed before public launch.</p></section>`));
}

writeAll();
console.log(`Built ${dist}`);
