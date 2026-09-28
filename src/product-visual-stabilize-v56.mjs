import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const read = (file) => fs.readFileSync(file, "utf8");
const write = (file, content) => fs.writeFileSync(file, content, "utf8");

// This is deliberately the last product presentation stage. Earlier v45/v46 rules
// promoted full-bleed imagery, while v54/v55 restored intrinsic sizing. Keeping the
// final contract here makes the generated site deterministic on the next build.
const css = `
/* v56: stable product media geometry, bounded navigation and consistent card rhythm. */
html, body { overflow-x: hidden; }

/* Detail hero: the content grid and body sections share the same 1240px alignment. */
.phase1-detail .v3p-hero {
  width: min(1240px, calc(100% - 48px));
  grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
  gap: 32px;
  align-items: center;
}
.phase1-detail .ty-system__product-carousel {
  min-width: 0;
  overflow: hidden;
}
.phase1-detail .ty-system__product-carousel-stage {
  position: relative;
  display: grid;
  place-items: center;
  height: 480px !important;
  overflow: hidden;
  background: #eef3f5;
}
.phase1-detail .ty-system__product-carousel-slide {
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0 !important;
  padding: 24px !important;
  box-sizing: border-box;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  overflow: hidden;
  background: #eef3f5;
}
.phase1-detail .ty-system__product-carousel-slide img {
  display: block !important;
  flex: 0 1 auto;
  width: auto !important;
  height: auto !important;
  max-width: 100% !important;
  max-height: 100% !important;
  padding: 0 !important;
  object-fit: contain !important;
  object-position: center !important;
  transform: none !important;
  filter: none !important;
}

/* Short product labels may scroll inside their own strip, never across the page. */
.phase1-detail .v3p-family-nav {
  max-width: 100%;
}
@media (max-width: 820px) {
  .phase1-detail .v3p-hero {
    grid-template-columns: 1fr !important;
    min-height: 0;
  }
  .phase1-detail .v3p-hero-media { order: 0; }
  .phase1-detail .ty-system__product-carousel-stage { height: 340px !important; }
  .phase1-detail .ty-system__product-carousel-slide { padding: 16px !important; }
  .phase1-detail .v3p-family-nav {
    display: flex;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    overflow-y: hidden;
    white-space: nowrap;
    scrollbar-width: thin;
    padding-bottom: 4px;
  }
  .phase1-detail .v3p-family-nav a { flex: 0 0 auto; }
}
@media (min-width: 821px) and (max-width: 1080px) {
  .phase1-detail .v3p-hero {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 24px;
  }
  .phase1-detail .ty-system__product-carousel-stage { height: 420px !important; }
}
@media (max-width: 560px) {
  .phase1-detail .v3p-hero { width: calc(100% - 28px); gap: 16px; }
  .phase1-detail .ty-system__product-carousel-stage { height: 280px !important; }
  .phase1-detail .ty-system__product-carousel-slide { padding: 12px !important; }
}

/* Directory hero: image, caption and controls always occupy stable rows. */
.phase1-products .v23-product-carousel {
  display: block;
  height: 400px !important;
}
.phase1-products .v23-product-slide {
  grid-template-rows: minmax(0, calc(100% - 64px)) 64px;
  margin: 0 !important;
  height: 100%;
}
.phase1-products .v23-product-slide img {
  width: 100% !important;
  height: 100% !important;
  min-height: 0;
  padding: 16px 24px !important;
  box-sizing: border-box;
  object-fit: contain !important;
  object-position: center;
  transform: none !important;
}
.phase1-products .v23-product-slide figcaption {
  min-height: 0;
  height: 64px;
  box-sizing: border-box;
  overflow: hidden;
}

/* Directory and family cards show the complete equipment at a stable scale. */
.phase1-products .v3p-platform-card .media,
.v3p-platform-card .media {
  overflow: hidden !important;
  background: #eef3f5 !important;
}
.phase1-products .v3p-platform-card .media img,
.v3p-platform-card .media img,
.v3p-platform-card > img {
  display: block;
  width: 100% !important;
  height: 100% !important;
  max-width: none;
  max-height: none;
  padding: 14px !important;
  box-sizing: border-box;
  object-fit: contain !important;
  object-position: center;
  transform: none !important;
  mix-blend-mode: normal !important;
}
.v3p-family-hero-media img {
  width: 100% !important;
  height: 100% !important;
  padding: 28px !important;
  box-sizing: border-box;
  object-fit: contain !important;
  object-position: center;
  transform: none !important;
}
@media (max-width: 820px) {
  .phase1-products .v23-product-carousel { height: 330px !important; }
  .phase1-products .v23-product-slide { grid-template-rows: minmax(0, calc(100% - 62px)) 62px; }
  .phase1-products .v23-product-slide figcaption { height: 62px; }
  .phase1-products .v23-product-slide img { padding: 12px 16px !important; }
}
@media (max-width: 560px) {
  .phase1-products .v23-product-carousel { height: 292px !important; }
  .phase1-products .v23-product-slide { grid-template-rows: minmax(0, calc(100% - 60px)) 60px; }
  .phase1-products .v23-product-slide figcaption { height: 60px; }
  .phase1-products .v23-product-slide img { padding: 10px !important; }
}
`;

const cssTargets = [
  ["assets", "css", "visual-system.css"],
  ["assets", "css", "product-directory.css"],
  ["assets", "css", "product-detail.css"],
  ["assets", "css", "site-v3-upgrade.css"],
];
for (const rel of cssTargets) {
  const file = path.join(dist, ...rel);
  if (!fs.existsSync(file)) continue;
  const current = read(file);
  if (!current.includes("v56: stable product media geometry")) write(file, `${current.trimEnd()}\n\n${css.trim()}\n`);
}

const htmlFiles = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(file);
  }
}
walk(dist);

const replacements = [
  ["110 / 132 kV Oil-Immersed Power Transformer", "110 kV Three-Winding Power Transformer"],
  ["220 kV Oil-Immersed Power Transformer", "220 kV Three-Winding Power Transformer"],
  ["Request RFQ", "Request a Quote"],
  ["Request a Technical Review", "Request a Quote"],
  ["Request project configuration review", "Request a Quote"],
  ["Request configuration review", "Request a Quote"],
  ["Start Technical Inquiry", "Request a Quote"],
  ["These variants remain available for technical reference, but they no longer use duplicate standalone product-image cards.", "These configurations use the parent platform and are finalized against the electrical system, site conditions and project requirements."],
  ["It no longer carries a duplicate standalone image card when dedicated media is not available.", "Final ratings are project engineered within the parent dry-type platform."],
  ["Reference imagery remains family-level unless model-specific media is supplied.", "Reference imagery represents the parent family; project media is confirmed during engineering review."],
  ["Separate model pages should only be added when model-specific evidence is available.", "Final ratings and evidence are confirmed during engineering review."],
  ["Product Navigation Update", "Application-specific solutions"],
  ["Legacy Product Group", "Special-purpose solutions"],
  ["Special-purpose products are now grouped by transformer construction", "Special-purpose transformer and substation solutions"],
  ["The former Special &amp; Renewable grouping has been retired from the active product taxonomy. Renewable energy, offshore wind, rectifier duty and other applications now appear inside the transformer or substation family that delivers the function.", "Renewable energy, offshore wind, rectifier duty and other applications are organized under the transformer or substation platform that delivers the function."],
];

let changedPages = 0;
for (const file of htmlFiles) {
  let html = read(file);
  const before = html;
  for (const [from, to] of replacements) html = html.split(from).join(to);
  html = html.replace(/(<nav\b[^>]*class=["'][^"']*v3p-family-nav[^"']*["'][^>]*>)([\s\S]*?)<\/nav>/gi, (whole, open, inner) => {
    const labels = [
      ["35 kV Oil-Immersed Power", "35 kV"],
      ["66 kV Oil-Immersed Power", "66 kV"],
      ["110 kV Three-Winding Power", "110 kV"],
      ["220 kV Three-Winding Power", "220 kV"],
      ["Oil-Immersed Distribution Transformer", "Oil-Immersed"],
      ["Dry-Type Distribution Transformer", "Dry-Type"],
    ];
    let next = inner;
    for (const [from, to] of labels) next = next.split(`>${from}<`).join(`>${to}<`);
    return `${open}${next}</nav>`;
  });
  if (html !== before) {
    write(file, html);
    changedPages += 1;
  }
}

const products = path.join(dist, "products.html");
if (fs.existsSync(products)) {
  const html = read(products);
  if (html.includes("110 / 132 kV Oil-Immersed Power Transformer") || html.includes("220 kV Oil-Immersed Power Transformer")) {
    throw new Error("v56: legacy power-transformer directory labels remain");
  }
}

const detailPages = htmlFiles.filter((file) => /products[\\/]([^\\/]+)[\\/]index\.html$/i.test(file));
if (detailPages.length < 20) throw new Error(`v56: expected at least 20 product pages, found ${detailPages.length}`);
console.log(`v56 product presentation: stable image geometry applied to ${cssTargets.length} CSS targets; customer-facing labels normalized across ${changedPages} generated pages.`);
