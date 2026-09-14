import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const productsRoot = path.join(dist, "products");
const classifiedRoot = path.join(dist, "assets", "media", "products", "classified");

const familyRepresentatives = {
  "high-voltage-power-transformer": "110kv-power-transformer",
  "oil-immersed-distribution-transformer": "12kv-oil-immersed-distribution-transformer",
  "cast-resin-dry-type-transformer": "dry-type-distribution-transformer",
  "prefabricated-substations": "yb-prefabricated-substation",
  "special-renewable-solutions": "35-110kv-mobile-intelligent-substation",
};

const portfolioRepresentatives = {
  "Power Transformers": "110kv-power-transformer",
  "Distribution Transformers": "12kv-oil-immersed-distribution-transformer",
  "Oil-Immersed Transformers": "12kv-oil-immersed-distribution-transformer",
  "Dry-Type Transformers": "dry-type-distribution-transformer",
  "Prefabricated Substations": "yb-prefabricated-substation",
};

function toWeb(p) {
  return p.split(path.sep).join("/");
}

function coverFile(slug) {
  const dir = path.join(classifiedRoot, slug);
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir)
    .filter((name) => /^01\.(?:png|jpe?g|webp)$/i.test(name))
    .sort();
  if (!files.length) return null;
  return path.join(dir, files[0]);
}

function coverHref(fromFile, slug) {
  const cover = coverFile(slug);
  return cover ? toWeb(path.relative(path.dirname(fromFile), cover)) : null;
}

function absoluteCover(slug) {
  const cover = coverFile(slug);
  if (!cover) return null;
  return `/${toWeb(path.relative(dist, cover))}`;
}

function hrefSlug(href = "") {
  if (/^(?:https?:|mailto:|tel:|#)/i.test(href)) return null;
  const clean = href.split(/[?#]/)[0].replace(/\/+$/, "");
  const parts = clean.split("/").filter((p) => p && p !== "." && p !== "..");
  const slug = parts.at(-1);
  return slug && coverFile(slug) ? slug : null;
}

function replaceCardImages(html, file) {
  let changed = 0;
  const next = html.replace(/<a\b([^>]*class=["'][^"']*v3p-platform-card[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi, (whole, attrs, inner) => {
    const href = attrs.match(/href=["']([^"']+)["']/i)?.[1];
    const slug = hrefSlug(href);
    if (!slug) return whole;
    const src = coverHref(file, slug);
    if (!src || !/<img\b/i.test(inner)) return whole;
    const updated = inner.replace(/<img\b([^>]*?)src=["'][^"']+["']([^>]*)>/i, `<img$1src="${src}"$2>`);
    if (updated !== inner) changed += 1;
    return `<a${attrs}>${updated}</a>`;
  });
  return { html: next, changed };
}

function replaceFamilyHero(html, file, familySlug) {
  let target = familyRepresentatives[familySlug] || null;
  if (!target) {
    const firstCard = html.match(/<a\b[^>]*class=["'][^"']*v3p-platform-card[^"']*["'][^>]*href=["']([^"']+)["']/i)?.[1];
    target = hrefSlug(firstCard);
  }
  if (!target) return { html, changed: 0, target: null };
  const src = coverHref(file, target);
  if (!src) return { html, changed: 0, target };
  const next = html.replace(/(<div\s+class=["']v3p-family-hero-media["'][^>]*>\s*<img\b[^>]*?src=["'])[^"']+(["'][^>]*>)/i, `$1${src}$2`);
  return { html: next, changed: next === html ? 0 : 1, target };
}

function replacePortfolioHero(html, file) {
  let changed = 0;
  const next = html.replace(/<figure\b([^>]*class=["'][^"']*v23-product-slide[^"']*["'][^>]*)>([\s\S]*?)<\/figure>/gi, (whole, attrs, inner) => {
    const label = inner.match(/<figcaption>[\s\S]*?<span>([^<]+)<\/span>/i)?.[1]?.trim();
    const slug = label ? portfolioRepresentatives[label] : null;
    if (!slug) return whole;
    const src = coverHref(file, slug);
    if (!src) return whole;
    const updated = inner.replace(/<img\b([^>]*?)src=["'][^"']+["']([^>]*)>/i, `<img$1src="${src}"$2>`);
    if (updated !== inner) changed += 1;
    return `<figure${attrs}>${updated}</figure>`;
  });
  return { html: next, changed };
}

function updateOgImage(html, slug) {
  const src = absoluteCover(slug);
  if (!src) return html;
  if (/<meta\s+property=["']og:image["']/i.test(html)) {
    return html.replace(/(<meta\s+property=["']og:image["']\s+content=["'])[^"']+(["'][^>]*>)/i, `$1${src}$2`);
  }
  return html;
}

function addMarker(html) {
  if (html.includes("data-v44-media-sync")) return html;
  return html.replace(/<body\b([^>]*)>/i, '<body data-v44-media-sync="true"$1>');
}

let detailPages = 0;
let detailOg = 0;
for (const entry of fs.readdirSync(productsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const slug = entry.name;
  const file = path.join(productsRoot, slug, "index.html");
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");

  if (html.includes('<section class="v3p-hero">') && !html.includes("v3p-family-hero")) {
    if (!coverFile(slug)) throw new Error(`v44: concrete product page lacks classified cover: ${slug}`);
    const before = html;
    html = updateOgImage(html, slug);
    html = addMarker(html);
    if (html !== before) detailOg += 1;
    fs.writeFileSync(file, html, "utf8");
    detailPages += 1;
  }
}

const directoryFile = path.join(dist, "products.html");
let directory = fs.readFileSync(directoryFile, "utf8");
const directoryCards = replaceCardImages(directory, directoryFile);
directory = directoryCards.html;
const directoryHero = replacePortfolioHero(directory, directoryFile);
directory = addMarker(directoryHero.html);
fs.writeFileSync(directoryFile, directory, "utf8");

let familyPages = 0;
let familyCards = 0;
let familyHeroes = 0;
for (const entry of fs.readdirSync(productsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const file = path.join(productsRoot, entry.name, "index.html");
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  if (!html.includes("v3p-family-hero")) continue;

  const hero = replaceFamilyHero(html, file, entry.name);
  html = hero.html;
  const cards = replaceCardImages(html, file);
  html = cards.html;
  if (hero.target) html = updateOgImage(html, hero.target);
  html = addMarker(html);
  fs.writeFileSync(file, html, "utf8");
  familyPages += 1;
  familyCards += cards.changed;
  familyHeroes += hero.changed;
}

if (detailPages < 20) throw new Error(`v44: expected at least 20 concrete product pages, found ${detailPages}`);
if (directoryCards.changed < 15) throw new Error(`v44: expected at least 15 directory cards to use classified covers, updated ${directoryCards.changed}`);
if (directoryHero.changed < 4) throw new Error(`v44: expected four product-directory hero slides, updated ${directoryHero.changed}`);
if (familyPages < 4) throw new Error(`v44: expected at least four product family pages, found ${familyPages}`);
if (familyCards < 10) throw new Error(`v44: too few family product cards updated: ${familyCards}`);

console.log(`v44 product media rollout: ${detailPages} detail pages checked, ${detailOg} detail OG images synchronized, ${directoryCards.changed} directory cards, ${directoryHero.changed} directory hero slides, ${familyHeroes} family heroes and ${familyCards} family cards updated from classified product media.`);
