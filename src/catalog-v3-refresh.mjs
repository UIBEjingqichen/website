import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  catalogSource,
  manufacturing,
  highVoltageSeries,
  distributionSeries,
  dryTypeSeries,
  prefabricatedSeries,
  renewableSpecials,
  drawings
} from "./catalog-v3-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const mediaSource = path.join(root, "source-media", "catalog-v3");
const mediaTarget = path.join(dist, "assets", "media", "catalog-v3");
const cssSource = path.join(root, "src", "catalog-v3.css");
const cssTarget = path.join(dist, "assets", "css", "catalog-v3.css");

const esc = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeRead = (file) => fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
const safeWrite = (file, content) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); };

if (fs.existsSync(mediaSource)) {
  fs.mkdirSync(mediaTarget, { recursive: true });
  fs.cpSync(mediaSource, mediaTarget, { recursive: true });
}
if (fs.existsSync(cssSource)) {
  fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
  fs.copyFileSync(cssSource, cssTarget);
}

function ensureCss(html, href) {
  if (html.includes("catalog-v3.css")) return html;
  return html.replace("</head>", `  <link rel="stylesheet" href="${href}">\n</head>`);
}
function insertBefore(html, marker, block, signature) {
  if (!html) return html;
  if (signature && html.includes(signature)) return html;
  if (html.includes(marker)) return html.replace(marker, `${block}\n${marker}`);
  return html.replace("</main>", `${block}\n</main>`);
}
function renderStats(items) {
  return `<div class="v3-stat-grid">${items.map(([k,v]) => `<div class="v3-stat"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join("")}</div>`;
}
function renderSpecs(items) {
  return `<div class="v3-spec-grid">${items.map(([k,v]) => `<div class="v3-spec"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join("")}</div>`;
}
function renderPills(items) {
  return `<div class="v3-pill-row">${items.map((item) => `<span class="v3-pill">${esc(item)}</span>`).join("")}</div>`;
}
function renderCards(items) {
  return `<div class="v3-card-grid">${items.map((item) => `<article class="v3-card"><h3>${esc(item.name)}</h3>${item.capacity ? `<p><strong>${esc(item.capacity)}</strong></p>` : ""}${item.voltage ? `<p>${esc(item.voltage)}</p>` : ""}${item.model ? `<p><small>${esc(item.model)}</small></p>` : ""}${item.detail ? `<p>${esc(item.detail)}</p>` : ""}</article>`).join("")}</div>`;
}
function renderImageCards(items, prefix) {
  return `<div class="v3-card-grid">${items.map((item) => `<article class="v3-image-card"><img src="${prefix}${esc(item.image)}" alt="${esc(item.name)}" loading="lazy"><div class="v3-card-copy"><h3>${esc(item.name)}</h3><p>${esc(item.detail || "")}</p>${item.capacity ? `<p><strong>${esc(item.capacity)}</strong></p>` : ""}</div></article>`).join("")}</div>`;
}
function renderDrawings(prefix, subset = drawings) {
  return `<div class="v3-drawing-grid">${subset.map(([title,image]) => `<a class="v3-drawing" href="${prefix}${esc(image)}" target="_blank" rel="noopener"><img src="${prefix}${esc(image)}" alt="${esc(title)}" loading="lazy"><span>${esc(title)}</span><small>Catalog reference drawing · final project drawing subject to engineering confirmation</small></a>`).join("")}</div>`;
}
function renderTable(headers, rows) {
  return `<div class="v3-table-wrap"><table class="v3-table"><thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function siteSection({ id = "", kicker, title, lead = "", body = "", soft = false }) {
  return `<section class="v3-section${soft ? " v3-soft" : ""}"${id ? ` id="${id}"` : ""}><div class="v3-shell"><p class="v3-kicker">${esc(kicker)}</p><h2 class="v3-title">${esc(title)}</h2>${lead ? `<p class="v3-lead">${esc(lead)}</p>` : ""}${body}</div></section>`;
}
function sourceNote() {
  return `<p class="v3-source-note"><strong>Source boundary:</strong> ${esc(catalogSource.evidenceRule)} Values described as catalog series capability are not presented as blanket third-party certification.</p>`;
}

const topMedia = "assets/media/catalog-v3/";
const productMedia = "../../assets/media/catalog-v3/";

// Home: concise capability strip only. Detailed numbers stay on Manufacturing.
{
  const file = path.join(dist, "index.html");
  let html = safeRead(file);
  if (html) {
    html = ensureCss(html, "assets/css/catalog-v3.css");
    const strip = `<section class="v3-capability-strip" data-v3-home-capability aria-label="Tianyu manufacturing capability"><div><span>Transformer platform</span><strong>Up to 220 kV</strong></div><div><span>Catalog series</span><strong>Up to 240 MVA</strong></div><div><span>Plant area</span><strong>100,000 m²</strong></div><div><span>Distribution transformers</span><strong>12,000 / year</strong></div><div><span>Impulse test system</span><strong>2,400 kV</strong></div></section>`;
    html = insertBefore(html, "</main>", strip, "data-v3-home-capability");
    safeWrite(file, html);
  }
}

// Product index: add catalog series layer without breaking six-family navigation.
{
  const file = path.join(dist, "products.html");
  let html = safeRead(file);
  if (html) {
    html = ensureCss(html, "assets/css/catalog-v3.css");
    const body = renderCards([
      { name: "Large Oil-Immersed Power Transformer", capacity: "35 / 66 / 110 / 220 kV catalog platforms", detail: "Standard series from 6.3 MVA to 240 MVA, plus separately documented 132 kV tested references." },
      { name: "Oil-Immersed Distribution & Renewable Transformer", capacity: "12 kV: 30-2,500 kVA · 40.5 kV renewable: 1-12.5 MVA", detail: "Includes 35 kV and below rectifier-transformer platform." },
      { name: "Dry-Type Transformer Platform", capacity: "35 kV class · catalog sub-series up to 25 MVA", detail: "General cast resin, renewable-energy, large-capacity, amorphous-alloy and intelligent dry-type variants." },
      { name: "ZGS Combined Transformer", capacity: "200-4,000 kVA", detail: "Compact integrated oil-filled platform for renewable collection and distribution applications." },
      { name: "YB / YBH Prefabricated Substations", capacity: "Up to 12,500 kVA catalog range", detail: "Dry-type or oil-immersed transformer configurations with configurable HV/LV schemes." },
      { name: "PV / BESS Integrated Power Conversion", capacity: "2,000-9,000 kVA", detail: "PCS / inverter + transformer + medium-voltage switchgear factory-integrated solution." }
    ]);
    const block = siteSection({ id: "series-capability", kicker: "2026 catalog integration", title: "Product platforms beyond the tested reference models", lead: "The website continues to keep exact third-party test evidence model-specific, while the official Tianyu catalog adds the wider configurable series range.", body: sourceNote() + body, soft: true });
    html = insertBefore(html, "</main>", block, 'id="series-capability"');
    safeWrite(file, html);
  }
}

function updateProductPage(id, content, signature) {
  const file = path.join(dist, "products", id, "index.html");
  let html = safeRead(file);
  if (!html) return;
  html = ensureCss(html, "../../assets/css/catalog-v3.css");
  html = insertBefore(html, '<section class="section v9-real-applications">', content, signature);
  safeWrite(file, html);
}

updateProductPage("high-voltage-power-transformer", siteSection({
  id: "standard-series", kicker: "Series capability", title: "35 kV to 220 kV standardized power-transformer platforms",
  lead: "Official Tianyu catalog series data complement the existing 110 / 132 / 220 kV third-party tested references already shown on this website.",
  body: sourceNote() + renderCards(highVoltageSeries.map((s) => ({ name:s.name, model:s.model, capacity:s.capacity, voltage:s.voltage, detail:`${s.tap} · ${s.vector}${s.impedance ? ` · ${s.impedance}` : ""}` }))) + `<h3 class="v3-title" style="font-size:1.45rem;margin-top:2.2rem">Catalog GA reference plate</h3>` + renderDrawings(productMedia, drawings.slice(0,1)) + `<h3 class="v3-title" style="font-size:1.45rem;margin-top:2.2rem">Special high-voltage / renewable solutions</h3>` + renderCards(renewableSpecials.slice(0,3)), soft:true
}), 'id="standard-series"');

updateProductPage("oil-immersed-distribution-transformer", siteSection({
  id: "catalog-series", kicker: "Series capability", title: "Distribution, renewable-energy and rectifier transformer range",
  lead: "The new catalog adds standard 12 kV sales data and a 40.5 kV renewable-energy platform while the existing TÜV / Tier 2 evidence remains tied to exact 22 kV tested models.",
  body: sourceNote() + renderCards([
    { name:distributionSeries.general12kV.name, capacity:distributionSeries.general12kV.capacity, voltage:distributionSeries.general12kV.voltage, detail:`${distributionSeries.general12kV.frequency} · ${distributionSeries.general12kV.vector} · ${distributionSeries.general12kV.winding}` },
    { name:distributionSeries.renewable40kV.name, capacity:distributionSeries.renewable40kV.capacity, voltage:distributionSeries.renewable40kV.voltage, detail:`${distributionSeries.renewable40kV.frequency} · ${distributionSeries.renewable40kV.vector} · Z ${distributionSeries.renewable40kV.impedance}` },
    { name:distributionSeries.rectifier.name, capacity:"35 kV and below", detail:distributionSeries.rectifier.detail }
  ]) + renderPills(distributionSeries.catalogFeatures) + `<h3 class="v3-title" style="font-size:1.45rem;margin-top:2.2rem">Catalog GA reference plate</h3>` + renderDrawings(productMedia, drawings.slice(1,2)), soft:true
}), 'id="catalog-series"');

updateProductPage("cast-resin-dry-type-transformer", siteSection({
  id: "dry-type-platform", kicker: "Series capability", title: "Dry-type platform: distribution, renewable and large-capacity variants",
  lead: "SCB18 1000 / 2500 kVA models remain the tested references. The official catalog broadens the visible sales platform to additional dry-type sub-series.",
  body: sourceNote() + renderSpecs(dryTypeSeries.general) + renderCards(dryTypeSeries.families) + renderPills([...dryTypeSeries.applications, ...dryTypeSeries.features]), soft:true
}), 'id="dry-type-platform"');

const prefabComparison = siteSection({
  id: "substation-platform-comparison", kicker: "Platform comparison", title: "ZGS, YB, YBH and PV / BESS integrated configurations",
  lead: "The official catalog distinguishes these products by integration method, transformer configuration and capacity range rather than treating every box-type product as the same substation.",
  body: sourceNote() + renderImageCards(prefabricatedSeries, productMedia), soft:true
});
updateProductPage("dry-type-prefabricated-substation", prefabComparison, 'id="substation-platform-comparison"');
updateProductPage("oil-immersed-prefabricated-substation", prefabComparison, 'id="substation-platform-comparison"');
updateProductPage("american-type-combined-transformer", prefabComparison, 'id="substation-platform-comparison"');

// Manufacturing: replace the old "capacity pending" limitation with source-bounded catalog figures.
{
  const file = path.join(dist, "manufacturing.html");
  let html = safeRead(file);
  if (html) {
    html = ensureCss(html, "assets/css/catalog-v3.css");
    const systems = `<div class="v3-system-list">${manufacturing.digital.map(([k,v]) => `<div><strong>${esc(k)}</strong><span>${esc(v)}</span></div>`).join("")}</div>`;
    const tests = `<div class="v3-system-list">${manufacturing.testing.map(([k,v]) => `<div><strong>${esc(k)}</strong><span>${esc(v)}</span></div>`).join("")}</div>`;
    const block = siteSection({ id:"documented-capability", kicker:"Documented manufacturing capability", title:"From production scale to 220 kV-class testing",
      lead:"The 2026 Tianyu transformer catalog provides factory-capacity numbers, named production equipment, digital manufacturing systems and laboratory ratings that were previously missing from the website.",
      body: sourceNote() + renderStats(manufacturing.stats) + `<h3 class="v3-title" style="font-size:1.45rem">Plant division</h3>` + renderPills(manufacturing.plants) + `<div class="v3-two-col"><div><h3 class="v3-title" style="font-size:1.35rem">Production equipment</h3><img src="${topMedia}manufacturing-overview.webp" alt="Tianyu transformer manufacturing equipment overview" style="width:100%;border:1px solid #dce5ec">${renderCards(manufacturing.equipment)}</div><div><h3 class="v3-title" style="font-size:1.35rem">MES / QMS / WMS / SRM</h3>${systems}<h3 class="v3-title" style="font-size:1.35rem;margin-top:1.5rem">Test & inspection</h3>${tests}<img src="${topMedia}testing-220kv-lab.webp" alt="Tianyu transformer test laboratory" style="width:100%;margin-top:1rem;border:1px solid #dce5ec"></div></div>`, soft:true });
    html = insertBefore(html, "</main>", block, 'id="documented-capability"');
    safeWrite(file, html);
  }
}

{
  const file = path.join(dist, "applications.html");
  let html = safeRead(file);
  if (html) {
    html = ensureCss(html, "assets/css/catalog-v3.css");
    const block = siteSection({ id:"renewable-integrated-solutions", kicker:"Renewable-energy systems", title:"Transformer and integrated-station options for PV, wind and BESS",
      lead:"Catalog product photography adds application context for floating PV, prefabricated substations and factory-integrated power-conversion stations.",
      body:`<img src="${topMedia}renewable-projects.webp" alt="Tianyu renewable-energy project references" style="width:100%;max-width:900px;border:1px solid #dce5ec;margin-top:1.3rem">` + renderCards(prefabricatedSeries) + `<h3 class="v3-title" style="font-size:1.45rem;margin-top:2rem">Special transformer solutions</h3>` + renderCards(renewableSpecials), soft:true });
    html = insertBefore(html, "</main>", block, 'id="renewable-integrated-solutions"');
    safeWrite(file, html);
  }
}

{
  const file = path.join(dist, "resources.html");
  let html = safeRead(file);
  if (html) {
    html = ensureCss(html, "assets/css/catalog-v3.css");
    const block = siteSection({ id:"catalog-ga-drawings", kicker:"Engineering references", title:"Official catalog GA / outline drawings",
      lead:"These catalog reference plates support configuration and space-planning review. Final project drawings remain subject to engineering confirmation after technical review.",
      body:sourceNote() + renderDrawings(topMedia), soft:true });
    html = insertBefore(html, "</main>", block, 'id="catalog-ga-drawings"');
    safeWrite(file, html);
  }
}

function catalogSheet({ code, id = "", kicker, title, lead, body }) {
  return `<section class="catalog-sheet v3-catalog-sheet"${id ? ` id="${id}"` : ""}><span class="catalog-page-no">${esc(code)}</span><p class="v3-kicker">${esc(kicker)}</p><h2 class="v3-title">${esc(title)}</h2><p class="v3-lead">${esc(lead)}</p>${body}</section>`;
}
function seriesSummaryCards(series) {
  return renderCards(series.map((s) => ({ name:s.name, model:s.model, capacity:s.capacity, voltage:s.voltage, detail:`${s.tap} · ${s.vector}${s.impedance ? ` · ${s.impedance}` : ""}` })));
}
function hvTable(series) {
  const isThree = series.name.startsWith("110") || series.name.startsWith("220");
  const headers = isThree ? ["kVA","P0 kW","Pk kW","I0 %","L×W×H mm"] : ["kVA","P0 kW","Pk kW","I0 %","Z %","L×W×H mm","kg"];
  return renderTable(headers, series.rows);
}

// Export Catalog V3 additions. Existing certificate/test-report pages are deliberately retained.
{
  const file = path.join(dist, "catalog.html");
  let html = safeRead(file);
  if (html) {
    html = ensureCss(html, "assets/css/catalog-v3.css");
    html = html.replaceAll("Tianyu Export Catalog V2", "Tianyu Export Catalog V3");
    html = html.replaceAll("110 kV · 132 kV · 220 kV Reference Range", "35 / 66 / 110 / 132 / 220 kV Platform");
    html = html.replaceAll("SCB18 Cast-Resin Indoor Distribution", "35 kV Dry-Type Platform · SCB18 Tested References");
    html = html.replace("Transformer and prefabricated substation solutions for utility, renewable-energy, industrial and infrastructure applications.", "Transformer, substation and renewable-energy power-conversion platforms supported by manufacturing, drawings and model-specific test evidence.");
    html = html.replace('</aside>', '<a href="#manufacturing-capacity">Manufacturing Capacity</a><a href="#series-hv-overview">Catalog Series Capability</a><a href="#catalog-ga-plate">Catalog GA Drawings</a></aside>');

    const systems = `<div class="v3-system-list">${manufacturing.digital.map(([k,v]) => `<div><strong>${esc(k)}</strong><span>${esc(v)}</span></div>`).join("")}</div>`;
    const tests = `<div class="v3-system-list">${manufacturing.testing.map(([k,v]) => `<div><strong>${esc(k)}</strong><span>${esc(v)}</span></div>`).join("")}</div>`;
    const manufacturingSheets = [
      catalogSheet({ code:"M1", id:"manufacturing-capacity", kicker:"Manufacturing Base", title:"Production scale documented by the Tianyu catalog", lead:"Factory capacity and plant data are now separated from third-party product test evidence.", body:sourceNote()+renderStats(manufacturing.stats)+renderPills(manufacturing.plants) }),
      catalogSheet({ code:"M2", id:"production-equipment", kicker:"Production Equipment", title:"Named equipment across coil, core, tank and dry-type production", lead:"The catalog adds actual equipment photography to replace generic manufacturing imagery.", body:`<img src="${topMedia}manufacturing-overview.webp" alt="Tianyu manufacturing equipment overview" style="width:100%;max-height:490px;object-fit:contain">`+renderCards(manufacturing.equipment) }),
      catalogSheet({ code:"M3", id:"digital-manufacturing", kicker:"Digital Manufacturing", title:"MES, QMS, WMS and SRM production-management chain", lead:"Production planning, quality traceability, warehouse management and supplier collaboration are presented as separate operational systems.", body:systems }),
      catalogSheet({ code:"M4", id:"test-inspection-capability", kicker:"Test & Inspection", title:"220 kV-class laboratory and independent test power supply", lead:"The official catalog lists laboratory ratings for lightning impulse, power-frequency withstand, partial discharge and power analysis.", body:`<div class="v3-two-col"><div>${tests}</div><div><img src="${topMedia}testing-220kv-lab.webp" alt="Tianyu transformer test laboratory" style="width:100%;border:1px solid #dce5ec"></div></div>` })
    ].join("\n");
    html = insertBefore(html, '<section class="catalog-sheet catalog-front-certificate-sheet" id="quality">', manufacturingSheets, 'id="manufacturing-capacity"');

    const productSheets = [
      catalogSheet({ code:"S1", id:"series-hv-overview", kicker:"Series Capability", title:"35 / 66 / 110 / 220 kV oil-immersed power-transformer platforms", lead:"Series capability from the official catalog is shown separately from the existing 110 / 132 / 220 kV tested reference models.", body:sourceNote()+seriesSummaryCards(highVoltageSeries) }),
      catalogSheet({ code:"S2", kicker:"35 / 66 kV Series Data", title:"Standard capacity, loss and outline data", lead:"Published catalog values for standard 35 kV and 66 kV on-load voltage-regulating transformers.", body:`<h3>35 kV · ${esc(highVoltageSeries[0].model)}</h3>${hvTable(highVoltageSeries[0])}<h3 style="margin-top:16px">66 kV · ${esc(highVoltageSeries[1].model)}</h3>${hvTable(highVoltageSeries[1])}` }),
      catalogSheet({ code:"S3", kicker:"110 / 220 kV Series Data", title:"Three-winding main-transformer range", lead:"Published catalog values for 110 kV and 220 kV standard platforms.", body:`<h3>110 kV · ${esc(highVoltageSeries[2].model)}</h3>${hvTable(highVoltageSeries[2])}<h3 style="margin-top:16px">220 kV · ${esc(highVoltageSeries[3].model)}</h3>${hvTable(highVoltageSeries[3])}` }),
      catalogSheet({ code:"S4", id:"catalog-ga-plate", kicker:"GA / Outline Drawings", title:"Catalog transformer GA reference plates", lead:"GA drawings become the primary catalog engineering reference; test schematics remain in evidence resources.", body:renderDrawings(topMedia, drawings) }),
      catalogSheet({ code:"S5", kicker:"Distribution & Renewable", title:"12 kV distribution and 40.5 kV renewable-energy transformer platforms", lead:"The official catalog fills the previous series-data gap while existing Tier 2 evidence remains model-specific.", body:renderCards([{name:distributionSeries.general12kV.name,capacity:distributionSeries.general12kV.capacity,voltage:distributionSeries.general12kV.voltage,detail:`${distributionSeries.general12kV.frequency} · ${distributionSeries.general12kV.vector}`},{name:distributionSeries.renewable40kV.name,capacity:distributionSeries.renewable40kV.capacity,voltage:distributionSeries.renewable40kV.voltage,detail:`${distributionSeries.renewable40kV.frequency} · ${distributionSeries.renewable40kV.vector} · Z ${distributionSeries.renewable40kV.impedance}`},{name:distributionSeries.rectifier.name,capacity:"35 kV and below",detail:distributionSeries.rectifier.detail}]) }),
      catalogSheet({ code:"S6", kicker:"Dry-Type Platform", title:"General, renewable, large-capacity and amorphous-alloy dry-type series", lead:"SCB18 tested references remain distinct from the wider catalog product platform.", body:renderSpecs(dryTypeSeries.general)+renderCards(dryTypeSeries.families) }),
      catalogSheet({ code:"S7", kicker:"Prefabricated Substations", title:"ZGS, YB, YBH and PV / BESS integrated station range", lead:"Capacity and integration method clarify the differences between compact combined transformers, modular substations and integrated power-conversion stations.", body:`<img src="${topMedia}renewable-projects.webp" alt="Renewable project references" style="width:100%;max-height:350px;object-fit:contain">`+renderCards(prefabricatedSeries) }),
      catalogSheet({ code:"S8", kicker:"Renewable & Special Solutions", title:"Offshore wind, mobile power and integrated renewable-energy equipment", lead:"Special product pages from the Tianyu catalog are retained as application-led solutions rather than forced into generic transformer categories.", body:renderCards(renewableSpecials) })
    ].join("\n");
    html = insertBefore(html, '<section class="catalog-sheet engineering-sheet" id="engineering">', productSheets, 'id="series-hv-overview"');
    safeWrite(file, html);
  }
}

console.log("Catalog / website V3 refresh complete.");
