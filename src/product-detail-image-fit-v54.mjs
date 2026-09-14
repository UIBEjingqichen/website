import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const productsRoot = path.join(dist, "products");
const read = (file) => fs.readFileSync(file, "utf8");
const write = (file, content) => fs.writeFileSync(file, content, "utf8");

const cssFile = path.join(dist, "assets", "css", "product-detail.css");
let css = read(cssFile);
const marker = "v54: complete-product hero fit and balanced detail layout";
if (!css.includes(marker)) {
  css += `\n\n/* ${marker}. */\n.phase1-detail .v3p-hero{width:min(1440px,calc(100% - 64px));grid-template-columns:minmax(390px,.88fr) minmax(520px,1.12fr);gap:42px;align-items:center;padding:36px 0 32px}\n.phase1-detail .v3p-hero-copy{padding:8px 0}\n.phase1-detail .v3p-hero-copy h1{max-width:620px}\n.phase1-detail .vs-product-carousel{min-width:0}\n.phase1-detail .vs-product-carousel-stage{height:520px;display:grid;place-items:center;overflow:hidden;background:#eef3f5}\n.phase1-detail .vs-product-carousel-slide{display:grid;place-items:center;width:100%;height:100%;padding:18px;background:#eef3f5;overflow:hidden}\n.phase1-detail .vs-product-carousel-slide img{display:block;width:100%;height:100%;max-width:100%;max-height:100%;padding:0;object-fit:contain!important;object-position:center!important;transform:none!important;filter:none}\n.phase1-detail .vs-product-carousel-controls{margin-top:8px}\nbody[data-v52-oil-family=\"true\"] .v3p-family-nav{gap:8px;border:0;overflow:visible;white-space:normal}\nbody[data-v52-oil-family=\"true\"] .v3p-family-nav a,body[data-v52-oil-family=\"true\"] .v3p-family-nav a:first-child{padding:8px 11px;border:1px solid var(--ty-border);border-radius:3px;background:#fff}\nbody[data-v52-oil-family=\"true\"] .v3p-family-nav a.current{background:#edf4f5;border-color:#9eb8c1}\n@media(max-width:1180px){.phase1-detail .v3p-hero{width:min(1180px,calc(100% - 48px));grid-template-columns:minmax(350px,.95fr) minmax(440px,1.05fr);gap:28px}.phase1-detail .vs-product-carousel-stage{height:440px}}\n@media(max-width:820px){.phase1-detail .v3p-hero{width:min(var(--ty-max),calc(100% - 36px));grid-template-columns:1fr;gap:22px;padding:26px 0}.phase1-detail .v3p-hero-copy{padding:0}.phase1-detail .v3p-hero-media{order:0}.phase1-detail .vs-product-carousel-stage{height:360px}.phase1-detail .vs-product-carousel-slide{padding:12px}}\n@media(max-width:560px){.phase1-detail .v3p-hero{width:calc(100% - 28px);gap:16px}.phase1-detail .vs-product-carousel-stage{height:290px}.phase1-detail .vs-product-carousel-slide{padding:8px}}\n`;
  write(cssFile, css);
}

// Ensure every concrete product detail carousel shows complete equipment rather than center-cropping it.
let detailCount = 0;
for (const entry of fs.readdirSync(productsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const file = path.join(productsRoot, entry.name, "index.html");
  if (!fs.existsSync(file)) continue;
  let html = read(file);
  if (!html.includes('<section class="v3p-hero">') || html.includes("v3p-family-hero")) continue;
  if (!html.includes('data-v54-complete-image-fit="true"')) {
    html = html.replace(/<body\b([^>]*)>/i, '<body data-v54-complete-image-fit="true"$1>');
    write(file, html);
  }
  detailCount += 1;
}

const oilFile = path.join(productsRoot, "oil-immersed-distribution-transformer", "index.html");
let oil = read(oilFile);
oil = oil.replace(/<meta property="og:description" content="[^"]*">/i,
  '<meta property="og:description" content="Oil-immersed distribution transformer platform covering standard and project-engineered configurations up to the 35 kV class.">');
oil = oil.replace(/<div class="v3p-hero-proof">[\s\S]*?<\/div>/i,
  '<div class="v3p-hero-proof"><span>35 kV and below</span><span>30 kVA–12.5 MVA platform range</span></div>');
oil = oil.replace(/<div class="vs-parameter-source" style="margin-top:24px"><small>[\s\S]*?<\/small><\/div>/i, "");
oil = oil.replace(/<h3>22 kV Tested Reference<\/h3>/i, '<h3>Representative Parameters</h3>');
oil = oil.replace(/These values belong to the tested 22 kV model and demonstrate that the oil-immersed distribution family is not limited to 6–11 kV\./i,
  'Values shown are from the identified tested model; other voltage and capacity combinations follow the applicable project design.');
oil = oil.replace(/includes 22 kV tested reference/gi, "");
oil = oil.replace(/tested 22 kV reference/gi, "22 kV model");
write(oilFile, oil);

const finalOil = read(oilFile);
if (/includes 22 kV tested reference/i.test(finalOil)) throw new Error("v54: 22 kV reference is still over-emphasized in the oil-distribution hero");
if (/og:description[^>]+tested reference/i.test(finalOil)) throw new Error("v54: hidden metadata still over-emphasizes the 22 kV test reference");
if (!finalOil.includes("35 kV and below")) throw new Error("v54: consolidated oil-distribution voltage range missing");
if (!finalOil.includes("Representative Parameters")) throw new Error("v54: representative parameter heading missing");
if (!read(cssFile).includes(marker) || !read(cssFile).includes("object-fit:contain!important")) throw new Error("v54: complete-image fit rules missing");
if (detailCount < 20) throw new Error(`v54: expected at least 20 detail pages, found ${detailCount}`);

console.log(`v54 detail presentation: complete-image contain fit applied across ${detailCount} product pages; oil-distribution hero simplified and 22 kV kept as an ordinary technical-range value.`);
