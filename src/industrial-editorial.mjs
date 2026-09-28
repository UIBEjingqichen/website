import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const read = rel => fs.readFileSync(path.join(dist, rel), 'utf8');
const write = (rel, value) => fs.writeFileSync(path.join(dist, rel), value, 'utf8');

function sectionRange(html, className) {
  const start = html.search(new RegExp(`<section\\b[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>`, 'i'));
  if (start < 0) return null;
  const tags = /<\/?section\b[^>]*>/gi;
  tags.lastIndex = start;
  let depth = 0;
  for (let match; (match = tags.exec(html));) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return [start, tags.lastIndex];
  }
  throw new Error(`Unclosed section ${className}`);
}
function replaceSection(html, className, replacement) {
  const range = sectionRange(html, className);
  if (!range) throw new Error(`Section ${className} missing`);
  return html.slice(0, range[0]) + replacement + html.slice(range[1]);
}
function afterSection(html, className, addition) {
  const range = sectionRange(html, className);
  if (!range) throw new Error(`Section ${className} missing`);
  return html.slice(0, range[1]) + addition + html.slice(range[1]);
}

let home = read('index.html');
const previousHeroRange = sectionRange(home, 'v6-hero');
const previousFlowRange = sectionRange(home, 'ty-energy-flow-wrap');
if (!previousHeroRange || !previousFlowRange) throw new Error('Previous homepage hero or energy flow missing');
const previousHero = home.slice(...previousHeroRange);
const previousFlow = home.slice(...previousFlowRange);
home = replaceSection(home, 'ty-energy-flow-wrap', '');
home = replaceSection(home, 'v6-hero', `${previousHero}${previousFlow}<section class="ie-hero" aria-labelledby="ie-home-title">
  <div class="ie-shell ie-hero-grid">
    <div class="ie-hero-copy"><p class="ie-eyebrow">TIANYU ELECTRIC · TRANSFORMER MANUFACTURING</p>
      <h1 id="ie-home-title">Power transformers for utility, renewable and industrial projects.</h1>
      <p>Power, distribution and project-engineered transformer platforms, supported by manufacturing and test evidence from Fuzhou.</p>
      <div class="ie-actions"><a class="ie-button" href="products.html">Explore products</a><a class="ie-button ie-button-secondary" href="contact.html">Discuss a specification</a></div>
      <p class="ie-hero-detail">35–220 kV power-transformer platforms · Distribution transformers · Prefabricated substations</p>
    </div>
    <figure class="ie-hero-media"><img src="assets/media/products/classified/110kv-power-transformer/01.png" alt="110 kV power transformer in Tianyu's manufacturing facility" width="1200" height="900" fetchpriority="high"><figcaption>110 kV power transformer · Tianyu manufacturing facility</figcaption></figure>
  </div>
</section>`);
home = replaceSection(home, 'ty-product-showcase', `<section class="ie-home-products" id="products"><div class="ie-shell">
  <div class="ie-section-head"><div><p class="ie-eyebrow">PRODUCT RANGE</p><h2>Choose by equipment and voltage class.</h2></div><a class="ie-text-link" href="products.html">View complete product directory →</a></div>
  <nav class="ie-family-links" aria-label="Product families">
    <a href="products.html#power-transformers"><span>01</span><strong>Power Transformers</strong><small>35–220 kV platforms</small></a>
    <a href="products.html#distribution-transformers"><span>02</span><strong>Distribution Transformers</strong><small>Oil-immersed and dry-type</small></a>
    <a href="products.html#prefabricated-substations"><span>03</span><strong>Prefabricated Substations</strong><small>Project-engineered systems</small></a>
  </nav>
  <div class="ie-feature-grid">
    <a href="products/35kv-power-transformer/index.html"><img src="assets/media/products/classified/35kv-power-transformer/01.png" alt="35 kV oil-immersed power transformer" loading="lazy"><span>35 kV class</span><strong>Oil-Immersed Power Transformer</strong><small>8–31.5 MVA</small></a>
    <a href="products/66kv-power-transformer/index.html"><img src="assets/media/products/classified/66kv-power-transformer/01.png" alt="66 kV oil-immersed power transformer" loading="lazy"><span>66 kV class</span><strong>Oil-Immersed Power Transformer</strong><small>6.3–63 MVA</small></a>
    <a href="products/110kv-power-transformer/index.html"><img src="assets/media/products/classified/110kv-power-transformer/01.png" alt="110 kV three-winding power transformer" loading="lazy"><span>110 kV class</span><strong>Three-Winding Power Transformer</strong><small>6.3–63 MVA</small></a>
    <a href="products/220kv-power-transformer/index.html"><img src="assets/media/products/classified/220kv-power-transformer/01.png" alt="220 kV three-winding power transformer" loading="lazy"><span>220 kV class</span><strong>Three-Winding Power Transformer</strong><small>31.5–240 MVA</small></a>
  </div></div></section>`);
home = home.replace('Hover to preview · Click to open project details', 'Select a point for project details');
write('index.html', home);

let testing = read('testing.html');
testing = afterSection(testing, 'ty-project-detail-hero', `<section class="ie-test-evidence"><div class="ie-shell"><div class="ie-section-head"><div><p class="ie-eyebrow">TESTING FACILITY</p><h2>Equipment and records behind verification.</h2></div><a class="ie-text-link" href="resources.html#certificates">Find model-specific reports →</a></div><div class="ie-test-grid"><figure><img src="assets/media/factory/large-transformer-test-station.png" alt="Large transformer test station at Tianyu" loading="lazy"><figcaption>Large transformer test station · Routine and project-specified tests</figcaption></figure><figure><img src="assets/media/factory/lightning-impulse-test-equipment.png" alt="Lightning impulse test equipment" loading="lazy"><figcaption>Lightning impulse equipment · Test scope is defined by the applicable standard and project specification</figcaption></figure></div></div></section>`);
write('testing.html', testing);

let quality = read('quality.html');
const evidence = [...quality.matchAll(/<article class="evidence-card"[\s\S]*?<\/article>/g)].map(match => match[0]);
if (evidence.length < 15) throw new Error('Expected model-specific reports on quality page');
const proof = [1, 8, 14].map(index => {
  const card = evidence[index];
  const img = card.match(/<img\b[^>]*src="([^"]+)"/)?.[1];
  const title = card.match(/<h3>([\s\S]*?)<\/h3>/)?.[1];
  const report = card.match(/<a class="text-link" href="([^"]+)"/)?.[1];
  const rating = card.match(/<h3>[\s\S]*?<\/h3>\s*<p>([\s\S]*?)<\/p>/)?.[1];
  if (!img || !title || !report || !rating) throw new Error(`Incomplete report evidence at index ${index}`);
  return `<article class="ie-proof"><a href="${report}" target="_blank" rel="noopener"><img src="${img}" alt="Cover of ${title}" loading="lazy"><span>${rating}</span><strong>${title}</strong><span class="ie-proof-action">View report →</span></a></article>`;
}).join('');
quality = replaceSection(quality, 'evidence-section', `<section class="ie-quality-evidence" aria-labelledby="ie-quality-title"><div class="ie-shell"><div class="ie-section-head"><div><p class="ie-eyebrow">THIRD-PARTY EVIDENCE</p><h2 id="ie-quality-title">Evidence tied to a tested model.</h2><p class="ie-section-intro">These examples identify their product and rating. The resource library holds all 19 supplied report files, with model and document filters.</p></div><a class="ie-text-link" href="resources.html#certificates">Search all reports →</a></div><div class="ie-proof-grid">${proof}</div></div></section>`);
write('quality.html', quality);

let resources = read('resources.html');
const resourceHero = sectionRange(resources, 'v6-hero');
if (!resourceHero) throw new Error('Resources hero missing');
const firstResourceSlide = resources.slice(...resourceHero).match(/<article class="v6-hero-slide active"[\s\S]*?<\/article>/)?.[0];
if (!firstResourceSlide) throw new Error('Resources hero slide missing');
resources = resources.slice(0, resourceHero[0]) + `<section class="v6-hero v6-page-hero ie-static-page-hero"><div class="v6-hero-slides">${firstResourceSlide}</div></section>` + resources.slice(resourceHero[1]);
write('resources.html', resources);

let applications = read('applications.html');
applications = applications.replace('<div class="ap26-hero-caption"><small>Brazil', '<div class="ap26-hero-caption"><small>Project reference photograph · Brazil');
applications = applications.replaceAll('Location not specified', 'Location not provided');
write('applications.html', applications);

const project = 'projects/brazil-cemig-155mw-pv.html';
let detail = read(project);
detail = detail.replace('<h2>Project reference</h2>', '<p class="ie-photo-note">Project reference photograph supplied with Tianyu materials. It shows personnel with equipment; it is not identified as an installation-site photograph.</p><h2>Project reference</h2>');
write(project, detail);

let contact = read('contact.html');
contact = contact.replace('<div><h2>What helps the review</h2>', '<div class="ie-inquiry-help"><h2>What helps the review</h2>');
write('contact.html', contact);

const css = fs.readFileSync(path.join(root, 'src', 'industrial-editorial.css'), 'utf8');
fs.writeFileSync(path.join(dist, 'assets', 'css', 'industrial-editorial.css'), css);
const optimizedRoot = path.join(root, 'src', 'optimized-media');
const optimized = [
  'products/classified/35kv-power-transformer/01.png',
  'products/classified/66kv-power-transformer/01.png',
  'products/classified/110kv-power-transformer/01.png',
  'products/classified/110kv-power-transformer/02.png',
  'products/classified/220kv-power-transformer/01.png',
  'factory/large-oil-transformer-winding-line.png',
  'factory/large-transformer-test-station.png',
];
for (const original of optimized) {
  const replacement = original.replace(/\.png$/, '.webp');
  const target = path.join(dist, 'assets', 'media', 'optimized', replacement);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(optimizedRoot, replacement), target);
}
function visit(dir = '') {
  for (const entry of fs.readdirSync(path.join(dist, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory() && entry.name !== 'assets') visit(rel);
    else if (entry.isFile() && rel.endsWith('.html')) {
      let html = read(rel);
      const depth = '../'.repeat(rel.split('/').length - 1);
      for (const original of optimized) {
        html = html.replaceAll(`assets/media/${original}`, `assets/media/optimized/${original.replace(/\.png$/, '.webp')}`);
      }
      let imageIndex = 0;
      html = html.replace(/<img\b[^>]*>/g, tag => {
        const first = imageIndex++ === 0;
        if (!/\bdecoding=/.test(tag)) tag = tag.replace(/>$/, ' decoding="async">');
        if (!first && !/\bloading=/.test(tag)) tag = tag.replace(/>$/, ' loading="lazy">');
        if (first && !/\bfetchpriority=/.test(tag)) tag = tag.replace(/>$/, ' fetchpriority="high">');
        return tag;
      });
      if (!html.includes('industrial-editorial.css')) {
        html = html.replace('</head>', `<link rel="stylesheet" href="${depth}assets/css/industrial-editorial.css"></head>`);
      }
      write(rel, html);
    }
  }
}
visit();
// The root mirror is part of the existing build contract.
const mirror = read('index.html').replace(/<base\b[^>]*>/gi, '').replace('<head>', '<head><base href="dist/">');
fs.writeFileSync(path.join(root, 'index.html'), mirror, 'utf8');
console.log('Applied Industrial Editorial layout and shared design contract.');
