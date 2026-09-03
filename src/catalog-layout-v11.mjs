import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "dist", "catalog.html");
const cssTarget = path.join(root, "dist", "assets", "css", "catalog-layout-v11.css");

if (!fs.existsSync(catalogPath)) throw new Error("dist/catalog.html is missing.");
let html = fs.readFileSync(catalogPath, "utf8");

const cssHref = "assets/css/catalog-layout-v11.css?v=20260819-1";
if (!html.includes("catalog-layout-v11.css")) {
  html = html.replace("</head>", `  <link rel="stylesheet" href="${cssHref}">\n</head>`);
} else {
  html = html.replace(/assets\/css\/catalog-layout-v11\.css(?:\?[^\"]*)?/g, cssHref);
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const replaceOverview = (id, replacement) => {
  const re = new RegExp(`<section class="catalog-sheet product-overview-sheet[^\"]*" id="${esc(id)}">[\\s\\S]*?<\\/section>`);
  html = html.replace(re, replacement);
};
const replaceDetails = (title, replacement) => {
  const re = /<section class="catalog-sheet product-evidence-sheet catalog-product-detail-sheet catalog-product-spec-sheet[^\"]*">[\s\S]*?<\/section>/g;
  html = html.replace(re, (match) => match.includes(`<h2>${title}</h2>`) ? replacement : match);
};
const replaceParameterSheets = (title, replacement) => {
  let inserted = false;
  const re = /<section class="catalog-sheet catalog-core-params-sheet[^\"]*">[\s\S]*?<\/section>/g;
  html = html.replace(re, (match) => {
    if (!match.includes(`<h2>${title}</h2>`)) return match;
    if (inserted) return "";
    inserted = true;
    return replacement;
  });
};

const gallery = (images, cls = "") => `<div class="v11-product-gallery ${cls}">${images.map(([src, alt]) => `<figure><img src="${src}" alt="${alt}" loading="lazy"></figure>`).join("")}</div>`;
const overviewSpecs = (items) => `<div class="v9-overview-specs">${items.map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join("")}</div>`;
const overviewBand = (items) => `<div class="v9-overview-band">${items.map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join("")}</div>`;
const referenceModels = (models) => models.map(([model, rating]) => `<div class="v9-reference-model"><strong>${model}</strong><span>${rating}</span></div>`).join("");
const selectionStrip = (items) => `<div class="v9-selection-strip">${items.map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join("")}</div>`;

const makeOverview = ({id, page, eyebrow, title, subtitle, lead, images, galleryClass, panelTitle, panelText, specs, features, standards, band}) => `<section class="catalog-sheet product-overview-sheet catalog-v9-overview catalog-v10-overview catalog-v11-overview" id="${id}">
  <span class="catalog-page-no">${page}</span>
  <div class="sheet-head"><p>${eyebrow}</p><h2>${title}</h2><span>${subtitle}</span></div>
  <p class="v9-overview-lead">${lead}</p>
  <div class="v9-overview-stage">
    ${gallery(images, galleryClass)}
    <aside class="v9-overview-panel">
      <div class="v9-panel-intro"><p>PRODUCT PLATFORM</p><h3>${panelTitle}</h3><span>${panelText}</span></div>
      ${overviewSpecs(specs)}
      <div class="v9-panel-columns"><div><p>KEY FEATURES</p><ul>${features.map(x => `<li>${x}</li>`).join("")}</ul></div><div><p>STANDARDS / TEST SCOPE</p>${standards.map(x => `<strong>${x}</strong>`).join("")}<small>Third-party evidence applies to the stated tested configurations.</small></div></div>
    </aside>
  </div>
  ${overviewBand(band)}
</section>`;

const makeDetails = ({title, subtitle, leadTitle, leadText, duo, strip, image, models, evidence}) => `<section class="catalog-sheet product-evidence-sheet catalog-product-detail-sheet catalog-product-spec-sheet catalog-v9-details catalog-v10-details catalog-v11-details">
  <div class="sheet-head"><p>PRODUCT DETAILS</p><h2>${title}</h2><span>${subtitle}</span></div>
  <div class="v9-details-stage">
    <div class="v9-details-main">
      <article class="v9-details-lead"><p>APPLICATION &amp; DESIGN</p><h3>${leadTitle}</h3><span>${leadText}</span></article>
      <div class="v9-detail-duo">
        ${duo.map(d => `<article><p>${d.eyebrow}</p><h4>${d.title}</h4><ul>${d.items.map(x => `<li>${x}</li>`).join("")}</ul></article>`).join("")}
      </div>
      ${selectionStrip(strip)}
    </div>
    <aside class="v9-reference-panel v11-reference-panel-${models.length}">
      <figure><img src="${image}" alt="${title} reference product" loading="lazy"></figure>
      <p>TESTED REFERENCE CONFIGURATIONS</p>
      <h3>${models.length === 1 ? "Documented reference configuration" : `${models.length} documented reference configurations`}</h3>
      ${referenceModels(models)}
      <div class="v9-reference-evidence"><span>Evidence set</span>${evidence.map(x => `<strong>${x}</strong>`).join("")}</div>
    </aside>
  </div>
  <p class="v9-detail-note">Reference evidence applies to the stated tested configurations. Project variants are confirmed separately against the approved technical schedule and applicable verification requirements.</p>
</section>`;

const microGrid = (items) => `<div class="v11-param-microgrid">${items.map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join("")}</div>`;
const paramCard = ({model, badge, value, items, cls = ""}) => `<article class="v11-param-card ${cls}"><div class="v11-param-head"><div><p>TESTED MODEL</p><h3>${model}</h3></div><div><span>${badge}</span><strong>${value}</strong></div></div>${microGrid(items)}</article>`;
const performanceTable = (headers, rows) => `<div class="v11-performance-wrap"><table class="v11-performance-table"><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="v11-rowhead"' : ''}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const standardsBand = (label, standards) => `<div class="v10-standards-band v11-standards-band"><div><span>Applicable test scope</span><strong>${label}</strong></div><div class="v10-standard-list">${standards.map(x => `<span>${x}</span>`).join("")}</div></div>`;
const paramSheet = (title, subtitle, body) => `<section class="catalog-sheet catalog-core-params-sheet catalog-v11-params"><div class="sheet-head compact-sheet-head"><p>TESTED REFERENCE PARAMETERS</p><h2>${title}</h2><span>${subtitle}</span></div><p class="catalog-core-note"><strong>Evidence scope.</strong> Values below belong to the stated Tianyu tested configurations. They do not certify every capacity, voltage or project variant in the wider product family.</p>${body}</section>`;

// 1) HIGH-VOLTAGE POWER TRANSFORMER
replaceOverview("product-high-voltage-power-transformer", makeOverview({
  id: "product-high-voltage-power-transformer", page: "09", eyebrow: "POWER TRANSFORMER", title: "High-Voltage Power Transformer", subtitle: "110 kV · 132 kV · 220 kV Tested Reference Range",
  lead: "Three-phase oil-immersed main transformers are engineered for utility substations, renewable-energy interconnection and major industrial power systems, with documented Tianyu references extending from 50 MVA / 110 kV to 240 MVA / 220 kV.",
  images: [["assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png", "High-voltage power transformer"], ["assets/media/products/distribution-transformers/oil-immersed-distribution-transformer-green.jpeg", "Oil-immersed power transformer"]], galleryClass: "v11-gallery-2",
  panelTitle: "Main-transformer design built around the system study", panelText: "Voltage ratio, impedance, tapping, insulation coordination, cooling, guaranteed losses, accessories, monitoring and transport limits are confirmed against the project electrical and site requirements.",
  specs: [["Voltage class", "Up to 220 kV"], ["Tested references", "50–240 MVA"], ["Frequency", "50 Hz"], ["Cooling", "ONAN / ONAF"], ["Installation", "Outdoor"], ["Construction", "Oil-immersed"]],
  features: ["Project-specific impedance and tapping", "High-voltage insulation coordination", "Short-circuit withstand design", "Monitoring and transport engineering"], standards: ["IEC 60076 series"],
  band: [["Tested references", "50 MVA / 110 kV · 150 MVA / 132 kV · 240 MVA / 220 kV"], ["Independent evidence", "4 model-specific test / type-test reports"], ["Typical applications", "Main substations · grid interconnection · heavy industry"]]
}));
replaceDetails("High-Voltage Power Transformer", makeDetails({
  title: "High-Voltage Power Transformer", subtitle: "System-study inputs, project engineering and independently documented reference points.", leadTitle: "Main-transformer design starts with the electrical system", leadText: "Tianyu high-voltage power transformers are engineered around system voltage, fault level, regulation strategy, guaranteed losses, transport limits and site conditions. Documented references cover 110 kV, 132 kV and 220 kV equipment.",
  duo: [
    {eyebrow:"ELECTRICAL ENGINEERING", title:"Ratings follow the network study", items:["Voltage ratio, impedance and vector group","On-load or off-circuit tapping requirements","Insulation levels and impulse withstand","Guaranteed losses and temperature-rise limits"]},
    {eyebrow:"MECHANICAL & SITE", title:"The active design is coordinated with transport and site limits", items:["Cooling arrangement and radiator configuration","Bushings, monitoring and protection interfaces","Transport envelope and lifting requirements","Altitude, ambient conditions and final drawings"]}
  ], strip:[["Voltage class","Up to 220 kV"],["Reference capacity","Up to 240 MVA tested"],["Cooling","ONAN / ONAF"],["Frequency","50 Hz"]], image:"assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png",
  models:[["SZ22-50000/110-NX1","50 MVA · 110 / 10.5 kV"],["SFZ-150000/132","150 MVA · 132 / 21 kV"],["SSZ20-240000/220","240 MVA · 220 / 115 / 38.5 kV"],["SSZ22-240000/220-NX1","240 MVA · 220 / 115 / 38.5 kV"]], evidence:["21M2078-S · 21M2079-S","21M0905-S · 23M1317-S"]
}));
replaceParameterSheets("High-Voltage Power Transformer", paramSheet("High-Voltage Power Transformer", "Rated electrical, loss and impedance data across four documented 110–220 kV Tianyu reference transformers.", `
  <div class="v11-param-grid v11-param-grid-4">
    ${paramCard({model:"SZ22-50000/110-NX1",badge:"110 / 10.5 kV",value:"50 MVA",items:[["Rated current","262.4 / 2749.4 A"],["Tap range","±8×1.25%"],["Vector / cooling","YNd11 · ONAN"],["I₀","≤0.30 / 0.09%"],["P₀","21.000 / 20.468 kW"],["Impedance","10.5%±3% / 10.46%"],["Pₖ @75°C","175.000 / 172.957 kW"],["Total loss","196.000 / 193.426 kW"],["Report","21M2078-S"]]})}
    ${paramCard({model:"SFZ-150000/132",badge:"132 / 21 kV",value:"150 MVA",items:[["Rated current","656.1 / 4124 A"],["Tap range","±9×1.67%"],["Vector / cooling","YNd11 · ONAN / ONAF"],["I₀","0.30 / 0.07%"],["P₀","69.600 / 58.500 kW"],["Impedance ONAF","15.5%±3% / 15.76%"],["Pₖ ONAF","422.000 / 420.6614 kW"],["Total loss ONAF","491.600 / 479.1610 kW"],["Report","21M2079-S"]]})}
    ${paramCard({model:"SSZ20-240000/220",badge:"220 / 115 / 38.5 kV",value:"240 MVA",items:[["Rated current","629.8 / 1204.9 / 3599.1 A"],["Tap range","HV ±8×1.25%"],["Vector / cooling","YNyn0d11 · ONAN"],["I₀","<0.30 / 0.14%"],["P₀","100.000 / 94.076 kW"],["Impedance","H-L 24.12 · H-M 14.05 · M-L 8.02%"],["Pₖ @75°C","667.000 / 659.332 kW"],["Total loss","767.000 / 753.408 kW"],["Report","21M0905-S"]]})}
    ${paramCard({model:"SSZ22-240000/220-NX1",badge:"220 / 115 / 38.5 kV",value:"240 MVA",items:[["Rated current","629.8 / 1205 / 3599 A"],["Tap range","HV ±8×1.25%"],["Vector / cooling","YNyn0d11 · ONAN"],["I₀","0.20 / 0.09%"],["P₀","85.000 / 83.558 kW"],["Impedance","H-L 23.74 · H-M 13.99 · M-L 8.18%"],["Pₖ @75°C","667.000 / 625.856 kW"],["Total loss","752.000 / 709.414 kW"],["Report","23M1317-S"]]})}
  </div>
  <div class="v11-insulation-summary"><span>Rated insulation references</span><div><strong>50 MVA:</strong> HV 126/480/530/200 kV · LV 12/75/85/35 kV</div><div><strong>150 MVA:</strong> HV 145/650/715/275 kV · LV 24/125/140/55 kV</div><div><strong>240 MVA:</strong> HV 252/750/950/1050/395 kV · MV/LV levels per individual report</div></div>
  ${standardsBand("Power-transformer reference standards",["IEC 60076 series","Model-specific test reports"])}
`));

// 2) CAST RESIN DRY-TYPE TRANSFORMER
replaceOverview("product-cast-resin-dry-type-transformer", makeOverview({
  id:"product-cast-resin-dry-type-transformer",page:"11",eyebrow:"DRY-TYPE TRANSFORMER",title:"Cast Resin Dry-Type Transformer",subtitle:"SCB18 Cast-Resin Indoor Distribution",
  lead:"SCB18 cast-resin dry-type transformers provide oil-free indoor distribution for commercial buildings, healthcare, charging infrastructure, industrial facilities and public infrastructure, with AN / AF cooling and project-specific enclosure and monitoring options.",
  images:[["assets/media/products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg","SCB18 cast-resin dry-type transformer"],["assets/media/products/dry-type-transformers/cast-resin-transformer-core-coil-assembly.jpeg","Cast-resin dry-type transformer"]],galleryClass:"v11-gallery-2",
  panelTitle:"Oil-free indoor distribution with configurable cooling and enclosure",panelText:"The current tested references are 1000 kVA and 2500 kVA at 10 / 0.4 kV. Final capacity, impedance, cooling, enclosure, temperature monitoring, cable interface and room conditions are coordinated with the project.",
  specs:[["Voltage class","35 kV and below"],["Tested references","1000 · 2500 kVA"],["Frequency","50 / 60 Hz"],["Cooling","AN / AF"],["Installation","Indoor"],["Insulation","Cast resin · Class H"]],
  features:["Oil-free cast-resin insulation","Low partial-discharge reference results","Temperature monitoring options","Protective enclosure options"],standards:["IEC 60076-11","IEC 60076 series"],
  band:[["Tested references","SCB18-1000/10-NX1 · SCB18-2500/10"],["Independent evidence","26N0284-S · 26N0286-S"],["Typical applications","Commercial · healthcare · industry · infrastructure"]]
}));
replaceDetails("Cast Resin Dry-Type Transformer", makeDetails({
  title:"Cast Resin Dry-Type Transformer",subtitle:"Indoor application design, cooling / enclosure choices and documented SCB18 reference points.",leadTitle:"Cast-resin construction for oil-free indoor distribution",leadText:"The SCB18 platform is designed for indoor distribution where oil-free insulation, compact installation, low maintenance and temperature monitoring are important. Tested references cover 1000 kVA and 2500 kVA at 10 / 0.4 kV.",
  duo:[{eyebrow:"ELECTRICAL CONFIGURATION",title:"Electrical ratings are matched to the distribution system",items:["Rated voltage, capacity and impedance","Vector group and tap range","AN / AF cooling arrangement","Cable termination and bus interface"]},{eyebrow:"INSTALLATION & MONITORING",title:"Indoor interfaces follow the room and enclosure design",items:["Temperature monitoring and fan control","Protective enclosure and ventilation","Clearances and room heat dissipation","Final drawing and accessory schedule"]}],
  strip:[["Voltage class","35 kV and below"],["Tested capacity","1000 / 2500 kVA"],["Cooling","AN / AF"],["Thermal class","H"]],image:"assets/media/products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg",models:[["SCB18-1000/10-NX1","1000 kVA · 10 / 0.4 kV"],["SCB18-2500/10","2500 kVA · 10 / 0.4 kV"]],evidence:["26N0284-S · 26N0286-S","Type-test, temperature-rise, sound and PD data"]
}));
replaceParameterSheets("Cast Resin Dry-Type Transformer", paramSheet("Cast Resin Dry-Type Transformer", "Electrical, loss, temperature-rise, sound and partial-discharge data for two tested SCB18 references.", `
  <div class="v11-param-grid v11-param-grid-2">
    ${paramCard({model:"SCB18-1000/10-NX1",badge:"10 / 0.4 kV",value:"1000 kVA",items:[["Rated current HV / LV","57.7 / 1443.4 A"],["Tap / vector","±2×2.5% · Dyn11"],["Cooling / thermal class","AN / AF · H"],["HV / LV insulation","12/75/35 kV · ≤1.1/5 kV"],["I₀ spec / measured","0.70 / 0.51%"],["P₀ spec / measured","1.020 / 0.9435 kW"],["Z spec / measured","6.0%±10% / 6.06%"],["Pₖ @145°C","7.885 / 7.4311 kW"],["Temperature rise HV / LV","100.6 / 99.4 K"],["Sound LPA / LWA","37 / 51 dB(A)"],["PD @1.3Ur A/B/C","<2 / <3 / <2 pC"],["Report","26N0284-S"]]})}
    ${paramCard({model:"SCB18-2500/10",badge:"10 / 0.4 kV",value:"2500 kVA",items:[["Rated current HV / LV","144.3 / 3608.4 A"],["Tap / vector","±2×2.5% · Dyn11"],["Cooling / thermal class","AN / AF · H"],["HV / LV insulation","12/75/35 kV · ≤1.1/5 kV"],["I₀ spec / measured","0.60%+30% / 0.15%"],["P₀ spec / measured","2.080 / 1.8368 kW"],["Z spec / measured","6.0%±10% / 6.10%"],["Pₖ @145°C","16.605 / 15.6824 kW"],["Temperature rise HV / LV","101.6 / 104.8 K"],["Sound LPA / LWA","39 / 54 dB(A)"],["PD @1.3Ur A/B/C","<4 / <4 / <3 pC"],["Report","26N0286-S"]]})}
  </div>
  ${standardsBand("Dry-type transformer reference standards",["IEC 60076-11","IEC 60076-1","IEC 60076-3","IEC 60076-5","IEC 60076-10"])}
`));

// 3) EUROPEAN-TYPE PREFABRICATED SUBSTATION
replaceOverview("product-dry-type-prefabricated-substation", makeOverview({
  id:"product-dry-type-prefabricated-substation",page:"13",eyebrow:"PREFABRICATED SUBSTATION",title:"European-Type Prefabricated Substation",subtitle:"Dry-Type Transformer Configuration",
  lead:"The European-Type platform integrates high-voltage primary equipment, a dry-type transformer and low-voltage distribution equipment in one factory-assembled outdoor enclosure for renewable-energy, storage, urban-distribution and infrastructure projects.",
  images:[["assets/media/products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp","European-type prefabricated substation"],["assets/media/applications/wind-turbine-dry-type-prefabricated-substation-site.webp","Prefabricated substation outdoor view"],["assets/media/products/prefabricated-substations/dry-type-prefabricated-substation-lineup.webp","Prefabricated substation project view"],["assets/media/factory/dry-type-prefabricated-substation-assembly-01.webp","Prefabricated substation supporting view"]],galleryClass:"v11-gallery-4",
  panelTitle:"Factory-integrated medium-voltage distribution package",panelText:"Primary switchgear, dry transformer, LV distribution, protection, metering, monitoring, auxiliary power and cable interfaces are engineered as one station around the project single-line diagram and site conditions.",
  specs:[["Primary voltage","35 kV and below"],["Tested capacity","6.3 · 10 · 12.5 MVA"],["Frequency","50 Hz"],["Transformer cooling","AN / AF"],["Installation","Outdoor"],["Station standard","IEC 62271-202"]],
  features:["Integrated HV / transformer / LV package","Dry-type transformer configuration","Factory assembly reduces site work","Monitoring and remote-operation options"],standards:["IEC 62271-202"],
  band:[["Tested references","6.3 · 10 · 12.5 MVA at 35 kV class"],["Independent evidence","3 complete-station type-test reports"],["Typical applications","Wind · solar · storage · distribution"]]
}));
replaceDetails("European-Type Prefabricated Substation", makeDetails({
  title:"European-Type Prefabricated Substation",subtitle:"Complete-station design, enclosure interfaces and independently tested 35 kV-class references.",leadTitle:"The station is engineered as one integrated electrical and mechanical system",leadText:"High-voltage equipment, the dry-type transformer, low-voltage distribution and enclosure are coordinated together. Current type-tested references cover 6.3 MVA, 10 MVA and 12.5 MVA configurations.",
  duo:[{eyebrow:"ELECTRICAL SYSTEM",title:"Primary, transformer and LV interfaces are coordinated together",items:["Primary voltage and switchgear scheme","Transformer capacity, impedance and tapping","LV distribution, protection and metering","Auxiliary power and monitoring architecture"]},{eyebrow:"ENCLOSURE & SITE",title:"Complete-station performance depends on the physical arrangement",items:["Cable entry and compartment arrangement","IP / IK and internal-arc requirements","Ventilation, altitude and ambient conditions","Transport split, foundation and final GA drawing"]}],
  strip:[["Primary voltage","35 kV class"],["Tested capacity","6.3–12.5 MVA"],["Transformer","Dry type"],["Type-test basis","IEC 62271-202"]],image:"assets/media/products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp",models:[["YB-40.5/1.14-6300","6300 kVA · 35 / 1.14 kV"],["YB-40.5/1.14-10000","10000 kVA · 37 / 1.14 kV"],["YB-40.5/1.14-12500","12500 kVA · 37 / 1.14 kV"]],evidence:["23XB0121-S","26XB0130-S · 26XB0131-S"]
}));
replaceParameterSheets("European-Type Prefabricated Substation", paramSheet("European-Type Prefabricated Substation", "Complete-station configuration and transformer performance data for three dry-transformer reference substations.", `
  <div class="v11-param-grid v11-param-grid-3">
    ${paramCard({model:"YB-40.5/1.14-6300",badge:"35 / 1.14 kV",value:"6.3 MVA",items:[["Transformer","SCB13-6300/35"],["Cooling / vector","AN/AF · Dyn11"],["HV switchgear","HXGN26-40.5(Z)/T630-25"],["HV IAC","IAC-AB 20 kA · 1 s"],["Protection","IP44 · IK10"],["Weight","27,150 kg"],["Dimensions","6220×2800×2900 mm"],["P₀ measured","6.8469 kW"],["Pₖ measured","34.9418 kW"],["Impedance measured","8.05%"],["Station sound","40 / 59 dB(A)"],["Report","23XB0121-S"]]})}
    ${paramCard({model:"YB-40.5/1.14-10000",badge:"37 / 1.14 kV",value:"10 MVA",items:[["Transformer","SCB18-10000/35-NX1"],["Cooling / vector","AN/AF · Dyn11"],["HV switchgear","HXGN26-40.5/630-31.5"],["HV IAC","IAC-AB 31.5 kA · 1 s"],["Protection","IP65 · IK10"],["Altitude","≤4500 m"],["Dimensions / weight","7850×3350×3450 mm · 26,600 kg"],["P₀ measured","7.7390 kW"],["Pₖ measured","52.8741 kW"],["Impedance measured","8.27%"],["Station sound","46 / 64 dB(A)"],["Report","26XB0130-S"]]})}
    ${paramCard({model:"YB-40.5/1.14-12500",badge:"37 / 1.14 kV",value:"12.5 MVA",items:[["Transformer","SCB18-12500/35-NX1"],["Cooling / vector","AN/AF · Dyn11"],["HV switchgear","HXGN26-40.5/630-31.5"],["HV IAC","IAC-AB 31.5 kA · 1 s"],["Protection","IP65 · IK10"],["Altitude","≤4500 m"],["Dimensions / weight","7850×3350×3450 mm · 28,600 kg"],["P₀ measured","8.8203 kW"],["Pₖ measured","62.1530 kW"],["Impedance measured","8.15%"],["Station sound","42 / 61 dB(A)"],["Report","26XB0131-S"]]})}
  </div>
  ${standardsBand("Complete prefabricated-substation type-test basis",["IEC 62271-202:2014","IEC 62271-202:2022","Complete-station configuration specific"])}
`));

// 4) COMPACT / GY PREFABRICATED SUBSTATION
replaceOverview("product-oil-immersed-prefabricated-substation", makeOverview({
  id:"product-oil-immersed-prefabricated-substation",page:"15",eyebrow:"PREFABRICATED SUBSTATION",title:"Compact Prefabricated Substation",subtitle:"Oil-Immersed Transformer Configuration",
  lead:"The Compact / GY platform integrates high-voltage equipment, an oil-immersed transformer and low-voltage distribution in a compact outdoor enclosure for renewable-energy, utility and industrial projects requiring high capacity and reduced field assembly.",
  images:[["assets/media/products/prefabricated-substations/oil-prefabricated-substation-exterior-01.webp","Compact prefabricated substation"],["assets/media/products/prefabricated-substations/oil-prefabricated-substation-lv-cabinet-interior.webp","Compact substation project view"],["assets/media/applications/industrial-platform-oil-prefabricated-substation-site.webp","Compact substation supporting view"],["assets/media/applications/oil-prefabricated-substation-site-01.webp","Compact substation additional view"]],galleryClass:"v11-gallery-4",
  panelTitle:"Compact complete-station package with an oil-immersed transformer",panelText:"Transformer rating, impedance, protection, switchgear, LV distribution, enclosure sealing, ventilation, monitoring, cable entry and site interfaces are coordinated around the project electrical scheme and environment.",
  specs:[["Voltage class","35 kV and below"],["Tested capacity","10 · 12.5 MVA"],["Frequency","50 Hz"],["Transformer cooling","ONAN"],["Installation","Outdoor"],["Station standard","IEC 62271-202"]],
  features:["Compact high-capacity package","Oil-immersed transformer configuration","Factory assembly and testing","Project-specific IP / site design"],standards:["IEC 62271-202"],
  band:[["Tested references","10 · 12.5 MVA GY configurations"],["Independent evidence","26XB0129-S · 23XB0332-S"],["Typical applications","Solar · storage · utility · industrial"]]
}));
replaceDetails("Compact Prefabricated Substation", makeDetails({
  title:"Compact Prefabricated Substation",subtitle:"Complete-station configuration, environmental interfaces and GY tested reference points.",leadTitle:"Compact packaging is coordinated with high current, heat and site conditions",leadText:"The GY platform combines an oil-immersed transformer with HV and LV equipment in a factory-assembled enclosure. Tested references at 10 MVA and 12.5 MVA demonstrate two distinct complete-station configurations rather than one universal enclosure specification.",
  duo:[{eyebrow:"ELECTRICAL SYSTEM",title:"Transformer and switchgear are selected against the project duty",items:["35 kV-class primary system interface","Transformer impedance, tapping and vector group","LV distribution and protection","Internal-arc and short-time current requirements"]},{eyebrow:"ENCLOSURE & ENVIRONMENT",title:"Protection level follows the tested configuration and project site",items:["IP / IK and sealing requirements","Altitude, ambient and ventilation conditions","Cable entry and compartment arrangement","Foundation, transport and final GA drawing"]}],
  strip:[["Voltage class","35 kV class"],["Tested capacity","10 / 12.5 MVA"],["Transformer","Oil immersed · ONAN"],["Type-test basis","IEC 62271-202"]],image:"assets/media/products/prefabricated-substations/oil-prefabricated-substation-exterior-01.webp",models:[["YB-40.5/1.14-10000 (GY)","10000 kVA · 37 / 1.14 kV"],["YB-40.5/1.14-12500 (GY)","12500 kVA · 37 / 1.14 kV"]],evidence:["26XB0129-S · IEC 62271-202:2022","23XB0332-S · IEC 62271-202:2014"]
}));
replaceParameterSheets("Compact Prefabricated Substation", paramSheet("Compact Prefabricated Substation", "Complete-station configuration and oil-immersed transformer performance data for two tested GY references.", `
  <div class="v11-param-grid v11-param-grid-2 v11-substation-dual">
    ${paramCard({model:"YB-40.5/1.14-10000 (GY)",badge:"37 / 1.14 kV",value:"10 MVA",items:[["Transformer","S22-10000/35-NX1"],["Cooling / vector","ONAN · Dyn11"],["HV switchgear","HXGN26-40.5/630-31.5"],["HV IAC","IAC-AB 31.5 kA · 1 s"],["Protection","Station/HV/LV IP65 · transformer IP68 · IK10"],["Altitude","≤5000 m"],["Dimensions / weight","5225×3440×3460 mm · 27,500 kg"],["I₀ measured","0.16%"],["P₀ measured","4.6076 kW"],["Z measured","8.17%"],["Pₖ @75°C measured","39.4295 kW"],["Total loss","44.0371 kW"],["Combined sound","36 / 56 dB(A)"],["Report","26XB0129-S"]]})}
    ${paramCard({model:"YB-40.5/1.14-12500 (GY)",badge:"37 / 1.14 kV",value:"12.5 MVA",items:[["Transformer","S22-12500/35-NX1"],["Cooling / vector","ONAN · Dyn11"],["HV switchgear","HXGN26-40.5/630-31.5"],["HV IAC","IAC-AB 31.5 kA · 1 s"],["Protection","Station/HV/LV IP54 · transformer compartment IP68 · IK10"],["Altitude","≤4000 m"],["Dimensions / weight","5003×3112×2554 mm · 27,500 kg"],["I₀ measured","0.09%"],["P₀ measured","5.390 kW"],["Z measured","8.17%"],["Pₖ @75°C measured","48.180 kW"],["Total loss","53.570 kW"],["Combined sound","Not stated in uploaded report"],["Report","23XB0332-S"]]})}
  </div>
  ${standardsBand("Complete-station type-test basis",["IEC 62271-202:2022","IEC 62271-202:2014","IP / IAC declarations are configuration-specific"])}
`));

// 5) PAD-MOUNTED / ZGS COMBINED TRANSFORMER
replaceOverview("product-american-type-combined-transformer", makeOverview({
  id:"product-american-type-combined-transformer",page:"17",eyebrow:"COMBINED TRANSFORMER",title:"Pad-Mounted Transformer",subtitle:"American-Type / Renewable Energy Configuration",
  lead:"The ZGS combined-transformer platform integrates the oil-immersed transformer body, high-voltage load switching and fuse protection in a compact outdoor assembly for renewable-energy collection and distribution applications.",
  images:[["assets/media/products/combined-transformers/american-type-combined-transformer-exterior-01.webp","Pad-mounted combined transformer"],["assets/media/products/combined-transformers/american-type-combined-transformer-lv-cabinet-interior.webp","Combined transformer renewable-energy configuration"],["assets/media/products/combined-transformers/american-type-combined-transformer-exterior-02.webp","Pad-mounted transformer supporting view"],["assets/media/applications/floating-solar-combined-transformer-site.webp","Pad-mounted transformer additional view"]],galleryClass:"v11-gallery-4",
  panelTitle:"Integrated transformer, switching and fuse protection for outdoor collection systems",panelText:"The documented ZGS22-4000/35/0.8 reference is rated 4000 kVA at 37 / 0.8 kV. Final cable entry, switching scheme, fuse arrangement, monitoring and enclosure interfaces are configured against the project collection system.",
  specs:[["Voltage class","35 kV class"],["Tested reference","4000 kVA"],["Frequency","50 Hz"],["Cooling","ONAN"],["Installation","Outdoor / pad mounted"],["Protection","IP65 / IP68 reference"]],
  features:["Highly integrated outdoor construction","Load-switch and fuse protection","Compact renewable-energy interface","Sealed transformer section"],standards:["IEC 60076 series","IEC/IEEE 60076-16"],
  band:[["Tested reference","ZGS22-4000/35/0.8 · 4000 kVA"],["Independent evidence","24XB0336-S"],["Typical applications","Solar · storage · renewable collection"]]
}));
replaceDetails("Pad-Mounted Transformer", makeDetails({
  title:"Pad-Mounted Transformer",subtitle:"Integrated protection, outdoor interfaces and the documented ZGS renewable-energy reference.",leadTitle:"One compact assembly combines transformation and primary protection",leadText:"The ZGS arrangement combines the oil-immersed transformer, high-voltage load switching and fuse protection in a single outdoor package. The tested ZGS22-4000/35/0.8 reference is rated 4000 kVA at 37 / 0.8 kV.",
  duo:[{eyebrow:"ELECTRICAL CONFIGURATION",title:"The combined-transformer interface follows the collection system",items:["35 kV-class primary interface","Transformer rating, impedance and tap range","High-voltage load switch and fuse arrangement","Low-voltage cable and terminal requirements"]},{eyebrow:"OUTDOOR INSTALLATION",title:"Enclosure and protection are coordinated with the site",items:["HV / LV compartment sealing","Transformer-tank protection","Monitoring and accessory requirements","Cable entry, pad arrangement and final drawing"]}],
  strip:[["Reference voltage","37 / 0.8 kV"],["Tested capacity","4000 kVA"],["Cooling","ONAN"],["Vector group","Dy11"]],image:"assets/media/products/combined-transformers/american-type-combined-transformer-exterior-01.webp",models:[["ZGS22-4000/35/0.8","4000 kVA · 37 / 0.8 kV"]],evidence:["24XB0336-S","Short-circuit · impulse · IP · temperature-rise · sound"]
}));
replaceParameterSheets("Pad-Mounted Transformer", paramSheet("Pad-Mounted Transformer", "Comprehensive reference data for ZGS22-4000/35/0.8 renewable-energy combined transformer, report 24XB0336-S.", `
  <div class="v11-pad-layout">
    <article class="v11-pad-summary"><p>TESTED MODEL</p><h3>ZGS22-4000/35/0.8</h3><strong>4000 kVA · 37 / 0.8 kV</strong>${microGrid([["Maximum equipment voltage","40.5 kV"],["Rated current HV / LV","62.4 / 2886.8 A"],["Tap / vector","±2×2.5% · Dy11"],["Cooling / thermal class","ONAN · Class A"],["HV insulation","40.5 / 200 / 220 / 85 kV"],["LV insulation","≤1.1 / 5 kV"],["Protection","HV/LV IP65 · transformer IP68"],["Test altitude correction","5000 m"],["Overall dimensions","Not stated in uploaded evidence"],["Weight","Not stated in uploaded evidence"]])}</article>
    <div class="v11-pad-performance"><h3>Measured Performance</h3>${performanceTable(["Parameter","Specified","Measured / Result"],[["No-load current I₀","0.36%","0.23%"],["No-load loss P₀","2.000 kW","1.9823 kW before SC · 1.9692 kW after SC"],["Short-circuit impedance","7.0% ±10%","7.30% before · 7.29% after"],["Load loss @75°C","24.600 kW","24.1500 kW before · 24.3850 kW after"],["Total loss","26.600 kW","26.1323 kW before · 26.3542 kW after"],["Temperature rise","Top oil 50 K · windings 55 K","Top oil 42.4 K · HV 53.9 K · LV 53.2 K"],["Sound power","≤58 dB(A)","No-load 50 · load 56 · combined 57 dB(A)"]])}</div>
  </div>
  ${standardsBand("Combined-transformer reference standards",["IEC 60076-1","IEC 60076-2","IEC 60076-3","IEC 60076-5","IEC 60076-10","IEC/IEEE 60076-16"])}
`));

fs.copyFileSync(path.join(__dirname, "catalog-layout-v11.css"), cssTarget);
fs.writeFileSync(catalogPath, html);
console.log("Catalog V11: balanced overview, detail and tested-parameter pages applied to the remaining five product families.");
