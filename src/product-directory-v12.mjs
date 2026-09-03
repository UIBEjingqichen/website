import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

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

function productCard({ href, image, family, title, range, note }) {
  return `<a class="v3p-platform-card" href="${href}"><div class="media"><img src="${image}" alt="${esc(title)}" loading="lazy"></div><div class="copy"><p class="v3p-kicker">${esc(family)}</p><h3>${esc(title)}</h3>${range ? `<span class="range">${esc(range)}</span>` : ""}${note ? `<small>${esc(note)}</small>` : ""}</div></a>`;
}

const familyCards = `
<section class="v3p-section"><div class="v3p-shell">
  <p class="v3p-kicker">Browse by Product Family</p>
  <h2 class="v3p-title">Four routes into Tianyu's transformer portfolio</h2>
  <div class="v3p-family-grid">
    <a class="v3p-family-card" href="#power-transformers"><div class="v3p-family-card-media"><img src="assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png" alt="Power Transformers" loading="lazy"></div><div class="v3p-family-card-copy"><p class="v3p-kicker">Product Family</p><h3>Power Transformers</h3><p>35 kV, 66 kV, 110 / 132 kV and 220 kV main-transformer platforms, plus large dry-type power transformers.</p><strong>VIEW PRODUCTS →</strong></div></a>
    <a class="v3p-family-card" href="#distribution-transformers"><div class="v3p-family-card-media"><img src="assets/media/products/distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp" alt="Distribution Transformers" loading="lazy"></div><div class="v3p-family-card-copy"><p class="v3p-kicker">Product Family</p><h3>Distribution Transformers</h3><p>Oil-immersed and dry-type distribution transformers presented by voltage and capacity rather than domestic model codes.</p><strong>VIEW PRODUCTS →</strong></div></a>
    <a class="v3p-family-card" href="#special-transformers"><div class="v3p-family-card-media"><img src="assets/media/applications/renewable-wind-solar-landscape.jpeg" alt="Special and Renewable Transformers" loading="lazy"></div><div class="v3p-family-card-copy"><p class="v3p-kicker">Product Family</p><h3>Special &amp; Renewable Transformers</h3><p>Renewable step-up, offshore wind, rectifier, phase-shifting and split-winding transformer solutions.</p><strong>VIEW PRODUCTS →</strong></div></a>
    <a class="v3p-family-card" href="#prefabricated-substations"><div class="v3p-family-card-media"><img src="assets/media/products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp" alt="Prefabricated Substations" loading="lazy"></div><div class="v3p-family-card-copy"><p class="v3p-kicker">Product Family</p><h3>Prefabricated Substations</h3><p>Compact, European-type, renewable, mobile, PV and energy-storage integrated substation platforms.</p><strong>VIEW PRODUCTS →</strong></div></a>
  </div>
</div></section>`;

const powerCards = [
  { href: "products/35kv-power-transformer/", image: "assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png", title: "35 kV Oil-Immersed Power Transformer", range: "8–31.5 MVA", note: "35 kV class" },
  { href: "products/66kv-power-transformer/", image: "assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png", title: "66 kV Oil-Immersed Power Transformer", range: "6.3–63 MVA", note: "63 / 66 / 69 kV system voltages" },
  { href: "products/110kv-power-transformer/", image: "assets/media/products/power-transformers/oil-immersed-power-transformer-isolated-01.jpeg", title: "110 / 132 kV Oil-Immersed Power Transformer", range: "110 / 132 kV", note: "Main-substation and grid-interconnection applications" },
  { href: "products/220kv-power-transformer/", image: "assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png", title: "220 kV Oil-Immersed Power Transformer", range: "Up to 420 MVA", note: "Tianyu manufacturing capability at 220 kV" },
  { href: "products/35kv-large-dry-type-power-transformer/", image: "assets/media/products/dry-type-transformers/cast-resin-transformer-core-coil-assembly.jpeg", title: "35 kV Large Dry-Type Power Transformer", range: "Up to 25 MVA", note: "Large-capacity dry-type platform" }
].map((item) => productCard({ family: "Power Transformers", ...item })).join("");

const distributionCards = [
  { href: "products/oil-immersed-distribution-transformer/", image: "assets/media/products/distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp", title: "Oil-Immersed Distribution Transformer", range: "6–35 kV · 30–4,000 kVA", note: "Standard and project-specific distribution configurations" },
  { href: "products/dry-type-distribution-transformer/", image: "assets/media/products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg", title: "Dry-Type Distribution Transformer", range: "Up to 35 kV · Up to 8,000 kVA", note: "Includes cast-resin and amorphous-alloy low-loss configurations" }
].map((item) => productCard({ family: "Distribution Transformers", ...item })).join("");

const specialCards = [
  { href: "products/40-5kv-renewable-oil-immersed-transformer/", image: "assets/media/applications/renewable-wind-solar-landscape.jpeg", title: "Renewable Energy Step-Up Transformer", range: "Up to 40.5 kV class", note: "Wind, photovoltaic and energy-storage collection systems" },
  { href: "products/66kv-offshore-wind-nacelle-transformer/", image: "assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png", title: "Offshore Wind Transformer", range: "66 kV class", note: "Nacelle and marine renewable applications" },
  { href: "products/oil-immersed-rectifier-transformer/", image: "assets/media/products/special-transformers/dry-type-rectifier-transformer-red.jpeg", title: "Rectifier Transformer", range: "35 kV and below", note: "Industrial rectifier and converter duty" },
  { href: "products/oil-immersed-rectifier-transformer/#24-pulse", image: "assets/media/products/special-transformers/dry-type-rectifier-transformer-red.jpeg", title: "24-Pulse Phase-Shifting Transformer", range: "Project engineered", note: "Multi-pulse rectifier and phase-shifting applications" },
  { href: "products/220kv-double-split-booster-transformer/", image: "assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png", title: "Split-Winding / Double-Split Transformer", range: "Up to 220 kV class", note: "Renewable booster-station applications" }
].map((item) => productCard({ family: "Special & Renewable Transformers", ...item })).join("");

const prefabCards = [
  { href: "products/zgs-prefabricated-substation/", image: "assets/media/products/combined-transformers/american-type-combined-transformer-exterior-01.webp", title: "Combined Transformer / Compact Substation", range: "Up to 40.5 kV", note: "Integrated outdoor transformer and protection package" },
  { href: "products/yb-prefabricated-substation/", image: "assets/media/products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp", title: "European-Type Prefabricated Substation", range: "Up to 40.5 kV · Up to 12.5 MVA", note: "MV, transformer and LV compartments" },
  { href: "products/ybh-prefabricated-substation/", image: "assets/media/products/prefabricated-substations/oil-prefabricated-substation-exterior-01.webp", title: "Renewable Prefabricated Substation", range: "Up to 40.5 kV · Up to 12.5 MVA", note: "Higher-capacity renewable and industrial applications" },
  { href: "products/prefabricated-substations/", image: "assets/media/products/prefabricated-substations/integrated-prefabricated-substation-render.jpeg", title: "Prefabricated Electrical Cabin", range: "Project engineered", note: "Factory-integrated electrical and control equipment" },
  { href: "products/35-110kv-mobile-intelligent-substation/", image: "assets/media/products/prefabricated-substations/integrated-prefabricated-substation-render.jpeg", title: "35–110 kV Mobile Substation", range: "35–110 kV", note: "Temporary supply, emergency restoration and rapid deployment" },
  { href: "products/pv-ess-integrated-substation/#pv", image: "assets/media/applications/floating-solar-combined-transformer-site.webp", title: "PV Step-Up Integrated Unit", range: "PV integration", note: "Converter / inverter, transformer and MV equipment integration" },
  { href: "products/pv-ess-integrated-substation/#ess", image: "assets/media/applications/renewable-wind-solar-landscape.jpeg", title: "Energy Storage Converter & Booster Station", range: "Energy storage integration", note: "PCS, transformer and medium-voltage equipment integration" }
].map((item) => productCard({ family: "Prefabricated Substations", ...item })).join("");

const directory = `
<section class="v3p-section v3p-soft" id="all-platforms"><div class="v3p-shell">
  <p class="v3p-kicker">Product Directory</p>
  <h2 class="v3p-title">Transformers and prefabricated substations</h2>

  <div class="v12-directory-group" id="power-transformers"><div class="v12-directory-head"><div><p class="v3p-kicker">01</p><h3>Power Transformers</h3></div><p>Oil-immersed main transformers grouped by voltage class, with large dry-type power transformers shown alongside them.</p></div><div class="v3p-platform-grid">${powerCards}</div></div>

  <div class="v12-directory-group" id="distribution-transformers"><div class="v12-directory-head"><div><p class="v3p-kicker">02</p><h3>Distribution Transformers</h3></div><p>Start with insulation type, then select voltage and capacity. Domestic series codes remain inside technical detail pages rather than in the product navigation.</p></div><div class="v3p-platform-grid v12-two-card-grid">${distributionCards}</div></div>

  <div class="v12-directory-group" id="special-transformers"><div class="v12-directory-head"><div><p class="v3p-kicker">03</p><h3>Special &amp; Renewable Transformers</h3></div><p>Application-specific transformer platforms for renewable energy, offshore wind, rectifier duty and split-winding systems.</p></div><div class="v3p-platform-grid">${specialCards}</div></div>

  <div class="v12-directory-group" id="prefabricated-substations"><div class="v12-directory-head"><div><p class="v3p-kicker">04</p><h3>Prefabricated Substations</h3></div><p>Factory-integrated transformer and substation systems, including compact, renewable, mobile, PV and energy-storage configurations.</p></div><div class="v3p-platform-grid">${prefabCards}</div></div>
</div></section>`;

const hero = `<section class="v3p-index-hero"><div class="copy"><p class="v3p-kicker">Product Portfolio</p><h1>Transformers and prefabricated substations for power, distribution and renewable projects.</h1><p class="v3p-lead">Browse by transformer role first, then by voltage, capacity or application. Product navigation uses engineering terms that international buyers can read without decoding domestic model numbers.</p><div class="v3p-range-strip"><a href="#power-transformers">Power Transformers</a><a href="#distribution-transformers">Distribution Transformers</a><a href="#special-transformers">Special &amp; Renewable</a><a href="#prefabricated-substations">Prefabricated Substations</a></div></div><div class="media"><img src="assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png" alt="Tianyu power transformer"></div></section>`;

function rewriteNavigation(html) {
  return html.replace(/<div class="nav-item nav-dropdown"><a class="([^"]*)" href="([^"]*products\.html)">Products<\/a><div class="dropdown-menu">[\s\S]*?<\/div><\/div>/g, (match, activeClass, productsHref) => {
    const prefix = productsHref.slice(0, -"products.html".length);
    return `<div class="nav-item nav-dropdown"><a class="${activeClass}" href="${productsHref}">Products</a><div class="dropdown-menu"><a href="${prefix}products/high-voltage-power-transformer/">Power Transformers</a><a href="${prefix}products/oil-immersed-distribution-transformer/">Distribution Transformers</a><a href="${prefix}products/special-renewable-solutions/">Special &amp; Renewable Transformers</a><a href="${prefix}products/prefabricated-substations/">Prefabricated Substations</a><a href="${productsHref}#all-platforms">All Transformer &amp; Substation Products</a></div></div>`;
  });
}

function rewriteQuoteFamilySelect(html) {
  return html.replace(/<select name="product">[\s\S]*?<\/select>/g, `<select name="product"><option value="">Select a product family</option><option>Power Transformers</option><option>Distribution Transformers</option><option>Special &amp; Renewable Transformers</option><option>Prefabricated Substations</option></select>`);
}

function rewriteFooterProducts(html, prefix) {
  return html.replace(/<div><h3>Products<\/h3>[\s\S]*?<\/div>/, `<div><h3>Products</h3><a href="${prefix}products/high-voltage-power-transformer/">Power Transformers</a><a href="${prefix}products/oil-immersed-distribution-transformer/">Distribution Transformers</a><a href="${prefix}products/special-renewable-solutions/">Special &amp; Renewable Transformers</a><a href="${prefix}products/prefabricated-substations/">Prefabricated Substations</a></div>`);
}

for (const file of walk(dist).filter((file) => file.endsWith(".html"))) {
  let html = fs.readFileSync(file, "utf8");
  const relative = path.relative(dist, file).split(path.sep).join("/");
  const depth = relative.includes("/") ? "../".repeat(relative.split("/").length - 1) : "";
  html = rewriteNavigation(html);
  html = rewriteQuoteFamilySelect(html);
  html = rewriteFooterProducts(html, depth);
  fs.writeFileSync(file, html, "utf8");
}

const productsFile = path.join(dist, "products.html");
if (fs.existsSync(productsFile)) {
  let html = fs.readFileSync(productsFile, "utf8");
  const replacement = `${hero}${familyCards}${directory}`;
  const pattern = /<section class="v3p-index-hero">[\s\S]*?<section class="v3p-cta">/;
  if (!pattern.test(html)) throw new Error("Could not locate product-directory section in dist/products.html");
  html = html.replace(pattern, `${replacement}<section class="v3p-cta">`);
  if (!html.includes("product-directory-v12.css")) {
    html = html.replace("</head>", `  <link rel="stylesheet" href="assets/css/product-directory-v12.css">\n</head>`);
  }
  fs.writeFileSync(productsFile, html, "utf8");
}

const cssSource = path.join(__dirname, "product-directory-v12.css");
const cssTarget = path.join(dist, "assets", "css", "product-directory-v12.css");
if (fs.existsSync(cssSource)) {
  fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
  fs.copyFileSync(cssSource, cssTarget);
}

console.log("Product directory reorganized into Power, Distribution, Special & Renewable Transformers, and Prefabricated Substations.");
