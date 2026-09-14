import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const productsRoot = path.join(dist, "products");
const classifiedRoot = path.join(dist, "assets", "media", "products", "classified");
const cssSource = path.join(__dirname, "product-media-visual-v45.css");

const mergedVariants = [
  {
    slug: "66kv-offshore-wind-nacelle-transformer",
    parent: "66kv-power-transformer",
    title: "66 kV Offshore Wind Configuration",
    note: "Application-specific 66 kV platform for offshore and marine renewable-energy duty. Presented as a configuration of the 66 kV power-transformer family rather than a separate photographed product.",
  },
  {
    slug: "220kv-double-split-booster-transformer",
    parent: "220kv-power-transformer",
    title: "Double-Split Booster Configuration",
    note: "Renewable booster-station configuration within the 220 kV power-transformer platform. Project engineering determines the final arrangement.",
  },
  {
    slug: "40-5kv-new-energy-dry-type-transformer",
    parent: "cast-resin-dry-type-transformer",
    title: "40.5 kV-Class New-Energy Configuration",
    note: "Renewable-energy step-up configuration within the dry-type family. It no longer carries a duplicate standalone image card when dedicated media is not available.",
  },
  {
    slug: "24-pulse-phase-shifting-transformer",
    parent: "cast-resin-dry-type-transformer",
    title: "24-Pulse Phase-Shifting Configuration",
    note: "Project-engineered multi-pulse rectifier configuration using the dry-type platform. Reference imagery remains family-level unless model-specific media is supplied.",
  },
];

const mergedSlugs = new Set(mergedVariants.map((item) => item.slug));
const familyRepresentatives = {
  "high-voltage-power-transformer": "110kv-power-transformer",
  "oil-immersed-distribution-transformer": "12kv-oil-immersed-distribution-transformer",
  "cast-resin-dry-type-transformer": "dry-type-distribution-transformer",
  "prefabricated-substations": "yb-prefabricated-substation",
};

const toWeb = (value) => value.split(path.sep).join("/");
const hashFile = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const esc = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function slugFromHref(href = "") {
  if (/^(?:https?:|mailto:|tel:|#)/i.test(href)) return null;
  const clean = href.split(/[?#]/)[0].replace(/\/+$/, "");
  return clean.split("/").filter((part) => part && part !== "." && part !== "..").at(-1) || null;
}

function classifiedImages(slug) {
  const dir = path.join(classifiedRoot, slug);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => /\.(?:png|jpe?g|webp)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => path.join(dir, name));
}

function webHref(fromFile, target) {
  return toWeb(path.relative(path.dirname(fromFile), target));
}

function pickUnique(slug, used) {
  const images = classifiedImages(slug);
  if (!images.length) return null;
  const unique = images.find((file) => !used.has(hashFile(file))) || images[0];
  used.add(hashFile(unique));
  return unique;
}

function mark(html) {
  if (html.includes('data-v45-product-media="true"')) return html;
  return html.replace(/<body\b([^>]*)>/i, '<body data-v45-product-media="true"$1>');
}

function cleanupEmptyProductSections(html) {
  let next = html.replace(/<div\s+class=["']v3p-platform-grid["']>\s*<\/div>/gi, "");
  next = next.replace(/<section\b[^>]*id=["']application-specific-power["'][^>]*>[\s\S]*?<\/section>/gi, "");
  return next;
}

function removeMergedNavLinks(html) {
  html = html.replace(/<nav\b([^>]*class=["'][^"']*v3p-family-nav[^"']*["'][^>]*)>([\s\S]*?)<\/nav>/gi, (whole, attrs, inner) => {
    let next = inner;
    for (const slug of mergedSlugs) {
      const re = new RegExp(`<a\\b[^>]*href=["'][^"']*${slug}\\/?["'][^>]*>[\\s\\S]*?<\\/a>`, "gi");
      next = next.replace(re, "");
    }
    return `<nav${attrs}>${next}</nav>`;
  });
  for (const slug of mergedSlugs) {
    const related = new RegExp(`<a\\b(?=[^>]*class=["'][^"']*vs-related-card[^"']*["'])[^>]*href=["'][^"']*${slug}\\/?["'][^>]*>[\\s\\S]*?<\\/a>`, "gi");
    html = html.replace(related, "");
  }
  return html;
}

function updatePlatformCards(html, file) {
  const used = new Set();
  let updated = 0;
  let removed = 0;
  const next = html.replace(/<a\b([^>]*class=["'][^"']*v3p-platform-card[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi, (whole, attrs, inner) => {
    const href = attrs.match(/href=["']([^"']+)["']/i)?.[1] || "";
    const slug = slugFromHref(href);
    if (!slug) return whole;
    if (mergedSlugs.has(slug)) {
      removed += 1;
      return "";
    }
    const chosen = pickUnique(slug, used);
    if (!chosen || !/<img\b/i.test(inner)) return whole;
    const src = webHref(file, chosen);
    const changedInner = inner.replace(/<img\b([^>]*?)src=["'][^"']+["']([^>]*)>/i, `<img$1src="${src}"$2>`);
    if (changedInner !== inner) updated += 1;
    return `<a${attrs}>${changedInner}</a>`;
  });
  return { html: next, updated, removed };
}

function updateFamilyCards(html, file) {
  const used = new Set();
  let updated = 0;
  const next = html.replace(/<a\b([^>]*class=["'][^"']*v3p-family-card[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi, (whole, attrs, inner) => {
    const href = attrs.match(/href=["']([^"']+)["']/i)?.[1] || "";
    const familySlug = slugFromHref(href);
    const rep = familyRepresentatives[familySlug];
    if (!rep) return whole;
    const chosen = pickUnique(rep, used);
    if (!chosen || !/<img\b/i.test(inner)) return whole;
    const src = webHref(file, chosen);
    const changedInner = inner.replace(/<img\b([^>]*?)src=["'][^"']+["']([^>]*)>/i, `<img$1src="${src}"$2>`);
    if (changedInner !== inner) updated += 1;
    return `<a${attrs}>${changedInner}</a>`;
  });
  return { html: next, updated };
}

function variantBlock(parentFile, variants) {
  const links = variants.map((variant) => {
    const target = path.join(productsRoot, variant.slug);
    const href = `${toWeb(path.relative(path.dirname(parentFile), target))}/`;
    return `<a class="v45-variant-link" href="${esc(href)}"><strong>${esc(variant.title)}</strong><span>${esc(variant.note)}</span></a>`;
  }).join("");
  return `<section class="v45-variant-section" data-v45-merged-variants><div class="v3p-shell"><div class="v45-variant-intro"><p class="v3p-kicker">Shared Platform Variants</p><h2>Configurations grouped under the parent product</h2><p>These variants remain available for technical reference, but they no longer use duplicate standalone product-image cards.</p></div><div class="v45-variant-list">${links}</div></div></section>`;
}

function insertVariantBlock(parentSlug, variants) {
  const file = path.join(productsRoot, parentSlug, "index.html");
  if (!fs.existsSync(file)) throw new Error(`v45: missing parent page ${parentSlug}`);
  let html = fs.readFileSync(file, "utf8");
  if (html.includes("data-v45-merged-variants")) return 0;
  const block = variantBlock(file, variants);
  if (html.includes('id="applications"')) {
    html = html.replace(/(<section\b[^>]*id=["']applications["'][^>]*>)/i, `${block}$1`);
  } else if (/<section\b[^>]*class=["'][^"']*v3p-cta[^"']*["']/i.test(html)) {
    html = html.replace(/(<section\b[^>]*class=["'][^"']*v3p-cta[^"']*["'][^>]*>)/i, `${block}$1`);
  } else {
    html = html.replace(/<\/main>/i, `${block}</main>`);
  }
  html = cleanupEmptyProductSections(mark(removeMergedNavLinks(html)));
  fs.writeFileSync(file, html, "utf8");
  return 1;
}

function appendCss(target) {
  const css = fs.readFileSync(cssSource, "utf8");
  if (!fs.existsSync(target)) return 0;
  const current = fs.readFileSync(target, "utf8");
  if (current.includes("v45: full-bleed product media")) return 0;
  fs.writeFileSync(target, `${current.trimEnd()}\n\n${css.trim()}\n`, "utf8");
  return 1;
}

let cssTargets = 0;
for (const rel of [
  ["assets", "css", "visual-system.css"],
  ["assets", "css", "product-directory.css"],
  ["assets", "css", "product-detail.css"],
  ["assets", "css", "site-v3-upgrade.css"],
]) cssTargets += appendCss(path.join(dist, ...rel));

const directoryFile = path.join(dist, "products.html");
let directory = fs.readFileSync(directoryFile, "utf8");
const directoryCards = updatePlatformCards(directory, directoryFile);
directory = cleanupEmptyProductSections(mark(removeMergedNavLinks(directoryCards.html)));
fs.writeFileSync(directoryFile, directory, "utf8");

let familyPages = 0;
let familyCardsUpdated = 0;
let familyCardsRemoved = 0;
let detailPages = 0;
for (const entry of fs.readdirSync(productsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const file = path.join(productsRoot, entry.name, "index.html");
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  if (html.includes("v3p-family-hero")) {
    const cards = updatePlatformCards(html, file);
    html = cleanupEmptyProductSections(mark(removeMergedNavLinks(cards.html)));
    fs.writeFileSync(file, html, "utf8");
    familyPages += 1;
    familyCardsUpdated += cards.updated;
    familyCardsRemoved += cards.removed;
  } else if (html.includes('<section class="v3p-hero">')) {
    html = cleanupEmptyProductSections(mark(removeMergedNavLinks(html)));
    fs.writeFileSync(file, html, "utf8");
    detailPages += 1;
  }
}

let homeCards = 0;
for (const file of [path.join(dist, "index.html"), path.join(root, "index.html")]) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  const cards = updateFamilyCards(html, file);
  html = mark(cards.html);
  fs.writeFileSync(file, html, "utf8");
  homeCards += cards.updated;
}

let mergedBlocks = 0;
for (const parent of new Set(mergedVariants.map((item) => item.parent))) {
  mergedBlocks += insertVariantBlock(parent, mergedVariants.filter((item) => item.parent === parent));
}

if (directoryCards.removed < 4) throw new Error(`v45: expected at least four weak child cards removed from products directory, removed ${directoryCards.removed}`);
if (mergedBlocks < 3) throw new Error(`v45: expected three parent variant blocks, inserted ${mergedBlocks}`);
if (detailPages < 20) throw new Error(`v45: expected at least 20 detail pages, found ${detailPages}`);

console.log(`v45 product presentation: ${cssTargets} CSS targets updated; ${directoryCards.updated} directory cards refreshed and ${directoryCards.removed} weak child cards merged; ${familyCardsUpdated} family cards refreshed and ${familyCardsRemoved} removed; ${homeCards} homepage family cards refreshed; ${mergedBlocks} parent variant blocks inserted; empty duplicate-image grids removed.`);
