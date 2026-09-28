import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { products } from "./products-data.mjs";
import { documents } from "./documents-data.mjs";
import { highVoltageSeries, distributionSeries, dryTypeSeries, prefabricatedSeries } from "./catalog-v3-data.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const catalogPath = path.join(dist, "catalog.html");
const cssSource = path.join(path.dirname(fileURLToPath(import.meta.url)), "catalog-product-focus.css");
const cssTarget = path.join(dist, "assets", "css", "catalog-product-focus.css");

if (!fs.existsSync(catalogPath)) throw new Error("Product-focused catalog: dist/catalog.html is missing.");

const esc = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));
const media = (value) => `assets/media/${value}`;
const findProduct = (id) => products.find((item) => item.id === id);
const customerDescription = (product) => {
  const descriptions = {
    "high-voltage-power-transformer": "Oil-immersed power transformers for utility substations, grid interconnection and major industrial systems.",
    "oil-immersed-distribution-transformer": "Oil-immersed distribution transformers for utility, renewable-energy and industrial networks.",
    "cast-resin-dry-type-transformer": "Cast-resin dry-type transformers for indoor distribution, commercial buildings and industrial loads.",
    "dry-type-prefabricated-substation": "Factory-assembled dry-type substations combining high-voltage, transformer and low-voltage equipment.",
    "oil-immersed-prefabricated-substation": "Compact oil-immersed substations for renewable-energy collection and outdoor distribution.",
    "american-type-combined-transformer": "Compact integrated transformer packages for pad-mounted renewable-energy and distribution applications."
  };
  return descriptions[product.id] || String(product.description || "");
};
const documentNumber = (value) => value === "Report on supplied PDF" ? "Technical report" : value;

const imageSets = {
  "high-voltage-power-transformer": [
    ["products/power-transformers/oil-immersed-power-transformer-installed.png", "Oil-immersed power transformer installed view"],
    ["products/power-transformers/oil-immersed-power-transformer-isolated-01.jpeg", "Oil-immersed power transformer isolated view"]
  ],
  "oil-immersed-distribution-transformer": [
    ["products/distribution-transformers/oil-immersed-distribution-transformer-sealed-01.webp", "Sealed oil-immersed distribution transformer"],
    ["products/distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp", "Conservator-type distribution transformer"]
  ],
  "cast-resin-dry-type-transformer": [
    ["products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg", "Cast-resin dry-type transformer finished product"],
    ["products/dry-type-transformers/cast-resin-transformer-core-coil-assembly.jpeg", "Cast-resin dry-type transformer core and coil assembly"]
  ],
  "dry-type-prefabricated-substation": [
    ["products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp", "Dry-type prefabricated substation exterior"],
    ["products/prefabricated-substations/dry-type-prefabricated-substation-interior.webp", "Dry-type prefabricated substation transformer compartment"]
  ],
  "oil-immersed-prefabricated-substation": [
    ["products/prefabricated-substations/oil-prefabricated-substation-exterior-01.webp", "Oil-immersed prefabricated substation exterior"],
    ["products/prefabricated-substations/oil-prefabricated-substation-hv-compartment-interior.webp", "Oil-immersed prefabricated substation transformer compartment"]
  ],
  "american-type-combined-transformer": [
    ["products/combined-transformers/american-type-combined-transformer-exterior-01.webp", "American-type combined transformer exterior"],
    ["products/combined-transformers/american-type-combined-transformer-exterior-02.webp", "American-type combined transformer alternative view"],
    ["products/combined-transformers/american-type-combined-transformer-lv-cabinet-interior.webp", "American-type combined transformer LV cabinet"]
  ]
};

const drawingSets = {
  "high-voltage-power-transformer": [["catalog-assets/drawings/power-transformer-50mva-110kv-cropped.webp", "50 MVA / 110 kV test-circuit schematic"]],
  "oil-immersed-distribution-transformer": [["catalog-assets/drawings/oil-distribution-1600kva-sound-layout.webp", "1600 kVA sound-level measurement layout"]],
  "cast-resin-dry-type-transformer": [["catalog-assets/drawings/dry-type-scb18-2500kva-cropped.webp", "SCB18 2500 kVA / 10 kV test-circuit schematic"]],
  "dry-type-prefabricated-substation": [["drawings/european-substation-6300kva-cropped.webp", "YB 6300 kVA / 35 kV outline drawing"]],
  "oil-immersed-prefabricated-substation": [["drawings/china-substation-10000kva-cropped.webp", "Oil-immersed substation 10000 kVA / 35 kV outline drawing"]],
  "american-type-combined-transformer": []
};

// Parameter pages use a matching visual reference on the right. Main-transformer
// pages use the exterior-dimension drawings from the English catalog; product
// photos remain the fallback only where no separate outline plate is available.
const parameterDrawings = {
  "high-voltage-power-transformer": [
    ["catalog-assets/drawings/power-transformer-35kv-english-catalog-drawing.png", "35 kV transformer external-dimension drawing"],
    ["catalog-assets/drawings/power-transformer-66kv-english-catalog-drawing.png", "66 kV transformer external-dimension drawing"]
  ],
  "oil-immersed-distribution-transformer": [
    ["catalog-assets/drawings/oil-distribution-12kv-english-drawing.png", "12 kV distribution transformer external-dimension drawing"],
    ["products/distribution-transformers/catalog-energy-efficient-oil-immersed-transformer.png", "12 kV distribution transformer product reference"],
    ["catalog-assets/drawings/oil-distribution-40kv-english-drawing.png", "40.5 kV renewable transformer external-dimension drawing"]
  ],
  "cast-resin-dry-type-transformer": [
    ["catalog-assets/drawings/dry-type-scb14-18-english-product-reference-hq.png", "SC(B)14 / SC(B)18 dry-type transformer product reference from English catalog"],
    ["products/dry-type-transformers/cast-resin-transformer-core-coil-assembly.jpeg", "SC(B)14 / SC(B)18 dry-type transformer core and coil reference"],
    ["catalog-assets/drawings/dry-type-scbh17-19-chinese-catalog-product-reference-hq.png", "SC(B)H17 / SC(B)H19 amorphous-alloy dry-type transformer product reference from 519 catalog"],
    ["products/dry-type-transformers/amorphous-alloy-dry-type-transformer-with-fans.jpeg", "Amorphous-alloy dry-type transformer product reference"]
  ],
  "dry-type-prefabricated-substation": [["catalog-assets/drawings/prefabricated-yb-english-product-reference-hq.png", "YB prefabricated substation product reference from English catalog"]],
  "oil-immersed-prefabricated-substation": [["catalog-assets/drawings/prefabricated-ybh-english-product-reference-hq.png", "YBH Chinese-type substation product reference from English catalog"]],
  "american-type-combined-transformer": [["catalog-assets/drawings/prefabricated-zgs-english-product-reference-hq.png", "ZGS American-type combined transformer product reference from English catalog"]]
};

const modelMeta = {
  "S-M-630/22-Tier2": ["630 kVA", "22 / 0.42 kV"],
  "S-M-1600/22-Tier2": ["1600 kVA", "22 / 0.42 kV"],
  "SZ22-50000/110-NX1": ["50 MVA", "110 / 10.5 kV"],
  "SFZ-150000/132": ["150 MVA", "132 / 21 kV"],
  "SSZ20-240000/220": ["240 MVA", "220 / 115 / 38.5 kV"],
  "SSZ22-240000/220-NX1": ["240 MVA", "220 / 115 / 38.5 kV"],
  "SCB18-1000/10-NX1": ["1000 kVA", "10 / 0.4 kV"],
  "SCB18-2500/10": ["2500 kVA", "10 / 0.4 kV"],
  "YB-40.5/1.14-6300": ["6300 kVA", "35 / 1.14 kV"],
  "YB-40.5/1.14-10000": ["10 MVA", "37 / 1.14 kV"],
  "YB-40.5/1.14-12500": ["12.5 MVA", "37 / 1.14 kV"],
  "YB-40.5-10000": ["10 MVA", "37 / 1.14 kV"],
  "YB-40.5/1.14-12500 (GY)": ["12.5 MVA", "37 / 1.14 kV"],
  "ZGS22-4000/35/0.8": ["4000 kVA", "37 / 0.8 kV"]
};

const configs = [
  { id: "high-voltage-power-transformer", label: "POWER TRANSFORMERS", kicker: "Main transformer platforms", scope: "35 / 66 / 110 / 220 kV", note: "Oil-immersed, three-winding and on-load regulating configurations are selected by project voltage and capacity.", features: ["Three-phase oil-immersed construction", "On-load tap-changing arrangements", "Transport and insulation coordination", "Project-specific cooling and monitoring"], tags: ["Utility substations", "Grid interconnection", "Industrial power"], series: highVoltageSeries.map((row) => ({ name: row.name, model: row.model, voltage: row.voltage, capacity: row.capacity, detail: `Tap ${row.tap} · ${row.vector}` })) },
  { id: "oil-immersed-distribution-transformer", label: "DISTRIBUTION TRANSFORMERS", kicker: "Medium-voltage distribution", scope: "S(B)20 / S(B)22 platform", note: "12 kV distribution and 40.5 kV renewable configurations cover utility and industrial networks.", features: ["Low-loss magnetic core", "Sealed or conservator configurations", "ONAN cooling", "Copper or project-specific winding material"], tags: ["Utility distribution", "Industrial loads", "Commercial sites"], series: [distributionSeries.general12kV, distributionSeries.renewable40kV, distributionSeries.rectifier].map((row) => ({ name: row.name, model: row.capacity, voltage: row.voltage || "35 kV and below", capacity: row.capacity || "Project engineered", detail: [row.frequency, row.vector, row.winding].filter(Boolean).join(" · ") })) },
  { id: "cast-resin-dry-type-transformer", label: "DRY-TYPE TRANSFORMERS", kicker: "SC(B)14 / SC(B)18 and SC(B)H17 / SC(B)H19 series", scope: "35 kV and below", note: "Energy-saving cast-resin and amorphous-alloy dry-type transformer series from the 519 catalog, with capacity-by-capacity values shown on the following parameter sheets.", features: ["Oil-free cast-resin insulation", "SC(B)14 / SC(B)18 silicon-steel series", "SC(B)H17 / SC(B)H19 amorphous-alloy series", "AN / AF cooling and temperature monitoring"], tags: ["Commercial buildings", "Data centers", "Charging infrastructure", "Industry"], series: dryTypeSeries.families.map((row) => ({ name: row.name, model: row.capacity, voltage: "35 kV and below", capacity: row.capacity, detail: row.detail })) },
  { id: "dry-type-prefabricated-substation", label: "PREFABRICATED SUBSTATIONS", kicker: "YB European-type substation", scope: "YB · 200–8,000 kVA", note: "The English catalog presents YB as a complete box-substation platform integrating transformer, high-voltage switchgear and low-voltage distribution.", features: ["Factory-assembled HV, transformer and LV package", "Dry-type or oil-immersed transformer option", "Protection, metering and compensation interfaces", "Outdoor enclosure"], tags: ["Wind", "Solar", "Energy storage", "Distribution"], series: [prefabricatedSeries[1]].map((row) => ({ name: row.name, model: "Series parameter table", voltage: row.voltage, capacity: row.capacity, detail: row.detail })) },
  { id: "oil-immersed-prefabricated-substation", label: "PREFABRICATED SUBSTATIONS", kicker: "YBH Chinese-type substation", scope: "YBH · 200–12,500 kVA", note: "YBH is shown as a separate Chinese-type box-substation family with separated high-voltage switching and transformer-oil sections.", features: ["Separated HV switching and transformer sections", "Dry-type or oil-immersed transformer option", "High-voltage breaking capacity up to 31.5 kA for applicable schemes", "Outdoor enclosure"], tags: ["Solar", "Wind", "Utility", "Industrial"], series: [prefabricatedSeries[2]].map((row) => ({ name: row.name, model: "Series parameter table", voltage: row.voltage, capacity: row.capacity, detail: row.detail })) },
  { id: "american-type-combined-transformer", label: "COMBINED TRANSFORMERS", kicker: "ZGS American-type combined transformer", scope: "ZGS · 200–4,000 kVA", note: "ZGS integrates the transformer body, high-voltage load switch and fuse in an insulated-liquid package for compact outdoor distribution.", features: ["Integrated transformer, load switch and fuse", "Compact pad-mounted arrangement", "Low-voltage metering and compensation interfaces", "Renewable and terminal-distribution applications"], tags: ["Solar collection", "BESS", "Compact distribution"], series: [{ name: "ZGS American-type combined transformer", model: "Series parameter table", voltage: "HV 7.2–40.5 kV · LV 0.315–1.14 kV", capacity: "200–4,000 kVA", detail: "Oil-immersed integrated platform" }] }
].map((config) => ({ ...config, product: findProduct(config.id), images: imageSets[config.id], drawings: drawingSets[config.id] }));

const docsFor = (id) => documents.filter((item) => item.productIds?.includes(id) && item.status !== "pending-asset").slice(0, 4);
const params = (product) => product.technicalParameters || [];

const dryCapacities = ["30", "50", "80", "100", "125", "160", "200", "250", "315", "400", "500", "630*", "630", "800", "1000", "1250", "1600", "2000", "2500"];
const dryLoadLoss = [
  ["605 / 640 / 685", "605 / 640 / 685"], ["845 / 900 / 965", "845 / 900 / 965"],
  ["1160 / 1240 / 1330", "1160 / 1240 / 1330"], ["1330 / 1415 / 1520", "1330 / 1415 / 1520"],
  ["1565 / 1665 / 1780", "1565 / 1665 / 1780"], ["1800 / 1915 / 2050", "1800 / 1915 / 2050"],
  ["2135 / 2275 / 2440", "2135 / 2275 / 2440"], ["2330 / 2485 / 2665", "2330 / 2485 / 2665"],
  ["2945 / 3125 / 3355", "2945 / 3125 / 3355"], ["3375 / 3590 / 3850", "3375 / 3590 / 3850"],
  ["4130 / 4390 / 4705", "4130 / 4390 / 4705"], ["4975 / 5290 / 5660", "4975 / 5290 / 5660"],
  ["5050 / 5365 / 5760", "5050 / 5365 / 5760"], ["5895 / 6265 / 6715", "5895 / 6265 / 6715"],
  ["6885 / 7315 / 7885", "6885 / 7315 / 7885"], ["8190 / 8720 / 9335", "8190 / 8720 / 9335"],
  ["9945 / 10555 / 11320", "9945 / 10555 / 11320"], ["12240 / 13005 / 14005", "12240 / 13005 / 14005"],
  ["14535 / 15445 / 16605", "14535 / 15445 / 16605"]
];
const drySeriesRows = (noLoadA, currentA, noLoadB, currentB) => dryCapacities.map((capacity, index) => [
  capacity, `${noLoadA[index]} / ${currentA[index]}`, dryLoadLoss[index][0],
  `${noLoadB[index]} / ${currentB[index]}`, dryLoadLoss[index][1],
  ["4", "6–8"][index < 11 ? 0 : 1]
]);

const scb18NoLoad = [105, 155, 210, 230, 270, 310, 360, 415, 510, 570, 670, 775, 750, 875, 1020, 1205, 1415, 1760, 2080];
const scb18Current = [1.46, 1.46, 1.09, 1.09, 0.95, 0.95, 0.8, 0.8, 0.73, 0.73, 0.73, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.51, 0.51];
const scb14NoLoad = [130, 185, 250, 270, 320, 365, 420, 490, 600, 665, 790, 910, 885, 1035, 1205, 1420, 1665, 2075, 2450];
const scb14Current = [1.46, 1.46, 1.09, 1.09, 0.95, 0.95, 0.8, 0.8, 0.73, 0.73, 0.73, 0.62, 0.62, 0.62, 0.62, 0.62, 0.62, 0.51, 0.51];
const scbh19NoLoad = [50, 60, 85, 90, 105, 120, 140, 160, 195, 215, 250, 295, 290, 335, 385, 455, 530, 700, 840];
const scbh17NoLoad = [60, 75, 100, 110, 130, 145, 170, 195, 235, 265, 305, 360, 350, 410, 470, 550, 645, 850, 1020];
const scbhCurrent = [1.6, 1.4, 1.3, 1.2, 1.1, 1.1, 1, 1, 0.9, 0.8, 0.8, 0.7, 0.7, 0.7, 0.6, 0.6, 0.6, 0.5, 0.5];
const scbSeriesRows = drySeriesRows(scb18NoLoad, scb18Current, scb14NoLoad, scb14Current);
const scbhSeriesRows = drySeriesRows(scbh19NoLoad, scbhCurrent, scbh17NoLoad, scbhCurrent);

const parameterBlocks = {
  "high-voltage-power-transformer": highVoltageSeries.map((series) => ({
    title: series.name,
    headers: ["Capacity (kVA)", "No-load loss (kW)", "Load loss (kW)", "I0 (%)", "Z (%)", "Dimensions (mm)", "Weight (kg)"],
    rows: series.rows.map((row) => [
      row[0], row[1], row[2], row[3],
      row.length === 7 ? row[4] : (series.impedance || "—"),
      row.length === 7 ? row[5] : row[4],
      row.length === 7 ? row[6] : (row.length === 6 ? row[5] : "—")
    ])
  })),
  "oil-immersed-distribution-transformer": [
    {
      title: "12 kV oil-immersed distribution transformer parameters",
      headers: ["Capacity (kVA)", "No-load loss (kW)", "Load loss (kW)", "I0 (%)", "Z (%)", "L×W×H (mm)", "Weight (kg)"],
      rows: [
        ["30", "0.065", "0.455", "1.20", "4", "630×380×600", "350"],
        ["50", "0.080", "0.655", "1.04", "4", "730×400×680", "400"],
        ["63", "0.090", "0.785", "0.96", "4", "750×430×690", "570"],
        ["80", "0.105", "0.945", "0.96", "4", "780×430×700", "600"],
        ["100", "0.120", "1.140", "0.88", "4", "800×450×730", "650"],
        ["125", "0.135", "1.360", "0.88", "4", "850×490×750", "700"],
        ["160", "0.160", "1.665", "0.80", "4", "950×550×900", "830"],
        ["200", "0.190", "1.970", "0.80", "4", "1050×600×930", "900"],
        ["250", "0.230", "2.300", "0.72", "4", "1080×600×950", "1000"],
        ["315", "0.270", "2.760", "0.72", "4", "1200×750×1000", "1210"],
        ["400", "0.330", "3.250", "0.64", "4", "1350×880×1190", "1450"],
        ["500", "0.385", "3.900", "0.64", "4", "1400×910×1230", "1680"],
        ["630", "0.460", "4.460", "0.48", "4.5", "1500×950×1270", "1980"],
        ["800", "0.560", "5.400", "0.48", "4.5", "1830×1220×1270", "2470"],
        ["1000", "0.660", "7.415", "0.48", "4.5", "1790×1290×1380", "2680"],
        ["1250", "0.780", "8.640", "0.40", "4.5", "1820×1350×1450", "3110"],
        ["1600", "0.940", "10.44", "0.40", "4.5", "1960×1480×1500", "3850"],
        ["2000", "1.085", "13.18", "0.32", "5", "2020×1450×1550", "4600"],
        ["2500", "1.280", "15.27", "0.32", "5", "2090×1510×1290", "5550"]
      ]
    },
    {
      title: "40.5 kV renewable-energy transformer parameters",
      headers: ["Capacity (kVA)", "No-load loss (kW)", "Load loss (kW)", "I0 (%)", "Z (%)"],
      rows: [
        ["1000", "0.6", "10.4", "0.52", "6–14"],
        ["1250", "0.8", "12.5", "0.44", "6–14"],
        ["1600", "0.9", "14.9", "0.36", "6–14"],
        ["2000", "1.2", "16.5", "0.36", "6–14"],
        ["2500", "1.4", "17.6", "0.36", "6–14"],
        ["3000", "1.6", "20.3", "0.36", "6–14"],
        ["3150", "1.7", "20.7", "0.36", "6–14"],
        ["4000", "2.0", "24.6", "0.36", "6–14"],
        ["4500", "2.2", "27.1", "0.36", "6–14"],
        ["5000", "2.4", "28.2", "0.36", "6–14"],
        ["5500", "2.6", "30.3", "0.36", "6–14"],
        ["6300", "2.9", "31.5", "0.36", "6–14"],
        ["8000", "4.0", "34.6", "0.28", "6–14"],
        ["10000", "4.8", "40.8", "0.28", "6–14"],
        ["12500", "5.6", "50.7", "0.24", "6–14"]
      ]
    }
  ],
  "cast-resin-dry-type-transformer": [
    { title: "SC(B)14 / SC(B)18 silicon-steel series · 30–500 kVA · 10 / 10.5 / 11 kV to 0.4 kV · ±5% / ±2×2.5% · Yyn0 / Dyn11", headers: ["Capacity (kVA)", "SCB18 no-load W / I0 (%)", "SCB18 load loss @130 / 155 / 180°C (W)", "SCB14 no-load W / I0 (%)", "SCB14 load loss @130 / 155 / 180°C (W)", "Z (%)"], rows: scbSeriesRows.slice(0, 11) },
    { title: "SC(B)14 / SC(B)18 silicon-steel series · 630–2500 kVA · 10 / 10.5 / 11 kV to 0.4 kV · ±5% / ±2×2.5% · Yyn0 / Dyn11", headers: ["Capacity (kVA)", "SCB18 no-load W / I0 (%)", "SCB18 load loss @130 / 155 / 180°C (W)", "SCB14 no-load W / I0 (%)", "SCB14 load loss @130 / 155 / 180°C (W)", "Z (%)"], rows: scbSeriesRows.slice(11) },
    { title: "SC(B)H17 / SC(B)H19 amorphous-alloy series · 30–500 kVA · 10 / 10.5 / 11 kV to 0.4 kV · ±5% / ±2×2.5% · Yyn0 / Dyn11", headers: ["Capacity (kVA)", "SCBH19 no-load W / I0 (%)", "SCBH19 load loss @130 / 155 / 180°C (W)", "SCBH17 no-load W / I0 (%)", "SCBH17 load loss @130 / 155 / 180°C (W)", "Z (%)"], rows: scbhSeriesRows.slice(0, 11) },
    { title: "SC(B)H17 / SC(B)H19 amorphous-alloy series · 630–2500 kVA · 10 / 10.5 / 11 kV to 0.4 kV · ±5% / ±2×2.5% · Yyn0 / Dyn11", headers: ["Capacity (kVA)", "SCBH19 no-load W / I0 (%)", "SCBH19 load loss @130 / 155 / 180°C (W)", "SCBH17 no-load W / I0 (%)", "SCBH17 load loss @130 / 155 / 180°C (W)", "Z (%)"], rows: scbhSeriesRows.slice(11) }
  ],
  "dry-type-prefabricated-substation": [{
    title: "YB European-type prefabricated substation parameters",
    headers: ["Item", "Unit", "Parameter"],
    rows: [
      ["Rated voltage", "kV", "LV 0.315–1.14 · HV 7.2–40.5"], ["Rated frequency", "Hz", "50"], ["Rated capacity", "kVA", "200–8,000"], ["Rated short-time withstand voltage", "kV/1 min", "5 (LV) · 85 (HV)"], ["Protection grade", "—", "IP33 · IP43 · IP54 · IP65"], ["Energy efficiency level", "—", "Grade 1–3"], ["Transformer type", "—", "Dry-type or oil-immersed transformer"], ["High-voltage switchgear", "—", "Air cabinet, C-GIS, handcart or fixed type; load switch, fuse, circuit breaker and metering options"], ["Low-voltage switchgear", "—", "Fixed or drawer type; incoming, outgoing, compensation and metering options"], ["Breaking current", "kA", "LV 50–100 · HV 20–40"]
    ]
  }],
  "oil-immersed-prefabricated-substation": [{
    title: "YBH Chinese-type prefabricated substation parameters",
    headers: ["Item", "Unit", "Parameter"],
    rows: [
      ["Rated voltage", "kV", "LV 0.315–1.14 · HV 7.2–40.5"], ["Rated frequency", "Hz", "50"], ["Rated capacity", "kVA", "200–12,500"], ["Rated short-time withstand voltage", "kV/1 min", "5 (LV) · 85 (HV)"], ["Protection grade", "—", "IP33 · IP43 · IP54 · IP65"], ["Energy efficiency level", "—", "Grade 1–3"], ["Transformer type", "—", "Dry-type or oil-immersed transformer"], ["High-voltage switchgear", "—", "Air cabinet, C-GIS, handcart or fixed type; load switch, fuse, circuit breaker and metering options"], ["Low-voltage switchgear", "—", "Fixed or drawer type; incoming, outgoing, compensation and metering options"], ["Breaking current", "kA", "LV 50–100 · HV up to 31.5"]
    ]
  }],
  "american-type-combined-transformer": [{
    title: "ZGS American-type combined transformer parameters",
    headers: ["Item", "Unit", "Parameter"],
    rows: [
      ["Rated voltage", "kV", "LV 0.315–1.14 · HV 7.2–40.5"], ["Rated frequency", "Hz", "50"], ["Rated capacity", "kVA", "200–4,000"], ["Rated short-time withstand voltage", "kV/1 min", "5 (LV) · 85 (HV)"], ["Protection grade", "—", "Below IP65"], ["Energy efficiency level", "—", "Grade 1–3"], ["Transformer type", "—", "Oil-immersed integrated transformer"], ["Switch type", "—", "LV fixed type; HV oil-immersed load switch + fuse"], ["Breaking current", "kA", "LV 50–100 · HV 20–40"]
    ]
  }]
};

// The 12 kV table has nineteen capacity rows. Split it into two sheets so the
// source values remain readable at the same minimum table size as every other
// technical page.
const distribution12Block = parameterBlocks["oil-immersed-distribution-transformer"][0];
parameterBlocks["oil-immersed-distribution-transformer"] = [
  { ...distribution12Block, title: "12 kV oil-immersed distribution transformer parameters · 30–500 kVA", rows: distribution12Block.rows.slice(0, 12) },
  { ...distribution12Block, title: "12 kV oil-immersed distribution transformer parameters · 630–2500 kVA", rows: distribution12Block.rows.slice(12) },
  parameterBlocks["oil-immersed-distribution-transformer"][1]
];

// The client edition keeps two main-transformer tables. The second table uses
// representative capacity points so the table and its drawing remain legible
// together on one A4 landscape sheet.
const mainTechnicalBlocks = parameterBlocks["high-voltage-power-transformer"].slice(0, 2).map((block, index) => index === 1
  ? { ...block, rows: block.rows.filter((_, rowIndex) => [0, 1, 3, 5, 7, 9, 10].includes(rowIndex)) }
  : block);

function technicalTable(block) {
  const compact = block.rows.length > 10 ? " pf-technical-table-compact" : "";
  const vertical = block.headers.length === 3 ? " pf-technical-table-vertical" : "";
  return `<section class="pf-technical-block"><h3>${esc(block.title)}</h3><div class="pf-technical-table-wrap"><table class="pf-technical-table${compact}${vertical}"><thead><tr>${block.headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead><tbody>${block.rows.map((row) => `<tr>${row.map((cell, index) => `<td${index === 0 ? " class=\"pf-model-cell\"" : ""}>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;
}

const modelRows = (product) => (product.testedModels || []).map((model) => {
  const doc = documents.find((item) => item.testedModel === model && item.productIds?.includes(product.id));
  const meta = modelMeta[model] || [doc?.ratedPower || "Project reference", doc?.ratedVoltage || "Project configuration"];
  return { modelLabel: model, capacity: meta[0], voltage: meta[1] };
});

function imageFigure([src, alt], role) {
  const imageKey = src.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `<figure class="pf-media-card pf-media-${imageKey}"><img src="${media(src)}" alt="${esc(alt)}" loading="eager"></figure>`;
}

function header(eyebrow, title, lead = "") {
  return `<header class="pf-sheet-head"><p class="pf-eyebrow">${esc(eyebrow)}</p><h2>${esc(title)}</h2>${lead ? `<p class="pf-lead">${esc(lead)}</p>` : ""}</header>`;
}

function overviewSpecs(config) {
  const product = config.product;
  const base = product.seriesCapability || {};
  const capacity = product.id === "american-type-combined-transformer" ? "4,000 kVA reference" : (base.capacity || "Project-engineered");
  const items = [["Series", product.id === "high-voltage-power-transformer" ? config.scope : (product.strapline || config.scope)], ["Voltage", base.voltage || "Project-specific"], ["Capacity", capacity], ["Cooling", base.cooling || "Project-specific"]];
  return `<div class="pf-overview-specs">${items.map(([label, value]) => `<div class="pf-overview-spec"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("")}</div>`;
}

function overview(config, number) {
  const product = config.product;
  const imageRoles = ["Installed product view", "Product or configuration detail", "Internal or auxiliary detail"];
  const overviewImages = config.images.slice(0, 2);
  return `<section class="pf-sheet pf-overview" id="product-${config.id}"><span class="pf-page">${String(number).padStart(2, "0")}</span>${header(config.label, product.name, customerDescription(product))}<div class="pf-overview-grid"><div class="pf-overview-visual"><div class="pf-gallery pf-gallery-2">${overviewImages.map((img, index) => imageFigure(img, imageRoles[index])).join("")}</div></div><aside class="pf-platform"><div class="pf-overview-intro"><p class="pf-card-kicker">${esc(config.kicker)}</p><p class="pf-platform-description">${esc(config.note)}</p></div>${overviewSpecs(config)}<div class="pf-overview-lower"><div><p class="pf-card-kicker">Key features</p><ul>${config.features.slice(0, 4).map((feature) => `<li>${esc(feature)}</li>`).join("")}</ul></div><div><p class="pf-card-kicker">Applications</p><p class="pf-applications">${esc(config.tags.join(" · "))}</p></div></div></aside></div></section>`;
}

function seriesAndModelsSection(config, number) {
  if (config.id !== "high-voltage-power-transformer") return "";
  const seriesRows = config.series.map((row) => [row.name, row.capacity || "Published platform", row.voltage || "Project-specific", row.detail || ""]);
  const rangeImages = config.images.slice(0, 2).map(([src, alt]) => `<figure class="pf-range-media"><img src="${media(src)}" alt="${esc(alt)}" loading="eager"></figure>`).join("");
  return `<section class="pf-sheet pf-range-sheet" id="range-${config.id}"><span class="pf-page">${String(number).padStart(2, "0")}</span>${header("PRODUCT RANGE", `${config.product.name} range`)}<div class="pf-range-layout"><div class="pf-range-table-wrap"><table class="pf-range-table"><thead><tr><th>Series</th><th>Capacity</th><th>Voltage</th><th>Configuration</th></tr></thead><tbody>${seriesRows.map((row) => `<tr>${row.map((cell, index) => `<td${index === 0 ? " class=\"pf-family\"" : ""}>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div><div class="pf-range-media-grid">${rangeImages}</div></div></section>`;
}

function technicalPage(config, blocks, number, suffix, drawing) {
  const [drawingSrc, drawingAlt] = drawing || [];
  return `<section class="pf-sheet pf-technical-sheet" id="technical-${config.id}-${suffix}"><span class="pf-page">${String(number).padStart(2, "0")}</span>${header("TECHNICAL PARAMETERS", `${config.product.name} parameter table`)}<div class="pf-technical-layout"><div class="pf-technical-content">${blocks.map(technicalTable).join("")}</div>${drawingSrc ? `<figure class="pf-parameter-drawing"><img src="${media(drawingSrc)}" alt="${esc(drawingAlt)}"><figcaption>${esc(drawingAlt)}</figcaption></figure>` : ""}</div></section>`;
}

function evidenceSection(config, number) {
  const docs = docsFor(config.id);
  if (!docs.length && !config.drawings.length) return "";
  const diagramHeading = ["dry-type-prefabricated-substation", "oil-immersed-prefabricated-substation"].includes(config.id) ? "Engineering drawings" : "Reference diagrams";
  return `<section class="pf-sheet pf-resources-sheet" id="documents-${config.id}"><span class="pf-page">${String(number).padStart(2, "0")}</span>${header("TECHNICAL DOCUMENTS", `${config.product.name} documents`)}<div class="pf-documents-layout"><div><h3>Certificates and test reports</h3><div class="pf-document-list">${docs.length ? docs.map((doc) => `<article><p>${esc((doc.tags || [doc.type]).slice(0, 2).join(" · "))}</p><strong>${esc(doc.type === "type-test" ? "Type test report" : "Test report or certificate")}</strong><span>${esc([doc.ratedPower, doc.ratedVoltage].filter(Boolean).join(" · ") || "Configuration-specific technical evidence")}</span></article>`).join("") : ""}</div></div>${config.drawings.length ? `<div><h3>${diagramHeading}</h3><div class="pf-drawing-list">${config.drawings.map(([src, alt]) => `<figure class="pf-drawing"><img src="${media(src)}" alt="${esc(alt)}"><figcaption>${esc(alt)}</figcaption></figure>`).join("")}</div></div>` : ""}</div></section>`;
}

function portfolio(number) {
  return `<section class="pf-sheet pf-cover" id="cover"><img src="${media("products/power-transformers/oil-immersed-power-transformer-installed.png")}" alt="Oil-immersed power transformer installed view" class="pf-cover-image"><div class="pf-cover-shade"></div><div class="pf-cover-copy"><p>TIANYU ELECTRIC</p><h1>Product Catalog</h1><span>Transformers · Prefabricated Substations · Combined Transformers</span><small>Export edition · 2026</small></div></section><section class="pf-sheet" id="contents"><span class="pf-page">${String(number).padStart(2, "0")}</span>${header("PRODUCT PORTFOLIO", "Transformer and substation platforms")}<div class="pf-portfolio-grid">${configs.map((config) => `<article class="pf-portfolio-card"><img src="${media(config.images[0][0])}" alt="${esc(config.images[0][1])}" loading="eager"><div><p>${esc(config.label)}</p><h3>${esc(config.product.name)}</h3><span>${esc(config.scope)}</span></div></article>`).join("")}</div></section>`;
}

function selection(number) {
  const rows = [
    ["Power Transformers", "35 / 66 / 110 / 220 kV platforms", "50–240 MVA tested references", "Oil immersed"],
    ["Distribution Transformers", "12 kV and below; 40.5 kV renewable platform", "30–2,500 kVA published 12 kV series", "Oil immersed"],
    ["Dry-Type Transformers", "35 kV and below", "SCB18 1,000 / 2,500 kVA tested references", "Cast resin"],
    ["Prefabricated Substations", "7.2–40.5 kV HV; project LV", "YB / YBH ranges and tested configurations", "Dry or oil immersed"],
    ["Combined Transformers", "7.2–40.5 kV HV; project LV", "4,000 kVA tested reference", "Integrated oil-filled package"]
  ];
  return `<section class="pf-sheet" id="selection"><span class="pf-page">${String(number).padStart(2, "0")}</span>${header("SELECTION GUIDE", "Find a platform by voltage, capacity and configuration")}<div class="pf-selection-table-wrap"><table class="pf-selection-table"><thead><tr><th>Product family</th><th>Voltage scope</th><th>Capacity / reference scope</th><th>Construction</th></tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell, index) => `<td${index === 0 ? " class=\"pf-family\"" : ""}>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;
}

function specials(number) {
  const cards = [
    ["35-110kv-mobile-intelligent-substation", "Mobile intelligent substation", "Vehicle-mounted / towable system for temporary supply and emergency restoration.", "products/special-transformers/catalog-mobile-prefabricated-substation.png"],
    ["rectifier-transformer", "ZBS / ZBSCB rectifier transformer", "Oil-immersed or dry-type rectifier transformer configurations for industrial DC systems.", "products/special-transformers/dry-type-rectifier-transformer-red.jpeg"],
    ["amorphous-alloy-dry-type-transformer", "SC(B)H17 / SC(B)H19 amorphous-alloy transformer", "Energy-saving dry-type transformer family with an amorphous-alloy core for low no-load loss.", "products/dry-type-transformers/amorphous-alloy-dry-type-transformer-with-fans.jpeg"],
    ["pv-ess-integrated-substation", "PV / BESS integrated station", "Factory-integrated converter or inverter, transformer and medium-voltage switchgear package.", "products/prefabricated-substations/catalog-energy-storage-converter-booster-system.png"]
  ];
  return `<section class="pf-sheet" id="special-solutions"><span class="pf-page">${String(number).padStart(2, "0")}</span>${header("SPECIAL PRODUCT PLATFORMS", "Application-led product configurations", "These configurations extend the main transformer and substation range for renewable-energy, mobile-supply and offshore applications.")}<div class="pf-special-grid">${cards.map(([, title, text, image]) => `<article><img src="${media(image)}" alt="${esc(title)}" loading="eager"><div><p>${esc(title)}</p><span>${esc(text)}</span></div></article>`).join("")}</div></section>`;
}

function options(number) {
  const rows = [
    ["Electrical ratings", "Rated power, HV / MV / LV voltage, frequency, phase, vector group"],
    ["Performance", "Impedance, no-load loss, load loss, temperature rise, sound and efficiency target"],
    ["Insulation and regulation", "Insulation levels, tap range, OLTC or off-circuit tapping"],
    ["Installation", "Indoor / outdoor, altitude, ambient temperature, coastal or corrosive environment"],
    ["Interfaces", "Bushings, cable entry, switchgear, protection, metering, monitoring and communications"],
    ["Documents", "Single-line diagram, tender specification, site layout, load profile and harmonic data"]
  ];
  return `<section class="pf-sheet" id="rfq"><span class="pf-page">${String(number).padStart(2, "0")}</span>${header("TECHNICAL REVIEW", "Information required for quotation")}<div class="pf-rfq-grid">${rows.map(([label, value]) => `<div><strong>${esc(label)}</strong><span>${esc(value)}</span></div>`).join("")}</div></section>`;
}

const sections = [];
let page = 1;
sections.push(portfolio(page++));
for (const config of configs) {
  sections.push(overview(config, page++));
  const range = seriesAndModelsSection(config, page);
  if (range) {
    sections.push(range);
    page++;
  }
  if (config.id === "high-voltage-power-transformer") {
    mainTechnicalBlocks.forEach((block, index) => sections.push(technicalPage(config, [block], page++, String(index + 1), parameterDrawings[config.id][index])));
  } else if ((parameterBlocks[config.id] || []).length) {
    parameterBlocks[config.id].forEach((block, index) => sections.push(technicalPage(config, [block], page++, String(index + 1), parameterDrawings[config.id]?.[index])));
  }
}
sections.push(specials(page++));
sections.push(options(page));

const html = `<!doctype html><html lang="en"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Tianyu Electric Product Catalog 2026</title>
  <meta name="description" content="Tianyu Electric product catalog for transformers, prefabricated substations and combined transformer platforms.">
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="assets/css/catalog-product-focus.css">
 </head><body class="product-focused-catalog">
  <main class="pf-catalog">${sections.join("\n")}</main>
</body></html>`;

fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);
fs.writeFileSync(catalogPath, html);
console.log(`Product-focused catalog: wrote ${sections.length} content sheets with one shared product data model.`);
