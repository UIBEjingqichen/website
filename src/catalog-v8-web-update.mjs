import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderSupplementalProductDetail } from './catalog-v8-product-details.mjs';

// The enriched 2026 PPTX supplies the copy and series tables below. Values are
// catalog ranges; the site's independent reports remain tied to tested models.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const productsDir = path.join(dist, 'products');
const cssName = 'catalog-v8-web-update.css';
const detailCssName = 'catalog-v8-product-details.css';
const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const read = f => fs.readFileSync(f, 'utf8');
const write = (f,s) => { fs.mkdirSync(path.dirname(f), {recursive:true}); fs.writeFileSync(f,s,'utf8'); };
const pageFile = slug => path.join(productsDir, slug, 'index.html');
const media = name => `../../assets/media/${name}`;

const catalogEnrichedSlugs = [
  "35kv-power-transformer",
  "66kv-power-transformer",
  "110kv-power-transformer",
  "220kv-power-transformer",
  "220kv-double-split-booster-transformer",
  "66kv-offshore-wind-nacelle-transformer",
  "35-110kv-mobile-intelligent-substation",
  "oil-immersed-rectifier-transformer",
  "24-pulse-phase-shifting-transformer",
  "12kv-oil-immersed-distribution-transformer",
  "dry-type-distribution-transformer",
  "amorphous-alloy-dry-type-transformer",
  "40-5kv-new-energy-dry-type-transformer",
  "35kv-large-dry-type-power-transformer",
  "yb-prefabricated-substation",
  "ybh-prefabricated-substation",
  "zgs-prefabricated-substation",
  "pv-ess-integrated-substation"
];

function addCss(html, prefix='../../') { return html.includes(cssName) ? html : html.replace('</head>', `<link rel="stylesheet" href="${prefix}assets/css/${cssName}"></head>`); }
for (const slug of catalogEnrichedSlugs) {
  const file=pageFile(slug);
  if (!fs.existsSync(file)) throw new Error(`Missing product page: ${slug}`);
  write(file,addCss(read(file)));
}

// The enriched catalog carries an SC(B)H17 / H19 capacity ladder that the
// previous website reduced to a broad family claim.
const amorphousRows = [
  ['30','50','60','640','1.6','4'],['50','60','75','900','1.4','4'],
  ['80','85','100','1,240','1.3','4'],['100','90','110','1,415','1.2','4'],
  ['125','105','130','1,665','1.1','4'],['160','120','145','1,915','1.1','4'],
  ['200','140','170','2,275','1.0','4'],['250','160','195','2,485','1.0','4'],
  ['315','195','235','3,125','0.9','4'],['400','215','265','3,590','0.8','4'],
  ['500','250','305','4,390','0.8','4'],['630*','295','360','5,290','0.7','4'],
  ['630','290','350','5,365','0.7','6–8'],['800','335','410','6,265','0.7','6–8'],
  ['1,000','385','470','7,315','0.6','6–8'],['1,250','455','550','8,720','0.6','6–8'],
  ['1,600','530','645','10,555','0.6','6–8'],['2,000','700','850','13,005','0.5','6–8'],
  ['2,500','840','1,020','15,445','0.5','6–8']
];
{
  const file=pageFile('amorphous-alloy-dry-type-transformer');
  let html=read(file);
  const block=`<section class="ty-product__section" id="catalog-amorphous-parameters"><div class="ty-product__shell"><p class="ty-product__kicker">SC(B)H17 / SC(B)H19</p><h2 class="ty-product__title">Published amorphous-alloy series values</h2><p>10 / 10.5 / 11 kV to 0.4 kV · ±5% or ±2×2.5% taps · Yyn0 or Dyn11. Load loss is shown at 155°C; the catalog also lists 130°C and 180°C columns.</p>${table(['Capacity (kVA)','H19 no-load loss (W)','H17 no-load loss (W)','Load loss at 155°C (W)','I0 (%)','Z (%)'],amorphousRows)}<p class="ty-product__mini-note">The two 630 kVA entries are distinct rows in the source catalog. Confirm the intended configuration before selection.</p></div></section>`;
  const cta=html.indexOf('<section class="ty-product__cta"');
  html=cta>=0?html.slice(0,cta)+block+html.slice(cta):html.replace('</main>',block+'</main>');
  write(file,html);
}

const sz20Rows = [
  ['200','215','2,185 / 2,080','0.7','4.0'],['400','370','3,615 / 3,440','0.7','4.0'],
  ['500','430','4,330 / 4,120','0.7','4.0'],['630','510','4,960','0.6','4.5'],
  ['800','630','6,000','0.6','4.5'],['1,000','745','8,240','0.6','4.5'],
  ['1,250','870','9,600','0.5','4.5'],['1,600','1,050','11,600','0.5','4.5'],
  ['2,000','1,225','14,640','0.4','5.0'],['2,500','1,440','16,960','0.4','5.0']
];
const newPages = [
  {slug:'sz20-on-load-oil-immersed-transformer',title:'SZ20 On-Load Oil-Immersed Transformer',family:'Distribution Transformers',familyHref:'oil-immersed-distribution-transformer',range:'200–2,500 kVA',voltage:'6 / 6.3 / 10 / 10.5 / 11 kV to 0.4 kV',image:'products/distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp',intro:['An on-load tap changer lets the SZ20 adjust its low-voltage output while energized. The series serves distribution networks with fluctuating incoming voltage.',[['Automatic regulation','Tap adjustment helps maintain output voltage without interrupting supply.'],['Operating visibility','The catalog describes optional smart control for voltage, current, power and power factor.']]],specs:[['Tap range','±4 × 2.5%'],['Vector group','Yyn0 / Dyn11'],['Frequency','50 Hz'],['Cooling','ONAN']],columns:['Capacity (kVA)','No-load loss (W)','Load loss (W)','I0 (%)','Z (%)'],rows:sz20Rows,applications:['Rural networks with voltage fluctuation','Industrial and mining supplies','Distribution system upgrades']},
  {slug:'oil-immersed-split-winding-transformer',title:'Oil-Immersed Split-Winding Transformer',family:'Special & Renewable Solutions',familyHref:'special-renewable-solutions',range:'Project engineered',voltage:'Voltage and capacity by project',image:'products/power-transformers/oil-immersed-power-transformer-installed.png',intro:['Separate low-voltage winding branches have no electrical connection and weak magnetic coupling. This arrangement helps limit fault current in large auxiliary and industrial power systems.',[['Fault isolation','A healthy branch can retain about 90% voltage when another branch faults, according to the catalog.'],['Arrangement choice','Radial or axial split designs support through, half-through and split operating modes.']]],specs:[['Winding arrangement','Split low-voltage branches'],['Split geometry','Radial or axial'],['Operating modes','Through / half-through / split']],applications:['Large substation auxiliary supplies','Industrial systems with separate low-voltage branches']},
  {slug:'intelligent-low-noise-dry-type-transformer',title:'Intelligent Low-Noise Dry-Type Transformer',family:'Dry-Type Transformers',familyHref:'cast-resin-dry-type-transformer',range:'Project configuration',voltage:'Voltage and capacity by model',image:'products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg',intro:['An intelligent terminal brings transformer condition monitoring and operating data into one system. It records power quality, temperature, losses and electricity use.',[['Fault response','Alarm handling, data storage and remote transmission support operations teams.'],['Temperature control','Fan control responds to operating conditions and assists maintenance planning.']]],specs:[['Insulation','Dry type'],['Monitoring','Power quality / temperature / losses'],['Control','Alarm / remote transmission / fan control']],applications:['Indoor distribution with remote status needs','Critical facilities and industrial sites']},
  {slug:'zbs-rectifier-transformer',title:'ZBS / ZBSCB Rectifier Transformer',family:'Special & Renewable Solutions',familyHref:'special-renewable-solutions',range:'Project engineered',voltage:'Voltage and capacity by rectifier scheme',image:'products/special-transformers/dry-type-rectifier-transformer-red.jpeg',intro:['ZBS and ZBSCB transformers supply industrial rectification systems. Thermal design accounts for converter overload and additional heating from harmonics.',[['Equipment protection','An earthed screen between high- and low-voltage windings protects rectifier equipment.'],['Fault strength','Low-voltage foil windings support short-circuit performance.']]],specs:[['Duty','Industrial rectifier supply'],['Construction','Dry-type or oil-immersed by model'],['Design inputs','Harmonics / overload / converter scheme']],applications:['Chemical electrolysis and electroplating','Rolling-mill drives','Locomotive DC networks and charging systems']}
];
// Keep every product in the site's established three-family taxonomy.
for (const p of newPages) {
  if (p.slug === 'oil-immersed-split-winding-transformer') {
    p.family='Power Transformers';
    p.familyHref='high-voltage-power-transformer';
  } else if (p.slug === 'intelligent-low-noise-dry-type-transformer' || p.slug === 'zbs-rectifier-transformer') {
    p.family='Distribution Transformers';
    p.familyHref='oil-immersed-distribution-transformer';
  }
}
for (const p of newPages) p.image=`products/catalog-v8/${p.slug}.webp`;

function table(columns,rows){return `<p class="catalog-v8-table-hint">Swipe the table to see all parameters →</p><div class="ty-product__table-wrap"><table class="ty-product__table"><thead><tr>${columns.map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
const template = read(pageFile('110kv-power-transformer'));
for (const p of newPages) {
  let html = template.replace(/<main>[\s\S]*?<\/main>/,renderSupplementalProductDetail(p, sz20Rows));
  html = html.replace('</head>', `<link rel="stylesheet" href="../../assets/css/${detailCssName}"></head>`);
  html = html.replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(p.title)} | Tianyu Electric</title>`)
    .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${esc(p.intro[0])}">`)
    .replace(/<link rel="canonical" href="[^"]*">/,`<link rel="canonical" href="/products/${p.slug}/">`)
    .replace(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${esc(p.title)} | Tianyu Electric">`)
    .replace(/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${esc(p.intro[0])}">`)
    .replace(/<meta property="og:url" content="[^"]*">/,`<meta property="og:url" content="/products/${p.slug}/">`)
    .replace(/<meta property="og:image" content="[^"]*">/,`<meta property="og:image" content="/assets/media/${p.image}">`);
  write(pageFile(p.slug),html);
}

function familyLinks(title,items,prefix,imagePrefix) {
  return `<div class="catalog-v8-family-links"><h4>${esc(title)}</h4><div class="catalog-v8-family-card-grid">${items.map(p=>`<a class="catalog-v8-family-card" href="${prefix}${p.slug}/"><img src="${imagePrefix}${p.image}" alt="${esc(p.title)}" loading="lazy"><span><strong>${esc(p.title)}</strong><small>${esc(p.range)} · ${esc(p.voltage)}</small></span></a>`).join('')}</div></div>`;
}
const powerProducts=newPages.filter(p=>p.family==='Power Transformers');
const distributionProducts=newPages.filter(p=>p.family==='Distribution Transformers');
{
  const file=path.join(dist,'products.html');
  let html=read(file);
  for (const [group,next,items,title] of [
    ['power-transformers','distribution-transformers',powerProducts,'Special power transformer'],
    ['distribution-transformers','prefabricated-substations',distributionProducts,'Distribution and industrial configurations']
  ]) {
    const start=html.indexOf(`<div class="v12-directory-group" id="${group}">`);
    const end=html.indexOf(`<div class="v12-directory-group" id="${next}">`,start);
    if(start<0||end<0) throw new Error(`Directory category missing: ${group}`);
    const segment=html.slice(start,end);
    const close=segment.lastIndexOf('</div>');
    if(close<0) throw new Error(`Directory category cannot be closed: ${group}`);
    html=html.slice(0,start)+segment.slice(0,close)+familyLinks(title,items,'products/','assets/media/')+segment.slice(close)+html.slice(end);
  }
  write(file,addCss(html,''));
}
for (const [slug,items,title] of [
  ['high-voltage-power-transformer',powerProducts,'Special power transformer'],
  ['oil-immersed-distribution-transformer',distributionProducts,'Distribution and industrial configurations'],
  ['cast-resin-dry-type-transformer',newPages.filter(p=>p.slug==='intelligent-low-noise-dry-type-transformer'),'Intelligent dry-type configuration'],
  ['oil-immersed-rectifier-transformer',newPages.filter(p=>p.slug==='zbs-rectifier-transformer'),'Rectifier configuration']
]) {
  const file=pageFile(slug);
  let html=read(file);
  const block=`<section class="ty-product__section"><div class="ty-product__shell">${familyLinks(title,items,'../','../../assets/media/')}</div></section>`;
  const cta=html.indexOf('<section class="ty-product__cta"');
  html=cta>=0?html.slice(0,cta)+block+html.slice(cta):html.replace('</main>',block+'</main>');
  write(file,addCss(html));
}
fs.copyFileSync(path.join(root,'src',cssName),path.join(dist,'assets','css',cssName));
fs.copyFileSync(path.join(root,'src',detailCssName),path.join(dist,'assets','css',detailCssName));
const manifest=path.join(dist,'product-range-pages.json');
if(fs.existsSync(manifest)) { const data=JSON.parse(read(manifest)); data.pages.push(...newPages.map(p=>({slug:p.slug,family:p.family,title:p.title,range:p.range,voltage:p.voltage,source:'Tianyu enriched 2026 catalog / 2026-05-19 catalog'}))); write(manifest,JSON.stringify(data,null,2)+'\n'); }
console.log(`Catalog v8 website update: ${catalogEnrichedSlugs.length} enriched product pages, ${newPages.length} new product pages.`);
