import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "dist", "catalog.html");
const cssTarget = path.join(root, "dist", "assets", "css", "catalog-layout-v6.css");

if (!fs.existsSync(catalogPath)) throw new Error("dist/catalog.html is missing.");

let html = fs.readFileSync(catalogPath, "utf8");

if (!html.includes("catalog-layout-v6.css")) {
  html = html.replace("</head>", `  <link rel="stylesheet" href="assets/css/catalog-layout-v6.css">\n</head>`);
}

const productConfig = [
  {
    id: "product-oil-immersed-distribution-transformer",
    title: "Oil-Immersed Distribution Transformer",
    images: [
      ["assets/media/products/oil-distribution-transformer-02.webp", "Oil-immersed distribution transformer"],
      ["assets/media/products/oil-distribution-transformer-01.webp", "Oil-immersed distribution transformer product view"]
    ],
    overview: [
      "Fuzhou Tianyu Electric supplies S(B)20 / S(B)22 oil-immersed distribution transformers for utility, industrial and commercial distribution systems. The series covers voltage levels up to 22 kV and design capacities up to 4,000 kVA, with sealed oil-immersed construction, ONAN cooling, low-loss magnetic-core design and low-noise configurations.",
      "The product platform supports project-specific voltage ratios, tap ranges, impedance, terminal arrangements, accessories and monitoring requirements. Energy-efficient configurations are available for applications requiring controlled losses and long-term outdoor operation."
    ],
    side: "The S(B)20 / S(B)22 series is designed for medium-voltage distribution duties with sealed construction, low losses, low noise and configurable electrical interfaces.",
    detail: [
      "The S(B)20 / S(B)22 series is available for systems up to 22 kV and capacities up to 4,000 kVA. Sealed oil-immersed construction limits contact between transformer oil and outside air, while ONAN cooling and low-loss core design support efficient long-term operation in utility and industrial distribution networks.",
      "Tested reference configurations include S-M-630/22-Tier2 and S-M-1600/22-Tier2, both rated 22 / 0.42 kV. The available documentation includes TÜV Certificates of Conformity, IEC complete type-test reports, efficiency test reports and CE / Ecodesign verification for the identified reference models.",
      "Rated voltage, tapping range, impedance, accessories, monitoring, cable or bushing interfaces and site conditions can be configured according to the project specification. Final technical parameters and drawings are confirmed before manufacturing."
    ]
  },
  {
    id: "product-high-voltage-power-transformer",
    title: "High-Voltage Power Transformer",
    // The export workbook does not contain embedded product photos for this family; these two images come from the supplied test reports.
    images: [
      ["assets/media/products/power-transformer-220kv-240mva-ssz22.webp", "240 MVA 220 kV power transformer"],
      ["assets/media/products/power-transformer-132kv-150mva.webp", "150 MVA 132 kV power transformer"]
    ],
    overview: [
      "Fuzhou Tianyu Electric supplies three-phase oil-immersed power transformers for main substations, grid interconnection and large industrial power systems. The documented reference range covers 110 kV, 132 kV and 220 kV equipment, with tested capacities from 50 MVA to 240 MVA.",
      "Each transformer is engineered to the project electrical system and site conditions. Voltage ratio, vector group, impedance, tap-changing range, insulation level, guaranteed losses, cooling arrangement, monitoring, accessories and transport limits are confirmed in the technical specification."
    ],
    side: "Oil-immersed main transformers for utility substations, renewable-energy interconnection and major industrial power systems, with project-specific electrical and mechanical design.",
    detail: [
      "Tianyu high-voltage power transformers are designed for main-substation and grid-interconnection service. Tested reference configurations include 50 MVA / 110 kV, 150 MVA / 132 kV and 240 MVA / 220 kV transformers, providing documented examples across the current high-voltage product range.",
      "Transformer design is developed around the project system parameters. Impedance, on-load tap changing, insulation coordination, cooling, losses, temperature-rise limits, monitoring, protection interfaces and transport requirements are incorporated into the final technical schedule and approved drawings before production."
    ]
  },
  {
    id: "product-cast-resin-dry-type-transformer",
    title: "Cast Resin Dry-Type Transformer",
    // The export workbook does not contain embedded product photos for this family; these two images come from the supplied type-test reports.
    images: [
      ["assets/media/products/dry-type-transformer-scb18-2500.webp", "SCB18 2500 kVA cast-resin dry-type transformer"],
      ["assets/media/products/dry-type-transformer-scb18-1000.webp", "SCB18 1000 kVA cast-resin dry-type transformer"]
    ],
    overview: [
      "Fuzhou Tianyu Electric supplies SCB18 cast-resin dry-type transformers for indoor distribution, commercial buildings, hospitals, charging infrastructure, industrial facilities and public infrastructure. The series uses cast-resin insulation and supports AN or AF cooling according to the selected configuration.",
      "The current tested references are SCB18-1000/10-NX1 and SCB18-2500/10 at 10 kV. Enclosure, ventilation, temperature monitoring, vector group, cable interfaces and installation conditions can be configured to suit the project."
    ],
    side: "SCB18 cast-resin transformers provide oil-free indoor distribution with configurable cooling, enclosure and temperature-monitoring arrangements.",
    detail: [
      "The SCB18 series is designed for indoor distribution applications requiring oil-free insulation, low maintenance and compact installation. Cast-resin construction supports use in commercial, healthcare, infrastructure and industrial environments where fire performance and equipment cleanliness are important.",
      "Tested reference configurations include SCB18-1000/10-NX1 and SCB18-2500/10. Project options include AN or AF cooling, protective enclosures, temperature monitoring and fan control, vector group, cable interfaces and site-specific installation requirements."
    ]
  },
  {
    id: "product-dry-type-prefabricated-substation",
    title: "European-Type Prefabricated Substation",
    images: [
      ["assets/media/products/dry-type-prefabricated-substation-01.webp", "European-type prefabricated substation"],
      ["assets/media/products/dry-type-prefabricated-substation-03.webp", "Prefabricated substation for renewable-energy applications"]
    ],
    overview: [
      "The European-Type Prefabricated Substation integrates high-voltage primary equipment, a dry-type transformer and low-voltage distribution equipment in a factory-assembled outdoor enclosure. The series is available for primary voltages of 6 kV, 12 kV and 35 kV, with secondary-voltage configurations including 400 V, 690 V, 800 V and 1,140 V.",
      "Design capacity extends up to 12,500 kVA. Protection, metering, monitoring, auxiliary power, cable entry and remote-operation functions can be integrated according to the project single-line diagram and site requirements."
    ],
    side: "A factory-assembled 35 kV-class substation integrating high-voltage equipment, a dry-type transformer and low-voltage distribution in one outdoor package.",
    detail: [
      "Tianyu European-Type Prefabricated Substations combine high-voltage primary equipment, a dry-type transformer and low-voltage distribution in a single factory-assembled enclosure. The dry-type transformer configuration is suitable for renewable-energy, storage, urban-distribution and environmentally sensitive projects where transformer-oil leakage is to be avoided.",
      "The series covers primary voltages up to 35 kV and capacities up to 12.5 MVA. Type-tested reference configurations include 6.3 MVA, 10 MVA and 12.5 MVA units. Switchgear scheme, protection, metering, monitoring, auxiliary power, cable entry and enclosure arrangement are engineered to the project specification."
    ]
  },
  {
    id: "product-oil-immersed-prefabricated-substation",
    title: "Compact Prefabricated Substation",
    images: [
      ["assets/media/products/oil-prefabricated-substation-01.webp", "Compact prefabricated substation"],
      ["assets/media/products/oil-prefabricated-substation-04.webp", "Oil-immersed prefabricated substation project configuration"]
    ],
    overview: [
      "The Compact Prefabricated Substation combines high-voltage equipment, an oil-immersed transformer and low-voltage distribution in a compact outdoor package. The series is available for systems up to 35 kV and design capacities up to 15,000 kVA.",
      "The product is developed for solar, wind, energy-storage, utility and industrial projects requiring high integration and reduced site installation work. Protection, monitoring, cable interfaces, corrosion protection, ventilation and enclosure arrangements are configured to the installation environment."
    ],
    side: "A compact outdoor substation integrating high-voltage equipment, an oil-immersed transformer and low-voltage distribution for renewable-energy, utility and industrial projects.",
    detail: [
      "Tianyu Compact Prefabricated Substations integrate high-voltage equipment, an oil-immersed transformer and low-voltage distribution in a factory-assembled outdoor enclosure. The design supports renewable-energy, utility and industrial projects where high capacity, compact footprint and reduced field assembly are required.",
      "The series extends up to 15 MVA, with type-tested reference configurations at 10 MVA and 12.5 MVA. Corrosion protection, sealing, ventilation, structural loading, protection level, monitoring, cable entry and auxiliary systems are selected according to the project site and electrical scheme."
    ]
  },
  {
    id: "product-american-type-combined-transformer",
    title: "Pad-Mounted Transformer",
    images: [
      ["assets/media/products/american-combined-transformer-01.webp", "Pad-mounted transformer"],
      ["assets/media/products/american-combined-transformer-04.webp", "Renewable-energy combined transformer"]
    ],
    overview: [
      "The Pad-Mounted Transformer integrates the transformer body, high-voltage load switching and fuse protection in a compact outdoor assembly. The series is developed for renewable-energy collection systems and distribution projects where a high degree of integration and reduced site footprint are required.",
      "Series capacity extends up to 4,500 kVA. The ZGS22-4000/35/0.8 tested reference is rated 4,000 kVA at 37 / 0.8 kV and is supported by Type Test Report 24XB0336-S. Cable arrangement, switching scheme, protection and enclosure configuration are selected according to the project."
    ],
    side: "An integrated outdoor transformer package combining the transformer, high-voltage switching and fuse protection for renewable-energy and compact distribution systems.",
    detail: [
      "Tianyu Pad-Mounted Transformers combine the oil-immersed transformer, high-voltage load switch and fuse protection within a compact outdoor assembly. The integrated arrangement reduces separate field equipment and supports solar, storage and distribution applications.",
      "The ZGS22-4000/35/0.8 reference configuration is rated 4,000 kVA at 37 / 0.8 kV. Type Test Report 24XB0336-S references the IEC 60076 series and IEC/IEEE 60076-16 and includes short-circuit and lightning-impulse testing, IP65 protection for the high- and low-voltage compartments, IP68 for the transformer section and high-altitude evaluation using a 5,000 m reference condition.",
      "Final cable entry, switching scheme, fuse arrangement, protection, enclosure and site interfaces are confirmed according to the project electrical design and installation conditions."
    ]
  }
];

const paragraphs = (items) => items.map((text) => `<p>${text}</p>`).join("");

function replaceDivContent(segment, className, content) {
  const re = new RegExp(`<div class="${className}">[\\s\\S]*?<\\/div>`);
  return segment.replace(re, `<div class="${className}">${content}</div>`);
}

function replaceOverview(config) {
  const needle = `id="${config.id}"`;
  const marker = html.indexOf(needle);
  if (marker < 0) return;
  const start = html.lastIndexOf("<section", marker);
  const endTag = html.indexOf("</section>", marker);
  if (start < 0 || endTag < 0) return;
  const end = endTag + "</section>".length;
  let segment = html.slice(start, end);

  segment = replaceDivContent(segment, "catalog-editorial-prose", paragraphs(config.overview));

  const photoPair = `<div class="catalog-product-photo-pair">${config.images.map(([src, alt]) => `<figure><img src="${src}" alt="${alt}" loading="lazy"></figure>`).join("")}</div>`;
  segment = segment.replace(/<div class="product-hero-image">[\s\S]*?<\/div>/, photoPair);
  segment = segment.replace(/(<div class="product-overview-copy">)\s*<p>[\s\S]*?<\/p>/, `$1<p>${config.side}</p>`);

  html = html.slice(0, start) + segment + html.slice(end);
}

function replaceDetail(config) {
  const overviewNeedle = `id="${config.id}"`;
  const overviewMarker = html.indexOf(overviewNeedle);
  if (overviewMarker < 0) return;
  const overviewEnd = html.indexOf("</section>", overviewMarker);
  if (overviewEnd < 0) return;
  const titleNeedle = `<h2>${config.title}</h2>`;
  const title = html.indexOf(titleNeedle, overviewEnd + 10);
  if (title < 0) return;
  const start = html.lastIndexOf('<section class="catalog-sheet product-evidence-sheet catalog-product-detail-sheet">', title);
  const endTag = html.indexOf("</section>", title);
  if (start < 0 || endTag < 0) return;
  const end = endTag + "</section>".length;
  let segment = html.slice(start, end);
  segment = replaceDivContent(segment, "catalog-product-detail-prose", paragraphs(config.detail));
  segment = segment.replace("Tested configurations, certification, drawings and project applications.", "Product specifications, tested reference configurations and project applications.");
  html = html.slice(0, start) + segment + html.slice(end);
}

for (const config of productConfig) replaceOverview(config);
for (const config of productConfig) replaceDetail(config);

// Rewrite editorial sections in company voice instead of explaining how the catalog is organized.
html = html.replace(
  /<div class="catalog-editorial-intro">[\s\S]*?<\/div>/,
  `<div class="catalog-editorial-intro"><p>Tianyu Electric supplies transformers and prefabricated substations for utility, renewable-energy, industrial and infrastructure applications. The portfolio covers distribution transformers, high-voltage power transformers, cast-resin dry-type transformers, prefabricated substations and pad-mounted transformer solutions.</p><p>Product pages present series ratings, tested reference configurations, certificates and test reports, engineering drawings and project applications together with the technical information required for quotation.</p></div>`
);

const companyStart = html.indexOf('id="company"');
if (companyStart >= 0) {
  const start = html.lastIndexOf("<section", companyStart);
  const endTag = html.indexOf("</section>", companyStart);
  if (start >= 0 && endTag >= 0) {
    const end = endTag + "</section>".length;
    let segment = html.slice(start, end);
    segment = replaceDivContent(segment, "catalog-editorial-prose", `<p>Founded in 1996, Fuzhou Tianyu Electric Co., Ltd. manufactures transformers, prefabricated substations, switchgear and primary electrical equipment for utility, renewable-energy, industrial and infrastructure projects. The company operates as a wholly-owned subsidiary of XJ Group Corporation under China Electrical Equipment Group Co., Ltd.</p><p>Tianyu combines product engineering, manufacturing, testing and project documentation for medium- and high-voltage applications. The current export portfolio includes energy-efficient distribution transformers, 110–220 kV power-transformer references, SCB18 cast-resin dry-type transformers, 35 kV prefabricated substations and pad-mounted transformer solutions.</p>`);
    html = html.slice(0, start) + segment + html.slice(end);
  }
}

const manufacturingStart = html.indexOf('id="manufacturing"');
if (manufacturingStart >= 0) {
  const start = html.lastIndexOf("<section", manufacturingStart);
  const endTag = html.indexOf("</section>", manufacturingStart);
  if (start >= 0 && endTag >= 0) {
    const end = endTag + "</section>".length;
    let segment = html.slice(start, end);
    segment = replaceDivContent(segment, "catalog-editorial-prose", `<p>Transformer manufacturing covers magnetic-core processing, coil winding, insulation preparation, drying, active-part assembly, enclosure integration and final inspection. Process control at each stage supports the required losses, temperature rise, insulation performance, acoustic performance and mechanical strength.</p><p>Routine factory tests are completed according to the applicable product specification. Independent type-test reports and third-party certificates are identified separately by model and report number in the relevant product sections.</p>`);
    html = html.slice(0, start) + segment + html.slice(end);
  }
}

// Remove remaining internal/editorial phrases that read like commentary to the catalog author.
html = html
  .replaceAll("The published series capability is kept separate from the exact 630 kVA and 1600 kVA models covered by the attached third-party reports.", "The series supports project-specific ratings and configurations, with 630 kVA and 1,600 kVA 22 kV units available as tested reference models.")
  .replaceAll("Four attached independent reports provide model-specific evidence from 50 MVA / 110 kV through 240 MVA / 220 kV.", "Tested reference configurations cover 50 MVA / 110 kV through 240 MVA / 220 kV.")
  .replaceAll("The current evidence set covers SCB18 1000 kVA and 2500 kVA models at 10 kV.", "Tested SCB18 reference configurations include 1,000 kVA and 2,500 kVA models at 10 kV.");

fs.copyFileSync(path.join(__dirname, "catalog-layout-v6.css"), cssTarget);
fs.writeFileSync(catalogPath, html);
console.log("Catalog V6: two product images, company-facing copy, four-across certificates, enlarged two-across drawings and right-aligned product typography.");
