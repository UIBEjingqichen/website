import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const targets = [
  ["high-voltage-power-transformer", "power-transformers"],
  ["oil-immersed-distribution-transformer", "distribution-transformers"],
  ["prefabricated-substations", "prefabricated-substations"],
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function relativeProductsHref(file, anchor) {
  const relDir = path.relative(path.dirname(file), dist).split(path.sep).filter(Boolean);
  const prefix = relDir.length ? "../".repeat(relDir.length) : "";
  return `${prefix}products.html#${anchor}`;
}

let changed = 0;
const files = walk(dist);
for (const file of files) {
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  for (const [slug, anchor] of targets) {
    const dest = relativeProductsHref(file, anchor);
    const patterns = [
      new RegExp(`href=["'](?:\\.\\./)*products/${slug}/?["']`, "gi"),
      new RegExp(`href=["']\\.\\./${slug}/?["']`, "gi"),
    ];
    for (const re of patterns) html = html.replace(re, `href="${dest}"`);
  }
  if (html !== before) {
    html = html.replace(/<body\b([^>]*)>/i, (m, attrs) => m.includes('data-v50-products-direct-jump="true"') ? m : `<body data-v50-products-direct-jump="true"${attrs}>`);
    fs.writeFileSync(file, html, "utf8");
    changed += 1;
  }
}

// Keep the root homepage mirror aligned with the generated navigation.
const rootIndex = path.join(root, "index.html");
if (fs.existsSync(rootIndex)) {
  let html = fs.readFileSync(rootIndex, "utf8");
  const before = html;
  for (const [slug, anchor] of targets) {
    html = html.replace(new RegExp(`href=["']products/${slug}/?["']`, "gi"), `href="products.html#${anchor}"`);
  }
  if (html !== before) fs.writeFileSync(rootIndex, html, "utf8");
}

const products = fs.readFileSync(path.join(dist, "products.html"), "utf8");
for (const [, anchor] of targets) {
  if (!products.includes(`id="${anchor}"`)) throw new Error(`v50: products.html is missing jump target #${anchor}`);
}
for (const [slug] of targets) {
  if (products.includes(`href="products/${slug}/"`)) throw new Error(`v50: products landing still links to standalone family page ${slug}`);
}

console.log(`v50 restored Products navigation as direct jumps to the three sections on products.html across ${changed} generated pages.`);
