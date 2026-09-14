import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const productsRoot = path.join(dist, "products");
const classifiedRoot = path.join(dist, "assets", "media", "products", "classified");
const cssSource = path.join(__dirname, "product-architecture-v46.css");

const prohibitedSource = path.join(root, "source-media", "products", "products", "小型油浸式配变 (1).JPG");
const cleanPrefab = {
  "zgs-prefabricated-substation": ["02.webp", "03.webp"],
  "yb-prefabricated-substation": ["02.webp", "03.webp", "04.webp"],
  "ybh-prefabricated-substation": ["02.jpeg", "03.jpeg"],
};

const esc = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const read = (file) => fs.readFileSync(file, "utf8");
const write = (file, content) => fs.writeFileSync(file, content, "utf8");
const toWeb = (value) => value.split(path.sep).join("/");
const exists = (file) => fs.existsSync(file);

function mark(html) {
  if (html.includes('data-v46-three-family="true"')) return html;
  return html.replace(/<body\b([^>]*)>/i, '<body data-v46-three-family="true"$1>');
}

function appendCss(target) {
  if (!exists(target)) return 0;
  const css = read(cssSource);
  const current = read(target);
  if (current.includes("v46: three-family architecture")) return 0;
  write(target, `${current.trimEnd()}\n\n${css.trim()}\n`);
  return 1;
}

function productCard({ href, image, family, title, range, note }) {
  return `<a class="v3p-platform-card" href="${href}"><div class="media"><img src="${image}" alt="${esc(title)}" loading="lazy"></div><div class="copy"><p class="v3p-kicker">${esc(family)}</p><h3>${esc(title)}</h3><span class="range">${esc(range)}</span><small>${esc(note)}</small></div></a>`;
}

function heroSlide({ image, label, strong, index }) {
  return `<figure class="v23-product-slide${index === 0 ? " is-active" : ""}" data-product-slide="${index}" aria-hidden="${index === 0 ? "false" : "true"}"><img src="${image}" alt="${esc(label)}"><figcaption><span>${esc(label)}</span><strong>${esc(strong)}</strong></figcaption></figure>`;
}

function rewriteProductsDirectory() {
  const file = path.join(dist, "products.html");
  let html = read(file);

  const heroStart = html.indexOf('<section class="v3p-index-hero');
  const familyStart = html.indexOf('<section class="v23-family-section"', heroStart);
  if (heroStart < 0 || familyStart < 0) throw new Error("v46: products hero/family section not found");
  let hero = html.slice(heroStart, familyStart);
  hero = hero.replace(/<div class="v23-hero-facts"[\s\S]*?<\/div>/i, '<div class="v23-hero-facts" aria-label="Product range summary"><span><small>Power Transformers</small><strong>35–220 kV</strong></span><span><small>Distribution Transformers</small><strong>Oil-immersed &amp; dry-type</strong></span><span><small>Prefabricated Substations</small><strong>Project engineered</strong></span></div>');

  const mediaStart = hero.indexOf('<div class="media">');
  if (mediaStart < 0) throw new Error("v46: products hero media not found");
  const slides = [
    heroSlide({ index: 0, image: "assets/media/products/classified/110kv-power-transformer/01.png", label: "Power Transformers", strong: "35–220 kV main transformer platforms" }),
    heroSlide({ index: 1, image: "assets/media/products/classified/40-5kv-renewable-oil-immersed-transformer/01.png", label: "Distribution Transformers", strong: "Oil-immersed and dry-type distribution platforms" }),
    heroSlide({ index: 2, image: "assets/media/products/classified/yb-prefabricated-substation/02.webp", label: "Prefabricated Substations", strong: "Factory-integrated compact substations" }),
  ].join("");
  const dots = [0, 1, 2].map((index) => `<button class="v23-carousel-dot${index === 0 ? " is-active" : ""}" type="button" data-product-dot="${index}" aria-label="Show ${index === 0 ? "power transformer" : index === 1 ? "distribution transformer" : "prefabricated substation"}" aria-current="${index === 0 ? "true" : "false"}"></button>`).join("");
  const media = `<div class="media"><div class="v23-product-carousel" aria-label="Selected Tianyu product portfolio">${slides}<div class="v23-carousel-nav" aria-label="Product image controls"><span class="v23-carousel-count" data-product-count>01 / 03</span><button class="vs-carousel-toggle" type="button" data-product-toggle aria-pressed="false">Pause</button><div class="v23-carousel-dots">${dots}</div></div></div></div></section>\n`;
  hero = hero.slice(0, mediaStart) + media;

  const allStart = html.indexOf('<section class="v3p-section v3p-soft" id="all-platforms">', familyStart);
  const ctaStart = html.indexOf('<section class="v3p-cta"', allStart);
  if (allStart < 0 || ctaStart < 0) throw new Error("v46: products directory range not found");

  const familySection = `<section class="v23-family-section" id="product-families"><div class="v3p-shell"><div class="v23-family-heading"><div><p class="v3p-kicker">Product Families</p><h2>Three product families</h2></div><p>Choose between power transformers, distribution transformers and prefabricated substations. Application-specific variants sit under the parent platform instead of becoming duplicate product families.</p></div><nav class="v23-family-grid" aria-label="Product family navigation"><a href="#power-transformers"><span>01</span><strong>Power Transformers</strong><small>35–220 kV main transformer platforms</small><b>View range →</b></a><a href="#distribution-transformers"><span>02</span><strong>Distribution Transformers</strong><small>Oil-immersed and dry-type distribution platforms</small><b>View range →</b></a><a href="#prefabricated-substations"><span>03</span><strong>Prefabricated Substations</strong><small>Factory-integrated compact, renewable and mobile systems</small><b>View range →</b></a></nav></div></section>\n`;

  const powerCards = [
    productCard({ href: "products/35kv-power-transformer/", image: "assets/media/products/classified/35kv-power-transformer/01.png", family: "Power Transformers", title: "35 kV Oil-Immersed Power Transformer", range: "8–31.5 MVA", note: "35 kV class" }),
    productCard({ href: "products/66kv-power-transformer/", image: "assets/media/products/classified/66kv-power-transformer/01.png", family: "Power Transformers", title: "66 kV Oil-Immersed Power Transformer", range: "6.3–63 MVA", note: "63 / 66 / 69 kV system voltages" }),
    productCard({ href: "products/110kv-power-transformer/", image: "assets/media/products/classified/110kv-power-transformer/01.png", family: "Power Transformers", title: "110 / 132 kV Oil-Immersed Power Transformer", range: "110 / 132 kV", note: "Main-substation and grid-interconnection applications" }),
    productCard({ href: "products/220kv-power-transformer/", image: "assets/media/products/classified/220kv-power-transformer/01.png", family: "Power Transformers", title: "220 kV Oil-Immersed Power Transformer", range: "Up to 420 MVA", note: "220 kV manufacturing capability" }),
  ].join("");

  const distributionCards = [
    productCard({ href: "products/12kv-oil-immersed-distribution-transformer/", image: "assets/media/products/classified/12kv-oil-immersed-distribution-transformer/01.webp", family: "Distribution Transformers", title: "Oil-Immersed Distribution Transformer", range: "35 kV and below", note: "Utility, industrial and renewable collection distribution" }),
    productCard({ href: "products/dry-type-distribution-transformer/", image: "assets/media/products/classified/dry-type-distribution-transformer/01.jpg", family: "Distribution Transformers", title: "Dry-Type Distribution Transformer", range: "35 kV and below", note: "Indoor, infrastructure and fire-sensitive applications" }),
  ].join("");

  const prefabCards = [
    productCard({ href: "products/zgs-prefabricated-substation/", image: "assets/media/products/classified/zgs-prefabricated-substation/02.webp", family: "Prefabricated Substations", title: "Combined Transformer / Compact Substation", range: "Up to 40.5 kV", note: "Integrated outdoor transformer and protection package" }),
    productCard({ href: "products/yb-prefabricated-substation/", image: "assets/media/products/classified/yb-prefabricated-substation/02.webp", family: "Prefabricated Substations", title: "European-Type Prefabricated Substation", range: "Up to 40.5 kV", note: "MV, transformer and LV compartments" }),
    productCard({ href: "products/ybh-prefabricated-substation/", image: "assets/media/products/classified/ybh-prefabricated-substation/02.jpeg", family: "Prefabricated Substations", title: "Renewable Prefabricated Substation", range: "Up to 40.5 kV", note: "Renewable and industrial collection systems" }),
    productCard({ href: "products/pv-ess-integrated-substation/", image: "assets/media/products/classified/pv-ess-integrated-substation/02.jpeg", family: "Prefabricated Substations", title: "PV / ESS Integrated Substation", range: "Project engineered", note: "Converter, transformer and switchgear integration" }),
    productCard({ href: "products/35-110kv-mobile-intelligent-substation/", image: "assets/media/products/classified/35-110kv-mobile-intelligent-substation/02.jpeg", family: "Prefabricated Substations", title: "35–110 kV Mobile Intelligent Substation", range: "35–110 kV", note: "Mobile and temporary grid connection" }),
    productCard({ href: "products/american-type-combined-transformer/", image: "assets/media/products/classified/american-type-combined-transformer/01.webp", family: "Prefabricated Substations", title: "American-Type Combined Transformer", range: "Project dependent", note: "Compact pad-mounted distribution arrangement" }),
  ].join("");

  const directory = `<section class="v3p-section v3p-soft" id="all-platforms"><div class="v3p-shell"><p class="v3p-kicker">Product Directory</p><h2 class="v3p-title">Power, distribution and prefabricated substation platforms</h2><div class="v12-directory-group" id="power-transformers"><div class="v12-directory-head"><div><p class="v3p-kicker">01</p><h3>Power Transformers</h3></div><p>Main transformer platforms grouped by voltage class.</p></div><div class="v3p-platform-grid">${powerCards}</div></div><div class="v12-directory-group" id="distribution-transformers"><div class="v12-directory-head"><div><p class="v3p-kicker">02</p><h3>Distribution Transformers</h3></div><p>Two construction families only: oil-immersed distribution transformers and dry-type distribution transformers.</p></div><div class="v3p-platform-grid">${distributionCards}</div></div><div class="v12-directory-group" id="prefabricated-substations"><div class="v12-directory-head"><div><p class="v3p-kicker">03</p><h3>Prefabricated Substations</h3></div><p>Factory-integrated compact, renewable, mobile and project-engineered substation systems.</p></div><div class="v3p-platform-grid">${prefabCards}</div></div></div></section>\n`;

  html = html.slice(0, heroStart) + hero + familySection + directory + html.slice(ctaStart);
  html = mark(html);
  write(file, html);
}

function rewriteDistributionFamily() {
  const file = path.join(productsRoot, "oil-immersed-distribution-transformer", "index.html");
  let html = read(file);
  html = html.replace(/<title>[^<]*<\/title>/i, "<title>Distribution Transformers | Tianyu Electric</title>");
  html = html.replace(/<meta name="description" content="[^"]*">/i, '<meta name="description" content="Oil-immersed and dry-type distribution transformer platforms for utility, industrial and infrastructure projects.">');
  html = html.replace(/<span>Oil-Immersed Transformers<\/span>/g, "<span>Distribution Transformers</span>");
  html = html.replace(/<h1>Oil-Immersed Transformers<\/h1>/g, "<h1>Distribution Transformers</h1>");
  html = html.replace(/<p class="v3p-lead">[\s\S]*?<\/p>/i, '<p class="v3p-lead">Oil-immersed and dry-type distribution transformers are presented together as one distribution family. Choose the construction type first, then confirm voltage, capacity and project requirements on the dedicated page.</p>');
  html = html.replace(/(<div class="v3p-family-hero-media"><img src=")[^"]+("[^>]*>)/i, '$1../../assets/media/products/classified/40-5kv-renewable-oil-immersed-transformer/01.png$2');

  const heroEnd = html.indexOf("</section>", html.indexOf('<section class="v3p-family-hero">')) + 10;
  const nextSection = html.indexOf('<section class="v3p-section', heroEnd);
  const followingSection = html.indexOf('<section', nextSection + 10);
  if (nextSection < 0 || followingSection < 0) throw new Error("v46: distribution family product range not found");
  const cards = [
    productCard({ href: "../12kv-oil-immersed-distribution-transformer/", image: "../../assets/media/products/classified/12kv-oil-immersed-distribution-transformer/01.webp", family: "Distribution Transformer · Oil-Immersed", title: "Oil-Immersed Distribution Transformer", range: "35 kV and below", note: "Outdoor and utility distribution applications" }),
    productCard({ href: "../dry-type-distribution-transformer/", image: "../../assets/media/products/classified/dry-type-distribution-transformer/01.jpg", family: "Distribution Transformer · Dry-Type", title: "Dry-Type Distribution Transformer", range: "35 kV and below", note: "Indoor, infrastructure and fire-sensitive applications" }),
  ].join("");
  const range = `<section class="v3p-section"><div class="v3p-shell"><p class="v3p-kicker">Distribution Transformer Range</p><h2 class="v3p-title">Choose between two construction types</h2><div class="v3p-platform-grid">${cards}</div></div></section>`;
  html = html.slice(0, nextSection) + range + html.slice(followingSection);
  html = html.replace(/<body\b([^>]*)class="([^"]*)"/i, (whole, before, classes) => `<body${before}class="${classes.includes("v46-distribution-family") ? classes : `${classes} v46-distribution-family`}"`);
  html = mark(html);
  write(file, html);
}

function rebuildCarousel(slug, names) {
  const file = path.join(productsRoot, slug, "index.html");
  if (!exists(file)) return;
  let html = read(file);
  const available = names.filter((name) => exists(path.join(classifiedRoot, slug, name)));
  if (!available.length) throw new Error(`v46: no clean prefab media for ${slug}`);
  const title = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() || slug;
  const slides = available.map((name, index) => `<figure class="vs-product-carousel-slide${index === 0 ? " is-active" : ""}" data-product-slide aria-hidden="${index === 0 ? "false" : "true"}"><img src="../../assets/media/products/classified/${slug}/${name}" alt="${esc(title)}${index ? ` ${index + 1}` : ""}" ${index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}></figure>`).join("");
  const dots = available.map((_, index) => `<button class="vs-product-carousel-dot${index === 0 ? " is-active" : ""}" type="button" data-product-dot aria-label="Show image ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"></button>`).join("");
  const carousel = `<div class="v3p-hero-media vs-product-carousel" data-product-hero data-v43-classified-media data-single-slide="${available.length < 2 ? "true" : "false"}" aria-label="Product image carousel"><div class="vs-product-carousel-stage">${slides}</div><div class="vs-product-carousel-controls"><div class="vs-product-carousel-dots" aria-label="Choose product image">${dots}</div><span class="vs-product-carousel-count" data-product-count>01 / ${String(available.length).padStart(2, "0")}</span></div></div>`;
  html = html.replace(/<div class="v3p-hero-media\s+vs-product-carousel"[\s\S]*?<\/div>\s*<\/section>/i, `${carousel}</section>`);
  html = mark(html);
  write(file, html);
}

function rewriteCardImage(html, slug, replacement) {
  const re = new RegExp(`(<a\\b[^>]*class=["'][^"']*v3p-platform-card[^"']*["'][^>]*href=["'][^"']*${slug}\\/?["'][^>]*>[\\s\\S]*?<img\\b[^>]*?src=["'])[^"']+(["'][^>]*>)`, "gi");
  return html.replace(re, `$1${replacement}$2`);
}

function cleanPrefabFamily() {
  const file = path.join(productsRoot, "prefabricated-substations", "index.html");
  let html = read(file);
  html = html.replace(/(<div class="v3p-family-hero-media"><img src=")[^"]+("[^>]*>)/i, '$1../../assets/media/products/classified/yb-prefabricated-substation/02.webp$2');
  html = rewriteCardImage(html, "zgs-prefabricated-substation", "../../assets/media/products/classified/zgs-prefabricated-substation/02.webp");
  html = rewriteCardImage(html, "yb-prefabricated-substation", "../../assets/media/products/classified/yb-prefabricated-substation/02.webp");
  html = rewriteCardImage(html, "ybh-prefabricated-substation", "../../assets/media/products/classified/ybh-prefabricated-substation/02.jpeg");
  html = rewriteCardImage(html, "pv-ess-integrated-substation", "../../assets/media/products/classified/pv-ess-integrated-substation/02.jpeg");
  html = rewriteCardImage(html, "35-110kv-mobile-intelligent-substation", "../../assets/media/products/classified/35-110kv-mobile-intelligent-substation/02.jpeg");
  html = mark(html);
  write(file, html);
}

function globalThreeFamilyNav(html) {
  html = html.replace(/<a href="([^"]*products\/oil-immersed-distribution-transformer\/)">Oil-Immersed Transformers<\/a><a href="[^"]*products\/cast-resin-dry-type-transformer\/">Dry-Type Transformers<\/a>/g, '<a href="$1">Distribution Transformers</a>');
  html = html.replace(/<option>Oil-Immersed Transformers<\/option><option>Dry-Type Transformers<\/option>/g, '<option>Distribution Transformers</option>');
  return html;
}

function mergeHomepageFamilies(file) {
  if (!exists(file)) return;
  let html = read(file);
  const distributionImage = toWeb(path.relative(path.dirname(file), path.join(classifiedRoot, "40-5kv-renewable-oil-immersed-transformer", "01.png")));
  const prefabImage = toWeb(path.relative(path.dirname(file), path.join(classifiedRoot, "yb-prefabricated-substation", "02.webp")));
  html = html.replace(/<a\b([^>]*class=["'][^"']*v3p-family-card[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi, (whole, attrs, inner) => {
    const href = attrs.match(/href=["']([^"']+)["']/i)?.[1] || "";
    if (href.includes("cast-resin-dry-type-transformer")) return "";
    if (href.includes("oil-immersed-distribution-transformer")) {
      let next = inner.replace(/Oil-Immersed(?: Distribution)? Transformers/g, "Distribution Transformers");
      next = next.replace(/<img\b([^>]*?)src=["'][^"']+["']([^>]*)>/i, `<img$1src="${distributionImage}"$2>`);
      next = next.replace(/Oil-immersed[^<]*/i, "Oil-immersed and dry-type distribution platforms");
      return `<a${attrs}>${next}</a>`;
    }
    if (href.includes("prefabricated-substations")) {
      const next = inner.replace(/<img\b([^>]*?)src=["'][^"']+["']([^>]*)>/i, `<img$1src="${prefabImage}"$2>`);
      return `<a${attrs}>${next}</a>`;
    }
    return whole;
  });
  html = globalThreeFamilyNav(mark(html));
  write(file, html);
}

function walk(dir) {
  if (!exists(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

if (exists(prohibitedSource)) throw new Error("v46: prohibited small oil distribution transformer image still exists in source-media");

let cssTargets = 0;
for (const rel of [
  ["assets", "css", "visual-system.css"],
  ["assets", "css", "product-directory.css"],
  ["assets", "css", "product-detail.css"],
  ["assets", "css", "site-v3-upgrade.css"],
]) cssTargets += appendCss(path.join(dist, ...rel));

rewriteProductsDirectory();
rewriteDistributionFamily();
for (const [slug, names] of Object.entries(cleanPrefab)) rebuildCarousel(slug, names);
cleanPrefabFamily();
mergeHomepageFamilies(path.join(dist, "index.html"));
mergeHomepageFamilies(path.join(root, "index.html"));

for (const file of walk(dist).filter((file) => file.endsWith(".html"))) {
  let html = read(file);
  const next = globalThreeFamilyNav(html);
  if (next !== html) write(file, next);
}

const productsHtml = read(path.join(dist, "products.html"));
if (!productsHtml.includes('id="distribution-transformers"')) throw new Error("v46: Distribution Transformers group missing");
if (productsHtml.includes('id="oil-immersed-transformers"') || productsHtml.includes('id="dry-type-transformers"')) throw new Error("v46: retired oil/dry top-level groups still present");
if ((productsHtml.match(/data-product-slide=/g) || []).length !== 3) throw new Error("v46: products hero should contain exactly three slides");
for (const redCover of ["zgs-prefabricated-substation/01.png", "yb-prefabricated-substation/01.png", "ybh-prefabricated-substation/01.png"]) {
  if (productsHtml.includes(redCover)) throw new Error(`v46: products directory still uses captioned prefab cover ${redCover}`);
}
const distributionFamily = read(path.join(productsRoot, "oil-immersed-distribution-transformer", "index.html"));
if (!distributionFamily.includes("Distribution Transformers") || !distributionFamily.includes("dry-type-distribution-transformer")) throw new Error("v46: distribution family merge failed");
if ((distributionFamily.match(/class="v3p-platform-card"/g) || []).length !== 2) throw new Error("v46: distribution family should expose exactly two product cards");

console.log(`v46 three-family architecture complete: ${cssTargets} CSS targets updated; products directory consolidated to Power / Distribution / Prefabricated Substations; clean prefab media restored; detail hero media enlarged.`);
