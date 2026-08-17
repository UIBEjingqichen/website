import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const catalogPath = path.join(dist, "catalog.html");
const cssTarget = path.join(dist, "assets", "css", "catalog-refine-v3.css");

if (!fs.existsSync(catalogPath)) throw new Error("dist/catalog.html is missing. Run the catalog build first.");

let html = fs.readFileSync(catalogPath, "utf8");

if (!html.includes("catalog-refine-v3.css")) {
  html = html.replace("</head>", `  <link rel="stylesheet" href="assets/css/catalog-refine-v3.css">\n</head>`);
}

function addAfterHead(sectionNeedle, proseHtml) {
  const sectionStart = html.indexOf(sectionNeedle);
  if (sectionStart < 0) return;
  const headEnd = html.indexOf("</div>", html.indexOf('class="sheet-head"', sectionStart));
  if (headEnd < 0) return;
  const insertAt = headEnd + 6;
  if (html.slice(sectionStart, insertAt + proseHtml.length + 200).includes("catalog-editorial-prose")) return;
  html = html.slice(0, insertAt) + proseHtml + html.slice(insertAt);
}

const prose = (paragraphs) => `<div class="catalog-editorial-prose">${paragraphs.map((text) => `<p>${text}</p>`).join("")}</div>`;

addAfterHead('id="company"', prose([
  "Fuzhou Tianyu Electric Co., Ltd. was established in 1996 and operates as a wholly-owned subsidiary of XJ Group Corporation under China Electrical Equipment Group Co., Ltd. The company focuses on transformers, prefabricated substations, switchgear and other primary electrical equipment for utility, renewable-energy, industrial and infrastructure projects.",
  "This export catalog is organized around the information an engineering buyer normally needs before issuing an inquiry: product-family capability, exact tested reference models, available third-party evidence, project applications and the main parameters that must be confirmed before manufacturing. Series capability and test evidence are intentionally shown separately so that a configurable product range is not confused with the exact sample covered by a named report."
]));

addAfterHead('id="manufacturing"', prose([
  "Transformer performance is the result of a chain of manufacturing decisions rather than a single final inspection. Core processing, coil winding, insulation preparation, drying, assembly and final testing all influence losses, temperature rise, insulation performance, noise and mechanical reliability. The equipment and process images in this catalog are therefore presented as part of the manufacturing story, not as decorative factory photography.",
  "Routine manufacturing and factory verification must also be distinguished from independent type testing. Where a third-party report is available, the exact report number and tested model are identified later in the catalog. This separation allows a customer to see what Tianyu manufactures in-house and what has been independently verified on a specific reference configuration."
]));

addAfterHead('id="quality"', prose([
  "The current evidence library contains twenty certificate and test-report records covering distribution transformers, high-voltage power transformers, cast-resin dry-type transformers, prefabricated substations and a renewable-energy combined transformer. These documents are organized by model and rating rather than displayed as a generic certificate wall.",
  "For export projects, this distinction matters. A report proves the performance of the sample and configuration identified in that document. When voltage, capacity, winding arrangement, losses, insulation level, cooling, enclosure or other major parameters change, the final project configuration must be reviewed against the applicable specification and market requirements."
]));

const productNarratives = {
  "oil-immersed-distribution-transformer": [
    "The S(B)20 / S(B)22 oil-immersed distribution platform is intended for utility and industrial distribution duties where low losses, sealed construction and controlled noise are important. The published family covers 22 kV and below and extends up to 4,000 kVA, while the current independent evidence set is concentrated on two exact 22 kV reference models at 630 kVA and 1,600 kVA.",
    "Those two reference models are particularly important for export work because the available evidence includes TÜV certificates, IEC complete type-test reports, efficiency reports and CE / Ecodesign verification records. Project orders can still be engineered for different ratings, tapping, impedance, accessories and installation requirements, but any major change must be reviewed against the tested reference configuration and the destination-market requirements."
  ],
  "high-voltage-power-transformer": [
    "High-voltage power transformers are project-engineered main transformers rather than catalogue-stock distribution units. Tianyu's current reference set covers 110 kV, 132 kV and 220 kV equipment, with independently documented capacities of 50 MVA, 150 MVA and 240 MVA. These products are intended for substations, grid interconnection and major industrial power systems.",
    "A quotation for this class of transformer starts from the electrical system and site rather than from a single model number. Capacity, system voltages, vector group, impedance, tapping range, cooling arrangement, insulation levels, losses, monitoring, transport limits and project standards all affect the final design. The four listed report sets therefore serve as capability references for specific tested designs, not as a blanket specification for every 110–220 kV project."
  ],
  "cast-resin-dry-type-transformer": [
    "The SCB18 cast-resin family is intended for indoor and fire-sensitive distribution environments where an oil-free insulation system, low maintenance and compact installation are valuable. Current catalog capability is shown up to 35 kV, while the exact third-party evidence available today covers 10 kV SCB18 models at 1,000 kVA and 2,500 kVA.",
    "Dry-type transformer selection is closely tied to the installation environment. Cooling arrangement, enclosure, temperature monitoring, ventilation, vector group and project-specific fire or environmental requirements should be confirmed together with the basic electrical ratings. The tested SCB18 references provide a proven baseline from which those project options can be reviewed."
  ],
  "dry-type-prefabricated-substation": [
    "The European-Type Prefabricated Substation is a complete outdoor package integrating high-voltage primary equipment, a dry-type transformer and low-voltage distribution within one prefabricated enclosure. It is therefore better understood as a substation system than as a transformer alone. Tianyu's published range covers primary voltages up to 35 kV and capacities up to 12.5 MVA.",
    "The dry-type transformer configuration removes transformer-oil leakage risk and is suited to renewable-energy, storage, urban-distribution and environmentally constrained projects. The current evidence set includes 6.3 MVA, 10 MVA and 12.5 MVA reference models. Final switchgear scheme, protection, metering, auxiliary power, cable entry, monitoring and enclosure arrangement remain project-specific."
  ],
  "oil-immersed-prefabricated-substation": [
    "The Compact Prefabricated Substation combines an oil-immersed transformer with high-voltage and low-voltage equipment in a compact outdoor package. Compared with the dry-type prefabricated family, this configuration supports a higher published series capacity, up to 15 MVA, while retaining the factory-assembled substation concept.",
    "This family is aimed at renewable-energy, utility and industrial projects where compact footprint and outdoor environmental performance are important. Current tested references include 10 MVA and 12.5 MVA configurations. Anti-corrosion design, sealing, ventilation, structural loading, protection level, monitoring and cable interfaces are reviewed according to the actual site."
  ],
  "american-type-combined-transformer": [
    "The Pad-Mounted Transformer is a highly integrated outdoor solution in which the transformer body, high-voltage load switch and fuse protection are combined into a compact assembly. This architecture reduces the amount of separate field equipment and is particularly suited to renewable-energy collection systems and compact distribution sites.",
    "The current validated reference is ZGS22-4000/35/0.8, rated 4,000 kVA at 37 / 0.8 kV. The supplied type-test report records IEC 60076-series and IEC/IEEE 60076-16 references together with short-circuit, lightning-impulse and protection-degree evidence. The wider product family remains configurable, so final cable arrangement, protection scheme, enclosure requirements and site conditions must still be confirmed for each project."
  ]
};

for (const [id, paragraphs] of Object.entries(productNarratives)) {
  addAfterHead(`id="product-${id}"`, prose(paragraphs));
}

addAfterHead('id="projects"', prose([
  "Project references are included to show where each product family has been applied rather than to provide a simple customer-logo list. The current database covers renewable energy, energy storage, utility substations, cement and chemical industry, transportation infrastructure and other power-distribution projects in China and overseas markets.",
  "For a prospective buyer, the most useful comparison is between the electrical duty of a reference project and the new project under review. Project scale alone does not determine transformer suitability, so voltage, capacity, system configuration, environment and applicable technical standards should always be compared together."
]));

addAfterHead('id="engineering"', prose([
  "Transformer products are configurable, but customization is not unlimited substitution. A tested platform gives engineering a known starting point, while the final design is adjusted to the electrical system, load, environment, standards and interfaces of the project. Some changes, such as accessories or monitoring, may be relatively local; others, such as voltage, impedance, core design, harmonic duty, insulation level or loss target, can affect the fundamental design and the relevance of existing test evidence.",
  "For this reason Tianyu reviews the project specification before freezing the technical schedule. The objective is to identify which requirements can remain within an established platform, which require a new engineered configuration and which may require additional verification for the destination market or the customer's own technical specification."
]));

addAfterHead('id="rfq"', prose([
  "A transformer quotation becomes more accurate as soon as the electrical duty and site conditions are defined. Capacity and voltage alone are rarely sufficient for a final technical offer. Frequency, vector group, impedance, tapping, insulation levels, loss requirements, ambient temperature, altitude, installation method, accessories and the governing standard can all change the design and price.",
  "When available, a single-line diagram, tender specification, load profile, harmonic information and cable-interface drawing should be supplied with the inquiry. These documents allow engineering to compare the requirement against an existing platform and reduce avoidable revisions later in the project."
]));

html = html.replace(
  '<div class="portfolio-columns">',
  `<div class="catalog-editorial-intro"><p>This catalog is designed as an engineering sales document rather than a web-style product index. Each product family is introduced with its operating role and configurable range, followed by the exact models for which test evidence is currently available.</p><p>For first-stage product selection, use the portfolio below to identify the correct family. For quotation and compliance review, continue to the tested-model, evidence, project and RFQ sections.</p></div><div class="portfolio-columns">`
);

fs.copyFileSync(path.join(__dirname, "catalog-refine-v3.css"), cssTarget);
fs.writeFileSync(catalogPath, html);
console.log("Refined catalog V3 with continuous editorial styling and expanded explanatory copy.");