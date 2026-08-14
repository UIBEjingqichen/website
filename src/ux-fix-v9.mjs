import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { categories } from "./products-data.mjs";
import { projects } from "./projects-data.mjs";

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

function projectsFor(productId) {
  return projects.filter((project) => project.productIds?.includes(productId));
}

function realApplicationsSection(productId, depth = "../../") {
  const rows = projectsFor(productId);
  if (!rows.length) return "";
  const category = categories.find((item) => item.id === productId);
  const productName = displayNames[productId] || category?.name || "this product family";
  return `<section class="section v9-real-applications"><div class="v5-family-heading"><p>APPLICATIONS</p><h2>Real Application References</h2><span class="v9-section-note">Recorded project applications for the ${esc(productName)} family from the export master table.</span></div><div class="v9-application-project-grid">${rows.map((project) => `<article class="v9-application-project"><div class="v9-application-project-meta"><span>${esc(project.application || project.industry || "Project")}</span>${project.country ? `<small>${esc(project.country)}</small>` : ""}</div><h3>${esc(project.name)}</h3><div class="v9-application-project-foot">${project.industry ? `<span>${esc(project.industry)}</span>` : ""}${project.capacity ? `<strong>${esc(project.capacity)}</strong>` : ""}</div></article>`).join("")}</div><a class="v9-applications-more" href="${depth}applications.html">VIEW ALL APPLICATIONS & PROJECTS →</a></section>`;
}

function relatedProductsSection(currentId) {
  const others = categories.filter((category) => category.id !== currentId);
  return `<section class="section v5-model-apps v9-other-products"><div class="v5-family-heading"><p>OTHER PRODUCTS</p><h2>Explore Other Transformer Solutions</h2><span class="v9-section-note">Browse other Tianyu product families.</span></div><div class="v9-other-products-grid">${others.map((category) => `<a class="v9-other-product-card" href="../../products/${category.id}/index.html"><div class="v9-other-product-image"><img src="../../assets/media/${category.image}" alt="${esc(displayNames[category.id] || category.name)}" loading="lazy"></div><div class="v9-other-product-copy"><h3>${esc(displayNames[category.id] || category.name)}</h3><span>VIEW PRODUCT →</span></div></a>`).join("")}</div></section>`;
}

function updateModelPage(file, familyId) {
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/<section class="section v9-model-applications">[\s\S]*?<\/section>/, "");
  html = html.replace(/<section class="section v5-model-apps">[\s\S]*?<\/section>/, "");
  html = html.replace(/<section class="section v5-model-apps v9-other-products">[\s\S]*?<\/section>/, relatedProductsSection(familyId));
  const applications = realApplicationsSection(familyId, "../../");
  if (applications && !html.includes("v9-real-applications")) {
    html = html.replace(/<section class="section v5-model-apps v9-other-products">/, `${applications}<section class="section v5-model-apps v9-other-products">`);
  }
  html = explicitIndexLinks(html);
  html = injectCss(html, "../../");
  if (!html.includes("v9-model-page")) html = html.replace(/<body([^>]*)>/, '<body$1 class="v9-model-page">');
  fs.writeFileSync(file, html);
}

function updateFamilyPage(file, familyId) {
  let html = fs.readFileSync(file, "utf8");
  const applications = realApplicationsSection(familyId, "../../");
  html = html.replace(/<section class="section pale v5-family-applications">[\s\S]*?<\/section>/, applications);
  html = html.replace(/<section class="section v5-family-applications">[\s\S]*?<\/section>/, applications);
  html = explicitIndexLinks(html);
  html = injectCss(html, "../../");
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
    const productMatch = relative.match(/^products\/([^/]+)\/([^/]+\.html)$/);
    if (productMatch && productMatch[2] !== "index.html") {
      updateModelPage(full, productMatch[1]);
      continue;
    }
    if (productMatch && productMatch[2] === "index.html") {
      updateFamilyPage(full, productMatch[1]);
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

console.log("Applied V9: explicit index links, readable typography, real master-table applications, and Other Products on model pages.");
