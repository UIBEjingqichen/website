import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const cssSource = path.join(__dirname, "image-quality-pass.css");
const cssTarget = path.join(dist, "assets", "css", "image-quality-pass.css");

const read = (file) => fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
};
const rel = (from, to) => path.relative(path.dirname(from), to).split(path.sep).join("/");

// Marketing/product imagery hierarchy:
// 1) clean product-library photography; 2) curated catalog imagery;
// 3) contextual application imagery only when it is clearly presented as context.
// Full report sample-photo pages stay inside evidence/report contexts only.
const marketingReplacements = new Map([
  ["evidence/sample-photo-pages/power-transformer-240mva-220kv-ssz22-sample-photo-page.webp", "products/power-transformers/oil-immersed-power-transformer-installed.png"],
  ["evidence/sample-photo-pages/power-transformer-240mva-220kv-ssz20-sample-photo-page.webp", "products/power-transformers/oil-immersed-power-transformer-isolated-01.jpeg"],
  ["evidence/sample-photo-pages/power-transformer-150mva-132kv-sample-photo-page.webp", "products/power-transformers/oil-immersed-power-transformer-installed.png"],
  ["evidence/sample-photo-pages/power-transformer-50mva-110kv-sample-photo-page.webp", "products/power-transformers/oil-immersed-power-transformer-isolated-01.jpeg"],
  ["evidence/sample-photo-pages/dry-type-scb18-2500kva-10kv-sample-photo-page.webp", "products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg"],
  ["evidence/sample-photo-pages/dry-type-scb18-1000kva-10kv-sample-photo-page.webp", "products/dry-type-transformers/cast-resin-dry-type-transformer-red-02.jpeg"]
]);

function ensureCss(html, file) {
  if (html.includes("image-quality-pass.css")) return html;
  const href = rel(file, cssTarget);
  return html.replace("</head>", `  <link rel="stylesheet" href="${href}">\n</head>`);
}

function isEvidenceContext(file) {
  const base = path.basename(file);
  if (base === "resources.html" || base === "catalog.html") return true;
  if (file.includes(`${path.sep}knowledge${path.sep}`)) return true;
  return false;
}

function replaceMarketingImages(html, file) {
  if (isEvidenceContext(file)) return html;

  let out = html;
  for (const [oldMedia, newMedia] of marketingReplacements) {
    const oldName = oldMedia.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const target = rel(file, path.join(dist, "assets", "media", newMedia));
    out = out.replace(new RegExp(`(?:\\.\\.\\/)*assets\\/media\\/${oldName}`, "g"), target);
  }
  return out;
}

function replaceHomeLandscape(html, file) {
  if (path.resolve(file) !== path.join(dist, "index.html")) return html;
  const media = (name) => rel(file, path.join(dist, "assets", "media", name));
  const section = `<section class="yw-landscape iq-landscape"><div class="yw-centered-head"><p>TIANYU ELECTRIC</p><h2>MANUFACTURING, TESTING & APPLICATION ENVIRONMENTS</h2></div><div class="iq-landscape-grid">
    <figure class="iq-landscape-card iq-campus"><img src="${media("company/factory-campus-panorama.jpeg")}" alt="Tianyu Electric manufacturing campus" loading="lazy"></figure>
    <figure class="iq-landscape-card iq-manufacturing"><img src="${media("factory/dry-type-prefabricated-substation-assembly-01.webp")}" alt="Prefabricated substation factory assembly" loading="lazy"></figure>
    <figure class="iq-landscape-card iq-testing"><img src="${media("catalog-v3/testing-220kv-lab.webp")}" alt="High-voltage transformer testing laboratory" loading="lazy"></figure>
    <figure class="iq-landscape-card iq-grid"><img src="${media("applications/grid-substation-yard.jpeg")}" alt="Grid substation application environment" loading="lazy"></figure>
    <figure class="iq-landscape-card iq-renewable"><img src="${media("applications/onshore-wind-farm-grassland.jpeg")}" alt="Onshore wind power application environment" loading="lazy"></figure>
    <figure class="iq-landscape-card iq-solar"><img src="${media("applications/utility-scale-solar-farm-aerial-01.jpeg")}" alt="Utility-scale photovoltaic application environment" loading="lazy"></figure>
  </div></section>`;
  return html.replace(/<section class="yw-landscape">[\s\S]*?<\/section>/, section);
}

function processHtml(file) {
  let html = read(file);
  if (!html) return;
  html = replaceMarketingImages(html, file);
  html = replaceHomeLandscape(html, file);
  html = ensureCss(html, file);
  write(file, html);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile() && entry.name.endsWith(".html")) processHtml(file);
  }
}

function validateNoReportPagesInMarketing(dir) {
  const offenders = [];
  const inspect = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) inspect(file);
      else if (entry.isFile() && entry.name.endsWith(".html") && !isEvidenceContext(file)) {
        const html = read(file);
        if (html.includes("evidence/sample-photo-pages/")) offenders.push(rel(dist, file));
      }
    }
  };
  inspect(dir);
  if (offenders.length) throw new Error(`Image quality pass: report sample pages remain in marketing HTML: ${offenders.slice(0, 8).join(", ")}`);
}

function validate() {
  const home = read(path.join(dist, "index.html"));
  if (!home.includes("iq-landscape-grid")) throw new Error("Image quality pass: homepage landscape grid was not rebuilt");
  if (!home.includes("factory/dry-type-prefabricated-substation-assembly-01.webp")) throw new Error("Image quality pass: factory assembly image missing from homepage");
  if (!home.includes("applications/onshore-wind-farm-grassland.jpeg") || !home.includes("applications/utility-scale-solar-farm-aerial-01.jpeg")) {
    throw new Error("Image quality pass: clean renewable application imagery missing from homepage");
  }
  const resources = read(path.join(dist, "resources.html"));
  if (resources && !/evidence\//.test(resources)) throw new Error("Image quality pass: evidence imagery was unexpectedly removed from resources");
  validateNoReportPagesInMarketing(dist);
}

function main() {
  if (!fs.existsSync(dist)) throw new Error("Image quality pass: dist missing");
  fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
  fs.copyFileSync(cssSource, cssTarget);
  walk(dist);
  validate();
  console.log("Image quality pass applied: semantic product imagery preserved, report pages confined to evidence, and homepage photography normalized.");
}

main();
