import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { documents } from './documents-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const files = {
  home: path.join(dist, 'index.html'),
  products: path.join(dist, 'products.html'),
  detail: path.join(dist, 'products', '110kv-power-transformer', 'index.html'),
  manufacturing: path.join(dist, 'manufacturing.html')
};

const sourceAssets = [
  ['visual-system.css', 'assets/css/visual-system.css'],
  ['home.css', 'assets/css/home.css'],
  ['product-directory.css', 'assets/css/product-directory.css'],
  ['product-detail.css', 'assets/css/product-detail.css'],
  ['manufacturing.css', 'assets/css/manufacturing.css'],
  ['visual-behavior.js', 'assets/js/visual-behavior.js']
];

const esc = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

function ensureFile(file) {
  if (!fs.existsSync(file)) throw new Error(`Phase-one visual system missing required page: ${path.relative(root, file)}`);
}

function copyAssets() {
  for (const [sourceName, targetRel] of sourceAssets) {
    const source = path.join(__dirname, sourceName);
    const target = path.join(dist, targetRel);
    if (!fs.existsSync(source)) throw new Error(`Missing visual-system source asset: ${sourceName}`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  }
}

function addBodyClass(html, className) {
  return html.replace(/<body(?: class="([^"]*)")?>/, (_match, classes = '') => {
    const next = new Set(classes.split(/\s+/).filter(Boolean));
    next.add(className);
    return `<body class="${[...next].join(' ')}">`;
  });
}

function migrateStyles(html, cssHrefs, behaviorHref) {
  html = html.replace(/\s*<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi, '');
  const links = cssHrefs.map((href) => `    <link rel="stylesheet" href="${href}">`).join('\n');
  html = html.replace('</head>', `${links}\n</head>`);
  html = html.replace(/\s*<script\b[^>]*src=["'][^"']*visual-behavior\.js["'][^>]*><\/script>/gi, '');
  html = html.replace('</body>', `  <script src="${behaviorHref}"></script>\n</body>`);
  return html;
}

function phaseOneHome(html) {
  html = migrateStyles(html, ['assets/css/visual-system.css', 'assets/css/home.css'], 'assets/js/visual-behavior.js');
  html = addBodyClass(html, 'phase1-home');

  let slideIndex = 0;
  html = html.replace(/<article class="v6-hero-slide[^>]*>[\s\S]*?<\/article>/g, (article) => {
    const currentIndex = slideIndex++;
    let next = article;
    if (currentIndex > 0) next = next.replace('<h1>', '<h2 class="vs-hero-slide-title">').replace('</h1>', '</h2>');
    if (!next.includes('vs-hero-actions')) {
      next = next.replace(/(<span>[\s\S]*?<\/span>)(<\/div>)/, `$1<div class="vs-hero-actions"><a class="vs-button primary" href="products.html">Products</a><button class="vs-button" type="button" data-quote-open>Request RFQ</button></div>$2`);
    }
    return next;
  });

  html = html.replace('<div class="v5-certificate-coverflow">', '<div class="v5-certificate-coverflow" data-phase1-evidence-shelf tabindex="0">');
  return html;
}

function phaseOneProducts(html) {
  html = migrateStyles(html, ['assets/css/visual-system.css', 'assets/css/product-directory.css'], 'assets/js/visual-behavior.js');
  html = addBodyClass(html, 'phase1-products');
  html = html.replace(/<script data-product-carousel>[\s\S]*?<\/script>\s*/g, '');
  html = html.replace('<span><small>Dry-type</small><strong>Up to 35 kV</strong></span>', '<span><small>Special &amp; Renewable</small><strong>Application-specific</strong></span>');
  if (!html.includes('data-product-toggle')) {
    html = html.replace('<div class="v23-carousel-dots">', '<button class="vs-carousel-toggle" type="button" data-product-toggle aria-pressed="false">Pause</button><div class="v23-carousel-dots">');
  }
  return html;
}

function detailDocumentSection() {
  const report = documents.find((document) => document.id === 'power-transformer-50mva-110kv');
  if (!report) throw new Error('Expected 110 kV model-specific report is missing from documents-data.mjs');
  const standards = report.standards?.length ? esc(report.standards.join(', ')) : 'Not specified in the current document metadata';
  return `<section class="vs-documents" id="documents"><div class="v3p-shell"><p class="v3p-kicker">Standards &amp; Documents</p><h2 class="v3p-title">Model-specific evidence for technical review</h2><p>This report is evidence for the tested model shown below. It is not presented as certification of the full 110 kV product family.</p><div class="vs-doc-grid"><article class="vs-doc-card"><small>${esc(report.type === 'test-report' ? 'Test Report' : report.type)}</small><h3>${esc(report.title)}</h3><dl class="vs-doc-meta"><dt>Report number</dt><dd>${esc(report.reportNo)}</dd><dt>Tested model</dt><dd>${esc(report.testedModel)}</dd><dt>Rated capacity</dt><dd>${esc(report.ratedPower)}</dd><dt>Rated voltage</dt><dd>${esc(report.ratedVoltage)}</dd><dt>Testing organization</dt><dd>${esc(report.issuer)}</dd><dt>Standard field</dt><dd>${standards}</dd></dl><div class="vs-doc-actions"><a class="vs-button primary" href="../../assets/media/${esc(report.pdf)}" target="_blank" rel="noopener">Open report PDF</a><a class="vs-button" href="../../resources.html#certificates">All reports</a></div><p class="vs-doc-note">Applicability is limited to the tested model and report record. Project specifications should be reviewed separately.</p></article><article class="vs-doc-card"><small>Engineering Drawing</small><h3>Reference outline drawing</h3><p>The drawing shown in the product gallery is a reference outline view. Final dimensions and interfaces are issued against the approved project design.</p><div class="vs-doc-actions"><a class="vs-button" href="#drawings">View reference drawing</a><button class="vs-button primary" type="button" data-quote-open>Request project drawing</button></div></article></div></div></section>`;
}

function relatedProductsSection() {
  return `<section class="vs-related" id="related"><div class="v3p-shell"><p class="v3p-kicker">Related Products</p><h2 class="v3p-title">Adjacent power-transformer voltage classes</h2><div class="vs-related-grid"><a class="vs-related-card" href="../35kv-power-transformer/"><small>Power Transformer</small><strong>35 kV Oil-Immersed Power Transformer</strong><span>View product →</span></a><a class="vs-related-card" href="../66kv-power-transformer/"><small>Power Transformer</small><strong>66 kV Oil-Immersed Power Transformer</strong><span>View product →</span></a><a class="vs-related-card" href="../220kv-power-transformer/"><small>Power Transformer</small><strong>220 kV Three-Winding Power Transformer</strong><span>View product →</span></a></div></div></section>`;
}

function phaseOneDetail(html) {
  html = migrateStyles(html, ['../../assets/css/visual-system.css', '../../assets/css/product-detail.css'], '../../assets/js/visual-behavior.js');
  html = addBodyClass(html, 'phase1-detail');

  html = html.replace(/(<div class="v3p-hero-proof">[\s\S]*?<\/div>)(<nav class="v3p-family-nav">)/, `$1<div class="vs-detail-hero-actions"><button class="vs-button primary" type="button" data-quote-open>Request RFQ</button><a class="vs-button" href="#ratings">View ratings</a></div>$2`);
  const jump = '<nav class="vs-detail-jump" aria-label="Product page sections"><div class="vs-detail-jump-inner"><a href="#ratings">Ratings</a><a href="#applications">Applications</a><a href="#engineering">Engineering</a><a href="#drawings">Photos & Drawings</a><a href="#documents">Standards & Documents</a><a href="#related">Related Products</a><a href="#contact-rfq">RFQ</a></div></nav>';
  html = html.replace(/(<section class="v3p-hero">[\s\S]*?<\/section>)/, `$1${jump}`);

  html = html.replace('<section class="v3p-section"><div class="v3p-shell"><p class="v3p-kicker">Technical Range</p>', '<section class="v3p-section" id="ratings"><div class="v3p-shell"><p class="v3p-kicker">Technical Range</p>');
  html = html.replace('<section class="v3p-section v3p-soft"><div class="v3p-shell v3p-two-col">', '<section class="v3p-section v3p-soft" id="applications"><div class="v3p-shell v3p-two-col">');
  html = html.replace('<p class="v3p-kicker">Application</p>', '<p class="v3p-kicker">Applications</p>');
  html = html.replace(/(<p class="v3p-kicker">Engineering Characteristics<\/p><h2>Platform features<\/h2><ul class="v3p-list">[\s\S]*?<\/ul>)/, `$1<div class="vs-config-link"><button class="vs-button" type="button" data-quote-open>Request project configuration review</button></div>`);
  html = html.replace('<section class="v3p-section"><div class="v3p-shell"><p class="v3p-kicker">Product & Engineering Views</p>', '<section class="v3p-section" id="drawings"><div class="v3p-shell"><p class="v3p-kicker">Product & Engineering Views</p>');
  html = html.replace(/<figure class="v3p-photo drawing"><img src="\.\.\/\.\.\/assets\/media\/catalog-v3\/ga-power-transformers\.webp" alt="[^"]+" loading="lazy"><\/figure>/, '<figure class="v3p-photo drawing"><button class="vs-drawing-open" type="button" data-drawing-open data-drawing-src="../../assets/media/catalog-v3/ga-power-transformers.webp" data-drawing-title="110 kV reference outline drawing"><img src="../../assets/media/catalog-v3/ga-power-transformers.webp" alt="110 kV reference outline drawing" loading="lazy"></button><figcaption>Reference outline drawing. Final project drawing is issued against the approved design.</figcaption></figure>');
  html = html.replace('<section class="v3p-cta">', `${detailDocumentSection()}${relatedProductsSection()}<section class="v3p-cta" id="contact-rfq">`);
  return html;
}

function phaseOneManufacturing(html) {
  html = migrateStyles(html, ['assets/css/visual-system.css', 'assets/css/manufacturing.css'], 'assets/js/visual-behavior.js');
  html = addBodyClass(html, 'phase1-manufacturing');
  html = html.replace(/\s*<script\b[^>]*src=["']assets\/js\/manufacturing-v34\.js["'][^>]*><\/script>/g, '');
  return html;
}

function writeRootMirror(homeHtml) {
  let mirror = homeHtml.replace(/\s*<base href="dist\/">/g, '');
  mirror = mirror.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n    <base href="dist/">');
  fs.writeFileSync(path.join(root, 'index.html'), mirror, 'utf8');
}

function assertMigratedPage(rel, html, expectedCss) {
  const styleLinks = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
  if (styleLinks.length !== 2) throw new Error(`${rel} should load exactly two stylesheets, found ${styleLinks.length}`);
  for (const expected of expectedCss) if (!styleLinks.includes(expected)) throw new Error(`${rel} missing migrated stylesheet ${expected}`);
  if (!html.includes('visual-behavior.js')) throw new Error(`${rel} missing visual behavior script`);
}

function main() {
  Object.values(files).forEach(ensureFile);
  copyAssets();

  let home = phaseOneHome(fs.readFileSync(files.home, 'utf8'));
  let products = phaseOneProducts(fs.readFileSync(files.products, 'utf8'));
  let detail = phaseOneDetail(fs.readFileSync(files.detail, 'utf8'));
  let manufacturing = phaseOneManufacturing(fs.readFileSync(files.manufacturing, 'utf8'));

  const ratingRows = detail.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1]?.match(/<tr>/g)?.length || 0;
  if (ratingRows !== 11) throw new Error(`110 kV Rating Range changed unexpectedly: expected 11 rows, found ${ratingRows}`);
  if (!detail.includes('SSZ-6300~63000/110') || !detail.includes('110 / 115 / 121 kV') || !detail.includes('6.3–63 MVA')) {
    throw new Error('110 kV canonical product identity or rating summary was lost');
  }

  assertMigratedPage('dist/index.html', home, ['assets/css/visual-system.css', 'assets/css/home.css']);
  assertMigratedPage('dist/products.html', products, ['assets/css/visual-system.css', 'assets/css/product-directory.css']);
  assertMigratedPage('dist/products/110kv-power-transformer/index.html', detail, ['../../assets/css/visual-system.css', '../../assets/css/product-detail.css']);
  assertMigratedPage('dist/manufacturing.html', manufacturing, ['assets/css/visual-system.css', 'assets/css/manufacturing.css']);

  fs.writeFileSync(files.home, home, 'utf8');
  fs.writeFileSync(files.products, products, 'utf8');
  fs.writeFileSync(files.detail, detail, 'utf8');
  fs.writeFileSync(files.manufacturing, manufacturing, 'utf8');
  writeRootMirror(home);
  console.log('Phase-one visual system applied to homepage, product directory, canonical 110 kV product detail and manufacturing page.');
}

main();
