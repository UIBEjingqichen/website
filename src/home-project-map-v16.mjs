import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { projects as projectLibrary } from "./projects-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const home = path.join(dist, "index.html");
const cssSrc = path.join(__dirname, "home-project-map-v16.css");
const jsSrc = path.join(__dirname, "home-project-map-v16.js");
const cssDst = path.join(dist, "assets", "css", "home-project-map-v16.css");
const jsDst = path.join(dist, "assets", "js", "home-project-map-v16.js");

// CC0 world map based on Natural Earth, via Wikimedia Commons.
const worldMapUrl = "https://upload.wikimedia.org/wikipedia/commons/f/fc/Blank_world_map_Robinson_projection.svg";

const esc = (v = "") => String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ensureDir = d => fs.mkdirSync(d, { recursive: true });

const productLabels = {
  "oil-immersed-distribution-transformer": "Oil-Immersed Distribution Transformer",
  "high-voltage-power-transformer": "High-Voltage Power Transformer",
  "cast-resin-dry-type-transformer": "Cast Resin Dry-Type Transformer",
  "dry-type-prefabricated-substation": "Dry-Type Prefabricated Substation",
  "oil-immersed-prefabricated-substation": "Oil-Immersed Prefabricated Substation",
  "american-type-combined-transformer": "American-Type Combined Transformer"
};

// Project records come from the website project library. Brazil is additionally retained from
// Tianyu's documented CEMIG project material already used elsewhere in the site media/project set.
const supplementalProjects = {
  "CEMIG 155 MW Photovoltaic Project": {
    name: "CEMIG 155 MW Photovoltaic Project",
    country: "Brazil",
    industry: "Solar",
    application: "Renewable Energy",
    productIds: ["oil-immersed-prefabricated-substation"],
    capacity: "155 MW",
    scope: "29 × 35 kV prefabricated substations"
  }
};

const projectConfig = [
  {
    name: "CEMIG 155 MW Photovoltaic Project",
    slug: "brazil-cemig-155mw-pv",
    x: 34.0, y: 57.0,
    image: "catalog-brazil-pv-export-project.png",
    summary: "155 MW photovoltaic project reference in Brazil, supplied with 29 high-capacity 35 kV prefabricated substations."
  },
  {
    name: "BCL Hattar Line 2 7200 TPD Cement Plant",
    slug: "pakistan-bcl-hattar-cement",
    x: 66.5, y: 35.5,
    image: "catalog-cement-plant-project.png",
    summary: "Cement-industry power-transformer reference recorded in Tianyu's project library."
  },
  {
    name: "Atlantic Industrial Park 132 kV Substation",
    slug: "nigeria-atlantic-132kv",
    x: 49.0, y: 45.5,
    image: "catalog-grid-110kv-substation-project.png",
    summary: "132 kV industrial-park substation reference recorded in Tianyu's project library."
  },
  {
    name: "Long Son Company Cement Grinding Project",
    slug: "vietnam-long-son-cement",
    x: 77.2, y: 42.0,
    image: "catalog-cement-plant-project.png",
    summary: "Cement grinding project recorded under Tianyu's high-voltage power-transformer references."
  },
  {
    name: "Methanol Dayyer Mobile Substation Export Project",
    slug: "uae-methanol-mobile-substation",
    x: 61.6, y: 38.0,
    image: "industrial-petrochemical-plant.jpeg",
    summary: "Mobile-substation export reference for a chemical-industry infrastructure project."
  },
  {
    name: "Sunshare Nambala 100 MW Solar Project",
    slug: "zambia-sunshare-nambala-solar",
    x: 54.7, y: 57.5,
    image: "utility-scale-solar-farm-aerial-01.jpeg",
    summary: "100 MW solar reference recorded under Tianyu's oil-immersed prefabricated substations."
  },
  {
    name: "CMOC Mining Area 500 MW Solar Project",
    slug: "drc-cmoc-mining-solar",
    x: 53.2, y: 51.5,
    image: "utility-scale-solar-farm-aerial-02.jpeg",
    summary: "500 MW mining / solar reference recorded under Tianyu's oil-immersed prefabricated substations."
  }
];

const selectedProjects = projectConfig.map(config => {
  const source = projectLibrary.find(project => project.name === config.name) || supplementalProjects[config.name];
  if (!source) throw new Error(`Project record not found: ${config.name}`);
  const productId = source.productIds?.[0] || "";
  return {
    ...source,
    ...config,
    id: config.slug,
    title: source.name,
    scale: source.capacity || "Project-specific",
    product: productLabels[productId] || productId || "Transformer / substation equipment",
    scope: source.scope || "",
    href: `projects/${config.slug}.html`,
    imagePath: `assets/media/applications/${config.image}`
  };
});

function assertNoPriceContent(value, label) {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  const pricePattern = /\b(price|pricing|contract value|unit price|total amount|currency|usd|cny|rmb|eur)\b|[$€¥]\s*\d/i;
  if (pricePattern.test(text)) throw new Error(`Price-like content blocked in ${label}`);
}
assertNoPriceContent(selectedProjects, "selected project data");

function attrs(p) {
  return [
    `data-project-id="${esc(p.id)}"`,
    `data-country="${esc(p.country || "")}"`,
    `data-title="${esc(p.title)}"`,
    `data-summary="${esc(p.summary)}"`,
    `data-application="${esc(p.application || "")}"`,
    `data-industry="${esc(p.industry || "")}"`,
    `data-scale="${esc(p.scale)}"`,
    `data-product="${esc(p.product)}"`,
    `data-scope="${esc(p.scope || "")}"`,
    `data-image="${esc(p.imagePath)}"`,
    `data-href="${esc(p.href)}"`,
    `data-x="${p.x}"`,
    `data-y="${p.y}"`
  ].join(" ");
}

function filtersMarkup() {
  const filters = [
    ["all", "All"],
    ["Renewable Energy", "Renewable"],
    ["Utility Grid", "Utility"],
    ["Industrial", "Industrial"],
    ["Infrastructure", "Infrastructure"]
  ];
  return filters.map(([value, label], index) => `<button class="ty16-filter${index === 0 ? " active" : ""}" type="button" aria-pressed="${index === 0 ? "true" : "false"}" data-ty16-filter="${esc(value)}">${esc(label)}</button>`).join("");
}

function projectMapSection() {
  const pins = selectedProjects.map(p => `<button class="ty16-pin" type="button" aria-label="Review ${esc(p.title)}" style="left:${p.x}%;top:${p.y}%" data-ty16-pin ${attrs(p)}></button>`).join("");
  const cards = selectedProjects.map(p => `<a class="ty16-feature-card" href="${esc(p.href)}" data-ty16-card ${attrs(p)}><div class="ty16-feature-media"><img src="${esc(p.imagePath)}" alt="${esc(p.title)} reference visual" loading="lazy"></div><div class="ty16-feature-copy"><small>${esc(p.country || p.application)}</small><strong>${esc(p.title)}</strong><div class="ty16-feature-meta"><span>${esc(p.application || "Project reference")}</span><span>${esc(p.scale)}</span></div></div></a>`).join("");

  const html = `<section class="ty16-projects" id="global-project-references" data-ty16-projects><div class="ty16-shell"><div class="ty16-head"><div><p class="ty16-kicker">Global Project References</p><h2 class="ty16-title">Projects delivered across international markets</h2><p class="ty16-lead">Explore selected transformer and substation references by country and application. Project facts are drawn from Tianyu's project library and documented project materials.</p></div><a class="ty16-all-link" href="applications.html#projects">VIEW ALL PROJECTS →</a></div><div class="ty16-filters" aria-label="Filter project references">${filtersMarkup()}</div><div class="ty16-map-stage"><img class="ty16-world-base" src="${worldMapUrl}" alt="" aria-hidden="true">${pins}<div class="ty16-map-hint"><strong>Explore the map</strong><span>Hover to preview · Click to open project details</span></div><div class="ty16-tooltip" role="status" aria-hidden="true"><small data-ty16-tip-country></small><strong data-ty16-tip-title></strong></div><article class="ty16-float-card" aria-live="polite" aria-hidden="true" data-ty16-float-card><button class="ty16-float-close" type="button" aria-label="Close project details" data-ty16-close>×</button><div class="ty16-float-media"><img src="" alt="" data-ty16-image></div><div class="ty16-float-copy"><small class="ty16-float-country" data-ty16-country></small><h3 data-ty16-title></h3><p data-ty16-summary></p><div class="ty16-facts"><div class="ty16-fact"><span>Application</span><strong data-ty16-application></strong></div><div class="ty16-fact"><span>Industry</span><strong data-ty16-industry></strong></div><div class="ty16-fact"><span>Scale</span><strong data-ty16-scale></strong></div><div class="ty16-fact"><span>Product</span><strong data-ty16-product></strong></div><div class="ty16-fact ty16-scope-fact" data-ty16-scope-row hidden><span>Supply reference</span><strong data-ty16-scope></strong></div></div><a class="ty16-float-link" href="applications.html#projects" data-ty16-link>VIEW PROJECT →</a></div></article></div><div class="ty16-featured-head"><h3>Featured Projects</h3><span data-ty16-visible-count>4 selected references</span></div><div class="ty16-featured-grid">${cards}</div></div></section>`;
  assertNoPriceContent(html, "homepage project map");
  return html;
}

function copyFile(from, to) {
  if (!fs.existsSync(from)) return;
  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
}
function ensureAssets() {
  copyFile(cssSrc, cssDst);
  copyFile(jsSrc, jsDst);
  for (const project of selectedProjects) {
    copyFile(path.join(root, "source-media", "applications", project.image), path.join(dist, "assets", "media", "applications", project.image));
  }
}
function ensureLinks(html) {
  if (!html.includes("home-project-map-v16.css")) html = html.replace("</head>", '  <link rel="stylesheet" href="assets/css/home-project-map-v16.css">\n</head>');
  if (!html.includes("home-project-map-v16.js")) html = html.replace("</body>", '  <script src="assets/js/home-project-map-v16.js"></script>\n</body>');
  return html;
}
function patchHome() {
  let html = fs.readFileSync(home, "utf8");
  html = ensureLinks(html);
  const section = projectMapSection();
  if (/<section class="ty16-projects"[\s\S]*?<\/section>/.test(html)) html = html.replace(/<section class="ty16-projects"[\s\S]*?<\/section>/, section);
  else if (/<section class="ty-projects"[\s\S]*?<\/section>/.test(html)) html = html.replace(/<section class="ty-projects"[\s\S]*?<\/section>/, section);
  else {
    const certIndex = html.indexOf('<section class="section yw-why');
    html = certIndex >= 0 ? html.slice(0, certIndex) + section + html.slice(certIndex) : html.replace("</main>", section + "</main>");
  }
  fs.writeFileSync(home, html, "utf8");
}

function detailPage(p) {
  const scopeRow = p.scope ? `<div><span>Supply reference</span><strong>${esc(p.scope)}</strong></div>` : "";
  const body = `<main class="ty16-detail"><section class="ty16-detail-hero"><div class="ty16-detail-shell"><a href="../index.html#global-project-references">← GLOBAL PROJECT REFERENCES</a><p>${esc(p.country || "Project Reference")} · ${esc(p.application || "")}</p><h1>${esc(p.title)}</h1><span>${esc(p.summary)}</span></div></section><section class="ty16-detail-body"><div class="ty16-detail-shell"><div class="ty16-detail-grid"><div class="ty16-detail-copy"><div class="ty16-detail-media"><img src="../${esc(p.imagePath)}" alt="${esc(p.title)} reference visual"></div><h2>Project reference</h2><p>This reference presents project information supported by Tianyu's existing project records and documented project materials.</p><div class="ty16-note">Where a media-library image represents an application category rather than the exact project site, it is used only as contextual visual material.</div></div><div class="ty16-detail-facts"><div><span>Country</span><strong>${esc(p.country || "Not specified")}</strong></div><div><span>Application</span><strong>${esc(p.application || "Not specified")}</strong></div><div><span>Industry</span><strong>${esc(p.industry || "Not specified")}</strong></div><div><span>Scale</span><strong>${esc(p.scale)}</strong></div><div><span>Product</span><strong>${esc(p.product)}</strong></div>${scopeRow}</div></div></div></section></main>`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.title)} | Tianyu Electric</title><meta name="description" content="${esc(p.summary)}"><link rel="stylesheet" href="../assets/css/styles.css"><link rel="stylesheet" href="../assets/css/home-project-map-v16.css"></head><body>${body}</body></html>`;
  assertNoPriceContent(html, `project page ${p.title}`);
  return html;
}
function buildProjectPages() {
  const dir = path.join(dist, "projects");
  fs.rmSync(dir, { recursive: true, force: true });
  ensureDir(dir);
  for (const project of selectedProjects) fs.writeFileSync(path.join(dir, `${project.slug}.html`), detailPage(project), "utf8");
}
function main() {
  if (!fs.existsSync(home)) throw new Error("dist/index.html not found");
  ensureAssets();
  patchHome();
  buildProjectPages();
  console.log(`Global project references rebuilt from ${selectedProjects.length} records with price-like content blocked.`);
}
main();
