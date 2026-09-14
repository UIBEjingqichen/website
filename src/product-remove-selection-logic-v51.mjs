import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const productsRoot = path.join(dist, "products");

const targets = [path.join(dist, "products.html")];
if (fs.existsSync(productsRoot)) {
  for (const entry of fs.readdirSync(productsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const index = path.join(productsRoot, entry.name, "index.html");
    if (fs.existsSync(index)) targets.push(index);
  }
}

let removed = 0;
const selectionSection = /<section\b[^>]*class=["'][^"']*v3p-section[^"']*v3p-soft[^"']*["'][^>]*>\s*<div\b[^>]*class=["'][^"']*v3p-shell[^"']*["'][^>]*>\s*<p\b[^>]*class=["'][^"']*v3p-kicker[^"']*["'][^>]*>\s*Selection Logic\s*<\/p>[\s\S]*?<\/div>\s*<\/section>/gi;

for (const file of targets) {
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  html = html.replace(selectionSection, () => {
    removed += 1;
    return "";
  });

  // Guard against the exact generic copy returning through a later build stage.
  if (/Selection Logic|Voltage class\s*→\s*capacity\s*→\s*electrical requirements\s*→\s*project options|Every platform page uses the same structure so procurement and engineering teams can compare products without learning a new layout each time\./i.test(html)) {
    throw new Error(`v51: generic Selection Logic copy remains in ${path.relative(root, file)}`);
  }

  if (html !== before) fs.writeFileSync(file, html, "utf8");
}

if (removed === 0) throw new Error("v51: no Selection Logic block was found to remove");
console.log(`v51 removed ${removed} generic Selection Logic block(s) from product pages.`);
