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

// The previous v55 diagnosis was wrong: the portrait/square JPEGs are not evidence of
// intrinsically cropped products. The live problem was presentation: full-bleed rules
// could make non-landscape source images fill a wide stage and clip their top/bottom.
// Restore the original seven oil-distribution sources and make intrinsic aspect ratio
// authoritative at the image element itself.
const media = [
  {
    source: "distribution-transformers/catalog-energy-efficient-oil-immersed-transformer.png",
    name: "01.png",
    alt: "Energy-efficient oil-immersed distribution transformer",
  },
  {
    source: "distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp",
    name: "02.webp",
    alt: "Conservator-type oil-immersed distribution transformer",
  },
  {
    source: "distribution-transformers/oil-immersed-distribution-transformer-sealed-01.webp",
    name: "03.webp",
    alt: "Sealed oil-immersed distribution transformer",
  },
  {
    source: "distribution-transformers/oil-immersed-distribution-transformer-cable-connected-01.webp",
    name: "04.webp",
    alt: "Cable-connected oil-immersed distribution transformer",
  },
  {
    source: "distribution-transformers/oil-immersed-distribution-transformer-conservator-white.jpeg",
    name: "05.jpeg",
    alt: "White conservator-type oil-immersed distribution transformer",
  },
  {
    source: "distribution-transformers/oil-immersed-distribution-transformer-green.jpeg",
    name: "06.jpeg",
    alt: "Green oil-immersed distribution transformer",
  },
  {
    source: "distribution-transformers/oil-immersed-distribution-transformer-blue.jpeg",
    name: "07.jpeg",
    alt: "Blue oil-immersed distribution transformer",
  },
];

for (const item of media) {
  const src = path.join(sourceRoot, item.source);
  if (!exists(src)) throw new Error(`v55: missing oil-distribution source ${item.source}`);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });
for (const item of media) fs.copyFileSync(path.join(sourceRoot, item.source), path.join(targetDir, item.name));

const imageStyle = "display:block!important;width:auto!important;height:auto!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important;object-position:center!important;transform:none!important;filter:none!important";
const slides = media.map((item, index) => {
  const src = `../../assets/media/products/classified/oil-immersed-distribution-transformer/${item.name}`;
  return `<figure class="vs-product-carousel-slide${index === 0 ? " is-active" : ""}" data-product-slide aria-hidden="${index === 0 ? "false" : "true"}"><img src="${esc(src)}" alt="${esc(item.alt)}" style="${imageStyle}" ${index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}></figure>`;
}).join("");
const dots = media.map((_, index) => `<button class="vs-product-carousel-dot${index === 0 ? " is-active" : ""}" type="button" data-product-dot aria-label="Show image ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"></button>`).join("");
const carousel = `<div class="v3p-hero-media vs-product-carousel" data-product-hero data-v52-oil-family-media data-v55-oil-media-integrity data-single-slide="false" aria-label="Oil-immersed distribution transformer image carousel"><div class="vs-product-carousel-stage">${slides}</div><div class="vs-product-carousel-controls"><div class="vs-product-carousel-dots" aria-label="Choose product image">${dots}</div><span class="vs-product-carousel-count" data-product-count>01 / 07</span></div></div>`;

let html = read(pageFile);
const start = html.indexOf('<div class="v3p-hero-media vs-product-carousel"');
const end = html.indexOf('</section><nav class="vs-detail-jump"', start);
if (start < 0 || end < 0) throw new Error("v55: oil-distribution hero carousel boundary not found");
html = html.slice(0, start) + carousel + html.slice(end);
html = html.replace(/<meta property="og:image" content="[^"]*">/i, '<meta property="og:image" content="/assets/media/products/classified/oil-immersed-distribution-transformer/01.png">');
html = html.replace(/<body\b([^>]*)>/i, (match, attrs) => {
  let clean = attrs.replace(/\sdata-v55-media-audited="true"/g, "").replace(/\sdata-v55-image-fit="true"/g, "");
  return `<body data-v55-image-fit="true"${clean}>`;
});
write(pageFile, html);

let css = read(cssFile);
const marker = "v55: oil-distribution intrinsic-ratio image fix";
if (!css.includes(marker)) {
  css += `\n\n/* ${marker}. Portrait and square source images must never be forced to fill a landscape frame. */\nbody[data-v55-image-fit=\"true\"] .vs-product-carousel-stage{height:460px;background:#eef3f5}\nbody[data-v55-image-fit=\"true\"] .vs-product-carousel-slide{display:flex!important;align-items:center!important;justify-content:center!important;padding:18px;background:#eef3f5;overflow:hidden}\nbody[data-v55-image-fit=\"true\"] .vs-product-carousel-slide img{display:block!important;width:auto!important;height:auto!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important;object-position:center!important;transform:none!important;filter:none!important}\n@media(max-width:1180px){body[data-v55-image-fit=\"true\"] .vs-product-carousel-stage{height:420px}}\n@media(max-width:820px){body[data-v55-image-fit=\"true\"] .vs-product-carousel-stage{height:340px}body[data-v55-image-fit=\"true\"] .vs-product-carousel-slide{padding:12px}}\n@media(max-width:560px){body[data-v55-image-fit=\"true\"] .vs-product-carousel-stage{height:280px}body[data-v55-image-fit=\"true\"] .vs-product-carousel-slide{padding:8px}}\n`;
  write(cssFile, css);
}

const finalHtml = read(pageFile);
if ((finalHtml.match(/data-product-slide/g) || []).length !== 7) throw new Error("v55: oil-distribution carousel must contain all seven source images");
if (!finalHtml.includes("data-v55-oil-media-integrity")) throw new Error("v55: oil media integrity marker missing");
if (!finalHtml.includes("width:auto!important") || !finalHtml.includes("height:auto!important")) throw new Error("v55: inline intrinsic-ratio protection missing");
if (fs.readdirSync(targetDir).filter((name) => /\.(?:png|jpe?g|webp)$/i.test(name)).length !== 7) throw new Error("v55: oil-distribution media directory should contain all seven images");

console.log("v55 oil-distribution fix: restored all 7 source images and changed the hero from frame-filling dimensions to intrinsic-ratio containment, with inline protection against stale full-bleed CSS.");
