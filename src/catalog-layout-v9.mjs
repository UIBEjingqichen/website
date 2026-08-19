import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "dist", "catalog.html");
const cssTarget = path.join(root, "dist", "assets", "css", "catalog-layout-v9.css");

if (!fs.existsSync(catalogPath)) throw new Error("dist/catalog.html is missing.");
let html = fs.readFileSync(catalogPath, "utf8");

const cssHref = "assets/css/catalog-layout-v9.css?v=20260819-1";
if (!html.includes("catalog-layout-v9.css")) {
  html = html.replace("</head>", `  <link rel="stylesheet" href="${cssHref}">\n</head>`);
} else {
  html = html.replace(/assets\/css\/catalog-layout-v9\.css(?:\?[^\"]*)?/g, cssHref);
}

const overview = `<section class="catalog-sheet product-overview-sheet catalog-v9-overview" id="product-oil-immersed-distribution-transformer">
  <span class="catalog-page-no">06</span>
  <div class="sheet-head"><p>DISTRIBUTION TRANSFORMER</p><h2>Oil-Immersed Distribution Transformer</h2><span>Energy-Efficient Distribution Platform</span></div>
  <p class="v9-overview-lead">S(B)20 / S(B)22 oil-immersed distribution transformers are engineered for utility, industrial and commercial distribution systems, combining sealed construction, ONAN cooling and low-loss magnetic-core design with project-specific electrical interfaces.</p>
  <div class="v9-overview-stage">
    <div class="catalog-product-photo-pair catalog-photo-count-3 v9-product-gallery">
      <figure><img src="assets/media/products/oil-distribution-transformer-02.webp" alt="Oil-immersed distribution transformer" loading="lazy"></figure>
      <figure><img src="assets/media/products/oil-distribution-transformer-01.webp" alt="Oil-immersed distribution transformer product view" loading="lazy"></figure>
      <figure><img src="assets/media/products/oil-distribution-transformer-03.webp" alt="Oil-immersed distribution transformer internal and component view" loading="lazy"></figure>
    </div>
    <aside class="v9-overview-panel">
      <div class="v9-panel-intro"><p>PRODUCT PLATFORM</p><h3>Medium-voltage distribution with a configurable project interface</h3><span>The platform covers voltage levels up to 22 kV and design capacities up to 4,000 kVA. Final voltage ratio, tapping, impedance, terminals, accessories and monitoring are confirmed against the project schedule.</span></div>
      <div class="v9-overview-specs">
        <div><span>Series voltage</span><strong>22 kV and below</strong></div>
        <div><span>Series capacity</span><strong>Up to 4,000 kVA</strong></div>
        <div><span>Frequency</span><strong>50 / 60 Hz</strong></div>
        <div><span>Cooling</span><strong>ONAN</strong></div>
        <div><span>Installation</span><strong>Outdoor</strong></div>
        <div><span>Construction</span><strong>Sealed oil-immersed</strong></div>
      </div>
      <div class="v9-panel-columns"><div><p>KEY FEATURES</p><ul><li>Low-loss silicon-steel core</li><li>Low-noise design</li><li>Sealed tank construction</li><li>Copper winding options</li></ul></div><div><p>STANDARDS / TEST SCOPE</p><strong>IEC 60076 series</strong><strong>GB 20052</strong><small>Third-party evidence is model-specific.</small></div></div>
    </aside>
  </div>
  <div class="v9-overview-band"><div><span>Tested references</span><strong>S-M-630/22-Tier2 · S-M-1600/22-Tier2</strong></div><div><span>Independent evidence</span><strong>TÜV · IEC type test · Tier 2 efficiency</strong></div><div><span>Typical applications</span><strong>Utility · industrial · commercial distribution</strong></div></div>
</section>`;

html = html.replace(/<section class="catalog-sheet product-overview-sheet" id="product-oil-immersed-distribution-transformer">[\s\S]*?<\/section>/, overview);

const details = `<section class="catalog-sheet product-evidence-sheet catalog-product-detail-sheet catalog-product-spec-sheet catalog-v9-details">
  <div class="sheet-head"><p>PRODUCT DETAILS</p><h2>Oil-Immersed Distribution Transformer</h2><span>Series design, project configuration and independently tested reference points.</span></div>
  <div class="v9-details-stage">
    <div class="v9-details-main">
      <article class="v9-details-lead"><p>APPLICATION &amp; DESIGN</p><h3>Built around distribution duty, then configured around the project</h3><span>The S(B)20 / S(B)22 platform uses sealed oil-immersed construction, ONAN cooling and a low-loss magnetic core for long-term outdoor service. The product family is used in utility networks, industrial plants and commercial distribution systems.</span></article>
      <div class="v9-detail-duo">
        <article><p>ELECTRICAL CONFIGURATION</p><h4>Electrical ratings are project-specific</h4><ul><li>Voltage ratio and tapping range</li><li>Short-circuit impedance</li><li>Vector group and terminal arrangement</li><li>Cable or bushing interfaces</li></ul></article>
        <article><p>SITE &amp; ACCESSORIES</p><h4>Mechanical interfaces follow installation conditions</h4><ul><li>Monitoring and protection accessories</li><li>Outdoor environment and site conditions</li><li>Connection orientation and clearances</li><li>Final drawing before manufacture</li></ul></article>
      </div>
      <div class="v9-selection-strip"><div><span>Voltage class</span><strong>Up to 22 kV</strong></div><div><span>Design capacity</span><strong>Up to 4,000 kVA</strong></div><div><span>Cooling</span><strong>ONAN</strong></div><div><span>Installation</span><strong>Outdoor</strong></div></div>
    </div>
    <aside class="v9-reference-panel">
      <figure><img src="assets/media/products/oil-distribution-transformer-01.webp" alt="Oil-immersed distribution transformer reference product" loading="lazy"></figure>
      <p>TESTED REFERENCE CONFIGURATIONS</p>
      <h3>Two independently documented 22 / 0.42 kV references</h3>
      <div class="v9-reference-model"><strong>S-M-630/22-Tier2</strong><span>630 kVA · 22 / 0.42 kV</span></div>
      <div class="v9-reference-model"><strong>S-M-1600/22-Tier2</strong><span>1600 kVA · 22 / 0.42 kV</span></div>
      <div class="v9-reference-evidence"><span>Evidence set</span><strong>TÜV Certificate of Conformity</strong><strong>IEC complete type-test reports</strong><strong>Tier 2 efficiency / Ecodesign evidence</strong></div>
    </aside>
  </div>
  <p class="v9-detail-note">Reference evidence applies to the stated tested configurations. Other capacities, voltage ratios and project variants require their own technical schedule and applicable verification.</p>
</section>`;

html = html.replace(/<section class="catalog-sheet product-evidence-sheet catalog-product-detail-sheet catalog-product-spec-sheet">[\s\S]*?<h2>Oil-Immersed Distribution Transformer<\/h2>[\s\S]*?<\/section>/, details);

const specItems = (items) => `<div class="v9-model-spec-grid">${items.map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join("")}</div>`;
const modelCard = (model, capacity, tag, items) => `<article class="v9-model-card"><div class="v9-model-head"><div><p>TESTED MODEL</p><h3>${model}</h3></div><div><span>${tag}</span><strong>${capacity}</strong></div></div>${specItems(items)}</article>`;

const params = `<section class="catalog-sheet catalog-core-params-sheet catalog-v9-params">
  <div class="sheet-head compact-sheet-head"><p>TESTED REFERENCE PARAMETERS</p><h2>Oil-Immersed Distribution Transformer</h2><span>Electrical and performance data for the two TÜV-tested 22 kV reference configurations.</span></div>
  <p class="catalog-core-note"><strong>Evidence scope.</strong> These values belong to the stated Tianyu reference configurations and do not certify every capacity or voltage in the wider product family.</p>
  <div class="v9-model-card-grid">
    ${modelCard("S-M-630/22-Tier2", "630 kVA", "22 / 0.42 kV", [
      ["Rated current HV / LV", "16.53 / 866 A"], ["Tap range", "±2×2.5%"], ["Vector group", "Dyn5"], ["Cooling", "ONAN"],
      ["No-load loss P₀", "≤0.54 kW"], ["Load loss Pₖ @75°C", "≤4.60 kW"], ["No-load current I₀", "0.40% (+30%)"], ["Impedance Z", "6.0% (±10%)"], ["Sound power", "≤45 dB(A)"], ["Frequency / phase", "50 Hz · three-phase"]
    ])}
    ${modelCard("S-M-1600/22-Tier2", "1600 kVA", "22 / 0.42 kV", [
      ["Rated current HV / LV", "41.99 / 2199 A"], ["Tap range", "±2×2.5%"], ["Vector group", "Dyn5"], ["Cooling", "ONAN"],
      ["No-load loss P₀", "≤1.08 kW"], ["Load loss Pₖ @75°C", "≤12.00 kW"], ["No-load current I₀", "0.40% (+30%)"], ["Impedance Z", "6.0% (±10%)"], ["Sound power", "≤57 dB(A)"], ["Frequency / phase", "50 Hz · three-phase"]
    ])}
  </div>
  <div class="v9-insulation-band"><div><span>HV rated insulation</span><strong>Um / LI / LIC / AC = 24 / 125 / 138 / 50 kV</strong></div><div><span>LV rated insulation</span><strong>Um / LI / LIC / AC = 1.1 / 20 / 22 / 10 kV</strong></div><div><span>LV neutral</span><strong>Um / LI / AC = 1.1 / 20 / 10 kV</strong></div></div>
  <div class="v9-evidence-footer"><div><span>Independent evidence</span><strong>TÜV Certificate of Conformity + IEC complete type-test reports</strong></div><div><span>Series data gap</span><strong>Full Tianyu capacity-by-capacity S(B)20 / S(B)22 performance table is not yet in the uploaded evidence set.</strong></div></div>
</section>`;

html = html.replace(/<section class="catalog-sheet catalog-core-params-sheet"><div class="sheet-head compact-sheet-head"><p>TESTED REFERENCE PARAMETERS<\/p><h2>Oil-Immersed Distribution Transformer<\/h2>[\s\S]*?<\/section>/, params);

fs.copyFileSync(path.join(__dirname, "catalog-layout-v9.css"), cssTarget);
fs.writeFileSync(catalogPath, html);
console.log("Catalog V9: rebalanced oil-distribution overview, editorial product-details page and two-model technical comparison layout.");
