import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourceRoot = path.join(root, "source-media", "products");
const distRoot = path.join(root, "dist");
const productsRoot = path.join(distRoot, "products");
const mediaRoot = path.join(distRoot, "assets", "media", "products", "classified");

const FORBIDDEN_GIT_BLOB_SHA = "54cc027041d0b5741a433ac36b63491311034596";
const forbiddenGeneratedPaths = [
  path.join(distRoot, "assets", "media", "applications", "floating-solar-combined-transformer-site.webp"),
];

const pageMedia = {
  "110kv-power-transformer": [
    "products/110KV.png",
    "power-transformers/oil-immersed-power-transformer-installed.png",
    "power-transformers/oil-immersed-power-transformer-isolated-01.jpeg",
  ],
  "220kv-power-transformer": [
    "products/220KV.png",
    "products/220KV111.png",
    "products/220kv222.png",
  ],
  "220kv-double-split-booster-transformer": [
    "products/220KV111.png",
    "products/220kv222.png",
    "power-transformers/oil-immersed-power-transformer-isolated-01.jpeg",
  ],
  "35kv-power-transformer": [
    "products/35KV.png",
    "power-transformers/oil-immersed-power-transformer-installed.png",
    "power-transformers/oil-immersed-power-transformer-isolated-01.jpeg",
  ],
  "66kv-power-transformer": [
    "power-transformers/oil-immersed-power-transformer-installed.png",
    "power-transformers/oil-immersed-power-transformer-isolated-01.jpeg",
  ],
  "66kv-offshore-wind-nacelle-transformer": [
    "power-transformers/oil-immersed-power-transformer-isolated-01.jpeg",
    "power-transformers/oil-immersed-power-transformer-installed.png",
  ],
  "12kv-oil-immersed-distribution-transformer": [
    "products/小型油浸式配变 (1).JPG",
    "distribution-transformers/oil-immersed-distribution-transformer-sealed-01.webp",
    "distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp",
  ],
  "40-5kv-renewable-oil-immersed-transformer": [
    "products/35KV油浸式.png",
    "distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp",
    "distribution-transformers/oil-immersed-distribution-transformer-cable-connected-01.webp",
  ],
  "oil-immersed-rectifier-transformer": [
    "power-transformers/oil-immersed-power-transformer-installed.png",
    "distribution-transformers/oil-immersed-distribution-transformer-cable-connected-01.webp",
  ],
  "dry-type-distribution-transformer": [
    "products/10kv干 (1).jpg",
    "products/10kv干 (2).jpg",
    "dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg",
    "dry-type-transformers/cast-resin-dry-type-transformer-red-02.jpeg",
  ],
  "40-5kv-new-energy-dry-type-transformer": [
    "dry-type-transformers/dry-type-transformer-red-tall-01.jpeg",
    "dry-type-transformers/cast-resin-dry-type-transformer-red-02.jpeg",
    "dry-type-transformers/cast-resin-transformer-core-coil-assembly.jpeg",
  ],
  "35kv-large-dry-type-power-transformer": [
    "dry-type-transformers/07_变压器总装_003_大型红色三相干式变压器，工人顶部装配.JPG",
    "dry-type-transformers/dry-type-transformer-red-tall-01.jpeg",
    "dry-type-transformers/cast-resin-dry-type-transformer-red-02.jpeg",
  ],
  "amorphous-alloy-dry-type-transformer": [
    "dry-type-transformers/amorphous-alloy-dry-type-transformer-with-fans.jpeg",
    "dry-type-transformers/cast-resin-transformer-core-coil-assembly.jpeg",
  ],
  "24-pulse-phase-shifting-transformer": [
    "special-transformers/dry-type-rectifier-transformer-red.jpeg",
    "dry-type-transformers/cast-resin-transformer-core-coil-assembly.jpeg",
    "dry-type-transformers/cast-resin-dry-type-transformer-red-02.jpeg",
  ],
  "american-type-combined-transformer": [
    "combined-transformers/american-type-combined-transformer-exterior-01.webp",
    "combined-transformers/american-type-combined-transformer-exterior-02.webp",
    "products/american-combined-transformer-05.webp",
    "combined-transformers/american-type-combined-transformer-lv-cabinet-interior.webp",
    "combined-transformers/american-type-combined-transformer-busbar-interior.webp",
  ],
  "dry-type-prefabricated-substation": [
    "prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp",
    "prefabricated-substations/dry-type-prefabricated-substation-lineup.webp",
    "products/dry-type-prefabricated-substation-05.webp",
    "prefabricated-substations/dry-type-prefabricated-substation-interior.webp",
  ],
  "oil-immersed-prefabricated-substation": [
    "prefabricated-substations/oil-prefabricated-substation-exterior-01.webp",
    "products/oil-prefabricated-substation-02.webp",
    "products/oil-prefabricated-substation-03.webp",
    "prefabricated-substations/oil-prefabricated-substation-hv-compartment-interior.webp",
    "prefabricated-substations/oil-prefabricated-substation-lv-cabinet-interior.webp",
  ],
  "zgs-prefabricated-substation": [
    "prefabricated-substations/catalog-american-pad-mounted-substation.png",
    "combined-transformers/american-type-combined-transformer-exterior-01.webp",
    "combined-transformers/american-type-combined-transformer-exterior-02.webp",
  ],
  "yb-prefabricated-substation": [
    "prefabricated-substations/catalog-european-prefabricated-substation.png",
    "prefabricated-substations/oil-prefabricated-substation-exterior-01.webp",
    "prefabricated-substations/oil-prefabricated-substation-hv-compartment-interior.webp",
    "prefabricated-substations/oil-prefabricated-substation-lv-cabinet-interior.webp",
  ],
  "ybh-prefabricated-substation": [
    "prefabricated-substations/catalog-chinese-box-type-substation.png",
    "prefabricated-substations/integrated-prefabricated-substation-render.jpeg",
    "prefabricated-substations/integrated-substation-white-exterior-01.jpeg",
  ],
  "pv-ess-integrated-substation": [
    "prefabricated-substations/catalog-energy-storage-converter-booster-system.png",
    "prefabricated-substations/integrated-prefabricated-substation-render.jpeg",
    "prefabricated-substations/integrated-substation-modules-render.jpeg",
    "prefabricated-substations/integrated-substation-white-exterior-01.jpeg",
  ],
  "35-110kv-mobile-intelligent-substation": [
    "special-transformers/catalog-mobile-prefabricated-substation.png",
    "prefabricated-substations/integrated-substation-modules-render.jpeg",
    "prefabricated-substations/integrated-substation-white-exterior-01.jpeg",
  ],
};

const familyFallbacks = {
  dry: [
    "dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg",
    "dry-type-transformers/cast-resin-dry-type-transformer-red-02.jpeg",
  ],
  oil: [
    "distribution-transformers/oil-immersed-distribution-transformer-sealed-01.webp",
    "distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp",
  ],
  power: [
    "power-transformers/oil-immersed-power-transformer-installed.png",
    "power-transformers/oil-immersed-power-transformer-isolated-01.jpeg",
  ],
  prefab: [
    "prefabricated-substations/integrated-prefabricated-substation-render.jpeg",
    "prefabricated-substations/integrated-substation-white-exterior-01.jpeg",
  ],
};

let cryptoModule;
function requireCrypto() {
  if (!cryptoModule) throw new Error("crypto module not initialized");
  return cryptoModule;
}

function gitBlobSha(file) {
  const crypto = requireCrypto();
  const body = fs.readFileSync(file);
  const header = Buffer.from(`blob ${body.length}\0`);
  return crypto.createHash("sha1").update(header).update(body).digest("hex");
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function titleFromHtml(html, slug) {
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return match ? match[1].replace(/<[^>]+>/g, "").trim() : slug.replace(/-/g, " ");
}

function fallbackFor(slug) {
  if (/dry|24-pulse|amorphous/i.test(slug)) return familyFallbacks.dry;
  if (/substation|combined/i.test(slug)) return familyFallbacks.prefab;
  if (/oil|distribution/i.test(slug)) return familyFallbacks.oil;
  return familyFallbacks.power;
}

function uniqueExisting(list) {
  const seen = new Set();
  const output = [];
  for (const relative of list) {
    const source = path.join(sourceRoot, relative);
    if (!fs.existsSync(source)) continue;
    const digest = gitBlobSha(source);
    if (digest === FORBIDDEN_GIT_BLOB_SHA || seen.has(digest)) continue;
    seen.add(digest);
    output.push({ relative, source, digest });
  }
  return output;
}

function copyForPage(slug, entries) {
  const targetDir = path.join(mediaRoot, slug);
  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(targetDir, { recursive: true });
  return entries.map((entry, index) => {
    const ext = path.extname(entry.source).toLowerCase() || ".jpg";
    const name = `${String(index + 1).padStart(2, "0")}${ext}`;
    fs.copyFileSync(entry.source, path.join(targetDir, name));
    return `../../assets/media/products/classified/${slug}/${name}`;
  });
}

function carousel(srcs, title) {
  const slides = srcs.map((src, index) => `<figure class="vs-product-carousel-slide${index === 0 ? " is-active" : ""}" data-product-slide aria-hidden="${index === 0 ? "false" : "true"}"><img src="${escapeHtml(src)}" alt="${escapeHtml(title)}${index ? ` ${index + 1}` : ""}" ${index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}></figure>`).join("");
  const dots = srcs.map((_, index) => `<button class="vs-product-carousel-dot${index === 0 ? " is-active" : ""}" type="button" data-product-dot aria-label="Show image ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"></button>`).join("");
  return `<div class="v3p-hero-media vs-product-carousel" data-product-hero data-v43-classified-media data-single-slide="${srcs.length < 2 ? "true" : "false"}" aria-label="Product image carousel"><div class="vs-product-carousel-stage">${slides}</div><div class="vs-product-carousel-controls"><div class="vs-product-carousel-dots" aria-label="Choose product image">${dots}</div><span class="vs-product-carousel-count" data-product-count>01 / ${String(srcs.length).padStart(2, "0")}</span></div></div>`;
}

async function main() {
  cryptoModule = await import("node:crypto");

  // Remove the prohibited photograph from generated assets even if an earlier build copied it.
  for (const file of forbiddenGeneratedPaths) fs.rmSync(file, { force: true });

  fs.mkdirSync(mediaRoot, { recursive: true });
  let pageCount = 0;
  let imageCount = 0;

  for (const entry of fs.readdirSync(productsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const file = path.join(productsRoot, slug, "index.html");
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, "utf8");
    if (!html.includes('<section class="v3p-hero">') || html.includes("v3p-family-hero")) continue;

    const selected = uniqueExisting(pageMedia[slug] || fallbackFor(slug));
    if (!selected.length) throw new Error(`No classified product media available for ${slug}`);
    const srcs = copyForPage(slug, selected);
    const title = titleFromHtml(html, slug);
    const replacement = `${carousel(srcs, title)}</section>`;
    const next = html.replace(/<div class=["']v3p-hero-media\s+vs-product-carousel["'][^>]*>[\s\S]*?<\/div>\s*<\/section>/i, replacement);
    if (next === html || !next.includes("data-v43-classified-media")) throw new Error(`Could not replace hero carousel for ${slug}`);
    if (/floating-solar-combined-transformer-site|american-combined-transformer-03/i.test(next)) throw new Error(`Forbidden media reference remains on ${slug}`);
    fs.writeFileSync(file, next, "utf8");
    pageCount += 1;
    imageCount += srcs.length;
  }

  if (pageCount < 10) throw new Error(`Expected at least 10 concrete product pages, found ${pageCount}`);
  console.log(`v43 classified product media: ${imageCount} deduplicated images applied across ${pageCount} product detail pages.`);
}

await main();
