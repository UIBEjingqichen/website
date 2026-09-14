import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const file = path.join(root, "dist", "products.html");

if (!fs.existsSync(file)) throw new Error("v49: dist/products.html not found");

let html = fs.readFileSync(file, "utf8");

function patchCard(href, range) {
  const cardRe = new RegExp(`(<a\\b[^>]*class=["'][^"']*v3p-platform-card[^"']*["'][^>]*href=["']${href.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}["'][^>]*>[\\s\\S]*?<span class=["']range["']>)([^<]*)(<\\/span>[\\s\\S]*?<\\/a>)`, "i");
  if (!cardRe.test(html)) throw new Error(`v49: product card not found: ${href}`);
  html = html.replace(cardRe, `$1${range}$3`);
}

// The middle column on Power Transformer cards is rated capacity, so keep one unit system.
// The 110 kV product page publishes SSZ-6300~63000/110, i.e. 6.3–63 MVA.
patchCard("products/110kv-power-transformer/", "6.3–63 MVA");

const powerSection = html.match(/id=["']power-transformers["'][\\s\\S]*?(?=<div class=["']v12-directory-group["'] id=["']distribution-transformers["'])/i)?.[0] || "";
const ranges = [...powerSection.matchAll(/<span class=["']range["']>([^<]+)<\\/span>/gi)].map((match) => match[1].trim());
if (ranges.length !== 4) throw new Error(`v49: expected 4 power-transformer capacity ranges, found ${ranges.length}`);
for (const range of ranges) {
  if (!/MVA$/i.test(range)) throw new Error(`v49: inconsistent power-transformer capacity unit remains: ${range}`);
}

html = html.replace(/<body\\b([^>]*)>/i, (match, attrs) => match.includes('data-v49-unified-capacity="true"') ? match : `<body data-v49-unified-capacity="true"${attrs}>`);
fs.writeFileSync(file, html, "utf8");

console.log(`v49 normalized Power Transformer directory capacity units: ${ranges.join(" | ")}`);
