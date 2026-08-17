import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "dist", "catalog.html");
const cssTarget = path.join(root, "dist", "assets", "css", "catalog-layout-v5.css");

if (!fs.existsSync(catalogPath)) throw new Error("dist/catalog.html is missing.");

let html = fs.readFileSync(catalogPath, "utf8");

if (!html.includes("catalog-layout-v5.css")) {
  html = html.replace("</head>", `  <link rel="stylesheet" href="assets/css/catalog-layout-v5.css">\n</head>`);
}

const productNames = [
  "Oil-Immersed Distribution Transformer",
  "High-Voltage Power Transformer",
  "Cast Resin Dry-Type Transformer",
  "European-Type Prefabricated Substation",
  "Compact Prefabricated Substation",
  "Pad-Mounted Transformer"
];

const chunk = (items, size) => {
  const result = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
};

function stripValidationColumn(segment) {
  return segment.replace(/<table class="catalog-model-table">[\s\S]*?<\/table>/g, (table) => {
    let next = table.replace(/<th>Available Validation<\/th>/g, "");
    next = next.replace(/<tr>([\s\S]*?)<\/tr>/g, (row) => {
      const cells = row.match(/<td>[\s\S]*?<\/td>/g) || [];
      if (cells.length === 4) return row.replace(cells[3], "");
      return row;
    });
    return next;
  });
}

function buildCertificatePages(productName, articles, basePage) {
  return chunk(articles, 4).map((group, index, groups) => `
<section class="catalog-sheet catalog-certificate-sheet">
  ${basePage ? `<span class="catalog-page-no">${basePage}C${index + 1}</span>` : ""}
  <div class="sheet-head compact-sheet-head">
    <p>CERTIFICATES &amp; TEST REPORTS</p>
    <h2>${productName}</h2>
    <span>Full-page previews are shown without cropping. Each record is tied to the model and report number printed below it.${groups.length > 1 ? ` · ${index + 1} / ${groups.length}` : ""}</span>
  </div>
  <div class="catalog-cert-page-grid">${group.join("")}</div>
</section>`).join("");
}

function buildDrawingPages(productName, figures, basePage) {
  return chunk(figures, 2).map((group, index, groups) => `
<section class="catalog-sheet catalog-drawing-sheet">
  ${basePage ? `<span class="catalog-page-no">${basePage}D${index + 1}</span>` : ""}
  <div class="sheet-head compact-sheet-head">
    <p>ENGINEERING DRAWINGS</p>
    <h2>${productName}</h2>
    <span>Two drawings per page for legibility. These drawings reproduce reference configurations from the available report set.${groups.length > 1 ? ` · ${index + 1} / ${groups.length}` : ""}</span>
  </div>
  <div class="catalog-drawing-page-grid">${group.join("")}</div>
</section>`).join("");
}

// Rebuild each product-detail section so certificates and drawings have dedicated pages.
const edits = [];
for (const productName of productNames) {
  const titleNeedle = `<h2>${productName}</h2>`;
  const titleIndex = html.indexOf(titleNeedle);
  if (titleIndex < 0) continue;

  // Find the PRODUCT DETAILS occurrence, not the earlier overview occurrence.
  let detailTitleIndex = html.indexOf(titleNeedle, titleIndex + titleNeedle.length);
  if (detailTitleIndex < 0) detailTitleIndex = titleIndex;
  const sectionStart = html.lastIndexOf('<section class="catalog-sheet product-evidence-sheet catalog-product-detail-sheet">', detailTitleIndex);
  if (sectionStart < 0) continue;
  const sectionEndTag = html.indexOf("</section>", detailTitleIndex);
  if (sectionEndTag < 0) continue;
  const sectionEnd = sectionEndTag + "</section>".length;
  let segment = html.slice(sectionStart, sectionEnd);

  const pageMatch = segment.match(/<span class="catalog-page-no">([^<]+)<\/span>/);
  const basePage = pageMatch?.[1] || "";

  const certStart = segment.indexOf('<div class="catalog-detail-section"><h3>Certificates & Test Reports</h3>');
  const drawingStart = segment.indexOf('<div class="catalog-detail-section"><h3>Engineering Drawings</h3>');
  const projectStart = segment.indexOf('<div class="catalog-detail-section catalog-project-table-section">');

  let certificatePages = "";
  let drawingPages = "";

  if (certStart >= 0 && drawingStart > certStart) {
    const certBlock = segment.slice(certStart, drawingStart);
    const articles = certBlock.match(/<article>[\s\S]*?<\/article>/g) || [];
    certificatePages = buildCertificatePages(productName, articles, basePage);
  }

  if (drawingStart >= 0 && projectStart > drawingStart) {
    const drawingBlock = segment.slice(drawingStart, projectStart);
    const figures = drawingBlock.match(/<figure>[\s\S]*?<\/figure>/g) || [];
    drawingPages = buildDrawingPages(productName, figures, basePage);
  }

  if (certStart >= 0 && projectStart > certStart) {
    segment = segment.slice(0, certStart) + segment.slice(projectStart);
  }

  segment = stripValidationColumn(segment);
  edits.push({ start: sectionStart, end: sectionEnd, replacement: segment + certificatePages + drawingPages });
}

for (const edit of edits.sort((a, b) => b.start - a.start)) {
  html = html.slice(0, edit.start) + edit.replacement + html.slice(edit.end);
}

// Split the front Quality & Certification evidence into two balanced pages of four records.
const qualityStart = html.indexOf('<section class="catalog-sheet quality-sheet" id="quality">');
if (qualityStart >= 0) {
  const qualityEndTag = html.indexOf("</section>", qualityStart);
  const qualityEnd = qualityEndTag >= 0 ? qualityEndTag + "</section>".length : -1;
  if (qualityEnd > qualityStart) {
    let quality = html.slice(qualityStart, qualityEnd);
    const gridStart = quality.indexOf('<div class="catalog-evidence-grid">');
    const principlesStart = quality.indexOf('<div class="quality-principles">');
    if (gridStart >= 0 && principlesStart > gridStart) {
      const gridBlock = quality.slice(gridStart, principlesStart);
      const cards = gridBlock.match(/<article class="catalog-evidence-card">[\s\S]*?<\/article>/g) || [];
      if (cards.length > 4) {
        const first = cards.slice(0, 4).join("");
        const second = cards.slice(4, 8).join("");
        const gridEnd = quality.indexOf("</div>", gridStart) + 6;
        quality = quality.slice(0, gridStart) + `<div class="catalog-evidence-grid catalog-quality-grid">${first}</div>` + quality.slice(gridEnd);
        const pageMatch = quality.match(/<span class="catalog-page-no">([^<]+)<\/span>/);
        const basePage = pageMatch?.[1] || "05";
        const secondPage = `
<section class="catalog-sheet quality-sheet catalog-quality-continuation">
  <span class="catalog-page-no">${basePage}B</span>
  <div class="sheet-head compact-sheet-head"><p>QUALITY &amp; CERTIFICATION</p><h2>Independent Evidence</h2><span>Continuation of the model-specific certificate and test-report previews.</span></div>
  <div class="catalog-evidence-grid catalog-quality-grid">${second}</div>
</section>`;
        html = html.slice(0, qualityStart) + quality + secondPage + html.slice(qualityEnd);
      }
    }
  }
}

// Final defensive cleanup in case any older generated model table survived.
html = stripValidationColumn(html);

fs.copyFileSync(path.join(__dirname, "catalog-layout-v5.css"), cssTarget);
fs.writeFileSync(catalogPath, html);
console.log("Catalog V5: improved typography, 4 certificates per page, 2 drawings per page, and simplified tested-model tables.");
