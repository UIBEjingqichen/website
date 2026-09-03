import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "dist", "catalog.html");
const cssTarget = path.join(root, "dist", "assets", "css", "catalog-core-parameters-v8.css");

if (!fs.existsSync(catalogPath)) throw new Error("dist/catalog.html is missing.");
let html = fs.readFileSync(catalogPath, "utf8");

const cssHref = "assets/css/catalog-core-parameters-v8.css?v=20260819-1";
if (!html.includes("catalog-core-parameters-v8.css")) {
  html = html.replace("</head>", `  <link rel="stylesheet" href="${cssHref}">\n</head>`);
} else {
  html = html.replace(/assets\/css\/catalog-core-parameters-v8\.css(?:\?[^\"]*)?/g, cssHref);
}

const table = (headers, rows, cls = "") => `<div class="catalog-core-table-wrap"><table class="catalog-core-table ${cls}"><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((cell, i) => `<td${i === 0 ? ' class="value-strong"' : ''}>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const kv = (items) => `<div class="catalog-core-kv">${items.map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join("")}</div>`;
const foot = (items) => `<div class="catalog-core-foot">${items.map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join("")}</div>`;
const note = `<p class="catalog-core-note"><strong>Evidence scope.</strong> Values below are taken from uploaded Tianyu test reports / third-party certificates for the stated reference configurations. They are not a blanket certification of every capacity or voltage in the wider product family. “Specified / measured” preserves the report distinction.</p>`;
const sheet = (title, subtitle, body, eyebrow = "TESTED REFERENCE PARAMETERS") => `<section class="catalog-sheet catalog-core-params-sheet"><div class="sheet-head compact-sheet-head"><p>${eyebrow}</p><h2>${title}</h2><span>${subtitle}</span></div>${note}${body}</section>`;

const pages = new Map();

pages.set("Oil-Immersed Distribution Transformer", [
  sheet(
    "Oil-Immersed Distribution Transformer",
    "Electrical, loss, impedance, sound and insulation data for the two TÜV-tested 22 kV reference configurations.",
    table(
      ["Model", "Capacity", "HV / LV", "Rated Current HV / LV", "Tap Range", "Vector", "Cooling", "P₀ No-load Loss", "Pₖ Load Loss @75°C", "I₀", "Z", "Sound Power"],
      [
        ["S-M-630/22-Tier2", "630 kVA", "22 / 0.42 kV", "16.53 / 866 A", "±2×2.5%", "Dyn5", "ONAN", "≤0.54 kW", "≤4.60 kW", "0.40% (+30%)", "6.0% (±10%)", "≤45 dB(A)"],
        ["S-M-1600/22-Tier2", "1600 kVA", "22 / 0.42 kV", "41.99 / 2199 A", "±2×2.5%", "Dyn5", "ONAN", "≤1.08 kW", "≤12.00 kW", "0.40% (+30%)", "6.0% (±10%)", "≤57 dB(A)"]
      ]
    ) + `<h3 class="catalog-core-subtitle">Rated Insulation Levels</h3>` +
    table(
      ["Model", "HV Um / LI / LIC / AC", "LV Um / LI / LIC / AC", "LV Neutral Um / LI / AC"],
      [
        ["S-M-630/22-Tier2", "24 / 125 / 138 / 50 kV", "1.1 / 20 / 22 / 10 kV", "1.1 / 20 / 10 kV"],
        ["S-M-1600/22-Tier2", "24 / 125 / 138 / 50 kV", "1.1 / 20 / 22 / 10 kV", "1.1 / 20 / 10 kV"]
      ]
    ) + foot([
      ["Evidence", "TÜV Certificate of Conformity + complete IEC type-test reports"],
      ["Frequency / phase", "50 Hz · three-phase · outdoor"],
      ["Series data gap", "Full Tianyu capacity-by-capacity S(B)20 / S(B)22 performance table not yet in the uploaded evidence set"]
    ])
  )
]);

pages.set("High-Voltage Power Transformer", [
  sheet(
    "High-Voltage Power Transformer",
    "Rated electrical data across the documented 110 kV, 132 kV and 220 kV Tianyu reference transformers.",
    table(
      ["Model", "Rated Capacity", "Rated Voltage", "Rated Current", "Tap Range", "Vector Group", "Cooling", "Frequency", "Report"],
      [
        ["SZ22-50000/110-NX1", "50 MVA", "110 / 10.5 kV", "262.4 / 2749.4 A", "±8×1.25%", "YNd11", "ONAN", "50 Hz", "21M2078-S"],
        ["SFZ-150000/132", "150 MVA", "132 / 21 kV", "656.1 / 4124 A", "±9×1.67%", "YNd11", "ONAN / ONAF (120 / 150 MVA)", "50 Hz", "21M2079-S"],
        ["SSZ20-240000/220", "240 / 240 / 240 MVA", "220 / 115 / 38.5 kV", "629.8 / 1204.9 / 3599.1 A", "HV ±8×1.25%", "YNyn0d11", "ONAN", "50 Hz", "21M0905-S"],
        ["SSZ22-240000/220-NX1", "240 / 240 / 240 MVA", "220 / 115 / 38.5 kV", "629.8 / 1205 / 3599 A", "HV ±8×1.25%", "YNyn0d11", "ONAN", "50 Hz", "23M1317-S"]
      ]
    ) + foot([
      ["Reference range evidenced", "50–240 MVA · 110–220 kV"],
      ["Design character", "Project-engineered main transformers; final impedance, tapping, cooling and interfaces follow the system study"],
      ["Series data gap", "A complete Tianyu 35 / 110 / 132 / 220 kV capacity-by-capacity sales performance table is not yet uploaded"]
    ])
  ),
  sheet(
    "High-Voltage Power Transformer",
    "Loss, impedance and insulation data. Loss columns show specified / measured values from the corresponding report.",
    table(
      ["Model", "I₀ Spec / Meas", "P₀ kW Spec / Meas", "Impedance Spec / Meas", "Pₖ kW Spec / Meas", "Total Loss kW Spec / Meas"],
      [
        ["SZ22-50000/110-NX1", "≤0.30 / 0.09%", "21.000 / 20.468", "10.5%±3% / 10.46%", "175.000 / 172.957", "196.000 / 193.426"],
        ["SFZ-150000/132 (ONAF)", "0.30 / 0.07%", "69.600 / 58.500", "15.5%±3% / 15.76%", "422.000 / 420.6614", "491.600 / 479.1610"],
        ["SFZ-150000/132 (ONAN)", "same no-load reference", "same no-load reference", "Measured 12.61%", "Measured 269.223", "Measured 327.723"],
        ["SSZ20-240000/220", "<0.30 / 0.14%", "100.000 / 94.076", "H-L 24% / 24.12%; H-M 14% / 14.05%; M-L 8% / 8.02%", "667.000 / 659.332", "767.000 / 753.408"],
        ["SSZ22-240000/220-NX1", "0.20 / 0.09%", "85.000 / 83.558", "H-L 24% / 23.74%; H-M 14% / 13.99%; M-L 8% / 8.18%", "667.000 / 625.856", "752.000 / 709.414"]
      ]
    ) + `<h3 class="catalog-core-subtitle">Rated Insulation Levels</h3>` +
    table(
      ["Model", "HV", "HV Neutral", "MV", "MV Neutral", "LV"],
      [
        ["SZ22-50000/110-NX1", "126/480/530/200 kV", "72.5/325/140 kV", "—", "—", "12/75/85/35 kV"],
        ["SFZ-150000/132", "145/650/715/275 kV", "72.5/325/140 kV", "—", "—", "24/125/140/55 kV"],
        ["SSZ20-240000/220", "252/750/950/1050/395 kV", "126/400/200 kV", "126/480/530/200 kV", "72.5/325/140 kV", "40.5/200/220/85 kV"],
        ["SSZ22-240000/220-NX1", "252/750/950/1050/395 kV", "126/400/200 kV", "126/395/480/530/200 kV", "72.5/325/140 kV", "40.5/200/220/85 kV"]
      ]
    )
  )
]);

pages.set("Cast Resin Dry-Type Transformer", [
  sheet(
    "Cast Resin Dry-Type Transformer",
    "Rated electrical, loss, impedance, temperature-rise, sound and partial-discharge data for SCB18 tested references.",
    table(
      ["Model", "Capacity", "HV / LV", "Current HV / LV", "Tap", "Vector", "Cooling", "Thermal Class", "HV Insulation", "LV Insulation"],
      [
        ["SCB18-1000/10-NX1", "1000 kVA", "10 / 0.4 kV", "57.7 / 1443.4 A", "±2×2.5%", "Dyn11", "AN / AF", "H", "12/75/35 kV", "≤1.1/5 kV"],
        ["SCB18-2500/10", "2500 kVA", "10 / 0.4 kV", "144.3 / 3608.4 A", "±2×2.5%", "Dyn11", "AN / AF", "H", "12/75/35 kV", "≤1.1/5 kV"]
      ]
    ) + `<h3 class="catalog-core-subtitle">Measured / Evaluated Performance</h3>` +
    table(
      ["Model", "I₀ Spec / Meas", "P₀ kW Spec / Meas", "Z Spec / Meas", "Pₖ @145°C Spec / Meas", "Total Loss Meas", "Temp Rise HV / LV", "Sound LPA / LWA", "PD @1.3Ur A/B/C"],
      [
        ["SCB18-1000/10-NX1", "0.70 / 0.51%", "1.020 / 0.9435", "6.0%±10% / 6.06%", "7.885 / 7.4311", "8.3746 kW", "100.6 / 99.4 K", "37 / 51 dB(A)", "<2 / <3 / <2 pC"],
        ["SCB18-2500/10", "0.60%+30% / 0.15%", "2.080 / 1.8368", "6.0%±10% / 6.10%", "16.605 / 15.6824", "17.5192 kW", "101.6 / 104.8 K", "39 / 54 dB(A)", "<4 / <4 / <3 pC"]
      ]
    ) + foot([
      ["Evidence", "26N0284-S · 26N0286-S"],
      ["Verified construction", "Three-phase · 50 Hz · 10/0.4 kV · cast-resin dry type"],
      ["Missing in current evidence", "Full series dimensions, weights and a capacity-by-capacity Tianyu SCB18 sales performance table"]
    ])
  )
]);

pages.set("European-Type Prefabricated Substation", [
  sheet(
    "European-Type Prefabricated Substation",
    "Complete-station configuration data for the 6.3, 10 and 12.5 MVA dry-transformer reference substations.",
    table(
      ["Station Model", "Capacity", "Transformer", "Transformer Voltage", "Tap", "Cooling / Vector", "HV Switchgear", "LV Main Breaker", "HV IAC", "Protection", "Weight", "Dimensions L×W×H"],
      [
        ["YB-40.5/1.14-6300", "6300 kVA", "SCB13-6300/35", "35 / 1.14 kV", "±2×2.5%", "AN/AF · Dyn11", "HXGN26-40.5(Z)/T630-25", "TeW5F-6300HU", "IAC-AB 20 kA · 1 s", "IP44 · IK10", "27,150 kg", "6220×2800×2900 mm"],
        ["YB-40.5/1.14-10000", "10000 kVA", "SCB18-10000/35-NX1", "37 / 1.14 kV", "±2×2.5%", "AN/AF · Dyn11", "HXGN26-40.5/630-31.5", "BW3-63HU", "IAC-AB 31.5 kA · 1 s", "IP65 · IK10", "26,600 kg", "7850×3350×3450 mm"],
        ["YB-40.5/1.14-12500", "12500 kVA", "SCB18-12500/35-NX1", "37 / 1.14 kV", "±2×2.5%", "AN/AF · Dyn11", "HXGN26-40.5/630-31.5", "BW3-80HU", "IAC-AB 31.5 kA · 1 s", "IP65 · IK10", "28,600 kg", "7850×3350×3450 mm"]
      ]
    ) + foot([
      ["IEC type-test basis", "6300: IEC 62271-202:2014 · 10000/12500: IEC 62271-202:2022"],
      ["High-altitude references", "10000 / 12500 kVA reports: ≤4500 m; 6300 kVA altitude not explicitly listed in the summary parameter page"],
      ["System scope", "HV equipment + dry transformer + LV equipment + enclosure assessed as a prefabricated substation"]
    ])
  ),
  sheet(
    "European-Type Prefabricated Substation",
    "Transformer loss / impedance values recorded within each tested complete-station configuration, plus station and transformer acoustic results.",
    table(
      ["Capacity", "I₀ Spec / Meas", "P₀ kW Spec / Meas", "Z Spec / Meas", "Pₖ kW Spec / Meas", "Total Loss kW Spec / Meas", "Correction Temp"],
      [
        ["6300 kVA", "0.60 / 0.14%", "6.930 / 6.8469", "8.0% / 8.05%", "35.370 / 34.9418", "42.300 / 41.7887", "145°C"],
        ["10000 kVA", "0.45%+30% / 0.19%", "8.200 / 7.7390", "8.0%±10% / 8.27%", "55.700 / 52.8741", "63.900 / 60.6131", "145°C"],
        ["12500 kVA", "0.35%+30% / 0.15%", "9.690 / 8.8203", "8.0%±10% / 8.15%", "65.800 / 62.1530", "75.490 / 70.9733", "145°C"]
      ]
    ) + `<h3 class="catalog-core-subtitle">Acoustic Results</h3>` +
    table(
      ["Capacity", "Station LPA", "Station LWA", "Transformer LPA", "Transformer LWA"],
      [
        ["6300 kVA", "40 dB(A)", "59 dB(A)", "47 dB(A)", "64 dB(A)"],
        ["10000 kVA", "46 dB(A)", "64 dB(A)", "51 dB(A)", "68 dB(A)"],
        ["12500 kVA", "42 dB(A)", "61 dB(A)", "51 dB(A)", "68 dB(A)"]
      ]
    )
  )
]);

pages.set("Compact Prefabricated Substation", [
  sheet(
    "Compact Prefabricated Substation",
    "Complete-station configuration data for the oil-immersed GY 10 and 12.5 MVA tested references.",
    table(
      ["Station Model", "Capacity", "Transformer", "Voltage", "Tap", "Cooling / Vector", "HV Switchgear", "LV Main Breaker", "HV IAC", "Protection", "Altitude", "Dimensions L×W×H"],
      [
        ["YB-40.5/1.14-10000 (GY)", "10000 kVA", "S22-10000/35-NX1", "37 / 1.14 kV", "±2×2.5%", "ONAN · Dyn11", "HXGN26-40.5/630-31.5", "BW3-63HU", "IAC-AB 31.5 kA · 1 s", "Station/HV/LV IP65 · transformer IP68 · IK10", "≤5000 m", "5225×3440×3460 mm"],
        ["YB-40.5/1.14-12500 (GY)", "12500 kVA", "S22-12500/35-NX1", "37 / 1.14 kV", "±2×2.5%", "ONAN · Dyn11", "HXGN26-40.5/630-31.5", "KFW3-7500HU", "IAC-AB 31.5 kA · 1 s", "Station/HV/LV IP54 · transformer compartment IP68 · IK10", "≤4000 m", "5003×3112×2554 mm"]
      ]
    ) + foot([
      ["Weight", "Both tested references: 27,500 kg"],
      ["IEC type-test basis", "10000: IEC 62271-202:2022 · 12500: IEC 62271-202:2014"],
      ["Configuration warning", "IP rating and other complete-station declarations follow the tested configuration; they are not automatically identical across every GY variant"]
    ])
  ),
  sheet(
    "Compact Prefabricated Substation",
    "Oil-immersed transformer performance values recorded inside the tested GY complete-station configurations.",
    table(
      ["Capacity", "I₀ Spec / Meas", "P₀ kW Spec / Meas", "Z Spec / Meas", "Pₖ @75°C Spec / Meas", "Total Loss kW Spec / Meas"],
      [
        ["10000 kVA", "0.32 / 0.16%", "4.800 / 4.6076", "8.0%±10% / 8.17%", "40.800 / 39.4295", "45.600 / 44.0371"],
        ["12500 kVA", "0.15%+30% / 0.09%", "5.500 / 5.390", "8.0%±10% / 8.17%", "48.400 / 48.180", "53.900 / 53.570"]
      ]
    ) + `<h3 class="catalog-core-subtitle">Acoustic Results</h3>` +
    table(
      ["Capacity", "No-load LPA / LWA", "Load LPA / LWA", "Combined LPA / LWA"],
      [
        ["10000 kVA", "37 / 54 dB(A)", "35 / 52 dB(A)", "36 / 56 dB(A)"],
        ["12500 kVA", `<span class="catalog-core-missing">Not specified in uploaded report</span>`, `<span class="catalog-core-missing">Not specified in uploaded report</span>`, `<span class="catalog-core-missing">Not specified in uploaded report</span>`]
      ]
    ) + foot([
      ["Energy performance", "10000 kVA report states measured transformer losses meet GB 20052-2024 Grade 1 requirements; 12500 kVA report references GB 20052-2020 Grade 1"],
      ["LV internal arc", "10000 kVA: Class C; 12500 kVA summary does not state the LV arc class"],
      ["Evidence", "26XB0129-S · 23XB0332-S"]
    ])
  )
]);

pages.set("Pad-Mounted Transformer", [
  sheet(
    "Pad-Mounted Transformer",
    "Comprehensive reference data for ZGS22-4000/35/0.8 renewable-energy combined transformer, report 24XB0336-S.",
    kv([
      ["Reference Model", "ZGS22-4000/35/0.8"],
      ["Rated Capacity", "4000 kVA"],
      ["Maximum Equipment Voltage", "40.5 kV"],
      ["Rated Voltage", "37 / 0.8 kV"],
      ["Rated Current", "62.4 / 2886.8 A"],
      ["Frequency / Phase", "50 Hz · 3-phase"],
      ["Tap Range", "±2×2.5%"],
      ["Vector Group", "Dy11"],
      ["Cooling / Thermal Class", "ONAN · Class A"],
      ["HV Insulation Um/LI/LIC/AC", "40.5 / 200 / 220 / 85 kV"],
      ["LV Insulation Um/AC", "≤1.1 / 5 kV"],
      ["Protection", "HV/LV compartments IP65 · transformer tank IP68"],
      ["Test Altitude Correction", "5000 m"],
      ["Overall Dimensions", `<span class="catalog-core-missing">Missing in uploaded evidence</span>`],
      ["Weight", `<span class="catalog-core-missing">Missing in uploaded evidence</span>`],
      ["Evidence", "24XB0336-S"]
    ]) + `<h3 class="catalog-core-subtitle">Loss, Impedance, Temperature Rise &amp; Sound</h3>` +
    table(
      ["Parameter", "Specified", "Measured Before Short-Circuit", "Measured After Short-Circuit / Other Result"],
      [
        ["No-load Current I₀", "0.36%", "0.23%", "0.23%"],
        ["No-load Loss P₀", "2.000 kW", "1.9823 kW", "1.9692 kW"],
        ["Short-circuit Impedance", "7.0% ±10%", "7.30%", "7.29%"],
        ["Load Loss @75°C", "24.600 kW", "24.1500 kW", "24.3850 kW"],
        ["Total Loss", "26.600 kW", "26.1323 kW", "26.3542 kW"],
        ["Temperature Rise", "Top oil 50 K · windings 55 K", "Top oil 42.4 K · HV 53.9 K · LV 53.2 K", "Capacity assessment: 4000 kVA compliant"],
        ["Sound Power", "≤58 dB(A)", "No-load 50 dB(A)", "Load 56 dB(A) · combined 57 dB(A)"]
      ]
    )
  )
]);

html = html.replace(/(<section class="catalog-sheet product-evidence-sheet catalog-product-detail-sheet catalog-product-spec-sheet">([\s\S]*?)<\/section>)/g, (section, _whole, body) => {
  const title = body.match(/<h2>([\s\S]*?)<\/h2>/)?.[1]?.trim();
  const extraPages = title ? pages.get(title) : null;
  if (!extraPages?.length) return section;
  return `${section}\n${extraPages.join("\n")}`;
});

fs.copyFileSync(path.join(__dirname, "catalog-core-parameters-v8.css"), cssTarget);
fs.writeFileSync(catalogPath, html);
console.log("Catalog V8: inserted comprehensive tested-reference parameter sheets for all six primary product families.");
