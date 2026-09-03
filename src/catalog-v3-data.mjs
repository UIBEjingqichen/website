export const catalogSource = {
  title: "Tianyu Transformer Product Catalog - 2026 working source",
  basis: "User-provided photographs of the official Tianyu transformer catalog, numbered P01-P29 plus company overview and contents pages.",
  evidenceRule: "Series capability from the company catalog is presented separately from model-specific third-party test evidence already stored in the website.",
  unresolved: [
    "Company establishment year differs between existing website data (1996) and the newly supplied catalog (1995); V3 does not overwrite the existing date until reconciled.",
    "EU Tier 2 statements printed in catalog technical tables are treated as published series data and are not expanded into blanket certification claims."
  ]
};

export const manufacturing = {
  stats: [
    ["Site area", "317 mu"],
    ["Plant area", "100,000 m²"],
    ["Large mechanical equipment", "460 units / sets"],
    ["Supporting test equipment", "60 types"],
    ["Large main transformers", "1,200 units / year"],
    ["Distribution transformers", "12,000 units / year"],
    ["Box-type substations", "10,000 units / year"],
    ["Complete switchgear", "15,000 units / year"]
  ],
  plants: ["Large Transformer Plant", "Intelligent Switch Plant", "Distribution Transformer Plant", "Welding Plant"],
  equipment: [
    { name: "20T horizontal winding machine", detail: "Large-coil winding for power transformer production.", image: "manufacturing-overview.webp" },
    { name: "Full-servo high-voltage horizontal winding machine", detail: "Servo-controlled high-voltage winding line.", image: "manufacturing-overview.webp" },
    { name: "Foil coil winding machine", detail: "Foil winding for low-voltage and distribution-transformer coils.", image: "manufacturing-overview.webp" },
    { name: "Soenen cut-to-length line", detail: "Belgium-imported core cutting line for magnetic-core processing.", image: "manufacturing-overview.webp" },
    { name: "Welding robot", detail: "Automated tank welding equipment for repeatable fabrication.", image: "manufacturing-overview.webp" },
    { name: "One-to-two vacuum casting tank", detail: "Automatic vacuum casting equipment for cast-resin dry-type transformer production.", image: "manufacturing-overview.webp" }
  ],
  digital: [
    ["MES", "Dynamic production planning, real-time monitoring and bottleneck identification"],
    ["QMS", "Full-process quality traceability and production quality issue location"],
    ["WMS", "Refined warehouse management to reduce inventory and material shortages"],
    ["SRM", "Transparent supplier collaboration and material-delivery coordination"]
  ],
  testing: [
    ["Lightning impulse", "2,400 kV test system"],
    ["Power-frequency withstand", "300 kV test system"],
    ["Partial discharge", "8-channel detector"],
    ["Power analysis", "WT3000 power analyzer"],
    ["Test power supply", "Independent generator set"],
    ["Documented laboratory scope", "Routine / type testing for transformers of 220 kV and below"]
  ]
};

export const highVoltageSeries = [
  { name: "35 kV On-Load Voltage Regulating Power Transformer", model: "SZ-8000~31500/35", capacity: "8-31.5 MVA", voltage: "HV 35-38.5 kV · LV 6.3 / 6.6 / 10.5 kV", tap: "±3×2.5%", vector: "YNd11 / Dyn11", frequency: "50 Hz", rows: [["8000","4.3","36.5","0.32","7.5/8.0","4400×3820×3390","17300"],["10000","5.1","43.2","0.32","7.5/8.0","4470×3850×3540","20100"],["12500","6.0","51.1","0.28","7.5/8.0","4870×4340×3690","24100"],["16000","7.2","63.3","0.28","7.5/8.0","5040×4050×3790","28300"],["20000","8.5","74.4","0.28","7.5/8.0","5260×4130×3820","34430"],["25000","10.1","88.0","0.24","10.0","5560×4370×4040","40700"],["31500","12.0","104.4","0.24","10.0","6060×4430×4110","45200"]] },
  { name: "66 kV On-Load Voltage Regulating Power Transformer", model: "SZ-6300~63000/66", capacity: "6.3-63 MVA", voltage: "HV 63 / 66 / 69 kV · LV 6.3 / 6.6 / 10.5 kV", tap: "±4×1.25% / ±6×1.25% / ±8×1.25%", vector: "YNd11 / Dyn11", frequency: "50 Hz", rows: [["6300","4.4","30.8","0.48","9.0","5275×3390×3932","21270"],["8000","5.3","36.5","0.48","9.0","5375×3510×4027","23970"],["10000","6.2","43.0","0.45","9.0","5465×3630×4121","26800"],["12500","7.4","51.1","0.45","9.0","5545×3660×4216","29870"],["16000","8.9","62.8","0.42","9.0","5695×3880×4341","34720"],["20000","10.6","76.1","0.42","9.0","6010×4100×4461","39780"],["25000","12.5","90.0","0.38","9.0","6190×4320×4581","45890"],["31500","14.8","108.0","0.35","9.0","6330×4460×4725","52840"],["40000","17.7","126.9","0.35","9.0","6480×4690×4890","61130"],["50000","20.9","150.3","0.32","10.0-12.0","6681×4830×5045","69820"],["63000","24.7","178.2","0.29","10.0-12.0","6841×4980×5280","80390"]] },
  { name: "110 kV Three-Winding On-Load Voltage Regulating Power Transformer", model: "SSZ-6300~63000/110", capacity: "6.3-63 MVA", voltage: "HV 110 / 115 / 121 kV · MV 36 / 37 / 38.5 kV · LV 6.3 / 6.6 / 10.5 / 21 kV", tap: "±4×1.25% / ±6×1.25% / ±8×1.25%", vector: "YNyn0d11", frequency: "50 Hz", impedance: "H-M 10.5% · H-L 17.5-19% · M-L 6.5%", rows: [["6300","5.3","40","0.61","6160×3880×4527"],["8000","6.3","48","0.61","6380×4000×4612"],["10000","7.5","56","0.57","6420×4120×4696"],["12500","8.9","67","0.57","6450×4230×4796"],["16000","10.6","81","0.54","6520×4280×4896"],["20000","12.5","95","0.54","6630×4410×4996"],["25000","14.9","113","0.50","6840×4540×5125"],["31500","17.7","134","0.50","7070×4690×5255"],["40000","21.2","161","0.46","7260×4840×5385"],["50000","25.0","192","0.46","7440×5000×5515"],["63000","29.8","230","0.42","7640×5150×5659"]] },
  { name: "220 kV Three-Winding On-Load Voltage Regulating Power Transformer", model: "SSZ-31500~240000/220", capacity: "31.5-240 MVA", voltage: "HV 220 / 230 / 242 kV · MV 69 / 115 / 121 kV · LV 6.3 / 6.6 / 10.5 / 21 / 36 / 37 / 38.5 kV", tap: "±4×1.25% / ±6×1.25% / ±8×1.25%", vector: "YNyn0d11", frequency: "50 Hz", impedance: "H-M 12-14% · H-L 22-24% · M-L 7-9%", rows: [["31500","19","138","0.50","6460×6700×7260","84760"],["40000","23","165","0.48","6750×6860×7330","95510"],["50000","26","194","0.48","7040×6930×7400","106780"],["63000","31","231","0.44","7360×7100×7470","119865"],["90000","40","300","0.35","7950×7620×7640","143260"],["120000","51","369","0.35","8470×7940×7790","165420"],["150000","59","438","0.31","8980×8050×7325","187265"],["180000","68","538","0.31","9360×8140×7410","208910"],["240000","85","667","0.28","9990×8370×7550","248270"]] }
];

export const distributionSeries = {
  general12kV: { name: "12 kV Oil-Immersed Distribution Transformer", capacity: "30-2,500 kVA", voltage: "HV 6 / 6.3 / 6.6 / 10 / 10.5 / 11 kV · LV 400 / 415 / 420 V", frequency: "50 / 60 Hz", tap: "±2×2.5% / ±5% / ±3×2.5% / ±4×2.5%", vector: "Dyn11 / Yyn0 / Dyn5", winding: "Copper" },
  renewable40kV: { name: "40.5 kV Oil-Immersed Transformer - New Energy", capacity: "1,000-12,500 kVA", voltage: "HV 33 / 34.5 / 35 / 37 / 38.5 kV · LV 400 / 690 / 800 / 1,140 V", frequency: "50 / 60 Hz", tap: "±2×2.5% / ±5% / ±3×2.5% / ±4×2.5%", vector: "Dyn11 / Yyn0 / Dyn5", winding: "Copper / aluminum", impedance: "6-14%" },
  rectifier: { name: "35 kV and Below Rectifier Power Transformer", detail: "Converter-system transformer platform for rectifier duties in industrial production environments." },
  catalogFeatures: ["Fully sealed corrugated tank configurations for outdoor service", "Four-remote intelligent operation and maintenance functions: telesignaling, telemetry, teleregulation and telecontrol", "Catalog states anti-corrosion treatment can reach C5-H for applicable configurations", "Standardized design direction for rapid engineering, production and delivery"]
};

export const dryTypeSeries = {
  general: [["Frequency","50 / 60 Hz"],["Phases","3"],["Vector groups","Dyn11 / Yyn0 / Yd11"],["Insulation system","Class F and above"],["Rated voltage","35 / 20 / 10 kV; LV 0.4 / 0.69 / 0.8 kV"],["Tapping range","±2×2.5% / ±5% / ±3×2.5% / ±4×2.5%"],["Regulation","Non-excitation / on-load voltage regulation"],["Short-circuit impedance","4 / 6 / 8 / 10%"]],
  families: [
    { name: "Energy-saving, low-noise intelligent dry-type distribution transformer", capacity: "Series platform", detail: "Intelligent terminals can monitor operating status, temperature, loss, power consumption, alarms, data storage, communications, fan control and remote transmission." },
    { name: "Dry-type transformer for energy storage, wind and photovoltaic projects", capacity: "Up to 8,000 kVA", detail: "S(S)CB11-18 platform with large-air-volume cooling for complex working conditions." },
    { name: "35 kV large-sized dry-type power transformer", capacity: "Up to 25,000 kVA", detail: "SC(Z)11-18 platform; the catalog cites SCZ12-25000/35 project operation in Hangzhou." },
    { name: "Amorphous alloy dry-type energy-saving distribution transformer", capacity: "Up to 4,000 kVA", detail: "SCBH15 / SCBH17 / SCBH19 platform for data centers, communications, semiconductor and industrial fields." },
    { name: "35 kV and below dry-type energy-saving distribution transformer", capacity: "Up to 8,000 kVA", detail: "SCB14(18) platform with laser-cut bending-plate structural process." }
  ],
  applications: ["Power generation","Petrochemical","Transportation","Commercial / high-rise buildings","Industrial and mining"],
  features: ["Flame-retardant and oil-free installation direction","Moisture resistance","Low loss / low partial discharge / low noise","Temperature protection and fan-control options","Catalog states 140% emergency loading under forced-air cooling for applicable designs"]
};

export const prefabricatedSeries = [
  { name: "ZGS Prefabricated Substation / Combined Transformer", capacity: "200-4,000 kVA", voltage: "HV 7.2-40.5 kV · LV 0.315-1.14 kV", transformer: "Oil-immersed integrated platform", protection: "Catalog states enclosure protection can reach IP65", detail: "Transformer body, HV load switch and fuse are integrated in insulating liquid; suited to ring-network / terminal distribution and renewable projects.", image: "renewable-projects.webp" },
  { name: "YB Prefabricated Substation", capacity: "200-8,000 kVA", voltage: "HV 7.2-40.5 kV · LV 0.315-1.14 kV", transformer: "Dry-type or oil-immersed configuration", protection: "Configurable IP33 / IP43 / IP54 / IP65 in catalog parameter table", detail: "Modular enclosure integrating transformer, HV switchgear, LV switchgear, metering, compensation and auxiliary systems.", image: "renewable-projects.webp" },
  { name: "YBH Chinese-Type Substation", capacity: "200-12,500 kVA", voltage: "HV 7.2-40.5 kV · LV 0.315-1.14 kV", transformer: "Dry-type or oil-immersed configuration", protection: "Catalog text cites HV breaking current up to 31.5 kA for applicable schemes", detail: "Designed for photovoltaic and wind-power generation with separated high-voltage switching and transformer-oil sections.", image: "renewable-projects.webp" },
  { name: "Photovoltaic Inverter / Converter Energy Storage Integrated Machine", capacity: "2,000-9,000 kVA", voltage: "HV 7.2-40.5 kV · LV 0.315-1.14 kV", transformer: "Dry-type or oil-immersed transformer + PCS / inverter + MV switchgear", protection: "Catalog parameter table lists IP33 / IP43 / IP54 / IP65 options", detail: "Factory-integrated PV / BESS power-conversion solution for remote sites, short construction periods and difficult site conditions.", image: "renewable-projects.webp" }
];

export const renewableSpecials = [
  { name: "220 kV double-split transformer for offshore / onshore booster station", detail: "Catalog describes axial split construction, two independent power supplies, winding temperature rise around 55 K, partial discharge below 50 pC and C5-M anti-corrosion for the referenced design." },
  { name: "35-110 kV mobile intelligent substation", detail: "Vehicle-mounted / towable factory-prefabricated system for temporary power supply and emergency restoration." },
  { name: "66 kV offshore wind liquid-immersed nacelle transformer", detail: "Deep/open-sea wind application with compact structure, plug-in HV bushing and natural-ester insulating liquid." },
  { name: "PV / BESS integrated power-conversion station", detail: "Factory-integrated inverter / PCS, transformer and medium-voltage switchgear package." }
];

export const drawings = [
  ["35 / 66 / 110 / 220 kV Power Transformer GA Reference Plate", "ga-power-transformers.webp"],
  ["12 kV Distribution + 40.5 kV Renewable Transformer GA Reference Plate", "ga-distribution-renewable.webp"]
];
