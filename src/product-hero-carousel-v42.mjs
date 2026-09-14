import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const productsDir = path.join(root, "dist", "products");
const detailCss = path.join(root, "dist", "assets", "css", "product-detail.css");
const carouselCss = path.join(root, "src", "product-hero-carousel-v42.css");

const read = (file) => fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
const write = (file, content) => fs.writeFileSync(file, content, "utf8");
const esc = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"));
  return match ? match[1] : "";
}

function heroImage(html) {
  const hero = html.match(/<div class=["']v3p-hero-media["'][^>]*>([\s\S]*?)<\/div>\s*<\/section>/i)?.[1] || "";
  const img = hero.match(/<img\b[^>]*>/i)?.[0] || "";
  if (!img) return null;
  return { src: attr(img, "src"), alt: attr(img, "alt") || "Product image" };
}

function galleryImages(html) {
  const section = html.match(/<section\b[^>]*\bid=["']drawings["'][^>]*>[\s\S]*?<\/section>/i)?.[0] || "";
  if (!section) return [];
  const figures = [...section.matchAll(/<figure\b([^>]*)>([\s\S]*?)<\/figure>/gi)];
  const images = [];
  for (const figure of figures) {
    const opening = figure[1] || "";
    const body = figure[2] || "";
    if (/\bdrawing\b/i.test(opening) || /data-drawing-/i.test(body)) continue;
    const img = body.match(/<img\b[^>]*>/i)?.[0] || "";
    if (!img) continue;
    const src = attr(img, "src");
    if (!src) continue;
    images.push({ src, alt: attr(img, "alt") || "Product image" });
  }
  return images;
}

function uniqueImages(images) {
  const seen = new Set();
  return images.filter((image) => {
    if (!image?.src || seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
}

function carousel(images) {
  const slides = images.map((image, index) => `<figure class="vs-product-carousel-slide${index === 0 ? " is-active" : ""}" data-product-slide aria-hidden="${index === 0 ? "false" : "true"}"><img src="${esc(image.src)}" alt="${esc(image.alt)}" ${index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}></figure>`).join("");
  const dots = images.map((image, index) => `<button class="vs-product-carousel-dot${index === 0 ? " is-active" : ""}" type="button" data-product-dot aria-label="Show image ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"></button>`).join("");
  const count = `${String(1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;
  return `<div class="v3p-hero-media vs-product-carousel" data-product-hero data-single-slide="${images.length < 2 ? "true" : "false"}" aria-label="Product image carousel"><div class="vs-product-carousel-stage">${slides}</div><div class="vs-product-carousel-controls"><div class="vs-product-carousel-dots" aria-label="Choose product image">${dots}</div><span class="vs-product-carousel-count" data-product-count>${count}</span></div></div>`;
}

function transform(html, slug) {
  const first = heroImage(html);
  const images = uniqueImages([first, ...galleryImages(html)].filter(Boolean));
  if (!images.length) throw new Error(`No product image found for ${slug}`);

  html = html.replace(/<div class=["']v3p-hero-media["'][^>]*>[\s\S]*?<\/div>\s*<\/section>/i, `${carousel(images)}</section>`);
  html = html.replace(/<section\b[^>]*\bid=["']drawings["'][^>]*>[\s\S]*?<\/section>/gi, "");
  html = html.replace(/<a\b[^>]*href=["']#drawings["'][^>]*>[\s\S]*?<\/a>/gi, "");
  html = html.replace(/The drawing shown in the product gallery is a reference outline view\./gi, "Reference outline drawings are available through the technical resources and project-document package.");
  html = html.replace(/The drawing shown in the product gallery/gi, "The reference engineering drawing");
  html = html.replace(/href=["']#drawings["']/gi, 'href="../../resources.html#drawings"');

  if (/Product\s*&(?:amp;)?\s*Engineering\s*Views/i.test(html) || /Product Images\s*&(?:amp;)?\s*Engineering Drawings/i.test(html)) {
    throw new Error(`Legacy product gallery heading remains on ${slug}`);
  }
  if (/\bid=["']drawings["']/i.test(html)) throw new Error(`Legacy drawings section remains on ${slug}`);
  if (!html.includes("data-product-hero")) throw new Error(`Hero carousel missing on ${slug}`);
  return html;
}

const files = fs.existsSync(productsDir)
  ? fs.readdirSync(productsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(productsDir, entry.name, "index.html"))
      .filter((file) => fs.existsSync(file))
  : [];

let count = 0;
for (const file of files) {
  let html = read(file);
  if (!html.includes('<section class="v3p-hero">') || html.includes("v3p-family-hero")) continue;
  const slug = path.basename(path.dirname(file));
  html = transform(html, slug);
  write(file, html);
  count += 1;
}

if (count < 10) throw new Error(`Expected at least 10 concrete product pages, found ${count}.`);

const addon = read(carouselCss).trim();
let css = read(detailCss);
if (!addon) throw new Error("Missing v42 carousel stylesheet source.");
if (!css.includes("v42: product imagery lives in the hero carousel")) {
  css = `${css.trim()}\n\n${addon}\n`;
  write(detailCss, css);
}

console.log(`Moved product imagery into hero carousels and removed lower Product & Engineering Views sections from ${count} product detail pages.`);
