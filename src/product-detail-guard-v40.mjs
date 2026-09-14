import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const productsDir = path.join(root, "dist", "products");

const read = (file) => fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
const write = (file, html) => fs.writeFileSync(file, html, "utf8");

function pages() {
  if (!fs.existsSync(productsDir)) return [];
  return fs.readdirSync(productsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(productsDir, entry.name, "index.html"))
    .filter((file) => fs.existsSync(file));
}

function addBodyClass(html, name) {
  return html.replace(/<body(?: class="([^"]*)")?>/, (match, classes = "") => {
    const all = new Set(classes.split(/\s+/).filter(Boolean));
    all.add(name);
    return `<body class="${[...all].join(" ")}">`;
  });
}

function normalizeStyles(html) {
  html = html.replace(/\s*<link\b[^>]*rel=["']stylesheet["'][^>]*>\s*/gi, "\n");
  const styles = '    <link rel="stylesheet" href="../../assets/css/visual-system.css">\n    <link rel="stylesheet" href="../../assets/css/product-detail.css">\n';
  return html.replace("</head>", `${styles}</head>`);
}

function sectionAround(html, needles, id) {
  if (html.includes(`id="${id}"`)) return html;
  for (const needle of needles) {
    const i = html.toLowerCase().indexOf(needle.toLowerCase());
    if (i < 0) continue;
    const start = html.lastIndexOf("<section", i);
    if (start < 0) continue;
    const end = html.indexOf(">", start);
    if (end < 0) continue;
    const open = html.slice(start, end + 1);
    if (/\sid=/.test(open)) continue;
    return html.slice(0, start) + open.replace(">", ` id="${id}">`) + html.slice(end + 1);
  }
  return html;
}

function addAnchorBefore(html, marker, id) {
  if (html.includes(`id="${id}"`)) return html;
  const i = html.indexOf(marker);
  if (i < 0) return html;
  return html.slice(0, i) + `<span id="${id}" class="vs-detail-anchor" aria-hidden="true"></span>` + html.slice(i);
}

function ensureRatings(html) {
  if (html.includes('id="ratings"')) return html;
  const hero = html.indexOf('<section class="v3p-hero">');
  const start = html.indexOf('<section class="v3p-section"', hero + 1);
  if (start < 0) return html;
  const end = html.indexOf(">", start);
  const open = html.slice(start, end + 1);
  if (/\sid=/.test(open)) return addAnchorBefore(html, open, "ratings");
  return html.slice(0, start) + open.replace(">", ' id="ratings">') + html.slice(end + 1);
}

function ensureEngineering(html) {
  if (html.includes('id="engineering"')) return html;
  const needles = ["Engineering Characteristics", "Platform features", "Functional features", "Main features"];
  for (const needle of needles) {
    const i = html.toLowerCase().indexOf(needle.toLowerCase());
    if (i < 0) continue;
    const div = html.lastIndexOf("<div", i);
    if (div >= 0) {
      const end = html.indexOf(">", div);
      const open = html.slice(div, end + 1);
      if (!/\sid=/.test(open)) return html.slice(0, div) + open.replace(">", ' id="engineering">') + html.slice(end + 1);
    }
  }
  const fallback = html.indexOf('id="drawings"');
  if (fallback >= 0) {
    const section = html.lastIndexOf("<section", fallback);
    if (section >= 0) return html.slice(0, section) + '<span id="engineering" class="vs-detail-anchor" aria-hidden="true"></span>' + html.slice(section);
  }
  return html.replace("</main>", '<span id="engineering" class="vs-detail-anchor" aria-hidden="true"></span></main>');
}

function genericDocuments() {
  return '<section class="vs-documents" id="documents"><div class="v3p-shell"><p class="v3p-kicker">Standards &amp; Documents</p><h2 class="v3p-title">Catalog reference and project documentation</h2><p>Published catalog and family data are used as preliminary reference unless a model-specific report is explicitly identified. Final ratings, dimensions, interfaces and guarantees are confirmed against the approved project design.</p><div class="vs-doc-grid"><article class="vs-doc-card"><small>Reference Basis</small><h3>Tianyu product catalog</h3><p>Use the published family range for preliminary selection and request model-specific evidence when required.</p><div class="vs-doc-actions"><a class="vs-button" href="../../catalog.html">Open product catalog</a><a class="vs-button" href="../../resources.html#certificates">Certificates &amp; reports</a></div></article><article class="vs-doc-card"><small>Project Documents</small><h3>Approved project package</h3><p>Final drawings, interfaces, accessories and test documentation are issued for the confirmed project configuration.</p><div class="vs-doc-actions"><button class="vs-button primary" type="button" data-quote-open>Request project documents</button></div></article></div></div></section>';
}

function related(slug) {
  const title = slug.replaceAll("-", " ");
  return `<section class="vs-related" id="related"><div class="v3p-shell"><p class="v3p-kicker">Related Products</p><h2 class="v3p-title">Continue product selection</h2><div class="vs-related-grid"><a class="vs-related-card" href="../../products.html"><small>Product Directory</small><strong>Compare Tianyu transformer platforms</strong><span>View products →</span></a><a class="vs-related-card" href="../../applications.html"><small>Applications</small><strong>Match equipment to project duty</strong><span>View applications →</span></a><a class="vs-related-card" href="../../resources.html"><small>Technical Resources</small><strong>Review documents for ${title}</strong><span>View resources →</span></a></div></div></section>`;
}

function ensureHeroActions(html) {
  if (html.includes("vs-detail-hero-actions")) return html;
  const block = '<div class="vs-detail-hero-actions"><button class="vs-button primary" type="button" data-quote-open>Request RFQ</button><a class="vs-button" href="#ratings">View ratings</a></div>';
  if (html.includes('<nav class="v3p-family-nav">')) return html.replace('<nav class="v3p-family-nav">', `${block}<nav class="v3p-family-nav">`);
  const media = html.indexOf('<div class="v3p-hero-media">');
  if (media >= 0) return html.slice(0, media) + block + html.slice(media);
  return html;
}

function ensureJump(html) {
  if (html.includes("vs-detail-jump")) return html;
  const start = html.indexOf('<section class="v3p-hero">');
  const end = html.indexOf("</section>", start);
  if (start < 0 || end < 0) return html;
  const nav = '<nav class="vs-detail-jump" aria-label="Product page sections"><div class="vs-detail-jump-inner"><a href="#ratings">Ratings</a><a href="#applications">Applications</a><a href="#engineering">Engineering</a><a href="#drawings">Photos &amp; Drawings</a><a href="#documents">Standards &amp; Documents</a><a href="#related">Related Products</a><a href="#contact-rfq">RFQ</a></div></nav>';
  return html.slice(0, end + 10) + nav + html.slice(end + 10);
}

function ensureCta(html) {
  if (html.includes('id="contact-rfq"')) return html;
  const start = html.indexOf('<section class="v3p-cta"');
  if (start >= 0) {
    const end = html.indexOf(">", start);
    const open = html.slice(start, end + 1);
    if (!/\sid=/.test(open)) return html.slice(0, start) + open.replace(">", ' id="contact-rfq">') + html.slice(end + 1);
    return html.slice(0, start) + '<span id="contact-rfq" class="vs-detail-anchor" aria-hidden="true"></span>' + html.slice(start);
  }
  return html.replace("</main>", '<section class="v3p-cta" id="contact-rfq"><div><p class="v3p-kicker">Technical Inquiry</p><h2>Send the project ratings for engineering review</h2><p>Capacity, voltage, frequency, vector group, impedance, tap range, site conditions and standards help define the correct configuration.</p></div><button class="btn btn-primary" type="button" data-quote-open>Request a Technical Review</button></section></main>');
}

function ensureScript(html) {
  if (html.includes("visual-behavior.js")) return html;
  return html.replace("</body>", '    <script src="../../assets/js/visual-behavior.js"></script>\n</body>');
}

let count = 0;
for (const file of pages()) {
  let html = read(file);
  if (!html.includes('<section class="v3p-hero">') || html.includes('v3p-family-hero')) continue;
  const slug = path.basename(path.dirname(file));
  html = normalizeStyles(html);
  html = addBodyClass(html, "phase1-detail");
  html = ensureHeroActions(html);
  html = ensureJump(html);
  html = ensureRatings(html);
  html = sectionAround(html, ["Typical application areas", "Application scope", "Applications", "Typical applications"], "applications");
  if (!html.includes('id="applications"')) html = addAnchorBefore(html, '<section class="v3p-section v3p-soft"', "applications");
  if (!html.includes('id="applications"')) html = addAnchorBefore(html, 'id="engineering"', "applications");
  html = ensureEngineering(html);
  html = sectionAround(html, ["Product &amp; Engineering Views", "Product & Engineering Views", "Product Images", "Engineering Drawings"], "drawings");
  if (!html.includes('id="drawings"')) html = addAnchorBefore(html, '<section class="vs-documents"', "drawings");
  if (!html.includes('id="drawings"')) html = html.replace("</main>", '<span id="drawings" class="vs-detail-anchor" aria-hidden="true"></span></main>');
  if (!html.includes('id="documents"')) {
    const cta = html.indexOf('<section class="v3p-cta"');
    html = cta >= 0 ? html.slice(0, cta) + genericDocuments() + html.slice(cta) : html.replace("</main>", genericDocuments() + "</main>");
  }
  if (!html.includes('id="related"')) {
    const cta = html.indexOf('<section class="v3p-cta"');
    const block = related(slug);
    html = cta >= 0 ? html.slice(0, cta) + block + html.slice(cta) : html.replace("</main>", block + "</main>");
  }
  html = ensureCta(html);
  html = ensureScript(html);
  write(file, html);
  count += 1;
}

console.log(`Normalized ${count} concrete product detail pages to the 110 kV visual contract.`);
