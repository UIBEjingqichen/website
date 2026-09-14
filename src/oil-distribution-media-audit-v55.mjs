import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const sourceRoot = path.join(root, "source-media", "products");
const targetDir = path.join(dist, "assets", "media", "products", "classified", "oil-immersed-distribution-transformer");
const pageFile = path.join(dist, "products", "oil-immersed-distribution-transformer", "index.html");
const cssFile = path.join(dist, "assets", "css", "product-detail.css");

const read = (file) => fs.readFileSync(file, "utf8");
const write = (file, content) => fs.writeFileSync(file, content, "utf8");
const exists = (file) => fs.existsSync(file);
const esc = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Curated after reviewing the live carousel and source-media mapping.
// Keep only complete, product-level oil-distribution imagery. The three tiny legacy
// JPEGs (white / green / blue) are intrinsically cropped and therefore excluded.
// The cable-connected image is also excluded because its presentation is too close
// to the previously prohibited small cable-connected product photograph.
const media = [
  {
    source: "products/35KV油浸式.png",
    name: "01.png",
    alt: "35 kV-class oil-immersed distribution transformer",
  },
  {
    source: "distribution-transformers/catalog-energy-efficient-oil-immersed-transformer.png",
    name: "02.png",
    alt: "Energy-efficient oil-immersed distribution transformer",
  },
  {
    source: "distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp",
    name: "03.webp",
    alt: "Conservator-type oil-immersed distribution transformer",
  },
  {
    source: "distribution-transformers/oil-immersed-distribution-transformer-sealed-01.webp",
    name: "04.webp",
    alt: "Sealed oil-immersed distribution transformer",
  },
];

for (const item of media) {
  const src = path.join(sourceRoot, item.source);
  if (!exists(src)) throw new Error(`v55: missing curated oil-distribution source ${item.source}`);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });
for (const item of media) fs.copyFileSync(path.join(sourceRoot, item.source), path.join(targetDir, item.name));

const slides = media.map((item, index) => {
  const src = `../../assets/media/products/classified/oil-immersed-distribution-transformer/${item.name}`;
  return `<figure class="vs-product-carousel-slide${index === 0 ? " is-active" : ""}" data-product-slide aria-hidden="${index === 0 ? "false" : "true"}"><img src="${esc(src)}" alt="${esc(item.alt)}" ${index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}></figure>`;
}).join("");
const dots = media.map((_, index) => `<button class="vs-product-carousel-dot${index === 0 ? " is-active" : ""}" type="button" data-product-dot aria-label="Show image ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"></button>`).join("");
const carousel = `<div class="v3p-hero-media vs-product-carousel" data-product-hero data-v52-oil-family-media data-v55-curated-oil-media data-single-slide="false" aria-label="Oil-immersed distribution transformer image carousel"><div class="vs-product-carousel-stage">${slides}</div><div class="vs-product-carousel-controls"><div class="vs-product-carousel-dots" aria-label="Choose product image">${dots}</div><span class="vs-product-carousel-count" data-product-count>01 / 04</span></div></div>`;

let html = read(pageFile);
const start = html.indexOf('<div class="v3p-hero-media vs-product-carousel"');
const end = html.indexOf('</section><nav class="vs-detail-jump"', start);
if (start < 0 || end < 0) throw new Error("v55: oil-distribution hero carousel boundary not found");
html = html.slice(0, start) + carousel + html.slice(end);
html = html.replace(/<meta property="og:image" content="[^"]*">/i, '<meta property="og:image" content="/assets/media/products/classified/oil-immersed-distribution-transformer/01.png">');
html = html.replace(/<body\b([^>]*)>/i, (match, attrs) => match.includes('data-v55-media-audited="true"') ? match : `<body data-v55-media-audited="true"${attrs}>`);
write(pageFile, html);

let css = read(cssFile);
const marker = "v55: curated oil-distribution media";
if (!css.includes(marker)) {
  css += `\n\n/* ${marker}. Complete equipment takes priority over filling the frame. */\nbody[data-v55-media-audited=\"true\"] .vs-product-carousel-stage{height:460px;background:#fff}\nbody[data-v55-media-audited=\"true\"] .vs-product-carousel-slide{padding:22px;background:#fff}\nbody[data-v55-media-audited=\"true\"] .vs-product-carousel-slide img{display:block;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain!important;object-position:center!important;transform:none!important;filter:none!important}\n@media(max-width:1180px){body[data-v55-media-audited=\"true\"] .vs-product-carousel-stage{height:420px}}\n@media(max-width:820px){body[data-v55-media-audited=\"true\"] .vs-product-carousel-stage{height:340px}body[data-v55-media-audited=\"true\"] .vs-product-carousel-slide{padding:14px}}\n@media(max-width:560px){body[data-v55-media-audited=\"true\"] .vs-product-carousel-stage{height:280px}body[data-v55-media-audited=\"true\"] .vs-product-carousel-slide{padding:8px}}\n`;
  write(cssFile, css);
}

const finalHtml = read(pageFile);
if ((finalHtml.match(/data-product-slide/g) || []).length !== 4) throw new Error("v55: oil-distribution carousel must contain exactly four curated images");
if (!finalHtml.includes("data-v55-curated-oil-media")) throw new Error("v55: curated media marker missing");
for (const bad of ["05.jpeg", "06.jpeg", "07.jpeg", "cable-connected-01", "conservator-white", "oil-immersed-distribution-transformer-green", "oil-immersed-distribution-transformer-blue"]) {
  if (finalHtml.includes(bad)) throw new Error(`v55: rejected cropped or weak oil-distribution media remains: ${bad}`);
}
if (fs.readdirSync(targetDir).length !== 4) throw new Error("v55: classified oil-distribution directory should contain exactly four vetted images");

console.log("v55 oil-distribution media audit: 7-image mixed carousel replaced with 4 vetted complete product images; cropped low-resolution and cable-connected weak media excluded.");
