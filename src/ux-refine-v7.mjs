import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "..", "dist");

function injectCss(html, depth = "") {
  if (!html.includes("ux-refine-v7.css")) {
    html = html.replace("</head>", `    <link rel="stylesheet" href="${depth}assets/css/ux-refine-v7.css">\n</head>`);
  }
  return html;
}

function stripHeroActions(html) {
  html = html.replaceAll('<div class="v6-hero-shade"></div>', '');
  return html.replace(/<div><a class="btn btn-primary"[\s\S]*?<\/div>(?=<\/div><\/article>)/g, "");
}

function markPageHero(html) {
  return html.replace('<section class="v6-hero" data-v6-hero>', '<section class="v6-hero v6-page-hero" data-v6-hero>');
}

function homeLandscape() {
  const items = [
    ["company-factory-campus.jpeg", "Tianyu Electric manufacturing campus"],
    ["hero-home-substation-grid.jpeg", "Substation and transmission equipment"],
    ["case-renewable-energy-base.jpeg", "Renewable energy project application"],
    ["products/oil-distribution-transformer-02.webp", "Oil-immersed distribution transformer"],
    ["products/power-transformer-220kv-240mva-ssz22.webp", "220 kV power transformer"],
    ["products/oil-prefabricated-substation-01.webp", "Compact prefabricated substation"]
  ];
  return `<div class="yw-landscape-grid">${items.map(([src, alt], index) => `<figure class="landscape-${index + 1}"><img src="assets/media/${src}" alt="${alt}" loading="lazy"></figure>`).join("")}</div>`;
}

function updateHome() {
  const file = path.join(dist, "index.html");
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, "utf8");
  html = stripHeroActions(html);
  if (html.includes("<body>")) html = html.replace("<body>", '<body class="v7-home">');
  html = html.replace(/<div class="yw-landscape-grid">[\s\S]*?<\/div>(?=<\/section>)/, homeLandscape());
  html = injectCss(html);
  fs.writeFileSync(file, html);
}

function updateTopLevelPage(name) {
  const file = path.join(dist, name);
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, "utf8");
  html = stripHeroActions(html);
  html = markPageHero(html);
  html = injectCss(html);
  fs.writeFileSync(file, html);
}

function walkProductPages(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walkProductPages(full);
    else if (entry.isFile() && entry.name.endsWith(".html")) {
      let html = fs.readFileSync(full, "utf8");
      const relative = path.relative(path.dirname(full), dist).replace(/\\/g, "/");
      html = injectCss(html, relative ? `${relative}/` : "");
      fs.writeFileSync(full, html);
    }
  }
}

fs.mkdirSync(path.join(dist, "assets", "css"), { recursive: true });
fs.copyFileSync(path.join(__dirname, "ux-refine-v7.css"), path.join(dist, "assets", "css", "ux-refine-v7.css"));

updateHome();
for (const name of ["products.html", "applications.html", "resources.html", "about.html", "news.html"]) updateTopLevelPage(name);
walkProductPages(path.join(dist, "products"));

console.log("Applied V7: larger image-first heroes, seamless homepage flow, smaller company metrics, and refined landscape imagery.");
