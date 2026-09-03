import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { products } from "./products-data.mjs";
import { documents } from "./documents-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "..", "dist");
const esc = (v="") => String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slug = (v="") => String(v).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
const asset = (v,p="") => `${p}assets/media/${v}`;

const labels = (html) => html
  .replaceAll("Dry-Type Prefabricated Substation","European-Type Prefabricated Substation")
  .replaceAll("GY Series / China-Type Substation","Compact Prefabricated Substation")
  .replaceAll("Oil-Immersed Prefabricated Substation","Compact Prefabricated Substation")
  .replaceAll("American-Type Combined Transformer","Pad-Mounted Transformer")
  .replaceAll("American-Type / Pad-Mounted Solution","Pad-Mounted Transformer")
  .replaceAll("Enabling Products","Reference Models");

function inject(html,p="") {
  if (!html.includes("ux-refine-v6.css")) html = html.replace("</head>",`    <link rel="stylesheet" href="${p}assets/css/ux-refine-v6.css">\n</head>`);
  if (!html.includes("ux-refine-v6.js")) html = html.replace("</body>",`    <script src="${p}assets/js/ux-refine-v6.js"></script>\n</body>`);
  return labels(html);
}

function hero(kicker,title,text,slides,primary,secondary) {
  return `<section class="v6-hero" data-v6-hero><div class="v6-hero-slides">${slides.map(([img,t,s],i)=>`<article class="v6-hero-slide${i===0?" active":""}" data-v6-hero-slide><img src="${asset(img)}" alt="${esc(t)}"><div class="v6-hero-shade"></div><div class="v6-hero-copy"><p>${esc(kicker)}</p><h1>${esc(i===0?title:t)}</h1><span>${esc(i===0?text:s)}</span><div>${primary?`<a class="btn btn-primary" href="${primary[0]}">${esc(primary[1])}</a>`:""}${secondary?`<a class="v6-hero-link" href="${secondary[0]}">${esc(secondary[1])}</a>`:""}</div></div></article>`).join("")}</div><div class="v6-hero-dots">${slides.map((_,i)=>`<button class="${i===0?"active":""}" type="button" data-v6-hero-dot="${i}" aria-label="Show slide ${i+1}"></button>`).join("")}</div></section>`;
}

function updateHome(){
  const f=path.join(dist,"index.html"); let h=fs.readFileSync(f,"utf8");
  const block=hero("TIANYU ELECTRIC","Power Transformer Solutions","For utility, renewable and industrial power projects.",[
    ["applications/grid-substation-yard.jpeg","Power Transformer Solutions","For utility, renewable and industrial power projects."],
    ["company/factory-campus-panorama.jpeg","Manufacturing & Testing","Production, inspection and engineering support from one manufacturing base."],
    ["applications/renewable-wind-solar-landscape.jpeg","Project Delivery","Reference experience across substations, renewables and industrial distribution."]
  ],["products.html","Explore Products"],["applications.html","View Applications"]);
  h=h.replace(/<section class="home-wave-hero"[\s\S]*?<\/section>/,block); fs.writeFileSync(f,inject(h));
}

const pages={
  "products.html":["PRODUCTS","Transformer Product Range","Explore product families, reference models and exact-model test evidence.",[["evidence/sample-photo-pages/power-transformer-240mva-220kv-ssz22-sample-photo-page.webp","Transformer Product Range","Reference models from distribution transformers to high-voltage power transformers."],["products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp","Prefabricated Substations","European-type, compact oil-immersed and pad-mounted configurations."],["evidence/sample-photo-pages/dry-type-scb18-2500kva-10kv-sample-photo-page.webp","Distribution Solutions","Oil-immersed and dry-type transformer families for project-specific requirements."]],["#products","View Product Families"],["resources.html","Technical Resources"]],
  "applications.html":["APPLICATIONS & PROJECTS","Application References","Utility, renewable and industrial project references.",[["applications/renewable-wind-solar-landscape.jpeg","Application References","Utility, renewable and industrial project references."],["applications/grid-substation-yard.jpeg","Utility & Substation","Main substations and power delivery systems."],["applications/utility-scale-solar-farm-aerial-02.jpeg","Renewable Energy","Wind, solar and energy-storage related projects."]],["#projects","View Projects"],["products.html","Explore Products"]],
  "resources.html":["RESOURCES","Technical Resources","Certificates, test reports, drawings and technical references.",[["company/factory-campus-panorama.jpeg","Technical Resources","Certificates, test reports, drawings and technical references."],["applications/grid-substation-yard.jpeg","Verified Documents","Independent test evidence organized by exact product model."],["applications/renewable-wind-solar-landscape.jpeg","Project Support","Supporting documents for quotation and technical review."]],["#certificates","View Documents"],["products.html","Explore Products"]],
  "about.html":["COMPANY","About Tianyu Electric","Manufacturing, engineering and project support from one primary equipment base.",[["company/factory-campus-panorama.jpeg","About Tianyu Electric","Manufacturing, engineering and project support from one primary equipment base."],["applications/grid-substation-yard.jpeg","Primary Equipment Base","Focused on transformer and substation solutions."],["applications/renewable-wind-solar-landscape.jpeg","Project Capability","Serving utility, renewable and industrial customers."]],["manufacturing.html","View Manufacturing"],["quality.html","Quality"]],
  "news.html":["NEWS","Transformer Information News","Technical reading, application notes and buying guides.",[["applications/grid-substation-yard.jpeg","Transformer Information News","Technical reading, application notes and buying guides."],["applications/renewable-wind-solar-landscape.jpeg","Engineering Notes","Practical information for transformer selection and inquiry preparation."],["company/factory-campus-panorama.jpeg","Industry Updates","Factory, product and project related content."]],["knowledge/index.html","Knowledge Center"],["products.html","Explore Products"]]
};

function updateTopPages(){
  for(const [name,c] of Object.entries(pages)){
    const f=path.join(dist,name); if(!fs.existsSync(f)) continue; let h=fs.readFileSync(f,"utf8"); const block=hero(...c);
    if(name==="products.html") h=h.replace(/<section class="yw-product-banner"[\s\S]*?<\/section>/,block);
    else if(name==="applications.html"||name==="resources.html") h=h.replace(/<section class="page-hero">[\s\S]*?<\/section>/,block);
    else if(name==="about.html") h=h.replace(/<section class="page-image-hero">[\s\S]*?<\/section>/,block);
    else h=h.replace(/<section class="yw-product-banner news-banner"[\s\S]*?<\/section>/,block);
    fs.writeFileSync(f,inject(h));
  }
}

function productDocs(p){const ids=new Set(p.evidenceIds||[]);return documents.filter(d=>ids.has(d.id));}
function variants(p){
  const map=new Map(); for(const d of productDocs(p)){if(!d.testedModel)continue;if(!map.has(d.testedModel))map.set(d.testedModel,[]);map.get(d.testedModel).push(d)}
  if(!map.size){const model=(p.productRange||[]).find(([k])=>/recorded model/i.test(k))?.[1]||p.name;return [{model,docs:productDocs(p)}]}
  const order=(p.testedModels||[]).filter(m=>map.has(m)); const keys=order.length?order:[...map.keys()]; return keys.map(model=>({model,docs:map.get(model)}));
}

const fallback={
  "oil-immersed-distribution-transformer":["products/distribution-transformers/oil-immersed-distribution-transformer-sealed-01.webp","products/distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp"],
  "high-voltage-power-transformer":["company/factory-campus-panorama.jpeg","applications/grid-substation-yard.jpeg"],
  "cast-resin-dry-type-transformer":["products/dry-type-transformers/cast-resin-transformer-core-coil-assembly.jpeg","products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg"],
  "dry-type-prefabricated-substation":["factory/dry-type-prefabricated-substation-assembly-01.webp","products/prefabricated-substations/dry-type-prefabricated-substation-interior.webp"],
  "oil-immersed-prefabricated-substation":["products/prefabricated-substations/oil-prefabricated-substation-lv-cabinet-interior.webp","factory/oil-prefabricated-substation-assembly.webp"],
  "american-type-combined-transformer":["products/combined-transformers/american-type-combined-transformer-lv-cabinet-interior.webp","products/combined-transformers/american-type-combined-transformer-busbar-interior.webp"]
};

function modelImage(p,v){const d=v.docs.find(x=>x.previewImages?.some(i=>i.includes("product-photo")))||v.docs[0];return d?.previewImages?.find(i=>i.includes("product-photo"))||p.gallery?.[0]?.[0]||"applications/grid-substation-yard.jpeg";}
function rating(v,p){const d=v.docs[0];return [d?.ratedPower,d?.ratedVoltage].filter(Boolean).join(" · ")||p.seriesCapability?.voltage||"Project-specific";}
function gallery(p,v){return [[modelImage(p,v),`${v.model} product view`],...(fallback[p.id]||["company/factory-campus-panorama.jpeg","applications/grid-substation-yard.jpeg"]).map((x,i)=>[x,i===0?"Manufacturing / product reference":"Application / installation reference"])].slice(0,3)}

function updateProductPages(){
  for(const p of products){
    const dir=path.join(dist,"products",p.slug); const family=path.join(dir,"index.html");
    if(fs.existsSync(family)){let h=fs.readFileSync(family,"utf8");h=labels(h);fs.writeFileSync(family,inject(h,"../../"));}
    for(const v of variants(p)){
      const f=path.join(dir,`${slug(v.model)}.html`); if(!fs.existsSync(f)) continue; let h=fs.readFileSync(f,"utf8"); const pics=gallery(p,v);
      const g=`<div class="v6-model-gallery"><figure class="v6-model-main"><img src="${asset(pics[0][0],"../../")}" alt="${esc(pics[0][1])}" data-v6-main-image><figcaption data-v6-main-caption>${esc(pics[0][1])}</figcaption></figure><div class="v6-model-thumbs">${pics.map(([src,cap],i)=>`<button type="button" class="${i===0?"active":""}" data-v6-thumb data-src="${asset(src,"../../")}" data-caption="${esc(cap)}"><img src="${asset(src,"../../")}" alt="${esc(cap)}" loading="lazy"></button>`).join("")}</div></div>`;
      h=h.replace(/<div class="v5-model-gallery">[\s\S]*?<\/div><div class="v5-model-summary">/,`${g}<div class="v5-model-summary">`);
      const overview=`${v.model} is a ${rating(v,p)} reference within the ${labels(p.name)} family. The gallery uses the available exact-model product photo plus supporting family, manufacturing or application images. Certificates and test reports below are limited to this exact model.`;
      h=h.replace(/<div class="v5-model-overview-copy">[\s\S]*?<\/div><div class="v5-feature-grid">/,`<div class="v5-model-overview-copy"><p class="eyebrow">MODEL OVERVIEW</p><h2>${esc(v.model)}</h2><p>${esc(overview)}</p></div><div class="v5-feature-grid">`);
      h=labels(h); fs.writeFileSync(f,inject(h,"../../"));
    }
  }
}

function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())walk(f);else if(e.isFile()&&e.name.endsWith(".html")){let h=fs.readFileSync(f,"utf8");const rel=path.relative(path.dirname(f),dist).replace(/\\/g,"/");fs.writeFileSync(f,inject(h,rel?rel+"/":""));}}}

fs.mkdirSync(path.join(dist,"assets","css"),{recursive:true});fs.mkdirSync(path.join(dist,"assets","js"),{recursive:true});
fs.copyFileSync(path.join(__dirname,"ux-refine-v6.css"),path.join(dist,"assets","css","ux-refine-v6.css"));
fs.copyFileSync(path.join(__dirname,"ux-refine-v6.js"),path.join(dist,"assets","js","ux-refine-v6.js"));
updateHome(); updateTopPages(); updateProductPages(); walk(dist);
console.log("Applied V6 layout, classification and product gallery refinement.");