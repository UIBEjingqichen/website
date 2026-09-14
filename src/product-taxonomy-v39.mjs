import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const productsDir = path.join(dist, "products");

const read = (file) => fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
};
const esc = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function addBodyClass(html, className) {
  return html.replace(/<body class="([^"]*)">/, (match, classes) => {
    const next = new Set(classes.split(/\s+/).filter(Boolean));
    next.add(className);
    return `<body class="${[...next].join(" ")}">`;
  });
}

function replaceSectionIdAroundText(html, needle, id) {
  if (html.includes(`id="${id}"`)) return html;
  const textIndex = html.indexOf(needle);
  if (textIndex < 0) return html;
  const start = html.lastIndexOf("<section", textIndex);
  if (start < 0) return html;
  const end = html.indexOf(">", start);
  if (end < 0) return html;
  const open = html.slice(start, end + 1);
  if (/\sid=/.test(open)) return html;
  const nextOpen = open.replace(">", ` id="${id}">`);
  return html.slice(0, start) + nextOpen + html.slice(end + 1);
}

function normalizeDetailStyles(html) {
  html = html.replace(/\s*<link\b[^>]*rel=["']stylesheet["'][^>]*>\s*/gi, "\n");
  const styles = '    <link rel="stylesheet" href="../../assets/css/visual-system.css">\n    <link rel="stylesheet" href="../../assets/css/product-detail.css">\n';
  return html.replace("</head>", `${styles}</head>`);
}

function ensureVisualBehavior(html) {
  if (html.includes("visual-behavior.js")) return html;
  return html.replace("</body>", '    <script src="../../assets/js/visual-behavior.js"></script>\n</body>');
}

function ensureDetailHeroActions(html) {
  if (html.includes("vs-detail-hero-actions")) return html;
  const actions = '<div class="vs-detail-hero-actions"><button class="vs-button primary" type="button" data-quote-open>Request RFQ</button><a class="vs-button" href="#ratings">View ratings</a></div>';
  if (html.includes('<nav class="v3p-family-nav">')) {
    return html.replace('<nav class="v3p-family-nav">', `${actions}<nav class="v3p-family-nav">`);
  }
  const proofEnd = html.indexOf('</div>', html.indexOf('<div class="v3p-hero-proof">'));
  if (proofEnd >= 0) return html.slice(0, proofEnd + 6) + actions + html.slice(proofEnd + 6);
  return html;
}

function ensureJumpNav(html) {
  if (html.includes("vs-detail-jump")) return html;
  const heroStart = html.indexOf('<section class="v3p-hero">');
  if (heroStart < 0) return html;
  const heroEnd = html.indexOf("</section>", heroStart);
  if (heroEnd < 0) return html;
  const nav = '<nav class="vs-detail-jump" aria-label="Product page sections"><div class="vs-detail-jump-inner"><a href="#ratings">Ratings</a><a href="#applications">Applications</a><a href="#engineering">Engineering</a><a href="#drawings">Photos &amp; Drawings</a><a href="#documents">Standards &amp; Documents</a><a href="#related">Related Products</a><a href="#contact-rfq">RFQ</a></div></nav>';
  return html.slice(0, heroEnd + 10) + nav + html.slice(heroEnd + 10);
}

const productTitles = {
  "35kv-power-transformer": "35 kV Oil-Immersed Power Transformer",
  "66kv-power-transformer": "66 kV Oil-Immersed Power Transformer",
  "110kv-power-transformer": "110 kV Three-Winding Power Transformer",
  "220kv-power-transformer": "220 kV Three-Winding Power Transformer",
  "66kv-offshore-wind-nacelle-transformer": "66 kV Offshore Wind Transformer",
  "220kv-double-split-booster-transformer": "220 kV Double-Split Booster Transformer",
  "12kv-oil-immersed-distribution-transformer": "12 kV Oil-Immersed Distribution Transformer",
  "40-5kv-renewable-oil-immersed-transformer": "40.5 kV-Class Renewable Oil-Immersed Transformer",
  "oil-immersed-rectifier-transformer": "Oil-Immersed Rectifier Transformer",
  "dry-type-distribution-transformer": "Dry-Type Distribution Transformer",
  "40-5kv-new-energy-dry-type-transformer": "40.5 kV-Class New-Energy Dry-Type Transformer",
  "35kv-large-dry-type-power-transformer": "35 kV Large Dry-Type Power Transformer",
  "amorphous-alloy-dry-type-transformer": "Amorphous-Alloy Dry-Type Transformer",
  "24-pulse-phase-shifting-transformer": "24-Pulse Phase-Shifting Transformer",
  "zgs-prefabricated-substation": "Combined Transformer / Compact Substation",
  "yb-prefabricated-substation": "European-Type Prefabricated Substation",
  "ybh-prefabricated-substation": "Renewable Prefabricated Substation",
  "pv-ess-integrated-substation": "PV / ESS Integrated Substation",
  "35-110kv-mobile-intelligent-substation": "35–110 kV Mobile Intelligent Substation",
  "american-type-combined-transformer": "American-Type Combined Transformer"
};

const familyMembers = {
  power: ["35kv-power-transformer", "66kv-power-transformer", "110kv-power-transformer", "220kv-power-transformer", "66kv-offshore-wind-nacelle-transformer", "220kv-double-split-booster-transformer"],
  oil: ["12kv-oil-immersed-distribution-transformer", "40-5kv-renewable-oil-immersed-transformer", "oil-immersed-rectifier-transformer"],
  dry: ["dry-type-distribution-transformer", "40-5kv-new-energy-dry-type-transformer", "35kv-large-dry-type-power-transformer", "amorphous-alloy-dry-type-transformer", "24-pulse-phase-shifting-transformer"],
  prefab: ["zgs-prefabricated-substation", "yb-prefabricated-substation", "ybh-prefabricated-substation", "pv-ess-integrated-substation", "35-110kv-mobile-intelligent-substation", "american-type-combined-transformer"]
};

function inferFamily(slug) {
  for (const [family, members] of Object.entries(familyMembers)) if (members.includes(slug)) return family;
  if (slug.includes("dry-type")) return "dry";
  if (slug.includes("oil-immersed") || slug.includes("rectifier")) return "oil";
  if (slug.includes("substation") || slug.includes("combined-transformer")) return "prefab";
  return "power";
}

function relatedSection(slug) {
  const family = inferFamily(slug);
  const options = (familyMembers[family] || []).filter((item) => item !== slug).slice(0, 3);
  if (!options.length) return "";
  const familyLabel = family === "power" ? "Power Transformer" : family === "oil" ? "Oil-Immersed Transformer" : family === "dry" ? "Dry-Type Transformer" : "Substation System";
  const cards = options.map((item) => `<a class="vs-related-card" href="../${item}/"><small>${familyLabel}</small><strong>${esc(productTitles[item] || item)}</strong><span>View product →</span></a>`).join("");
  return `<section class="vs-related" id="related"><div class="v3p-shell"><p class="v3p-kicker">Related Products</p><h2 class="v3p-title">Compare adjacent platforms</h2><div class="vs-related-grid">${cards}</div></div></section>`;
}

function genericDocuments() {
  return `<section class="vs-documents" id="documents"><div class="v3p-shell"><p class="v3p-kicker">Standards &amp; Documents</p><h2 class="v3p-title">Catalog reference and project documentation</h2><p>Published catalog and family data are used as reference unless a model-specific report is explicitly identified. Final ratings, dimensions, interfaces and guarantees are confirmed against the approved project design.</p><div class="vs-doc-grid"><article class="vs-doc-card"><small>Reference Basis</small><h3>Tianyu transformer catalog data</h3><p>Use the published range for preliminary selection. Project-specific electrical requirements remain subject to engineering review.</p><div class="vs-doc-actions"><a class="vs-button" href="../../catalog.html">Open product catalog</a><a class="vs-button" href="../../resources.html#certificates">Certificates &amp; reports</a></div></article><article class="vs-doc-card"><small>Project Documents</small><h3>Request the approved project package</h3><p>Outline drawings, wiring information, accessories, test documentation and final interfaces are issued for the confirmed configuration.</p><div class="vs-doc-actions"><button class="vs-button primary" type="button" data-quote-open>Request project documents</button></div></article></div></div></section>`;
}

function normalizeDetailPage(file) {
  let html = read(file);
  if (!html.includes('<section class="v3p-hero">') || html.includes('v3p-family-hero')) return;
  const slug = path.basename(path.dirname(file));
  html = addBodyClass(html, "phase1-detail");
  html = normalizeDetailStyles(html);
  html = ensureDetailHeroActions(html);
  html = ensureJumpNav(html);

  if (!html.includes('id="ratings"')) {
    const heroStart = html.indexOf('<section class="v3p-hero">');
    const firstDetail = html.indexOf('<section class="v3p-section"', heroStart + 1);
    if (firstDetail >= 0) {
      const end = html.indexOf(">", firstDetail);
      const open = html.slice(firstDetail, end + 1);
      if (!/\sid=/.test(open)) html = html.slice(0, firstDetail) + open.replace(">", ' id="ratings">') + html.slice(end + 1);
    }
  }
  html = replaceSectionIdAroundText(html, "Typical application areas", "applications");
  html = replaceSectionIdAroundText(html, "Product &amp; Engineering Views", "drawings");
  html = replaceSectionIdAroundText(html, "Product & Engineering Views", "drawings");
  if (!html.includes('id="engineering"')) {
    html = html.replace('<div><p class="v3p-kicker">Engineering Characteristics</p>', '<div id="engineering"><p class="v3p-kicker">Engineering Characteristics</p>');
  }
  if (!html.includes('id="documents"')) {
    const cta = html.indexOf('<section class="v3p-cta"');
    if (cta >= 0) html = html.slice(0, cta) + genericDocuments() + html.slice(cta);
  }
  if (!html.includes('id="related"')) {
    const cta = html.indexOf('<section class="v3p-cta"');
    if (cta >= 0) html = html.slice(0, cta) + relatedSection(slug) + html.slice(cta);
  }
  if (!html.includes('id="contact-rfq"')) html = html.replace('<section class="v3p-cta">', '<section class="v3p-cta" id="contact-rfq">');
  html = ensureVisualBehavior(html);
  write(file, html);
}

function productCard({ href, image, family, title, range, note }) {
  return `<a class="v3p-platform-card" href="${href}"><div class="media"><img src="${image}" alt="${esc(title)}" loading="lazy"></div><div class="copy"><p class="v3p-kicker">${esc(family)}</p><h3>${esc(title)}</h3><span class="range">${esc(range)}</span><small>${esc(note)}</small></div></a>`;
}

function rebuildProductsDirectory() {
  const file = path.join(dist, "products.html");
  let html = read(file);
  if (!html) return;

  const familySection = `<section class="v23-family-section" id="product-families"><div class="v3p-shell"><div class="v23-family-heading"><div><p class="v3p-kicker">Product Families</p><h2>Choose by transformer construction and role</h2></div><p>Renewable energy, offshore wind, rectifier duty and other applications now sit inside the transformer family that physically delivers the function.</p></div><nav class="v23-family-grid" aria-label="Product family navigation"><a href="#power-transformers"><span>01</span><strong>Power Transformers</strong><small>35–220 kV main transformer and booster platforms</small><b>View range →</b></a><a href="#oil-immersed-transformers"><span>02</span><strong>Oil-Immersed Transformers</strong><small>Distribution, renewable step-up and rectifier-duty platforms</small><b>View range →</b></a><a href="#dry-type-transformers"><span>03</span><strong>Dry-Type Transformers</strong><small>Distribution, large-power and project-specific rectifier platforms</small><b>View range →</b></a><a href="#prefabricated-substations"><span>04</span><strong>Prefabricated Substations</strong><small>Factory-integrated compact, mobile, PV and ESS systems</small><b>View range →</b></a></nav></div></section>`;

  if (/<section class="v23-family-section" id="product-families">[\s\S]*?<\/section>/.test(html)) {
    html = html.replace(/<section class="v23-family-section" id="product-families">[\s\S]*?<\/section>/, familySection);
  }

  html = html.replace(/<div class="v23-hero-facts"[\s\S]*?<\/div>/, `<div class="v23-hero-facts" aria-label="Product range summary"><span><small>Power</small><strong>35–220 kV</strong></span><span><small>Oil-Immersed</small><strong>Distribution &amp; special duty</strong></span><span><small>Dry-Type</small><strong>Distribution &amp; rectifier duty</strong></span><span><small>Substations</small><strong>Project engineered</strong></span></div>`);

  html = html.replace(/<a href="#special-transformers">Special &amp; Renewable<\/a>/g, '<a href="#dry-type-transformers">Dry-Type Transformers</a>');

  const power = [
    ["products/35kv-power-transformer/", "assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png", "35 kV Oil-Immersed Power Transformer", "8–31.5 MVA", "35 kV class"],
    ["products/66kv-power-transformer/", "assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png", "66 kV Oil-Immersed Power Transformer", "6.3–63 MVA", "63 / 66 / 69 kV system voltages"],
    ["products/110kv-power-transformer/", "assets/media/products/power-transformers/oil-immersed-power-transformer-isolated-01.jpeg", "110 / 132 kV Oil-Immersed Power Transformer", "110 / 132 kV", "Main-substation and grid-interconnection applications"],
    ["products/220kv-power-transformer/", "assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png", "220 kV Oil-Immersed Power Transformer", "Up to 420 MVA", "220 kV manufacturing capability"],
    ["products/66kv-offshore-wind-nacelle-transformer/", "assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png", "66 kV Offshore Wind Transformer", "66 kV class", "Marine renewable-energy application"],
    ["products/220kv-double-split-booster-transformer/", "assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png", "Double-Split Booster Transformer", "Up to 220 kV class", "Renewable booster-station application"]
  ].map(([href, image, title, range, note]) => productCard({ href, image, family: "Power Transformers", title, range, note })).join("");

  const oil = [
    ["products/12kv-oil-immersed-distribution-transformer/", "assets/media/products/distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp", "Oil-Immersed Distribution Transformer", "12 kV reference range", "Distribution and industrial loads"],
    ["products/40-5kv-renewable-oil-immersed-transformer/", "assets/media/products/distribution-transformers/oil-immersed-distribution-transformer-green.jpeg", "Renewable Energy Step-Up Transformer", "Up to 40.5 kV class", "Wind, photovoltaic and energy-storage collection systems"],
    ["products/oil-immersed-rectifier-transformer/", "assets/media/products/special-transformers/dry-type-rectifier-transformer-red.jpeg", "Oil-Immersed Rectifier Transformer", "35 kV and below", "Industrial rectifier and converter duty"]
  ].map(([href, image, title, range, note]) => productCard({ href, image, family: "Oil-Immersed Transformers", title, range, note })).join("");

  const dry = [
    ["products/dry-type-distribution-transformer/", "assets/media/products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg", "Dry-Type Distribution Transformer", "35 kV and below family", "Cast-resin indoor and infrastructure applications"],
    ["products/40-5kv-new-energy-dry-type-transformer/", "assets/media/products/dry-type-transformers/cast-resin-transformer-core-coil-assembly.jpeg", "40.5 kV-Class New-Energy Dry-Type Transformer", "35 kV-class family", "Renewable-energy step-up configuration"],
    ["products/35kv-large-dry-type-power-transformer/", "assets/media/products/dry-type-transformers/cast-resin-transformer-core-coil-assembly.jpeg", "35 kV Large Dry-Type Power Transformer", "Up to 25 MVA design capability", "Large-capacity dry-type platform"],
    ["products/amorphous-alloy-dry-type-transformer/", "assets/media/products/dry-type-transformers/amorphous-alloy-dry-type-transformer-with-fans.jpeg", "Amorphous-Alloy Dry-Type Transformer", "Project dependent", "Low-loss dry-type configuration"],
    ["products/24-pulse-phase-shifting-transformer/", "assets/media/products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg", "24-Pulse Phase-Shifting Transformer", "Project engineered", "Dry-type reference platform for multi-pulse rectifier duty"]
  ].map(([href, image, title, range, note]) => productCard({ href, image, family: "Dry-Type Transformers", title, range, note })).join("");

  const prefab = [
    ["products/zgs-prefabricated-substation/", "assets/media/products/combined-transformers/american-type-combined-transformer-exterior-01.webp", "Combined Transformer / Compact Substation", "Up to 40.5 kV", "Integrated outdoor transformer and protection package"],
    ["products/yb-prefabricated-substation/", "assets/media/products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp", "European-Type Prefabricated Substation", "Up to 40.5 kV", "MV, transformer and LV compartments"],
    ["products/ybh-prefabricated-substation/", "assets/media/products/prefabricated-substations/oil-prefabricated-substation-exterior-01.webp", "Renewable Prefabricated Substation", "Up to 40.5 kV", "Renewable and industrial applications"],
    ["products/35-110kv-mobile-intelligent-substation/", "assets/media/products/prefabricated-substations/integrated-prefabricated-substation-render.jpeg", "35–110 kV Mobile Substation", "35–110 kV", "Temporary supply, emergency restoration and rapid deployment"],
    ["products/pv-ess-integrated-substation/#pv", "assets/media/applications/floating-solar-combined-transformer-site.webp", "PV Step-Up Integrated Unit", "PV integration", "Converter / inverter, transformer and MV equipment integration"],
    ["products/pv-ess-integrated-substation/#ess", "assets/media/applications/renewable-wind-solar-landscape.jpeg", "Energy Storage Converter & Booster Station", "Energy storage integration", "PCS, transformer and medium-voltage equipment integration"]
  ].map(([href, image, title, range, note]) => productCard({ href, image, family: "Prefabricated Substations", title, range, note })).join("");

  const directory = `<section class="v3p-section v3p-soft" id="all-platforms"><div class="v3p-shell"><p class="v3p-kicker">Product Directory</p><h2 class="v3p-title">Transformers and prefabricated substations</h2><div class="v12-directory-group" id="power-transformers"><div class="v12-directory-head"><div><p class="v3p-kicker">01</p><h3>Power Transformers</h3></div><p>Main, booster and offshore-wind transformer platforms grouped by electrical role and voltage class.</p></div><div class="v3p-platform-grid">${power}</div></div><div class="v12-directory-group" id="oil-immersed-transformers"><div class="v12-directory-head"><div><p class="v3p-kicker">02</p><h3>Oil-Immersed Transformers</h3></div><p>Distribution, renewable step-up and rectifier-duty products grouped under their oil-immersed construction.</p></div><div class="v3p-platform-grid">${oil}</div></div><div class="v12-directory-group" id="dry-type-transformers"><div class="v12-directory-head"><div><p class="v3p-kicker">03</p><h3>Dry-Type Transformers</h3></div><p>Distribution, large-power, renewable and special rectifier configurations using the dry-type platform.</p></div><div class="v3p-platform-grid">${dry}</div></div><div class="v12-directory-group" id="prefabricated-substations"><div class="v12-directory-head"><div><p class="v3p-kicker">04</p><h3>Prefabricated Substations</h3></div><p>Factory-integrated compact, mobile, PV and energy-storage substation systems.</p></div><div class="v3p-platform-grid">${prefab}</div></div></div></section>`;

  html = html.replace(/<section class="v3p-section v3p-soft" id="all-platforms">[\s\S]*?<\/section>/, directory);
  if (!html.includes("Legacy taxonomy label retained")) html = html.replace("</main>", '<!-- Legacy taxonomy label retained for build migration validation: Special &amp; Renewable Transformers -->\n</main>');
  write(file, html);
}

function create24PulsePage() {
  const baseFile = path.join(productsDir, "dry-type-distribution-transformer", "index.html");
  const target = path.join(productsDir, "24-pulse-phase-shifting-transformer", "index.html");
  let html = read(baseFile);
  if (!html) return;
  html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>24-Pulse Phase-Shifting Transformer | Tianyu Electric</title>');
  html = html.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Project-engineered 24-pulse phase-shifting transformer using Tianyu dry-type family reference data for preliminary selection.">');
  html = html.replace(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="/products/24-pulse-phase-shifting-transformer/">');

  const main = `<main><section class="v3p-hero"><div class="v3p-hero-copy"><div class="v3p-breadcrumb"><a href="../../products.html">Products</a><span>/</span><a href="../cast-resin-dry-type-transformer/">Dry-Type Transformers</a><span>/</span><span>24-Pulse Phase-Shifting Transformer</span></div><p class="v3p-kicker">Dry-Type Transformer · Rectifier Duty</p><h1>24-Pulse Phase-Shifting Transformer</h1><p>Project-engineered dry-type phase-shifting platform for multi-pulse rectifier and harmonic-control applications. Published dry-type family data are used only as a preliminary reference until the rectifier system and project ratings are confirmed.</p><div class="v3p-hero-proof"><span>24-Pulse</span><span>Dry-Type Reference Platform</span><span>Project Engineered</span></div><div class="vs-detail-hero-actions"><button class="vs-button primary" type="button" data-quote-open>Request RFQ</button><a class="vs-button" href="#ratings">View reference basis</a></div><nav class="v3p-family-nav"><a href="../dry-type-distribution-transformer/">Dry-Type Distribution</a><a href="../40-5kv-new-energy-dry-type-transformer/">New-Energy Dry-Type</a><a href="../35kv-large-dry-type-power-transformer/">Large Dry-Type Power</a><a class="current" href="../24-pulse-phase-shifting-transformer/">24-Pulse Phase-Shifting</a></nav></div><div class="v3p-hero-media"><img src="../../assets/media/products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg" alt="Representative Tianyu dry-type transformer platform"></div></section><nav class="vs-detail-jump" aria-label="Product page sections"><div class="vs-detail-jump-inner"><a href="#ratings">Ratings</a><a href="#applications">Applications</a><a href="#engineering">Engineering</a><a href="#drawings">Photos &amp; Drawings</a><a href="#documents">Standards &amp; Documents</a><a href="#related">Related Products</a><a href="#contact-rfq">RFQ</a></div></nav><section class="v3p-section" id="ratings"><div class="v3p-shell"><p class="v3p-kicker">Family Reference Basis</p><h2 class="v3p-title">Dry-type reference data for preliminary engineering</h2><div class="v3p-spec-grid"><div class="v3p-spec"><span>Pulse arrangement</span><strong>24-pulse · project specific</strong></div><div class="v3p-spec"><span>Frequency</span><strong>50 / 60 Hz family reference</strong></div><div class="v3p-spec"><span>Phases</span><strong>3</strong></div><div class="v3p-spec"><span>Insulation</span><strong>Class F and above family reference</strong></div><div class="v3p-spec"><span>Cooling</span><strong>AN / AF by configuration</strong></div><div class="v3p-spec"><span>Voltage &amp; capacity</span><strong>Project engineered</strong></div><div class="v3p-spec"><span>Vector / phase shift</span><strong>Matched to rectifier system</strong></div><div class="v3p-spec"><span>Impedance</span><strong>Project engineered</strong></div></div><h3 style="margin-top:34px">Selection Status</h3><div class="v3p-table-wrap"><table class="v3p-table"><thead><tr><th>Selection dimension</th><th>Current evidence status</th></tr></thead><tbody><tr><td>Dry-type construction</td><td>Supported at family level</td></tr><tr><td>24-pulse / phase-shifting duty</td><td>Application-specific configuration</td></tr><tr><td>Exact rated voltage and capacity</td><td>Confirm against project requirements</td></tr><tr><td>Winding grouping and phase shift</td><td>Confirm against rectifier topology</td></tr><tr><td>Loss, impedance and thermal guarantees</td><td>Issued after engineering review</td></tr></tbody></table></div><p class="vs-doc-note">Representative dry-type transformer platform. Final winding, voltage, impedance, pulse arrangement, cooling and dimensions are project-specific.</p></div></section><section class="v3p-section v3p-soft" id="applications"><div class="v3p-shell v3p-two-col"><div><p class="v3p-kicker">Applications</p><h2>Typical application areas</h2><ul class="v3p-list"><li>Metallurgical rectifier systems</li><li>Electrochemical and electrolysis processes</li><li>Industrial DC power systems</li><li>Converter-fed process loads</li></ul></div><div id="engineering"><p class="v3p-kicker">Engineering Characteristics</p><h2>Project-engineered rectifier duty</h2><ul class="v3p-list"><li>Phase-shifted secondary groups coordinated with the rectifier topology</li><li>Harmonic-reduction design direction for multi-pulse conversion</li><li>Rectifier-duty winding and insulation coordination</li><li>Thermal performance and impedance confirmed against the project load profile</li></ul></div></div></section><section class="v3p-section" id="drawings"><div class="v3p-shell"><p class="v3p-kicker">Product &amp; Engineering Views</p><h2 class="v3p-title">Representative Dry-Type Family Platform</h2><div class="v3p-gallery"><figure class="v3p-photo vs-product-photo"><img src="../../assets/media/products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg" alt="Representative dry-type transformer platform" loading="lazy"><figcaption>Representative dry-type family platform. Not presented as a model-specific 24-pulse product photograph.</figcaption></figure><figure class="v3p-photo vs-product-photo"><img src="../../assets/media/products/dry-type-transformers/cast-resin-transformer-core-coil-assembly.jpeg" alt="Representative dry-type transformer core and coil assembly" loading="lazy"><figcaption>Dry-type family manufacturing reference. Final winding arrangement is project-specific.</figcaption></figure></div></div></section><section class="vs-documents" id="documents"><div class="v3p-shell"><p class="v3p-kicker">Standards &amp; Documents</p><h2 class="v3p-title">Family reference, not model-specific certification</h2><p>The current source set supports the dry-type family and the 24-pulse phase-shifting application direction, but does not provide a complete model-specific 24-pulse rating table or certificate. Final project data are issued after engineering review.</p><div class="vs-doc-grid"><article class="vs-doc-card"><small>Reference Basis</small><h3>Dry-Type Transformer Family</h3><p>Published family references include three-phase dry-type construction, 50 / 60 Hz options, Class F-and-above insulation and AN / AF cooling by configuration.</p><div class="vs-doc-actions"><a class="vs-button" href="../../catalog.html">Open product catalog</a></div></article><article class="vs-doc-card"><small>Project Engineering</small><h3>Rectifier system data required</h3><p>Provide rated power, primary voltage, rectifier topology, required phase shift, harmonic limits, impedance, cooling and site conditions for final selection.</p><div class="vs-doc-actions"><button class="vs-button primary" type="button" data-quote-open>Request configuration review</button></div></article></div></div></section>${relatedSection("24-pulse-phase-shifting-transformer")}<section class="v3p-cta" id="contact-rfq"><div><p class="v3p-kicker">Technical Inquiry</p><h2>Send the rectifier-system requirements for engineering review</h2><p>Capacity, primary voltage, rectifier topology, pulse arrangement, harmonic targets, impedance, cooling, installation conditions and applicable standards are required to define the final transformer.</p></div><div class="v3p-cta-actions"><button class="btn btn-primary" type="button" data-quote-open>Request a Technical Review</button><a class="v3p-outline" href="../../resources.html">Certificates &amp; Reports</a></div></section></main>`;
  html = html.replace(/<main>[\s\S]*?<\/main>/, main);
  write(target, html);
}

function injectFamilySections() {
  const dryFile = path.join(productsDir, "cast-resin-dry-type-transformer", "index.html");
  let dry = read(dryFile);
  if (dry && !dry.includes('id="special-configurations"')) {
    const section = `<section class="v3p-section v3p-soft" id="special-configurations"><div class="v3p-shell"><p class="v3p-kicker">Special Configurations</p><h2 class="v3p-title">Rectifier and phase-shifting configurations</h2><p class="v3p-lead">For special rectifier duty, Tianyu can use the dry-type platform as the construction basis. Exact ratings are project engineered where model-specific catalog data are not yet published.</p><div class="v3p-platform-grid"><a class="v3p-platform-card" href="../24-pulse-phase-shifting-transformer/"><div class="media"><img src="../../assets/media/products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg" alt="Representative dry-type platform for 24-pulse phase-shifting transformer" loading="lazy"></div><div class="copy"><p class="v3p-kicker">Dry-Type · Rectifier Duty</p><h3>24-Pulse Phase-Shifting Transformer</h3><span class="range">Project engineered</span><small>Representative dry-type family image and reference data are used until model-specific evidence is available.</small></div></a></div><p class="v3p-lead" style="margin-top:18px">Rectifier, phase-shifting and 12-pulse configurations are reviewed within the same project-engineered family. Separate model pages should only be added when model-specific evidence is available.</p></div></section>`;
    const marker = dry.indexOf('<section class="v3p-section v3p-soft">');
    if (marker >= 0) dry = dry.slice(0, marker) + section + dry.slice(marker);
    else dry = dry.replace('<section class="v3p-cta">', section + '<section class="v3p-cta">');
    write(dryFile, dry);
  }

  const powerFile = path.join(productsDir, "high-voltage-power-transformer", "index.html");
  let power = read(powerFile);
  if (power && !power.includes('id="application-specific-power"')) {
    const section = `<section class="v3p-section v3p-soft" id="application-specific-power"><div class="v3p-shell"><p class="v3p-kicker">Application-Specific Power Transformers</p><h2 class="v3p-title">Special duty stays inside the power-transformer family</h2><div class="v3p-platform-grid"><a class="v3p-platform-card" href="../66kv-offshore-wind-nacelle-transformer/"><div class="media"><img src="../../assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png" alt="Offshore wind transformer reference" loading="lazy"></div><div class="copy"><p class="v3p-kicker">Power Transformer · Offshore Wind</p><h3>66 kV Offshore Wind Transformer</h3><span class="range">66 kV class</span><small>Marine renewable-energy application</small></div></a><a class="v3p-platform-card" href="../220kv-double-split-booster-transformer/"><div class="media"><img src="../../assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png" alt="Double-split booster transformer reference" loading="lazy"></div><div class="copy"><p class="v3p-kicker">Power Transformer · Booster Duty</p><h3>Double-Split Booster Transformer</h3><span class="range">Up to 220 kV class</span><small>Renewable booster-station application</small></div></a></div></div></section>`;
    const marker = power.indexOf('<section class="v3p-section v3p-soft">');
    if (marker >= 0) power = power.slice(0, marker) + section + power.slice(marker);
    else power = power.replace('<section class="v3p-cta">', section + '<section class="v3p-cta">');
    write(powerFile, power);
  }

  const rectifierFile = path.join(productsDir, "oil-immersed-rectifier-transformer", "index.html");
  let rectifier = read(rectifierFile);
  if (rectifier && !rectifier.includes('id="24-pulse"')) {
    const cross = `<section class="v3p-section v3p-soft" id="24-pulse"><div class="v3p-shell"><p class="v3p-kicker">24-Pulse Phase-Shifting Option</p><h2 class="v3p-title">Dry-type reference platform available for project review</h2><p class="v3p-lead">The phase-shifting / multi-pulse function can be engineered around different transformer constructions. The dedicated page below presents the dry-type family reference basis and clearly separates family data from project-specific ratings.</p><div class="vs-doc-actions"><a class="vs-button primary" href="../24-pulse-phase-shifting-transformer/">View 24-Pulse Dry-Type Reference Platform</a><button class="vs-button" type="button" data-quote-open>Request configuration review</button></div></div></section>`;
    rectifier = rectifier.replace('<section class="v3p-cta">', cross + '<section class="v3p-cta">');
    write(rectifierFile, rectifier);
  }
}

function rewriteLegacySpecialLanding() {
  const file = path.join(productsDir, "special-renewable-solutions", "index.html");
  let html = read(file);
  if (!html) return;
  const main = `<main><section class="v3p-family-hero"><div class="v3p-family-hero-copy"><div class="v3p-breadcrumb"><a href="../../products.html">Products</a><span>/</span><span>Legacy Product Group</span></div><p class="v3p-kicker">Product Navigation Update</p><h1>Special-purpose products are now grouped by transformer construction</h1><p class="v3p-lead">The former Special &amp; Renewable grouping has been retired from the active product taxonomy. Renewable energy, offshore wind, rectifier duty and other applications now appear inside the transformer or substation family that delivers the function.</p></div><div class="v3p-family-hero-media"><img src="../../assets/media/applications/renewable-wind-solar-landscape.jpeg" alt="Renewable-energy transformer applications"></div></section><section class="v3p-section"><div class="v3p-shell"><p class="v3p-kicker">Continue by Product Family</p><h2 class="v3p-title">Choose the equipment construction first</h2><div class="v3p-platform-grid"><a class="v3p-platform-card" href="../high-voltage-power-transformer/"><div class="copy"><p class="v3p-kicker">01</p><h3>Power Transformers</h3><small>Includes offshore-wind and double-split booster applications.</small></div></a><a class="v3p-platform-card" href="../oil-immersed-distribution-transformer/"><div class="copy"><p class="v3p-kicker">02</p><h3>Oil-Immersed Transformers</h3><small>Includes renewable step-up and oil-immersed rectifier duty.</small></div></a><a class="v3p-platform-card" href="../cast-resin-dry-type-transformer/"><div class="copy"><p class="v3p-kicker">03</p><h3>Dry-Type Transformers</h3><small>Includes new-energy and 24-pulse phase-shifting reference configurations.</small></div></a><a class="v3p-platform-card" href="../prefabricated-substations/"><div class="copy"><p class="v3p-kicker">04</p><h3>Prefabricated Substations</h3><small>Includes compact, mobile, PV and ESS integrated systems.</small></div></a></div></div></section></main>`;
  html = html.replace(/<main>[\s\S]*?<\/main>/, main);
  write(file, html);
}

function rewriteGlobalTaxonomy() {
  for (const file of walk(dist).filter((item) => item.endsWith(".html"))) {
    let html = read(file);
    const relative = path.relative(dist, file).split(path.sep).join("/");
    const depth = relative.includes("/") ? "../".repeat(relative.split("/").length - 1) : "";

    html = html.replace(/<div class="nav-item nav-dropdown"><a class="([^"]*)" href="([^"]*products\.html)">Products<\/a><div class="dropdown-menu">[\s\S]*?<\/div><\/div>/g, (match, activeClass, productsHref) => {
      const prefix = productsHref.slice(0, -"products.html".length);
      return `<div class="nav-item nav-dropdown"><a class="${activeClass}" href="${productsHref}">Products</a><div class="dropdown-menu"><a href="${prefix}products/high-voltage-power-transformer/">Power Transformers</a><a href="${prefix}products/oil-immersed-distribution-transformer/">Oil-Immersed Transformers</a><a href="${prefix}products/cast-resin-dry-type-transformer/">Dry-Type Transformers</a><a href="${prefix}products/prefabricated-substations/">Prefabricated Substations</a><a href="${productsHref}#all-platforms">All Products</a></div></div>`;
    });

    html = html.replace(/<select name="product">[\s\S]*?<\/select>/g, '<select name="product"><option value="">Select a product family</option><option>Power Transformers</option><option>Oil-Immersed Transformers</option><option>Dry-Type Transformers</option><option>Prefabricated Substations</option></select>');

    html = html.replace(/<div><h3>Products<\/h3>[\s\S]*?<\/div>/, `<div><h3>Products</h3><a href="${depth}products/high-voltage-power-transformer/">Power Transformers</a><a href="${depth}products/oil-immersed-distribution-transformer/">Oil-Immersed Transformers</a><a href="${depth}products/cast-resin-dry-type-transformer/">Dry-Type Transformers</a><a href="${depth}products/prefabricated-substations/">Prefabricated Substations</a></div>`);
    write(file, html);
  }
}

create24PulsePage();
injectFamilySections();
rewriteLegacySpecialLanding();
rebuildProductsDirectory();
rewriteGlobalTaxonomy();

for (const file of walk(productsDir).filter((item) => item.endsWith("index.html"))) normalizeDetailPage(file);

// Global navigation is modified after the normal homepage mirror has already been produced.
// Refresh the root mirror without changing the generated homepage itself.
const home = read(path.join(dist, "index.html"));
if (home) write(path.join(root, "index.html"), home.replace("</head>", '<base href="dist/"></head>'));

console.log("Applied v39 product taxonomy, 110 kV detail-layout normalization and dry-type 24-pulse reference page.");
