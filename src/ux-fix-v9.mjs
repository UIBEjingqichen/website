import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { categories, products } from "./products-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "..", "dist");

const displayNames = {
  "dry-type-prefabricated-substation": "European-Type Prefabricated Substation",
  "oil-immersed-prefabricated-substation": "Compact Prefabricated Substation",
  "american-type-combined-transformer": "Pad-Mounted Transformer"
};

const esc = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

function injectCss(html, depth = "") {
  if (!html.includes("ux-fix-v9.css")) {
    html = html.replace("</head>", `    <link rel="stylesheet" href="${depth}assets/css/ux-fix-v9.css">\n</head>`);
  }
  return html;
}

function explicitIndexLinks(html) {
  return html.replace(/href="([^"]+)"/g, (full, href) => {
    if (!href || href.startsWith("#") || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return full;
    const hashIndex = href.indexOf("#");
    const queryIndex = href.indexOf("?");
    let splitIndex = href.length;
    if (hashIndex >= 0) splitIndex = Math.min(splitIndex, hashIndex);
    if (queryIndex >= 0) splitIndex = Math.min(splitIndex, queryIndex);
    const base = href.slice(0, splitIndex);
    const suffix = href.slice(splitIndex);
    if (!base.endsWith("/")) return full;
    return `href="${base}index.html${suffix}"`;
  });
}

function applicationsSection(product) {
  const applications = product?.applications || [];
  if (!applications.length) return "";
  return `<section class="section v9-model-applications"><div class="v5-family-heading"><p>APPLICATIONS</p><h2>Typical Applications</h2><span class="v9-section-note">General applications for the ${esc(displayNames[product.id] || product.name)} family.</span></div><div class="v9-application-list">${applications.map((application) => `<span>${esc(application)}</span>`).join("")}</div></section>`;
}

function relatedProductsSection(currentId) {
  const others = categories.filter((category) => category.id !== currentId);
  return `<section class="section v5-model-apps v9-other-products"><div class="v5-family-heading"><p>OTHER PRODUCTS</p><h2>Explore Other Transformer Solutions</h2><span class="v9-section-note">Browse other Tianyu product families.</span></div><div class="v9-other-products-grid">${others.map((category) => `<a class="v9-other-product-card" href="../../products/${category.id}/index.html"><div class="v9-other-product-image"><img src="../../assets/media/${category.image}" alt="${esc(displayNames[category.id] || category.name)}" loading="lazy"></div><div class="v9-other-product-copy"><h3>${esc(displayNames[category.id] || category.name)}</h3><span>VIEW PRODUCT →</span></div></a>`).join("")}</div></section>`;
}

function updateModelPage(file, familyId) {
  let html = fs.readFileSync(file, "utf8");
  const product = products.find((item) => item.id === familyId);
  const replacement = `${applicationsSection(product)}${relatedProductsSection(familyId)}`;
  html = html.replace(/<section class="section v5-model-apps">[\s\S]*?<\/section>/, replacement);
  html = explicitIndexLinks(html);
  html = injectCss(html, "../../");
  if (!html.includes("v9-model-page")) html = html.replace(/<body([^>]*)>/, '<body$1 class="v9-model-page">');
  fs.writeFileSync(file, html);
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".html")) continue;

    const relative = path.relative(dist, full).replace(/\\/g, "/");
    const modelMatch = relative.match(/^products\/([^/]+)\/([^/]+\.html)$/);
    if (modelMatch && modelMatch[2] !== "index.html") {
      updateModelPage(full, modelMatch[1]);
      continue;
    }

    let html = fs.readFileSync(full, "utf8");
    html = explicitIndexLinks(html);
    const depthParts = path.relative(path.dirname(full), dist).replace(/\\/g, "/");
    const depth = depthParts ? `${depthParts}/` : "";
    html = injectCss(html, depth);
    fs.writeFileSync(full, html);
  }
}

fs.mkdirSync(path.join(dist, "assets", "css"), { recursive: true });
fs.copyFileSync(path.join(__dirname, "ux-fix-v9.css"), path.join(dist, "assets", "css", "ux-fix-v9.css"));
walk(dist);

console.log("Applied V9: explicit index links, readable typography, generic family applications, and Other Products on exact-model pages.");
