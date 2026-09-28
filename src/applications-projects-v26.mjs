import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { projects } from "./projects-data.mjs";
import { productById } from "./products-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const pageFile = path.join(dist, "applications.html");
const cssSource = path.join(__dirname, "applications-projects-v26.css");
const cssTarget = path.join(dist, "assets", "css", "applications-projects-v26.css");

const esc = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

if (!fs.existsSync(pageFile)) {
  console.log("Applications redesign skipped: dist/applications.html not found.");
  process.exit(0);
}

fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);

const applicationMeta = {
  "Renewable Energy": {
    label: "Renewable Energy",
    note: "Solar, wind and renewable collection systems"
  },
  "Utility Grid": {
    label: "Utility & Grid",
    note: "Main substations and grid power delivery"
  },
  "Industrial": {
    label: "Industrial",
    note: "Cement, chemical and heavy-industry projects"
  },
  "Infrastructure": {
    label: "Infrastructure",
    note: "Transit, mobile substations and critical facilities"
  },
  "Energy Storage": {
    label: "Energy Storage",
    note: "Grid-scale storage and supporting power systems"
  }
};

const applicationOrder = ["Renewable Energy", "Utility Grid", "Industrial", "Infrastructure", "Energy Storage"];
const detailLinks = {
  "CEMIG 155 MW Photovoltaic Project": "projects/brazil-cemig-155mw-pv.html",
  "BCL Hattar Line 2 7200 TPD Cement Plant": "projects/pakistan-bcl-hattar-cement.html",
  "Atlantic Industrial Park 132 kV Substation": "projects/nigeria-atlantic-132kv.html",
  "Long Son Company Cement Grinding Project": "projects/vietnam-long-son-cement.html",
  "Methanol Dayyer Mobile Substation Export Project": "projects/uae-methanol-mobile-substation.html",
  "Sunshare Nambala 100 MW Solar Project": "projects/zambia-sunshare-nambala-solar.html",
  "CMOC Mining Area 500 MW Solar Project": "projects/drc-cmoc-mining-solar.html"
};

const featuredPresentation = [
  {
    country: "Brazil",
    name: "CEMIG 155 MW Photovoltaic Project",
    application: "Renewable Energy",
    scale: "155 MW",
    image: "assets/media/applications/catalog-brazil-pv-export-project.png",
    href: "projects/brazil-cemig-155mw-pv.html"
  },
  {
    country: "Nigeria",
    name: "Atlantic Industrial Park 132 kV Substation",
    application: "Utility Grid",
    scale: "132 kV",
    image: "assets/media/applications/catalog-grid-110kv-substation-project.png",
    href: "projects/nigeria-atlantic-132kv.html"
  },
  {
    country: "Zambia",
    name: "Sunshare Nambala 100 MW Solar Project",
    application: "Renewable Energy",
    scale: "100 MW",
    image: "assets/media/applications/utility-scale-solar-farm-aerial-01.jpeg",
    href: "projects/zambia-sunshare-nambala-solar.html"
  },
  {
    country: "United Arab Emirates",
    name: "Methanol Dayyer Mobile Substation Export Project",
    application: "Infrastructure",
    scale: "Project-specific",
    image: "assets/media/applications/industrial-petrochemical-plant.jpeg",
    href: "projects/uae-methanol-mobile-substation.html"
  }
];

const sectorButtons = applicationOrder.map((application, index) => {
  const meta = applicationMeta[application];
  const count = projects.filter((project) => project.application === application).length;
  return `<button class="ap26-sector" type="button" data-ap26-sector="${esc(application)}"><span>${String(index + 1).padStart(2, "0")} · ${count} PROJECTS</span><strong>${esc(meta.label)}</strong><small>${esc(meta.note)}</small><b>EXPLORE ↓</b></button>`;
}).join("");

const featuredCards = featuredPresentation.map((presentation) => {
  const project = projects.find((item) => item.name === presentation.name);
  if (!project) throw new Error(`Featured project missing from project library: ${presentation.name}`);
  return `<a class="ap26-feature-card" href="${esc(presentation.href)}"><img src="${esc(presentation.image)}" alt="${esc(project.name)}"><div class="ap26-feature-copy"><small>${esc(project.country || "Project reference")}</small><strong>${esc(project.name)}</strong><div class="ap26-feature-meta"><span>${esc(project.application)}</span><span>${esc(project.capacity || project.industry)}</span></div></div></a>`;
}).join("");

const productIds = [...new Set(projects.map((project) => project.productIds?.[0]).filter(Boolean))];
const productOptions = productIds.map((id) => {
  const product = productById.get(id);
  return `<option value="${esc(id)}">${esc(product?.name || id)}</option>`;
}).join("");

const filterTabs = [`<button class="is-active" type="button" data-ap26-filter="all" aria-pressed="true">All</button>`]
  .concat(applicationOrder.map((application) => `<button type="button" data-ap26-filter="${esc(application)}" aria-pressed="false">${esc(applicationMeta[application].label)}</button>`))
  .join("");

const projectCards = projects.map((project, index) => {
  const productId = project.productIds?.[0] || "";
  const product = productById.get(productId);
  const country = project.country || "Location not specified";
  const detailHref = detailLinks[project.name];
  const metaScale = project.capacity || project.industry || "Project-specific";
  const body = `<div class="ap26-card-top"><span class="ap26-card-country">${esc(country)}</span><span class="ap26-card-index">${String(index + 1).padStart(2, "0")}</span></div><h3>${esc(project.name)}</h3><div class="ap26-card-meta"><div><span>Application</span><strong>${esc(applicationMeta[project.application]?.label || project.application)}</strong></div><div><span>Scale / Sector</span><strong>${esc(metaScale)}</strong></div><div><span>Product</span><strong>${esc(product?.shortName || product?.name || productId)}</strong></div><div><span>Industry</span><strong>${esc(project.industry || "Power Infrastructure")}</strong></div></div>${detailHref ? `<span class="ap26-card-link">View project →</span>` : ""}`;
  const attrs = `class="ap26-card" data-ap26-project data-application="${esc(project.application)}" data-product="${esc(productId)}" data-country="${esc(project.country || "")}" data-search="${esc(`${project.name} ${project.country || ""} ${project.industry || ""}`.toLowerCase())}"`;
  return detailHref ? `<a ${attrs} href="${esc(detailHref)}">${body}</a>` : `<article ${attrs}>${body}</article>`;
}).join("");

const main = `<main class="ap26-main">
  <section class="ap26-hero">
    <div class="ap26-hero-copy">
      <p class="ap26-kicker">Applications &amp; Project References</p>
      <h1>Power equipment across utility, renewable and industrial projects.</h1>
      <p class="ap26-hero-lead">Explore transformer and prefabricated-substation experience by application, market and product platform.</p>
      <div class="ap26-hero-stats"><div><strong>${projects.length}</strong><span>Project references</span></div><div><strong>${applicationOrder.length}</strong><span>Application sectors</span></div></div>
    </div>
    <div class="ap26-hero-media">
      <div class="ap26-hero-main"><img src="assets/media/applications/catalog-brazil-pv-export-project.png" alt="CEMIG photovoltaic project"></div>
      <div class="ap26-hero-ribbon"><span>Renewable</span><span>Utility</span><span>Industrial</span></div>
      <div class="ap26-hero-caption"><small>Brazil · Renewable Energy</small><strong>CEMIG 155 MW Photovoltaic Project</strong></div>
    </div>
  </section>

  <section class="ap26-sectors" id="application-sectors"><div class="ap26-shell">
    <div class="ap26-section-head"><div><p class="ap26-kicker">Application Sectors</p><h2>Start with the project environment.</h2></div><p>Select a sector to jump directly into the relevant project references.</p></div>
    <div class="ap26-sector-grid">${sectorButtons}</div>
  </div></section>

  <section class="ap26-featured"><div class="ap26-shell">
    <div class="ap26-section-head"><div><p class="ap26-kicker">Selected International Projects</p><h2>Project references across overseas markets.</h2></div><p>Selected utility, renewable, industrial and infrastructure projects with dedicated reference pages.</p></div>
    <div class="ap26-feature-grid">${featuredCards}</div>
  </div></section>

  <section class="ap26-library" id="projects"><div class="ap26-shell">
    <div class="ap26-library-head"><div><p class="ap26-kicker">Project Library</p><h2>Browse all project references</h2></div><div class="ap26-library-count"><strong data-ap26-count>${projects.length}</strong> matching projects</div></div>
    <div class="ap26-filterbar">
      <div class="ap26-filter-tabs" aria-label="Filter projects by application">${filterTabs}</div>
      <select class="ap26-product-select" data-ap26-product aria-label="Filter projects by product"><option value="all">All product platforms</option>${productOptions}</select>
      <label class="ap26-search-label">Search projects<input type="search" data-ap26-search placeholder="Project name or country" autocomplete="off"></label>
      <button class="ap26-clear" type="button" data-ap26-clear>Clear filters</button>
    </div>
    <div class="ap26-project-grid" data-ap26-grid>${projectCards}</div>
    <button class="ap26-more" type="button" data-ap26-more>Show more projects</button>
  </div></section>

  <section class="ap26-cta"><div class="ap26-shell"><div class="ap26-cta-inner"><div><p class="ap26-kicker">Project Inquiry</p><h2>Have a similar application or project requirement?</h2><p>Send the voltage, capacity, application and site requirements for technical review.</p></div><button class="btn btn-primary" type="button" data-quote-open>Request a Technical Review</button></div></div></section>
</main>`;

const script = `<script>
(() => {
  const cards = [...document.querySelectorAll('[data-ap26-project]')];
  const tabs = [...document.querySelectorAll('[data-ap26-filter]')];
  const sectors = [...document.querySelectorAll('[data-ap26-sector]')];
  const product = document.querySelector('[data-ap26-product]');
  const count = document.querySelector('[data-ap26-count]');
  const grid = document.querySelector('[data-ap26-grid]');
  const search = document.querySelector('[data-ap26-search]');
  const more = document.querySelector('[data-ap26-more]');
  const clear = document.querySelector('[data-ap26-clear]');
  let application = 'all';
  let limit = 12;
  const stateKey = 'tianyu-project-library-state';
  try {
    const saved = JSON.parse(sessionStorage.getItem(stateKey) || '{}');
    if (tabs.some(tab => tab.dataset.ap26Filter === saved.application)) application = saved.application;
    if (product && [...product.options].some(option => option.value === saved.product)) product.value = saved.product;
    if (search && typeof saved.search === 'string') search.value = saved.search;
    if (Number.isInteger(saved.limit) && saved.limit >= 12) limit = Math.min(saved.limit, cards.length);
  } catch { /* A fresh view remains available if storage is unavailable. */ }

  const apply = () => {
    let matching = 0;
    cards.forEach((card) => {
      const matchesApplication = application === 'all' || card.dataset.application === application;
      const matchesProduct = !product || product.value === 'all' || card.dataset.product === product.value;
      const matchesSearch = !search?.value.trim() || (card.dataset.search || '').includes(search.value.trim().toLowerCase());
      const eligible = matchesApplication && matchesProduct && matchesSearch;
      if (eligible) matching += 1;
      const show = eligible && matching <= limit;
      card.hidden = !show;
    });
    if (count) count.textContent = matching;
    if (more) more.hidden = matching <= limit;
    tabs.forEach((tab) => {
      const active = tab.dataset.ap26Filter === application;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    sectors.forEach((sector) => sector.classList.toggle('is-active', sector.dataset.ap26Sector === application));
    let empty = grid?.querySelector('.ap26-empty');
    if (matching === 0 && grid && !empty) {
      empty = document.createElement('div');
      empty.className = 'ap26-empty';
      empty.textContent = 'No projects match the selected filters.';
      grid.appendChild(empty);
    } else if (matching > 0 && empty) empty.remove();
    try { sessionStorage.setItem(stateKey, JSON.stringify({application, product: product?.value || 'all', search: search?.value || '', limit})); } catch {}
  };

  tabs.forEach((tab) => tab.addEventListener('click', () => { application = tab.dataset.ap26Filter; limit = 12; apply(); }));
  sectors.forEach((sector) => sector.addEventListener('click', () => {
    application = sector.dataset.ap26Sector;
    limit = 12; apply();
    document.querySelector('#projects')?.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
  }));
  product?.addEventListener('change', () => { limit = 12; apply(); });
  search?.addEventListener('input', () => { limit = 12; apply(); });
  more?.addEventListener('click', () => { limit += 12; apply(); });
  clear?.addEventListener('click', () => { application = 'all'; product.value = 'all'; search.value = ''; limit = 12; apply(); });
  apply();
})();
</script>`;

let html = fs.readFileSync(pageFile, "utf8");
html = html.replace(/<body class="([^"]*)">/, '<body class="$1 ap26-projects-page">');
if (!html.includes("applications-projects-v26.css")) html = html.replace("</head>", '  <link rel="stylesheet" href="assets/css/applications-projects-v26.css">\n</head>');
html = html.replace(/<main>[\s\S]*?<\/main>/, main);
html = html.replace(/<script>\s*\(\(\) => \{\s*const cards = \[\.\.\.document\.querySelectorAll\('\[data-ap26-project\]'\)\][\s\S]*?<\/script>\s*/g, "");
html = html.replace("</body>", `${script}\n</body>`);

fs.writeFileSync(pageFile, html, "utf8");
console.log(`Redesigned applications page with ${projects.length} project references and ${applicationOrder.length} application sectors.`);
