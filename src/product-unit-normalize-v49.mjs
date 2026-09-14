import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const file = path.join(root, "dist", "products.html");

if (!fs.existsSync(file)) throw new Error("v49: dist/products.html not found");

let html = fs.readFileSync(file, "utf8");

function patchCard(href, range) {
  const marker = `href="${href}"`;
  const start = html.indexOf(marker);
  if (start < 0) throw new Error(`v49: product card not found: ${href}`);
  const end = html.indexOf("</a>", start);
  if (end < 0) throw new Error(`v49: product card closing tag not found: ${href}`);
  const card = html.slice(start, end + 4);
  if (!/<span class="range">[^<]*<\/span>/i.test(card)) throw new Error(`v49: range field not found: ${href}`);
  const patched = card.replace(/<span class="range">[^<]*<\/span>/i, `<span class="range">${range}</span>`);
  html = html.slice(0, start) + patched + html.slice(end + 4);
}

// The middle column on Power Transformer cards is rated capacity, so keep one unit system.
// The 110 kV product page publishes SSZ-6300~63000/110, i.e. 6.3–63 MVA.
patchCard("products/110kv-power-transformer/", "6.3–63 MVA");

const powerStart = html.indexOf('id="power-transformers"');
const distributionStart = html.indexOf('id="distribution-transformers"', powerStart);
if (powerStart < 0 || distributionStart < 0) throw new Error("v49: power/distribution directory sections not found");
const powerSection = html.slice(powerStart, distributionStart);
const ranges = [...powerSection.matchAll(/<span class="range">([^<]+)<\/span>/gi)].map((match) => match[1].trim());
if (ranges.length !== 4) throw new Error(`v49: expected 4 power-transformer capacity ranges, found ${ranges.length}`);
for (const range of ranges) {
  if (!/MVA$/i.test(range)) throw new Error(`v49: inconsistent power-transformer capacity unit remains: ${range}`);
}

html = html.replace(/<body\b([^>]*)>/i, (match, attrs) => match.includes('data-v49-unified-capacity="true"') ? match : `<body data-v49-unified-capacity="true"${attrs}>`);
fs.writeFileSync(file, html, "utf8");

console.log(`v49 normalized Power Transformer directory capacity units: ${ranges.join(" | ")}`);
