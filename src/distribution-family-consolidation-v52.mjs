import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const productsRoot = path.join(dist, "products");
const sourceRoot = path.join(root, "source-media", "products");
const classifiedRoot = path.join(dist, "assets", "media", "products", "classified");

const read = (file) => fs.readFileSync(file, "utf8");
const write = (file, content) => fs.writeFileSync(file, content, "utf8");
const exists = (file) => fs.existsSync(file);
const esc = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const genericSlug = "oil-immersed-distribution-transformer";
const legacyLowSlug = "12kv-oil-immersed-distribution-transformer";
const legacyHighSlug = "40-5kv-renewable-oil-immersed-transformer";

const oilMedia = [
  "distribution-transformers/catalog-energy-efficient-oil-immersed-transformer.png",
  "distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp",
  "distribution-transformers/oil-immersed-distribution-transformer-sealed-01.webp",
  "distribution-transformers/oil-immersed-distribution-transformer-cable-connected-01.webp",
  "distribution-transformers/oil-immersed-distribution-transformer-conservator-white.jpeg",
  "distribution-transformers/oil-immersed-distribution-transformer-green.jpeg",
  "distribution-transformers/oil-immersed-distribution-transformer-blue.jpeg",
];

function copyOilMedia() {
  const target = path.join(classifiedRoot, genericSlug);
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });
  const output = [];
  for (const relative of oilMedia) {
    const src = path.join(sourceRoot, relative);
    if (!exists(src)) continue;
    const ext = path.extname(src).toLowerCase();
    const name = `${String(output.length + 1).padStart(2, "0")}${ext}`;
    fs.copyFileSync(src, path.join(target, name));
    output.push(`../../assets/media/products/classified/${genericSlug}/${name}`);
  }
  if (output.length < 5) throw new Error(`v52: expected at least 5 oil-distribution product images, found ${output.length}`);
  return output;
}

function carousel(srcs) {
  const slides = srcs.map((src, index) => `<figure class="vs-product-carousel-slide${index === 0 ? " is-active" : ""}" data-product-slide aria-hidden="${index === 0 ? "false" : "true"}"><img src="${esc(src)}" alt="Oil-Immersed Distribution Transformer${index ? ` ${index + 1}` : ""}" ${index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}></figure>`).join("");
  const dots = srcs.map((_, index) => `<button class="vs-product-carousel-dot${index === 0 ? " is-active" : ""}" type="button" data-product-dot aria-label="Show image ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"></button>`).join("");
  return `<div class="v3p-hero-media vs-product-carousel" data-product-hero data-v52-oil-family-media data-single-slide="false" aria-label="Oil-immersed distribution transformer image carousel"><div class="vs-product-carousel-stage">${slides}</div><div class="vs-product-carousel-controls"><div class="vs-product-carousel-dots" aria-label="Choose product image">${dots}</div><span class="vs-product-carousel-count" data-product-count>01 / ${String(srcs.length).padStart(2, "0")}</span></div></div>`;
}

function extractRatingTable(html, label) {
  const match = html.match(/<h3[^>]*>Rating Range<\/h3>\s*<div class="v3p-table-wrap">\s*(<table class="v3p-table">[\s\S]*?<\/table>)\s*<\/div>/i);
  if (!match) throw new Error(`v52: could not extract ${label} rating table`);
  return match[1];
}

function rewriteProductsDirectory() {
  const file = path.join(dist, "products.html");
  let html = read(file);
  html = html.replace(/<div class="v23-family-heading"><div><p class="v3p-kicker">Product Families<\/p><h2>Three product families<\/h2><\/div><p>Choose between power transformers, distribution transformers and prefabricated substations\. Application-specific variants sit under the parent platform instead of becoming duplicate product families\.<\/p><\/div>/i,
    '<div class="v23-family-heading"><div><p class="v3p-kicker">Product Families</p><h2>Three product families</h2></div></div>');
  html = html.replace(/Oil-immersed and dry-type distribution platforms/gi, "Oil-immersed and dry-type transformers up to 35 kV");
  html = html.replace(/<strong>Oil-immersed &amp; dry-type<\/strong>/gi, "<strong>Up to 35 kV · oil-immersed &amp; dry-type</strong>");
  html = html.replace(/products\/12kv-oil-immersed-distribution-transformer\//g, "products/oil-immersed-distribution-transformer/");
  html = html.replace(/assets\/media\/products\/classified\/12kv-oil-immersed-distribution-transformer\/02\.webp/g, "assets/media/products/classified/oil-immersed-distribution-transformer/01.png");
  if (html.includes("Choose between power transformers, distribution transformers and prefabricated substations")) throw new Error("v52: obsolete Product Families explainer remains");
  write(file, html);
}

function buildGenericOilPage(srcs) {
  const lowFile = path.join(productsRoot, legacyLowSlug, "index.html");
  const highFile = path.join(productsRoot, legacyHighSlug, "index.html");
  const outFile = path.join(productsRoot, genericSlug, "index.html");
  let html = read(lowFile);
  const lowHtml = html;
  const highHtml = read(highFile);
  const lowTable = extractRatingTable(lowHtml, "6–11 kV");
  const highTable = extractRatingTable(highHtml, "35 kV-class");

  html = html.replace(/<title>[\s\S]*?<\/title>/i, "<title>Oil-Immersed Distribution Transformer | Tianyu Electric</title>");
  html = html.replace(/<meta name="description" content="[^"]*">/i, '<meta name="description" content="Oil-immersed distribution transformer platform for utility, industrial and renewable-energy systems up to the 35 kV class.">');
  html = html.replace(/<link rel="canonical" href="[^"]*">/i, '<link rel="canonical" href="/products/oil-immersed-distribution-transformer/">');
  html = html.replace(/<meta property="og:title" content="[^"]*">/i, '<meta property="og:title" content="Oil-Immersed Distribution Transformer | Tianyu Electric">');
  html = html.replace(/<meta property="og:description" content="[^"]*">/i, '<meta property="og:description" content="Oil-immersed distribution transformer platform covering standard distribution, 22 kV tested reference and 35 kV-class project configurations.">');
  html = html.replace(/<meta property="og:url" content="[^"]*">/i, '<meta property="og:url" content="/products/oil-immersed-distribution-transformer/">');
  html = html.replace(/<meta property="og:image" content="[^"]*">/i, '<meta property="og:image" content="/assets/media/products/classified/oil-immersed-distribution-transformer/01.png">');
  html = html.replace(/<body\b([^>]*)>/i, (match, attrs) => match.includes('data-v52-oil-family="true"') ? match : `<body data-v52-oil-family="true"${attrs}>`);

  html = html.replace(/<div class="v3p-breadcrumb">[\s\S]*?<\/div>/i, '<div class="v3p-breadcrumb"><a href="../../products.html">Products</a><span>/</span><a href="../../products.html#distribution-transformers">Distribution Transformers</a><span>/</span><span>Oil-Immersed Distribution Transformer</span></div>');
  html = html.replace(/<p class="v3p-kicker">Distribution Transformer[^<]*<\/p>/i, '<p class="v3p-kicker">Distribution Transformer · Oil-Immersed</p>');
  html = html.replace(/<h1>[^<]*Oil-Immersed Distribution Transformer<\/h1>/i, '<h1>Oil-Immersed Distribution Transformer</h1>');
  html = html.replace(/<h1>Oil-Immersed Distribution Transformer<\/h1>\s*<p>[\s\S]*?<\/p>/i, '<h1>Oil-Immersed Distribution Transformer</h1><p>Oil-immersed distribution transformer platform for utility, industrial and renewable-energy systems up to the 35 kV class.</p>');
  html = html.replace(/<div class="v3p-hero-proof">[\s\S]*?<\/div>/i, '<div class="v3p-hero-proof"><span>Up to 35 kV class · includes 22 kV tested reference</span><span>30 kVA–12.5 MVA by configuration</span></div>');
  html = html.replace(/<nav class="v3p-family-nav">[\s\S]*?<\/nav>/i, '<nav class="v3p-family-nav"><a class="current" href="../oil-immersed-distribution-transformer/">Oil-Immersed Distribution Transformer</a><a href="../dry-type-distribution-transformer/">Dry-Type Distribution Transformer</a></nav>');
  html = html.replace(/<div class="v3p-hero-media vs-product-carousel"[\s\S]*?<\/div>\s*<\/section>/i, `${carousel(srcs)}</section>`);

  const ratings = `<section class="v3p-section" id="ratings"><div class="v3p-shell"><p class="v3p-kicker">Technical Range</p><h2 class="v3p-title">Oil-immersed distribution range up to the 35 kV class</h2><div class="v3p-spec-grid"><div class="v3p-spec"><span>Product family</span><strong>Oil-immersed distribution transformer</strong></div><div class="v3p-spec"><span>HV systems</span><strong>6 / 6.3 / 6.6 / 10 / 10.5 / 11 / 22 / 33 / 34.5 / 35 / 37 / 38.5 kV</strong></div><div class="v3p-spec"><span>LV systems</span><strong>0.4 / 0.415 / 0.42 / 0.69 / 0.8 / 1.14 kV</strong></div><div class="v3p-spec"><span>Rated power</span><strong>30 kVA–12.5 MVA, depending on voltage and project configuration</strong></div><div class="v3p-spec"><span>Frequency</span><strong>50 / 60 Hz</strong></div><div class="v3p-spec"><span>Vector group</span><strong>Dyn11 / Yyn0 / Dyn5</strong></div><div class="v3p-spec"><span>Cooling</span><strong>ONAN</strong></div><div class="v3p-spec"><span>Winding</span><strong>Copper · aluminum available on project-specific configurations</strong></div></div><div class="vs-parameter-source" style="margin-top:24px"><small>The product hierarchy is organized by construction type, not by voltage. Voltage-specific tables below remain as engineering references so 22 kV and 35 kV-class configurations are not lost.</small></div><h3 style="margin-top:34px">Standard distribution range · 6–11 kV reference</h3><div class="v3p-table-wrap">${lowTable}</div><h3 style="margin-top:34px">35 kV-class / renewable collection range</h3><div class="v3p-table-wrap">${highTable}</div><div class="vs-reference-parameters" data-v41-reference-parameters><h3>22 kV Tested Reference</h3><p class="vs-parameter-source"><small><strong>Reference product:</strong> S-M-630/22-Tier2 · report CN25IM0T 001. These values belong to the tested 22 kV model and demonstrate that the oil-immersed distribution family is not limited to 6–11 kV.</small></p><div class="v3p-table-wrap"><table class="v3p-table"><thead><tr><th>Parameter</th><th>Reference value</th></tr></thead><tbody><tr><td>Rated power</td><td>630 kVA</td></tr><tr><td>Rated voltage</td><td>22(±2×2.5%) / 0.42 kV</td></tr><tr><td>Rated current HV / LV</td><td>16.53 / 866 A</td></tr><tr><td>Frequency</td><td>50 Hz</td></tr><tr><td>Vector group</td><td>Dyn5</td></tr><tr><td>Cooling</td><td>ONAN</td></tr><tr><td>Short-circuit impedance</td><td>6.0%±10%</td></tr><tr><td>Loss reference</td><td>P0 ≤0.54 kW · Pk ≤4.6 kW @75°C</td></tr></tbody></table></div></div></div></section>`;
  html = html.replace(/<section class="v3p-section" id="ratings">[\s\S]*?<\/section>(?=<section class="v3p-section v3p-soft" id="applications">)/i, ratings);

  const applications = `<section class="v3p-section v3p-soft" id="applications"><div class="v3p-shell v3p-two-col"><div><p class="v3p-kicker">Applications</p><h2>Typical application areas</h2><ul class="v3p-list"><li>Utility distribution networks</li><li>Industrial and commercial distribution</li><li>22 kV distribution systems</li><li>Wind, photovoltaic and energy-storage collection systems</li></ul></div><div id="engineering"><p class="v3p-kicker">Engineering Characteristics</p><h2>Platform configurations</h2><ul class="v3p-list"><li>Sealed and conservator-type oil-immersed construction</li><li>ONAN cooling</li><li>Multiple tapping and vector-group options</li><li>Project-specific winding material, impedance and cable-interface engineering</li></ul></div></div></section>`;
  html = html.replace(/<section class="v3p-section v3p-soft" id="applications">[\s\S]*?<\/section>(?=<section class="vs-documents")/i, applications);

  html = html.replace(/<section class="vs-related" id="related">[\s\S]*?<\/section>/i, '<section class="vs-related" id="related"><div class="v3p-shell"><p class="v3p-kicker">Related Products</p><h2 class="v3p-title">Related distribution and special-purpose platforms</h2><div class="vs-related-grid"><a class="vs-related-card" href="../dry-type-distribution-transformer/"><small>Distribution Transformer</small><strong>Dry-Type Distribution Transformer</strong><span>View product →</span></a><a class="vs-related-card" href="../oil-immersed-rectifier-transformer/"><small>Special-Purpose Transformer</small><strong>Oil-Immersed Rectifier Transformer</strong><span>View product →</span></a><a class="vs-related-card" href="../../products.html#prefabricated-substations"><small>Integrated Solution</small><strong>Prefabricated Substations</strong><span>View range →</span></a></div></div></section>');

  if (/12 kV Oil-Immersed Distribution Transformer|40\.5 kV-Class Renewable Oil-Immersed/i.test(html)) throw new Error("v52: voltage-defined product identity remains on consolidated oil page");
  if (!html.includes("22 kV Tested Reference") || !html.includes("35 kV-class / renewable collection range")) throw new Error("v52: consolidated oil page lost mid/high-voltage coverage");
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  write(outFile, html);
}

function normalizeDistributionNavigation() {
  const dryFile = path.join(productsRoot, "dry-type-distribution-transformer", "index.html");
  if (exists(dryFile)) {
    let dry = read(dryFile);
    dry = dry.replace(/<nav class="v3p-family-nav">[\s\S]*?<\/nav>/i, '<nav class="v3p-family-nav"><a href="../oil-immersed-distribution-transformer/">Oil-Immersed Distribution Transformer</a><a class="current" href="../dry-type-distribution-transformer/">Dry-Type Distribution Transformer</a></nav>');
    write(dryFile, dry);
  }

  const stack = [dist];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { stack.push(full); continue; }
      if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
      let html = read(full);
      const before = html;
      html = html.replace(/products\/12kv-oil-immersed-distribution-transformer\//g, "products/oil-immersed-distribution-transformer/");
      html = html.replace(/\.\.\/12kv-oil-immersed-distribution-transformer\//g, "../oil-immersed-distribution-transformer/");
      if (html !== before) write(full, html);
    }
  }
}

const srcs = copyOilMedia();
rewriteProductsDirectory();
buildGenericOilPage(srcs);
normalizeDistributionNavigation();

console.log(`v52 distribution architecture: generic oil-immersed distribution page rebuilt with ${srcs.length} compatible product images, 6–11 kV + 22 kV + 35 kV-class engineering coverage, and construction-type navigation.`);
