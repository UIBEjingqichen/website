import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const productsDir = path.join(root, "dist", "products");

const read = (file) => fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
const write = (file, html) => fs.writeFileSync(file, html, "utf8");
const esc = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

const profiles = {
  dry: {
    model: "SCB18-2500/10",
    source: "Dry-type tested reference · report 26N0286-S",
    rows: [
      ["Rated power", "2,500 kVA"],
      ["Rated voltage", "10 / 0.4 kV"],
      ["Rated current HV / LV", "144.3 / 3608.4 A"],
      ["Tap / vector group", "±2×2.5% · Dyn11"],
      ["Cooling / thermal class", "AN / AF · Class H"],
      ["Impedance", "6.0%±10% spec · 6.10% measured"],
      ["No-load loss", "2.080 kW spec · 1.8368 kW measured"],
      ["Load loss @145°C", "16.605 kW spec · 15.6824 kW measured"]
    ]
  },
  oil: {
    model: "S-M-630/22-Tier2",
    source: "Oil-immersed distribution tested reference · report CN25IM0T 001",
    rows: [
      ["Rated power", "630 kVA"],
      ["Rated voltage", "22(±2×2.5%) / 0.42 kV"],
      ["Rated current HV / LV", "16.53 / 866 A"],
      ["Frequency", "50 Hz"],
      ["Vector group", "Dyn5"],
      ["Cooling", "ONAN"],
      ["Short-circuit impedance", "6.0%±10%"],
      ["Loss reference", "P0 ≤0.54 kW · Pk ≤4.6 kW @75°C"]
    ]
  },
  power110: {
    model: "SZ22-50000/110-NX1",
    source: "High-voltage power transformer tested reference · report 21M2078-S",
    rows: [
      ["Rated power", "50 MVA"],
      ["Rated voltage", "110 / 10.5 kV"],
      ["Rated current HV / LV", "262.4 / 2749.4 A"],
      ["Tap range", "±8×1.25%"],
      ["Vector / cooling", "YNd11 · ONAN"],
      ["Impedance", "10.5%±3% spec · 10.46% measured"],
      ["No-load loss", "21.000 kW spec · 20.468 kW measured"],
      ["Load loss @75°C", "175.000 kW spec · 172.957 kW measured"]
    ]
  },
  power220: {
    model: "SSZ20-240000/220",
    source: "220 kV power transformer tested reference · report 21M0905-S",
    rows: [
      ["Rated power", "240 MVA"],
      ["Rated voltage", "220 / 115 / 38.5 kV"],
      ["Rated current HV / MV / LV", "629.8 / 1204.9 / 3599.1 A"],
      ["Tap range", "HV ±8×1.25%"],
      ["Vector / cooling", "YNyn0d11 · ONAN"],
      ["Impedance", "H-L 24.12% · H-M 14.05% · M-L 8.02%"],
      ["No-load loss", "100.000 kW spec · 94.076 kW measured"],
      ["Load loss @75°C", "667.000 kW spec · 659.332 kW measured"]
    ]
  },
  power35: {
    model: "SZ18-36000/37",
    source: "35 kV family project reference · export performance record",
    rows: [
      ["Rated power", "36 MVA"],
      ["Recorded voltage", "37 kV"],
      ["Product category", "35 kV oil-immersed power transformer"],
      ["Application reference", "Copper-mine solar / storage / diesel project"],
      ["Country", "Democratic Republic of the Congo"],
      ["Record year", "2025"]
    ]
  },
  power66: {
    model: "SZ-40000/69",
    source: "66 / 69 kV family project reference · export performance record",
    rows: [
      ["Rated power", "40 MVA"],
      ["Recorded voltage", "69 kV"],
      ["Product category", "66 kV oil-immersed power transformer"],
      ["Application reference", "33 MW photovoltaic project"],
      ["Country", "Philippines"],
      ["Record year", "2026"]
    ]
  },
  prefab: {
    model: "YB□-40.5/1.14-10000",
    source: "Prefabricated substation tested reference · report 26XB0130-S",
    rows: [
      ["Rated capacity", "10,000 kVA"],
      ["Transformer model", "SCB18-10000/35-NX1"],
      ["Transformer voltage", "37 / 1.14 kV"],
      ["Rated current HV / LV", "156.0 / 5064.5 A"],
      ["Tap range", "±2×2.5%"],
      ["Frequency", "50 Hz"],
      ["Cooling", "AN / AF"],
      ["Vector group", "Dyn11"]
    ]
  }
};

const exactProfiles = {
  "35kv-power-transformer": "power35",
  "66kv-power-transformer": "power66",
  "66kv-offshore-wind-nacelle-transformer": "power66",
  "110kv-power-transformer": "power110",
  "220kv-power-transformer": "power220",
  "220kv-double-split-booster-transformer": "power220"
};

function profileFor(slug) {
  if (exactProfiles[slug]) return profiles[exactProfiles[slug]];
  if (slug.includes("dry-type") || slug.includes("24-pulse") || slug.includes("amorphous-alloy")) return profiles.dry;
  if (slug.includes("oil-immersed") || slug.includes("rectifier")) return profiles.oil;
  if (slug.includes("substation") || slug.includes("combined-transformer")) return profiles.prefab;
  return profiles.power110;
}

function scopeNote(slug, profile) {
  const exact = {
    "110kv-power-transformer": "The reference table below belongs to the stated 110 kV tested model.",
    "220kv-power-transformer": "The reference table below belongs to the stated 220 kV tested model.",
    "35kv-power-transformer": "The reference table below uses a recorded 35 kV-family project model.",
    "66kv-power-transformer": "The reference table below uses a recorded 66 / 69 kV-family project model.",
    "dry-type-distribution-transformer": "The reference table below belongs to the tested cast-resin dry-type model shown in the catalog evidence set.",
    "12kv-oil-immersed-distribution-transformer": "The reference table below belongs to the tested oil-immersed distribution model shown in the catalog evidence set."
  };
  if (exact[slug]) return exact[slug];
  if (slug === "24-pulse-phase-shifting-transformer") return "The values below belong to SCB18-2500/10 and are shown only as a dry-type reference platform. They are not model-specific 24-pulse parameters.";
  if (slug === "oil-immersed-rectifier-transformer") return "The values below belong to S-M-630/22-Tier2 and are shown only as an oil-immersed reference platform. They are not rectifier-transformer-specific parameters.";
  if (slug === "66kv-offshore-wind-nacelle-transformer") return "The values below belong to SZ-40000/69 and are shown only as a 66 / 69 kV oil-immersed family reference. They are not nacelle-transformer-specific parameters.";
  if (slug === "220kv-double-split-booster-transformer") return "The values below belong to SSZ20-240000/220 and are shown only as a 220 kV family reference. They are not double-split-booster-specific parameters.";
  if (slug.includes("substation") || slug.includes("combined-transformer")) return "The values below belong to the YB□-40.5/1.14-10000 tested prefabricated-substation reference. They are a family reference unless this exact model is specified on the page.";
  if (profile === profiles.dry) return "The values below belong to SCB18-2500/10 and are used as a dry-type family reference unless this exact model is specified on the page.";
  if (profile === profiles.oil) return "The values below belong to S-M-630/22-Tier2 and are used as an oil-immersed family reference unless this exact model is specified on the page.";
  return `The values below belong to ${profile.model} and are used as a family reference unless this exact model is specified on the page.`;
}

function renderReferenceTable(slug, profile) {
  const rows = profile.rows.map(([name, value]) => `<tr><td>${esc(name)}</td><td>${esc(value)}</td></tr>`).join("");
  return `<div class="vs-reference-parameters" data-v41-reference-parameters><h3>Representative Parameter Table</h3><p class="vs-parameter-source"><small><strong>Reference product:</strong> ${esc(profile.model)} · ${esc(profile.source)}. ${esc(scopeNote(slug, profile))}</small></p><div class="v3p-table-wrap"><table class="v3p-table"><thead><tr><th>Parameter</th><th>Reference value</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}

function injectIntoRatings(html, slug) {
  html = html.replace(/<div class="vs-reference-parameters" data-v41-reference-parameters>[\s\S]*?<\/div>\s*<\/div>/g, "</div>");
  const id = html.indexOf('id="ratings"');
  if (id < 0) return html;
  const sectionStart = html.lastIndexOf("<section", id);
  const sectionEnd = html.indexOf("</section>", id);
  if (sectionStart < 0 || sectionEnd < 0) return html;
  const profile = profileFor(slug);
  const block = renderReferenceTable(slug, profile);
  const shellEnd = html.lastIndexOf("</div>", sectionEnd);
  const insertAt = shellEnd > sectionStart ? shellEnd : sectionEnd;
  return html.slice(0, insertAt) + block + html.slice(insertAt);
}

const files = fs.existsSync(productsDir)
  ? fs.readdirSync(productsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(productsDir, entry.name, "index.html"))
      .filter((file) => fs.existsSync(file))
  : [];

let count = 0;
for (const file of files) {
  let html = read(file);
  if (!html.includes('<section class="v3p-hero">') || html.includes("v3p-family-hero")) continue;
  const slug = path.basename(path.dirname(file));
  html = injectIntoRatings(html, slug);
  if (!html.includes("data-v41-reference-parameters")) throw new Error(`Reference parameter table was not inserted: ${slug}`);
  write(file, html);
  count += 1;
}

if (count < 10) throw new Error(`Expected at least 10 concrete product pages, found ${count}.`);
console.log(`Added source-labeled representative parameter tables to ${count} concrete product detail pages.`);
