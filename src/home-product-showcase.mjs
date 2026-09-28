import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const directory = fs.readFileSync(path.join(dist, 'products.html'), 'utf8');
const familyDefs = [
  { id: 'power-transformers' },
  { id: 'distribution-transformers' },
  { id: 'prefabricated-substations' },
];
const clean = value => value.replace(/\uFFFD(?:C)?/g, '–').replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const attr = (html, name) => html.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] || '';

const families = familyDefs.map((family, familyIndex) => {
  const start = directory.indexOf(`id="${family.id}"`);
  if (start < 0) throw new Error(`Product family missing from directory: ${family.id}`);
  const next = directory.indexOf('<div class="v12-directory-group"', start + family.id.length);
  const block = directory.slice(start, next < 0 ? undefined : next);
  const cardMatches = [...block.matchAll(/<a class="(?:v3p-platform-card|catalog-v8-family-card)"[^>]*>[\s\S]*?<\/a>/g)];
  const items = cardMatches.map(([card], itemIndex) => {
    const href = attr(card.match(/<a\b[^>]*>/)?.[0] || '', 'href');
    const imageTag = card.match(/<img\b[^>]*>/)?.[0] || '';
    const image = attr(imageTag, 'src');
    const title = clean(attr(imageTag, 'alt'));
    if (!href.startsWith('products/') || !image.startsWith('assets/') || !title) throw new Error(`Incomplete product card in ${family.id}`);
    if (!fs.existsSync(path.join(dist, ...href.split('/'), 'index.html'))) throw new Error(`Product detail missing: ${href}`);
    if (!fs.existsSync(path.join(dist, ...image.split('/')))) throw new Error(`Product image missing: ${image}`);
    return { href, image, title };
  });
  if (items.length < 2) throw new Error(`Expected product subcategories in ${family.id}`);
  return { ...family, items };
});

const products = families.flatMap(family => family.items);
const cards = products.map(product => `<a class="typs-card" data-product-card href="${escapeHtml(product.href)}" aria-label="${escapeHtml(product.title)}"><span class="typs-card-media"><img src="${escapeHtml(product.image)}" alt="" loading="lazy" draggable="false"></span><span class="typs-card-title">${escapeHtml(product.title)}</span></a>`).join('');
const familyEntries = [
  ['01', 'Power Transformers', 'Main transformer platforms', 'products.html#power-transformers'],
  ['02', 'Distribution Transformers', 'Oil-immersed and dry-type ranges', 'products.html#distribution-transformers'],
  ['03', 'Prefabricated Substations', 'Compact and project-engineered systems', 'products.html#prefabricated-substations'],
];
const familyCards = familyEntries.map(([number, title, summary, href]) => `<a class="typs-family" href="${href}"><small>${number} · PRODUCT FAMILY</small><strong>${title}</strong><span>${summary}</span><b>EXPLORE RANGE →</b></a>`).join('');
const section = `<section class="ty-product-showcase" id="products" data-product-showcase><div class="typs-shell"><div class="typs-head"><h2>PRODUCTS</h2><div class="typs-actions"><button class="ty-marquee-toggle" type="button" data-marquee-toggle aria-label="Pause product movement" aria-pressed="false">Ⅱ</button><a href="products.html">VIEW ALL →</a></div></div><div class="typs-family-grid" aria-label="Browse the three product families">${familyCards}</div><div class="typs-carousel"><button class="typs-arrow" type="button" data-typs-prev aria-label="Previous product">←</button><div class="typs-viewport" data-auto-marquee data-marquee-speed="24" aria-label="Product platforms"><div class="typs-rail">${cards}</div></div><button class="typs-arrow" type="button" data-typs-next aria-label="Next product">→</button></div></div></section>`;

for (const file of [path.join(dist, 'index.html'), path.join(root, 'index.html')]) {
  let html = fs.readFileSync(file, 'utf8');
  const oldSection = /<section class="v3p-section v3p-products-home"[\s\S]*?<\/section>/;
  if (!oldSection.test(html)) throw new Error(`Homepage product section missing: ${file}`);
  html = html.replace(oldSection, section);
  const certStage = '<div class="ty-carousel__coverflow-stage" data-ty-coverflow-stage>';
  if (!html.includes(certStage)) throw new Error(`Homepage certificate stage missing: ${file}`);
  html = html.replace(certStage, '<div class="ty-carousel__coverflow-stage" data-ty-coverflow-stage data-auto-marquee data-marquee-speed="17">');
  const certHead = '<div class="ty-home__subhead"><p>CERTIFICATES & TEST REPORTS</p><a href="resources.html">VIEW ALL →</a></div>';
  if (!html.includes(certHead)) throw new Error(`Homepage certificate heading missing: ${file}`);
  html = html.replace(certHead, '<div class="ty-home__subhead"><p>CERTIFICATES & TEST REPORTS</p><div class="ty-cert-actions"><button class="ty-marquee-toggle" type="button" data-marquee-toggle aria-label="Pause certificate movement" aria-pressed="false">Ⅱ</button><a href="resources.html">VIEW ALL →</a></div></div>');
  html = html.replace('</head>', '<link rel="stylesheet" href="assets/css/home-product-showcase.css"></head>');
  html = html.replace('</body>', '<script src="assets/js/home-product-showcase.js" defer></script></body>');
  fs.writeFileSync(file, html, 'utf8');
}
fs.copyFileSync(path.join(root, 'src', 'home-product-showcase.css'), path.join(dist, 'assets', 'css', 'home-product-showcase.css'));
fs.copyFileSync(path.join(root, 'src', 'home-product-showcase.js'), path.join(dist, 'assets', 'js', 'home-product-showcase.js'));
console.log(`Homepage product and certificate rows built with ${products.length} product cards and automatic movement.`);
