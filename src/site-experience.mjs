import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { servicePhases } from './services-data.mjs';
import { factoryAreas } from './factory-data.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read = rel => fs.readFileSync(path.join(dist,rel),'utf8');
const write = (rel,value) => fs.writeFileSync(path.join(dist,rel),value,'utf8');
const sharedHeader = read('about.html').match(/<header class="site-header"[\s\S]*?<\/header>/)?.[0];
const sharedFooter = read('about.html').match(/<footer class="footer"[\s\S]*?<\/footer>/)?.[0];
if (!sharedHeader || !sharedFooter) throw new Error('Shared site header/footer missing');
for(const file of ['site-experience.css','site-experience.js']) fs.copyFileSync(path.join(root,'src',file),path.join(dist,'assets',file.endsWith('.css')?'css':'js',file));
const pages=[];
function visit(dir='') { for(const entry of fs.readdirSync(path.join(dist,dir),{withFileTypes:true})){const rel=path.join(dir,entry.name).replace(/\\/g,'/');if(entry.isDirectory() && !['assets'].includes(entry.name)) visit(rel);else if(entry.isFile()&&entry.name.endsWith('.html')) pages.push(rel)} }
visit();
function relativeMarkup(markup,depth){
  return markup.replace(/\b(href|src)="(?!#|https?:|mailto:|tel:|\/)([^"]+)"/g,(_,a,v)=>`${a}="${depth}${v}"`);
}
function explicitDirectoryEntryLinks(html,rel){
  const pageDir=path.dirname(path.join(dist,rel));
  return html.replace(/\bhref="([^"?#]+\/)"/g,(match,href)=>{
    if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('//')) return match;
    const target=path.resolve(pageDir,href);
    if (!target.startsWith(dist+path.sep) || !fs.existsSync(path.join(target,'index.html'))) return match;
    return `href="${href}index.html"`;
  });
}
function commonShell(html,depth){
  const header=relativeMarkup(sharedHeader,depth).replace(/<button class="btn btn-primary" type="button" data-quote-open>Request a Quote<\/button>/,`<a class="btn btn-primary" href="${depth}contact.html">Request a Quote</a>`);
  const footer=relativeMarkup(sharedFooter,depth);
  if (/<header class="site-header"[\s\S]*?<\/header>/.test(html)) html=html.replace(/<header class="site-header"[\s\S]*?<\/header>/,header);
  else html=html.replace(/<body([^>]*)>/,`<body$1>${header}`);
  if (/<footer class="footer"[\s\S]*?<\/footer>/.test(html)) html=html.replace(/<footer class="footer"[\s\S]*?<\/footer>/,footer);
  else html=html.replace('</body>',`${footer}</body>`);
  if (!/<main[\s>]/.test(html)) html=html.replace(header,`${header}<main class="experience-detail">`).replace(footer,`</main>${footer}`);
  if (!html.includes('assets/js/main.js')&&!html.includes('knowledge.js')) html=html.replace('</body>',`<script src="${depth}assets/js/main.js"></script></body>`);
  return html;
}
const serviceSection=`<section class="experience-service" id="service-stages"><div class="experience-shell"><p class="experience-kicker">PROJECT SUPPORT</p><h2>Discuss the support needed at each project stage.</h2><div class="experience-service-grid">${servicePhases.filter(item=>item.publicationState==='published').map(item=>`<article><small>${esc(item.stage)}</small><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p></article>`).join('')}</div><p class="experience-note">Available support and timing are confirmed for each contract and destination.</p><a class="btn btn-primary" href="contact.html?requestType=Service%20support">Discuss a support requirement →</a></div></section>`;
const factorySection=`<section class="experience-factory" id="production-areas"><div class="experience-shell"><p class="experience-kicker">PRODUCTION AREAS</p><h2>Explore the manufacturing base by area.</h2><div class="experience-factory-grid">${factoryAreas.filter(item=>item.publicationState==='published').map(item=>`<article><img src="assets/media/${esc(item.image)}" alt="${esc(item.imageAlt)}" loading="lazy"><div><h3>${esc(item.name)}</h3><p>${esc(item.summary)}</p></div></article>`).join('')}</div></div></section>`;
for(const rel of pages){
  const depth='../'.repeat(rel.split('/').length-1);
  let html=read(rel);
  if(rel==='services.html'){
    const factsStart=html.indexOf('<div class="ty-project-facts">');
    const factsEnd=html.indexOf('</section>',factsStart);
    if(factsStart<0||factsEnd<0) throw new Error('Service stage summary missing');
    html=html.slice(0,factsStart)+'</div></div>'+html.slice(factsEnd);
    html=html.replace('</main>',`${serviceSection}</main>`);
    html=commonShell(html,depth);
  } else if(rel==='testing.html'||rel.startsWith('projects/')){
    html=commonShell(html,depth);
    if(rel.startsWith('projects/')) html=html.replace('</main>',`<div class="experience-detail-cta"><a href="${depth}applications.html#projects">← All project references</a><a class="btn btn-primary" href="${depth}contact.html?requestType=Project%20inquiry&reference=${encodeURIComponent(path.basename(rel,'.html'))}">Discuss a similar project →</a></div></main>`);
  } else if(rel.startsWith('knowledge/')) html=commonShell(html,depth);
  if(rel==='manufacturing.html') html=html.replace('<section class="mfg34-section white" id="process">',`${factorySection}<section class="mfg34-section white" id="process">`);
  if(rel==='products/prefabricated-substations/index.html') html=html.replace('Choose the platform first','Selected prefabricated substation platforms').replace('</main>',`<div class="experience-family-more"><a href="${depth}products.html#prefabricated-substations">View the complete prefabricated substation range →</a></div></main>`);
  if(rel==='resources.html'){
    html=html.replaceAll('35 / 66 / 110 / 220 kV Power Transformer GA Reference Plate','220 kV Power Transformer Reference Drawing')
      .replaceAll('12 kV Distribution + 40.5 kV Renewable Transformer GA Reference Plate','40.5 kV Renewable Transformer Reference Drawing')
      .replaceAll('Official catalog GA / outline drawings','Selected catalog reference drawings')
      .replace(/<p class="v3-source-note">[\s\S]*?<\/p>/,'<p class="v3-source-note">These drawings support preliminary layout review. Final project drawings are confirmed during engineering review.</p>');
  }
  html=html.replaceAll('assets/media/catalog-v3/ga-power-transformers.webp','assets/media/catalog-assets/drawings/power-transformer-220kv-english-catalog-drawing.png')
    .replaceAll('assets/media/catalog-v3/ga-distribution-renewable.webp','assets/media/catalog-assets/drawings/oil-distribution-40kv-english-drawing.png');
  if(rel==='index.html') html=html.replace('without repeating the same capability metrics','alongside the product and project information above');
  if(rel==='news.html') html=html.replaceAll('LATEST UPDATES','ENGINEERING GUIDES').replaceAll('TRANSFORMER INFORMATION NEWS','Technical Guides & Knowledge').replaceAll('Transformer Information News','Technical Guides & Knowledge').replaceAll('Industry Updates','Technical Resources').replaceAll('Factory, product and project related content.','Drawings, guides and reference information for project discussions.');
  html=html.replace(/(<a\b[^>]*href="(?:\.\.\/)*news\.html"[^>]*>)News(<\/a>)/g,'$1Guides$2');
  if(!html.includes('site-experience.css')) html=html.replace('</head>',`<link rel="stylesheet" href="${depth}assets/css/site-experience.css"></head>`);
  if(!html.includes('site-experience.js')) html=html.replace('</body>',`<script src="${depth}assets/js/site-experience.js" defer></script></body>`);
  html=explicitDirectoryEntryLinks(html,rel);
  write(rel,html);
}
const mirror=read('index.html').replace(/<base\b[^>]*>/gi,'').replace('<head>','<head><base href="dist/">');
fs.writeFileSync(path.join(root,'index.html'),mirror,'utf8');
console.log(`Applied shared site experience to ${pages.length} generated pages.`);
