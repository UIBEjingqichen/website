import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { documents } from "./documents-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const esc = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[character]));

function asset(source) {
  return `assets/media/${source}`;
}

function heroWave() {
  const slides = [
    ["applications/grid-substation-yard.jpeg", "POWER TRANSFORMER & SUBSTATION SOLUTIONS", "Utility, renewable energy and industrial power projects."],
    ["company/factory-campus-panorama.jpeg", "MANUFACTURING, TESTING & DOCUMENT CONTROL", "Integrated production, inspection and export document support from one factory base."],
    ["applications/renewable-wind-solar-landscape.jpeg", "SERVING UTILITY, RENEWABLE & INDUSTRIAL PROJECTS", "Reference coverage across utility grids, renewable energy, infrastructure and industrial power systems."]
  ];

  return `<section class="home-wave-hero" data-wave-slider>
    <div class="home-wave-slides">${slides.map(([image, title, text], index) => `<article class="home-wave-slide${index === 0 ? " active" : ""}" data-wave-slide><img src="${asset(image)}" alt="${esc(title)}"><div class="home-wave-overlay"></div><div class="home-wave-copy"><p>TIANYU ELECTRIC</p><h1>${esc(title)}</h1><span>${esc(text)}</span><div><a class="yw-outline-button" href="products.html">EXPLORE PRODUCTS</a><button class="yw-solid-button" type="button" data-quote-open>REQUEST A QUOTE</button></div></div></article>`).join("")}</div>
    <div class="home-wave-dots">${slides.map((_, index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-wave-dot="${index}" aria-label="Show hero slide ${index + 1}"></button>`).join("")}</div>
    <svg class="home-wave-edge" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0,58 C220,112 400,4 655,55 C900,104 1110,19 1440,66 L1440,120 L0,120 Z"></path></svg>
  </section>`;
}

function certificateCarousel3D() {
  const source = documents.filter((document) => document.previewImages?.length).slice(0, 10);
  const count = Math.max(source.length, 1);
  return `<div class="certificate-3d-stage" data-certificate-3d style="--certificate-count:${count};" aria-label="Certificates and test reports">
    <div class="certificate-3d-scene">
      <div class="certificate-3d-ring">${source.map((document, index) => `<a class="certificate-3d-card" style="--i:${index};" href="resources.html#certificates" aria-label="${esc(document.title)}"><div class="certificate-3d-card-inner"><img src="${asset(document.previewImages[0])}" alt="${esc(document.title)}" loading="lazy" draggable="false"></div></a>`).join("")}</div>
    </div>
  </div>`;
}

function injectAssets(html, depth = "") {
  if (!html.includes("visual-refine-v4.css")) {
    html = html.replace("</head>", `    <link rel="stylesheet" href="${depth}assets/css/visual-refine-v4.css">\n</head>`);
  }
  if (!html.includes("visual-refine-v4.js")) {
    html = html.replace("</body>", `    <script src="${depth}assets/js/visual-refine-v4.js"></script>\n</body>`);
  }
  return html;
}

function updateFile(relative, depth = "") {
  const target = path.join(dist, relative);
  if (!fs.existsSync(target)) return;
  let html = fs.readFileSync(target, "utf8");
  html = injectAssets(html, depth);
  fs.writeFileSync(target, html);
}

const cssDir = path.join(dist, "assets", "css");
const jsDir = path.join(dist, "assets", "js");
fs.mkdirSync(cssDir, { recursive: true });
fs.mkdirSync(jsDir, { recursive: true });
fs.copyFileSync(path.join(__dirname, "visual-refine-v4.css"), path.join(cssDir, "visual-refine-v4.css"));
fs.copyFileSync(path.join(__dirname, "visual-refine-v4.js"), path.join(jsDir, "visual-refine-v4.js"));

const indexPath = path.join(dist, "index.html");
let index = fs.readFileSync(indexPath, "utf8");
index = index.replace(/<section class="home-wave-hero"[\s\S]*?<\/section>/, heroWave());
index = index.replace(/<div class="certificate-marquee-viewport"[\s\S]*?<\/div>\s*<\/div>/, certificateCarousel3D());
index = injectAssets(index);
fs.writeFileSync(indexPath, index);

updateFile("products.html");
updateFile("news.html");
updateFile("about.html");
updateFile("applications.html");
updateFile("resources.html");
updateFile("quality.html");
updateFile("manufacturing.html");
for (const entry of fs.readdirSync(path.join(dist, "products"), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  updateFile(path.join("products", entry.name, "index.html"), "../../");
}

console.log("Applied V4 3D certificate carousel and unified existing photo composition.");
