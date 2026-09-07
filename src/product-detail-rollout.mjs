import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { documents } from './documents-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const productIndexPath = path.join(dist, 'product-range-pages.json');

const esc = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

const read = (file) => fs.readFileSync(file, 'utf8');
const write = (file, content) => fs.writeFileSync(file, content, 'utf8');

if (!fs.existsSync(productIndexPath)) throw new Error('dist/product-range-pages.json is missing before product-detail rollout.');
const productIndex = JSON.parse(read(productIndexPath));
const pageMap = new Map(productIndex.pages.map((page) => [page.slug, page]));
const familyMap = new Map(productIndex.families.map((family) => [family.id, family]));

function addBodyClass(html, className) {
  return html.replace(/<body(?: class="([^"]*)")?>/, (_match, classes = '') => {
    const next = new Set(classes.split(/\s+/).filter(Boolean));
    next.add(className);
    next.add('product-detail-standard');
    return `<body class="${[...next].join(' ')}">`;
  });
}

function migrateStyles(html) {
  html = html.replace(/\s*<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi, '');
  html = html.replace('</head>', '    <link rel="stylesheet" href="../../assets/css/visual-system.css">\n    <link rel="stylesheet" href="../../assets/css/product-detail.css">\n</head>');
  html = html.replace(/\s*<script\b[^>]*src=["'][^"']*visual-behavior\.js["'][^>]*><\/script>/gi, '');
  html = html.replace('</body>', '  <script src="../../assets/js/visual-behavior.js"></script>\n</body>');
  return html;
}

function setProductMeta(html, page) {
  const title = `${page.title} | Tianyu Electric`;
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="/products/${esc(page.slug)}/">`);
  return html;
}

function sourceNote(page) {
  return `<p class="vs-source-note"><strong>Published series capability.</strong> Ratings on this page are drawn from ${esc(page.source)} Where a full capacity-by-capacity table is not present in that source, the page keeps only the published scope and does not fill gaps by assumption.</p>`;
}

function exactEvidence(page) {
  if (page.slug === '110kv-power-transformer') {
    return documents.filter((document) => document.productIds?.includes('high-voltage-power-transformer') && document.voltage === '110 kV');
  }
  if (page.slug === '220kv-power-transformer') {
    return documents.filter((document) => document.productIds?.includes('high-voltage-power-transformer') && document.voltage === '220 kV');
  }
  if (page.slug === 'dry-type-distribution-transformer') {
    return documents.filter((document) => document.productIds?.includes('cast-resin-dry-type-transformer'));
  }
  if (page.slug === 'yb-prefabricated-substation') {
    return documents.filter((document) => document.productIds?.includes('dry-type-prefabricated-substation'));
  }
  if (page.slug === 'ybh-prefabricated-substation') {
    return documents.filter((document) => document.productIds?.includes('oil-immersed-prefabricated-substation'));
  }
  if (page.slug === 'zgs-prefabricated-substation') {
    return documents.filter((document) => document.productIds?.includes('american-type-combined-transformer') && document.issuer);
  }
  return [];
}

function evidenceLabel(page) {
  if (['110kv-power-transformer', '220kv-power-transformer'].includes(page.slug)) return 'Exact voltage-class evidence in the current register';
  if (['dry-type-distribution-transformer', 'yb-prefabricated-substation', 'ybh-prefabricated-substation', 'zgs-prefabricated-substation'].includes(page.slug)) return 'Documented reference configurations for this product platform';
  return 'Current evidence register';
}

function evidenceCards(page) {
  const evidence = exactEvidence(page).slice(0, 3);
  if (!evidence.length) {
    return `<article class="vs-doc-card vs-doc-card-muted"><small>Independent Evidence</small><h3>No exact model-specific report is linked to this product page</h3><p>The current evidence library may contain related family-level certificates or reports, but they are not presented here as certification of this exact voltage, capacity or project variant.</p><div class="vs-doc-actions"><a class="vs-button" href="../../resources.html#certificates">Review evidence library</a></div></article>`;
  }
  return evidence.map((document) => {
    const standards = document.standards?.length ? document.standards.join(', ') : 'Not specified in current metadata';
    const type = document.type === 'type-test' ? 'Type Test' : document.type === 'test-report' ? 'Test Report' : document.type === 'certificate' ? 'Certificate' : document.type;
    return `<article class="vs-doc-card"><small>${esc(type)}</small><h3>${esc(document.title)}</h3><dl class="vs-doc-meta"><dt>Report number</dt><dd>${esc(document.reportNo || 'Not specified')}</dd><dt>Tested model</dt><dd>${esc(document.testedModel || 'Not specified')}</dd><dt>Rated capacity</dt><dd>${esc(document.ratedPower || 'Not specified')}</dd><dt>Rated voltage</dt><dd>${esc(document.ratedVoltage || 'Not specified')}</dd><dt>Testing organization</dt><dd>${esc(document.issuer || 'Not specified')}</dd><dt>Standard field</dt><dd>${esc(standards)}</dd></dl><div class="vs-doc-actions"><a class="vs-button primary" href="../../assets/media/${esc(document.pdf)}" target="_blank" rel="noopener">Open report PDF</a><a class="vs-button" href="../../resources.html#certificates">All reports</a></div><p class="vs-doc-note">Evidence applies to the stated tested configuration. Other ratings and project variants require separate technical confirmation.</p></article>`;
  }).join('');
}

function documentsSection(page) {
  return `<section class="vs-documents" id="documents"><div class="v3p-shell"><p class="v3p-kicker">Standards &amp; Documents</p><h2 class="v3p-title">Series data and model-specific evidence are kept separate</h2><p>${esc(evidenceLabel(page))}. The catalog-backed series range is not treated as blanket third-party certification.</p><div class="vs-evidence-ladder" aria-label="Product evidence levels"><div><small>01</small><strong>Published Series Capability</strong><span>${esc(page.voltage)} · ${esc(page.range)}</span></div><div><small>02</small><strong>Reference / Produced Configuration</strong><span>Confirmed against the project technical schedule</span></div><div><small>03</small><strong>Independent Test Evidence</strong><span>Only the exact tested models shown below, where available</span></div></div><div class="vs-doc-grid vs-doc-grid-dynamic"><article class="vs-doc-card vs-catalog-basis"><small>Catalog Data Basis</small><h3>${esc(page.title)}</h3><dl class="vs-doc-meta"><dt>Voltage scope</dt><dd>${esc(page.voltage)}</dd><dt>Capacity / range</dt><dd>${esc(page.range)}</dd><dt>Source</dt><dd>${esc(page.source)}</dd></dl><div class="vs-doc-actions"><a class="vs-button" href="../../catalog.html">Open export catalog</a><button class="vs-button primary" type="button" data-quote-open>Request project schedule review</button></div><p class="vs-doc-note">Published range data describes Tianyu's product platform. Final ratings, interfaces, losses, accessories and documents follow the approved project specification.</p></article>${evidenceCards(page)}</div></div></section>`;
}

function relatedSection(page) {
  const family = familyMap.get(page.family);
  if (!family) return '';
  const peers = family.children.filter((slug) => slug !== page.slug).map((slug) => pageMap.get(slug)).filter(Boolean).slice(0, 3);
  if (!peers.length) return '';
  return `<section class="vs-related" id="related"><div class="v3p-shell"><p class="v3p-kicker">Related Products</p><h2 class="v3p-title">Compare adjacent products in ${esc(family.title)}</h2><div class="vs-related-grid">${peers.map((peer) => `<a class="vs-related-card" href="../${esc(peer.slug)}/"><small>${esc(peer.voltage)}</small><strong>${esc(peer.title)}</strong><span>${esc(peer.range)} · View product →</span></a>`).join('')}</div></div></section>`;
}

function makeDrawingInteractive(html, page) {
  return html.replace(/<figure class="v3p-photo drawing"><img src="([^"]+)" alt="([^"]*)" loading="lazy"><\/figure>/g, (_match, src) => `<figure class="v3p-photo drawing"><button class="vs-drawing-open" type="button" data-drawing-thumb data-drawing-open data-drawing-src="${esc(src)}" data-drawing-title="${esc(page.title)} reference engineering view"><img src="${esc(src)}" alt="${esc(page.title)} reference engineering view" loading="lazy"></button><figcaption>Reference engineering view. Final project dimensions and interfaces are issued against the approved design.</figcaption></figure>`);
}

function normalizeProductPhotos(html) {
  return html.replace(/<figure class="v3p-photo \"><img src="([^"]+)" alt="([^"]*)" loading="lazy"><\/figure>/g, '<figure class="v3p-photo vs-product-photo"><img src="$1" alt="$2" loading="lazy"></figure>');
}

function standardizePage(page) {
  const file = path.join(dist, 'products', page.slug, 'index.html');
  if (!fs.existsSync(file)) throw new Error(`Missing product page: ${page.slug}`);
  let html = read(file);

  const alreadySample = html.includes('phase1-detail');
  if (!alreadySample) {
    html = migrateStyles(html);
    html = addBodyClass(html, 'phase1-detail');
    html = html.replace(/(<div class="v3p-hero-proof">[\s\S]*?<\/div>)(<nav class="v3p-family-nav">)/, `$1<div class="vs-detail-hero-actions"><button class="vs-button primary" type="button" data-quote-open>Request RFQ</button><a class="vs-button" href="#ratings">View ratings</a></div>$2`);
    const jump = '<nav class="vs-detail-jump" aria-label="Product page sections"><div class="vs-detail-jump-inner"><a href="#ratings">Ratings</a><a href="#applications">Applications</a><a href="#engineering">Engineering</a><a href="#drawings">Photos & Drawings</a><a href="#documents">Standards & Documents</a><a href="#related">Related Products</a><a href="#contact-rfq">RFQ</a></div></nav>';
    html = html.replace(/(<section class="v3p-hero">[\s\S]*?<\/section>)/, `$1${jump}`);
    html = html.replace('<section class="v3p-section"><div class="v3p-shell"><p class="v3p-kicker">Technical Range</p>', '<section class="v3p-section" id="ratings"><div class="v3p-shell"><p class="v3p-kicker">Technical Range</p>');
    html = html.replace('<section class="v3p-section v3p-soft"><div class="v3p-shell v3p-two-col">', '<section class="v3p-section v3p-soft" id="applications"><div class="v3p-shell v3p-two-col">');
    html = html.replace('<div><p class="v3p-kicker">Engineering Characteristics</p>', '<div id="engineering"><p class="v3p-kicker">Engineering Characteristics</p>');
    html = html.replace('<p class="v3p-kicker">Application</p>', '<p class="v3p-kicker">Applications</p>');
    html = html.replace(/(<p class="v3p-kicker">Engineering Characteristics<\/p><h2>Platform features<\/h2><ul class="v3p-list">[\s\S]*?<\/ul>)/, `$1<div class="vs-config-link"><button class="vs-button" type="button" data-quote-open>Request project configuration review</button></div>`);
    html = html.replace('<section class="v3p-section"><div class="v3p-shell"><p class="v3p-kicker">Product & Engineering Views</p>', '<section class="v3p-section" id="drawings"><div class="v3p-shell"><p class="v3p-kicker">Product & Engineering Views</p>');
    html = normalizeProductPhotos(html);
    html = makeDrawingInteractive(html, page);
    html = html.replace('<section class="v3p-cta">', `${documentsSection(page)}${relatedSection(page)}<section class="v3p-cta" id="contact-rfq">`);
  } else {
    html = addBodyClass(html, 'phase1-detail');
    if (!html.includes('vs-source-note')) {
      html = html.replace(/(<div class="v3p-table-wrap">[\s\S]*?<\/div>)(<\/div><\/section>)/, `$1${sourceNote(page)}$2`);
    }
  }

  if (!alreadySample && !html.includes('vs-source-note')) {
    const ratingsEnd = /(<div class="v3p-table-wrap">[\s\S]*?<\/div>)(<\/div><\/section>)/;
    if (ratingsEnd.test(html)) html = html.replace(ratingsEnd, `$1${sourceNote(page)}$2`);
    else html = html.replace(/(<div class="v3p-spec-grid">[\s\S]*?<\/div>)(<\/div><\/section>)/, `$1${sourceNote(page)}$2`);
  }

  html = setProductMeta(html, page);
  write(file, html);
  return html;
}

const results = [];
for (const page of productIndex.pages) results.push([page, standardizePage(page)]);

for (const [page, html] of results) {
  const styles = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
  if (styles.length !== 2 || !styles.includes('../../assets/css/visual-system.css') || !styles.includes('../../assets/css/product-detail.css')) {
    throw new Error(`${page.slug} does not use the canonical two-stylesheet product-detail contract.`);
  }
  if (!html.includes('visual-behavior.js')) throw new Error(`${page.slug} is missing visual-behavior.js`);
  if (!html.includes('id="ratings"') || !html.includes('id="applications"') || !html.includes('id="engineering"') || !html.includes('id="drawings"') || !html.includes('id="documents"') || !html.includes('id="related"') || !html.includes('id="contact-rfq"')) {
    throw new Error(`${page.slug} is missing one or more canonical product-detail sections.`);
  }
  if (!html.includes(esc(page.range)) || !html.includes(esc(page.voltage))) throw new Error(`${page.slug} lost catalog-backed range or voltage text.`);
  if (!html.includes('Published series capability')) throw new Error(`${page.slug} is missing the catalog evidence-scope note.`);
}

console.log(`Canonical product-detail rollout applied to ${results.length} catalog-backed product pages.`);
