import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { productGradients, productGradientLegend } from "./product-gradient-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const cssSource = path.join(__dirname, "product-contract-upgrade.css");
const cssTarget = path.join(dist, "assets", "css", "product-contract-upgrade.css");
const marker = "data-product-contract-upgrade";

const esc = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

function ensureDir(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

function relativeCssHref(file) {
  return path.relative(path.dirname(file), cssTarget).split(path.sep).join("/");
}

function ensureStyleLink(html, file) {
  if (!html || html.includes("product-contract-upgrade.css")) return html;
  return html.replace("</head>", `  <link rel="stylesheet" href="${relativeCssHref(file)}">\n</head>`);
}

function badge(layer) {
  const label = productGradientLegend.find(([id]) => id === layer)?.[1] || layer;
  return `<span class="pcu-badge pcu-${esc(layer)}">${esc(label)}</span>`;
}

function gradientTable(rows, compact = false) {
  return `<div class="pcu-table-wrap${compact ? " compact" : ""}"><table class="pcu-gradient-table"><thead><tr><th>Product / Platform</th><th>Voltage</th><th>Capacity</th><th>Evidence Layer</th><th>Scope Note</th></tr></thead><tbody>${rows.map((row) => `<tr><td><strong>${esc(row.product)}</strong><small>${esc(row.family)}</small></td><td>${esc(row.voltage)}</td><td>${esc(row.capacity)}</td><td>${badge(row.layer)}</td><td>${esc(row.note)}</td></tr>`).join("")}</tbody></table></div>`;
}

function legendBlock() {
  return `<div class="pcu-legend">${productGradientLegend.map(([id, title, description]) => `<div>${badge(id)}<p>${esc(description)}</p></div>`).join("")}</div>`;
}

function productIndexSection() {
  return `<section class="section pale pcu-product-gradient" ${marker} id="product-capability-ladder"><div class="section-head"><div><p class="eyebrow">2026 Product Capability Ladder</p><h2>Separate published capability from proven evidence</h2></div></div><p class="pcu-lead">The ladder below is the current catalog-derived product map. Published series capability, operating references and exact third-party tested models are deliberately kept as different evidence layers.</p>${legendBlock()}${gradientTable(productGradients)}<p class="pcu-note">A published range is not a claim that every rating has the same certification or test history. Final configuration remains subject to project specification, technical review and applicable standards.</p></section>`;
}

function productPageSection(productId) {
  const rows = productGradients.filter((row) => row.productId === productId);
  if (!rows.length) return "";
  return `<section class="product-section pale-block pcu-product-gradient" ${marker} id="capability-ladder"><p class="eyebrow">Product Capability Ladder</p><h2>Series range, reference configurations and tested models</h2><p class="lead">Use this ladder to distinguish the broader catalog platform from exact models backed by available evidence.</p>${legendBlock()}${gradientTable(rows, true)}<div class="pcu-deliverables"><div><p>ENGINEERING</p><h3>Project deliverables</h3><ul><li>Technical schedule and specification review</li><li>GA / interface drawings as required by project scope</li><li>Configuration and accessory confirmation</li></ul></div><div><p>QUALITY</p><h3>Inspection & documentation</h3><ul><li>Routine-test documentation</li><li>FAT / witness inspection where specified</li><li>Quality and release records by contract scope</li></ul></div><div><p>DELIVERY</p><h3>Export & site support</h3><ul><li>Export packing and shipping marks</li><li>Packing / shipping document handover</li><li>Installation, commissioning or training support where contracted</li></ul></div></div><p class="pcu-note">Project deliverables are scope-dependent and are confirmed in the approved technical and commercial documents before order execution.</p></section>`;
}

function deliveryWorkflowSection(className = "section") {
  const steps = [
    ["01", "Specification Review", "Ratings, application, site conditions, standards and customer specification"],
    ["02", "Engineering & Drawings", "Technical clarification, GA / SLD / interface review and drawing approval"],
    ["03", "Material & Planning", "Material preparation, production plan and project milestones"],
    ["04", "Manufacturing & QC", "Production with incoming, in-process and final inspection points"],
    ["05", "FAT / Witness", "Routine testing, agreed FAT and customer / third-party witness where required"],
    ["06", "Packing & Release", "Export packing, markings, release records and shipping documentation"],
    ["07", "Shipment & Logistics", "Port, customs and transport coordination according to the agreed Incoterm / scope"],
    ["08", "Site Support", "Installation guidance, commissioning support, performance-test support and training where contracted"]
  ];
  return `<section class="${className} pcu-delivery-workflow" ${marker} id="project-delivery"><div class="section-head"><div><p class="eyebrow">Engineering & Project Delivery</p><h2>From specification to site support</h2></div></div><p class="pcu-lead">Large EPC and utility orders are managed as a delivery chain, not as a standalone equipment shipment. The exact scope is defined by the project contract.</p><div class="pcu-workflow">${steps.map(([no, title, text]) => `<article><span>${no}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join("")}</div><div class="pcu-doc-strip"><strong>Typical document chain</strong><span>Technical schedule</span><span>Approved drawings</span><span>Inspection / test records</span><span>Packing list</span><span>Shipping documents</span><span>O&amp;M / handover files</span></div></section>`;
}

function catalogGradientSheets() {
  const transformerRows = productGradients.filter((row) => ["high-voltage-power-transformer", "oil-immersed-distribution-transformer", "cast-resin-dry-type-transformer"].includes(row.productId));
  const systemRows = productGradients.filter((row) => !transformerRows.includes(row));
  const sheet = (title, intro, rows) => `<section class="catalog-sheet pcu-catalog-gradient" ${marker}><div class="sheet-head"><p>PRODUCT CAPABILITY LADDER</p><h2>${esc(title)}</h2><span>${esc(intro)}</span></div>${legendBlock()}${gradientTable(rows, true)}<p class="catalog-note pcu-note">Published series capability and exact tested evidence are intentionally presented as separate layers.</p></section>`;
  return sheet("Transformer Platform Ladder", "Current catalog ranges with evidence status separated by layer.", transformerRows) + sheet("Substation & Integrated Solution Ladder", "Prefabricated and renewable-energy platforms from the current catalog map.", systemRows);
}

function catalogDeliverySheet() {
  return `<section class="catalog-sheet pcu-catalog-delivery" ${marker}><div class="sheet-head"><p>ENGINEERING & PROJECT DELIVERY</p><h2>From specification to handover</h2><span>Typical project workflow derived from the delivery obligations repeatedly seen in major EPC orders.</span></div>${deliveryWorkflowSection("pcu-catalog-workflow-inner")}<p class="catalog-note pcu-note">This is a capability framework, not a blanket contractual promise. FAT, logistics, commissioning, training and warranty scope are confirmed project by project.</p></section>`;
}

function upgradeQuoteForm(html) {
  if (!html || html.includes("name=\"projectStage\"")) return html;
  const target = '<label class="full">Project Requirements<textarea';
  if (!html.includes(target)) return html;
  const extra = `<label>Quantity<input name="quantity" placeholder="e.g. 12 units"></label><label>Project Stage<select name="projectStage"><option value="">Select stage</option><option>Budgetary inquiry</option><option>Tender</option><option>Technical evaluation</option><option>Procurement</option></select></label><label>Required Standard<input name="requiredStandard" placeholder="e.g. IEC 60076 / project specification"></label><label>Required Delivery<input name="requiredDelivery" placeholder="Required date or project window"></label>`;
  return html.replace(target, `${extra}${target}`);
}

function upgradeProductsIndex() {
  const file = path.join(dist, "products.html");
  let html = read(file);
  if (!html || html.includes('id="product-capability-ladder"')) return;
  html = ensureStyleLink(html, file);
  html = upgradeQuoteForm(html);
  html = html.replace("</main>", `${productIndexSection()}\n</main>`);
  write(file, html);
}

function upgradeProductPages() {
  const productRoot = path.join(dist, "products");
  if (!fs.existsSync(productRoot)) return;
  for (const entry of fs.readdirSync(productRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = path.join(productRoot, entry.name, "index.html");
    let html = read(file);
    if (!html) continue;
    html = ensureStyleLink(html, file);
    html = upgradeQuoteForm(html);
    if (!html.includes('id="capability-ladder"')) {
      const section = productPageSection(entry.name);
      if (section) html = html.replace('<div class="product-page-body">', `<div class="product-page-body">${section}`);
    }
    write(file, html);
  }
}

function upgradeHome() {
  const file = path.join(dist, "index.html");
  let html = read(file);
  if (!html) return;
  html = ensureStyleLink(html, file);
  html = upgradeQuoteForm(html);
  if (!html.includes('id="project-delivery"')) {
    const target = '<section class="section yw-why';
    const index = html.indexOf(target);
    if (index >= 0) html = html.slice(0, index) + deliveryWorkflowSection("section") + html.slice(index);
    else html = html.replace("</main>", `${deliveryWorkflowSection("section")}\n</main>`);
  }
  write(file, html);
}

function upgradeCatalog() {
  const file = path.join(dist, "catalog.html");
  let html = read(file);
  if (!html) return;
  html = ensureStyleLink(html, file);
  if (!html.includes("pcu-catalog-gradient")) {
    const target = '<section class="catalog-sheet engineering-sheet';
    const index = html.indexOf(target);
    const insertion = catalogGradientSheets() + catalogDeliverySheet();
    if (index >= 0) html = html.slice(0, index) + insertion + html.slice(index);
    else html = html.replace("</main>", `${insertion}\n</main>`);
  }
  write(file, html);
}

function upgradeAllQuoteForms() {
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile() && entry.name.endsWith(".html")) {
        let html = read(file);
        const changed = upgradeQuoteForm(html);
        if (changed !== html) {
          html = ensureStyleLink(changed, file);
          write(file, html);
        }
      }
    }
  };
  if (fs.existsSync(dist)) walk(dist);
}

function writeGradientDataArtifact() {
  const targetDir = path.join(root, "catalog-content", "data");
  ensureDir(targetDir);
  write(path.join(targetDir, "product-gradient.json"), `${JSON.stringify({ legend: productGradientLegend, rows: productGradients }, null, 2)}\n`);
}

function main() {
  if (!fs.existsSync(dist)) throw new Error("dist directory not found. Run the base website build first.");
  ensureDir(path.dirname(cssTarget));
  fs.copyFileSync(cssSource, cssTarget);
  writeGradientDataArtifact();
  upgradeHome();
  upgradeProductsIndex();
  upgradeProductPages();
  upgradeCatalog();
  upgradeAllQuoteForms();
}

main();
