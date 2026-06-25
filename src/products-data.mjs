export const categories = [
  {
    name: "Oil-Immersed Power Transformer",
    slug: "oil-immersed-power-transformer",
    description: "High-voltage oil-immersed transformers for substations, grid interconnection and industrial transmission.",
    tags: ["220 kV and below"]
  },
  {
    name: "Oil-Immersed Distribution Transformer",
    slug: "oil-immersed-distribution-transformer",
    description: "Energy-saving distribution transformers for grid distribution and stable low-voltage output.",
    tags: ["S20", "SZ20 on-load"]
  },
  {
    name: "Dry-Type Transformer",
    slug: "dry-type-transformer",
    description: "Epoxy resin cast and amorphous alloy dry-type transformers for indoor and fire-sensitive loads.",
    tags: ["SC(B)10-18", "SC(B)14/18", "SC(B)17/19"]
  },
  {
    name: "Rectifier Transformer",
    slug: "rectifier-transformer",
    description: "Rectifier transformers for DC power systems, electrochemical processing and industrial drives.",
    tags: ["ZBS", "ZBSCB"]
  },
  {
    name: "Special Transformer",
    slug: "special-transformer",
    description: "Project-customized oil-immersed split and phase-shifting rectifier transformer solutions.",
    tags: ["Split transformer", "24-pulse phase-shifting"]
  }
];

const docs = [
  { name: "Outline dimension drawing", status: "Drawing to be provided" },
  { name: "Installation foundation drawing", status: "Drawing to be provided" },
  { name: "Wiring diagram", status: "Available upon request" },
  { name: "Principle diagram", status: "Available upon request" },
  { name: "Datasheet", status: "Available upon request" },
  { name: "Test report sample", status: "Test report sample to be provided" }
];

const baseOptions = {
  standard: ["Project-specific design based on inquiry", "Final parameters to be confirmed"],
  optional: ["Monitoring system: To be confirmed", "Enclosure: To be confirmed"],
  customized: ["Capacity, voltage, impedance, tapping and cooling to be confirmed against project requirements"]
};

export const products = [
  {
    slug: "220kv-and-below-energy-saving-oil-immersed-power-transformer",
    name: "220kV and Below Energy-Saving Oil-Immersed Power Transformer",
    category: "Oil-Immersed Power Transformer",
    tags: ["220 kV and below", "Oil-immersed", "Power transformer"],
    shortDescription: "Energy-saving oil-immersed power transformers for new and renovated substations.",
    overview: "This product is used as major substation equipment for voltage conversion and power transmission. The brochure describes online monitoring, remote communication, operation data monitoring, protection, fault alarm, condition diagnosis and information management as available functional directions.",
    applications: ["Power systems", "Petrochemical, steel and papermaking transmission and distribution", "New energy power generation", "Interconnection between different voltage grids"],
    features: ["Sufficient primary and longitudinal insulation margin", "Low stray loss and high efficiency", "Reasonable oil circuit structure", "Low partial discharge", "Folded tank process to reduce welds and improve sealing quality", "Strong short-circuit withstand capability"],
    advantages: ["Designed around GB20052-2024 energy-efficiency loss requirements", "Kerosene vapor-phase drying and cold pressure lead welding are referenced in the brochure", "Special tank structure suitable for long-distance transportation"],
    technicalParameters: {
      note: "Typical technical data from brochure. Final design can be customized according to project requirements.",
      rows: [
        ["Number of phases", "3-phase"],
        ["Rated frequency", "50 Hz"],
        ["Rated voltage", "110 +/- 8 x 1.25% / 10.5 kV"],
        ["Vector group", "YNd11"],
        ["Cooling method", "ONAN"],
        ["Service condition", "Outdoor"],
        ["Load loss", "175000 W"],
        ["No-load loss", "21000 W"],
        ["Impedance voltage", "10.5%"],
        ["Insulation level", "LI480AC200-LI325AC140 / LI75AC35"]
      ]
    },
    performanceIndicators: { note: "Brochure sample references grade 1 energy-efficiency product with rated capacity of 50,000 kVA.", rows: [["Detailed performance table", "To be confirmed from final engineering datasheet"]] },
    configurationOptions: baseOptions,
    standards: ["GB20052-2024 is explicitly referenced in brochure"],
    drawings: docs,
    images: { hero: "assets/images/product-oil-power.jpeg", full: "assets/images/product-oil-power.jpeg", detail: "assets/images/factory-substation.jpeg", factory: "assets/images/factory-campus.jpeg" },
    relatedCases: ["Huaruncaijin Hongguang Fishery 220 kV Booster Substation"],
    sourceNote: "PDF/DOCX brochure extraction"
  },
  {
    slug: "scb10-18-epoxy-resin-cast-dry-type-transformer",
    name: "SC(B)10-18 Epoxy Resin Cast Dry-Type Transformer",
    category: "Dry-Type Transformer",
    tags: ["SC(B)10-18", "Epoxy resin cast", "35 kV and below"],
    shortDescription: "Epoxy resin cast dry-type transformers for power transformation and distribution systems.",
    overview: "The brochure states that SC(B)10-18 dry-type transformers of 35 kV and below are mainly used in power transformation and distribution equipment systems, especially where fire prevention requirements are high, load fluctuation is large, or the environment is polluted and humid.",
    applications: ["Thermal, hydro, nuclear, gas-fired and wind power", "Petrochemical facilities", "Subway, light rail, airport, ship, highway and urban transportation", "High-rise buildings, commercial plazas, communication buildings and residential areas", "Industrial and mining power supply"],
    features: ["Flame-retardant, fireproof and pollution-free", "Maintenance-free with simple installation", "Low loss, low noise and low partial discharge", "Strong heat dissipation capability", "Temperature protection control system"],
    advantages: ["High-permeability, low-loss grain-oriented cold-rolled silicon steel sheets", "Low-voltage foil winding on imported SCAL foil winding machine", "Aluminum alloy or stainless-steel enclosure options are referenced", "Silicone rubber pads improve stability and mechanical strength"],
    technicalParameters: {
      note: "Brochure configuration data.",
      rows: [
        ["Frequency", "50 Hz / 60 Hz"],
        ["Number of phases", "3-phase"],
        ["Vector group", "Dyn11 / Yyn0 / Yd11"],
        ["Insulation system temperature", "Class F and above"],
        ["Rated voltage", "35, 20, 10 / 0.4, 0.69, 0.8 kV"],
        ["Tapping range", "+/-2 x 2.5%, +/-5%, +/-3 x 2.5%, +/-4 x 2.5%"],
        ["Voltage regulation", "Non-excitation voltage regulation / on-load voltage regulation"],
        ["Short-circuit impedance", "4%, 6%, 8%, 10%"],
        ["Insulation level", "National standard"]
      ]
    },
    performanceIndicators: { note: "Brochure mentions CESI certification and type/special tests for dry-type products.", rows: [["Certificate/Test reference", "Italian CESI certification; type tests and special tests referenced in brochure"]] },
    configurationOptions: baseOptions,
    standards: ["National standard is referenced for insulation level", "CESI certification referenced for dry-type products"],
    drawings: docs,
    images: { hero: "assets/images/product-dry-type-red.jpeg", full: "assets/images/product-dry-type-red.jpeg", detail: "assets/images/product-dry-type-cast.jpeg", factory: "assets/images/factory-campus.jpeg" },
    relatedCases: ["Transportation and public infrastructure applications mentioned in brochure"],
    sourceNote: "PDF/DOCX brochure extraction"
  },
  {
    slug: "zbs-zbscb-series-rectifier-transformer",
    name: "ZBS and ZBSCB Series Rectifier Transformer",
    category: "Rectifier Transformer",
    tags: ["ZBS", "ZBSCB", "Rectifier"],
    shortDescription: "Rectifier transformers for electrolytic processing, DC networks, drives, electroplating and excitation systems.",
    overview: "The brochure describes ZBS and ZBSCB rectifier transformers for chemical electrolytic processing, DC power grids for mines or urban electric locomotives, DC motor power supply, electroplating or electrical processing, excitation, charging and electrostatic precipitation. Products can be designed as dry-type or oil-immersed rectifier transformers according to user requirements.",
    applications: ["Chemical electrolytic processing", "Mine or urban electric locomotive DC networks", "Steel rolling electric drive", "Electroplating and electrical processing", "Excitation, charging and electrostatic precipitation DC power supply"],
    features: ["Designed with rectifier overload and harmonic temperature-rise effects in mind", "Grounding screens between high and low voltages", "Foil coil adopted for low voltage", "Energy-saving, low loss and low noise", "Strong overload, impact and short-circuit withstand capability"],
    advantages: ["Dry-type or oil-immersed design can be selected according to user requirements", "Compact structure is referenced in the brochure"],
    technicalParameters: {
      note: "Typical technical data from brochure, based on ZS-8000/10-0.66 sample.",
      rows: [
        ["Rated capacity", "8000 / 4000 / 4000 kVA"],
        ["Rated voltage", "10 / 0.66 / 0.66 kV"],
        ["Rated current", "461.9 / 3499 A"],
        ["Vector group designation", "Dy11d0"],
        ["Cooling method", "ONAN"],
        ["Number of phases", "3-phase"],
        ["Frequency", "50 Hz"]
      ]
    },
    performanceIndicators: { note: "Sample data only. Final design depends on rectifier duty and harmonics.", rows: [["Performance indicators", "To be confirmed"]] },
    configurationOptions: baseOptions,
    standards: ["Applicable standards to be confirmed"],
    drawings: docs,
    images: { hero: "assets/images/product-rectifier.jpeg", full: "assets/images/product-rectifier.jpeg", detail: "assets/images/product-dry-type-red.jpeg", factory: "assets/images/factory-campus.jpeg" },
    relatedCases: ["Industrial DC power applications"],
    sourceNote: "PDF/DOCX brochure extraction"
  },
  {
    slug: "scb14-18-dry-type-energy-saving-transformer",
    name: "SC(B)14/18 Dry-Type Energy-Saving Transformer",
    category: "Dry-Type Transformer",
    tags: ["SC(B)14", "SC(B)18", "Energy-saving dry-type"],
    shortDescription: "New energy-saving dry-type transformer series developed in line with GB20052-2024.",
    overview: "SC(B)14 and SC(B)18 dry-type energy-saving transformers are described as a new series developed according to the Transformer Energy Efficiency Enhancement Plan and GB20052-2024. Products can be equipped with vacuum on-load voltage regulation or intelligent units according to user requirements.",
    applications: ["Power grid distribution", "Real estate power distribution", "Industrial and mining enterprises"],
    features: ["Energy-saving, environmentally friendly and green", "Low loss and low noise", "Good crack resistance", "Maintenance-free", "Moisture-proof, mildew-proof and anti-fouling", "Strong short-circuit resistance"],
    advantages: ["Grade 2 and grade 1 energy-efficiency product series are referenced", "Optional vacuum on-load voltage regulation and intelligent unit are referenced"],
    technicalParameters: {
      note: "Typical technical data from brochure. Full table is available in brochure but should be confirmed for final model selection.",
      rows: [
        ["High voltage", "6, 6.3, 6.6, 10, 10.5, 11 kV"],
        ["Low voltage", "0.4, 0.69, 0.8 kV"],
        ["HV tapping range", "+/-2 x 2.5%, +/-5%, +/-3 x 2.5%"],
        ["Short-circuit impedance", "4%, 6%, 8%, 10%"],
        ["Vector group designation", "Dyn11, Yyn0, Yd11"],
        ["Rated capacity examples", "30-2500 kVA shown in brochure table"]
      ]
    },
    performanceIndicators: { note: "Typical rows from brochure table.", rows: [["SCB18/SCB14 loss table", "Available in brochure; final selection to be confirmed by model"]] },
    configurationOptions: baseOptions,
    standards: ["GB20052-2024", "Transformer Energy Efficiency Enhancement Plan (2021-2023) is referenced"],
    drawings: docs,
    images: { hero: "assets/images/product-dry-type-red.jpeg", full: "assets/images/product-dry-type-red.jpeg", detail: "assets/images/product-dry-type-cast.jpeg", factory: "assets/images/factory-campus.jpeg" },
    relatedCases: ["Power grid distribution applications"],
    sourceNote: "PDF/DOCX brochure extraction"
  },
  {
    slug: "scb17-19-dry-type-amorphous-alloy-energy-saving-transformer",
    name: "SC(B)17/19 Dry-Type Amorphous Alloy Energy-Saving Transformer",
    category: "Dry-Type Transformer",
    tags: ["SC(B)17", "SC(B)19", "Amorphous alloy", "Three-phase three-limb"],
    shortDescription: "Low-loss amorphous alloy dry-type transformer for grid reconstruction and upgrades.",
    overview: "The brochure describes SC(B)17 and SC(B)19 as low-loss energy-saving dry-type transformers combining amorphous alloy core technology and epoxy resin cast dry-type transformer technology. The structure is upgraded to a three-phase three-limb frame limit protection structure with compact layout and good overall rigidity.",
    applications: ["New power grid reconstruction", "Power grid upgrades", "Energy-saving distribution projects"],
    features: ["Amorphous alloy core technology", "Epoxy resin cast dry-type transformer technology", "Three-phase three-limb frame limit protection structure", "Compact structure and good overall rigidity"],
    advantages: ["Produced according to GB20052-2024", "Designed for energy-saving grid scenarios"],
    technicalParameters: {
      note: "Technical Data To Be Confirmed. Brochure table exists but extraction is not clean enough for complete publication.",
      rows: [["Noise", "<=54 dB"], ["Full model table", "To be confirmed"]]
    },
    performanceIndicators: { note: "To be confirmed from final datasheet.", rows: [["Performance indicators", "To be confirmed"]] },
    configurationOptions: baseOptions,
    standards: ["GB20052-2024"],
    drawings: docs,
    images: { hero: "assets/images/product-amorphous-dry.jpeg", full: "assets/images/product-amorphous-dry.jpeg", detail: "assets/images/product-dry-type-red.jpeg", factory: "assets/images/factory-campus.jpeg" },
    relatedCases: ["Energy-saving grid upgrade applications"],
    sourceNote: "PDF/DOCX brochure extraction"
  },
  {
    slug: "s20-oil-immersed-energy-saving-transformer",
    name: "S20 Oil-Immersed Energy-Saving Transformer",
    category: "Oil-Immersed Distribution Transformer",
    tags: ["S20", "Oil-immersed", "Distribution"],
    shortDescription: "Oil-immersed distribution transformer with reduced losses compared with earlier S11/S13 designs.",
    overview: "The brochure describes S20 as a new energy-saving transformer based on the S11 energy-saving transformer. It uses high-quality silicon steel sheets and a 45-degree full miter, stepped five-stage core joint structure to reduce no-load loss and no-load current.",
    applications: ["Distribution grids", "Energy-saving grid renovation", "Industrial and commercial distribution"],
    features: ["No-load loss reduced by 30-40% compared with S11/S13 references in brochure", "Load loss reduced by 20-30% compared with S11/S13 references in brochure", "High cost performance", "Convenient maintenance and user wiring", "Fully sealed and maintenance-free"],
    advantages: ["High-voltage coil made of oxygen-free copper wire", "Low-voltage coil above 200 kVA uses copper foil", "S22 grade 1 oil-immersed distribution transformer can be produced according to user requirements"],
    technicalParameters: {
      note: "Typical technical data from brochure, based on S13-630/10 sample.",
      rows: [
        ["Rated capacity", "630 kVA"],
        ["Vector group", "Dyn11"],
        ["HV voltage", "10000 V"],
        ["LV voltage", "400 V"],
        ["Voltage regulation range", "+/-2 x 2.5%"],
        ["Number of phases", "3"],
        ["Load loss", "6200 W"],
        ["No-load loss", "570 W"],
        ["No-load current", "0.35%"]
      ]
    },
    performanceIndicators: { note: "Sample data only. Final design can be customized.", rows: [["Performance indicators", "To be confirmed by model"]] },
    configurationOptions: baseOptions,
    standards: ["Applicable energy-efficiency standard to be confirmed by final model"],
    drawings: docs,
    images: { hero: "assets/images/product-oil-distribution.jpeg", full: "assets/images/product-oil-distribution.jpeg", detail: "assets/images/product-oil-power.jpeg", factory: "assets/images/factory-campus.jpeg" },
    relatedCases: ["Distribution network upgrades"],
    sourceNote: "PDF/DOCX brochure extraction"
  },
  {
    slug: "sz20-on-load-oil-immersed-energy-saving-transformer",
    name: "SZ20 On-Load Oil-Immersed Energy-Saving Transformer",
    category: "Oil-Immersed Distribution Transformer",
    tags: ["SZ20", "On-load tap changer", "Oil-immersed"],
    shortDescription: "S20-based oil-immersed transformer with on-load tap changing for stable output voltage.",
    overview: "SZ20 is based on S20 with an added on-load tap changer. The brochure states that it can adjust low-voltage output voltage while energized and help maintain stable transformer output voltage when the grid fluctuates.",
    applications: ["Rural power grids with unstable voltage", "Industrial and mining enterprises requiring stable long-term operation", "Distribution management upgrades"],
    features: ["Automatic voltage regulation", "Stable downstream equipment operation", "Supports improvement of distribution management", "Optional intelligent on-load tap changer"],
    advantages: ["Optional app-based monitoring of voltage, current, active power, reactive power and power factor is referenced in brochure", "Controller can automatically adjust tap position based on voltage condition"],
    technicalParameters: {
      note: "Typical technical data from brochure. Final design can be customized according to project requirements.",
      rows: [
        ["Rated capacity examples", "200-2500 kVA shown in brochure table"],
        ["HV voltage examples", "6, 6.3, 10, 10.5, 11 kV"],
        ["HV tapping range", "+/-4 x 2.5%"],
        ["LV voltage", "0.4 kV"],
        ["Vector group", "Yyn0 or Dyn11"],
        ["Short-circuit impedance", "4.0-5.0% in brochure table"]
      ]
    },
    performanceIndicators: { note: "Full table shown in brochure; values should be confirmed against selected model.", rows: [["Performance indicators", "To be confirmed by model"]] },
    configurationOptions: baseOptions,
    standards: ["Applicable standards to be confirmed"],
    drawings: docs,
    images: { hero: "assets/images/product-oil-distribution.jpeg", full: "assets/images/product-oil-distribution.jpeg", detail: "assets/images/factory-substation.jpeg", factory: "assets/images/factory-campus.jpeg" },
    relatedCases: ["Rural grid and industrial distribution applications"],
    sourceNote: "PDF/DOCX brochure extraction"
  },
  {
    slug: "oil-immersed-split-transformer",
    name: "Oil-Immersed Split Transformer",
    category: "Special Transformer",
    tags: ["Oil-immersed", "Split transformer", "Special transformer"],
    shortDescription: "Special oil-immersed split transformer for project-specific electrical systems.",
    overview: "The brochure lists oil-immersed split transformer under transformer equipment. Extracted technical data indicates input and output voltage, rated capacity options and neutral grounding modes for the product family.",
    applications: ["Project-specific industrial power systems", "Renewable energy electrical systems", "Special power conversion systems"],
    features: ["Input and output side data is shown in brochure", "Capacity options listed in brochure tables", "Grounded or ungrounded neutral modes referenced"],
    advantages: ["Can be engineered for project-specific requirements"],
    technicalParameters: {
      note: "Typical technical data from brochure. Final design can be customized according to project requirements.",
      rows: [
        ["Rated voltage input", "0.54 / 0.69 / 0.8 / 0.95 / 1.14 kV"],
        ["Rated voltage output", "12 / 40.5 kV"],
        ["Rated frequency", "50 Hz"],
        ["Rated capacity examples", "900, 1250, 1600, 2000, 2500, 3150, 3300, 3500, 4000 kVA"],
        ["Rated short-time withstand voltage input", "5 kV / 1 min"],
        ["Rated short-time withstand voltage output", "85 kV / 1 min"],
        ["Neutral grounding mode", "Grounded / ungrounded"]
      ]
    },
    performanceIndicators: { note: "To be confirmed from final datasheet.", rows: [["Performance indicators", "To be confirmed"]] },
    configurationOptions: baseOptions,
    standards: ["Applicable standards to be confirmed"],
    drawings: docs,
    images: { hero: "assets/images/product-special-container.jpeg", full: "assets/images/product-special-container.jpeg", detail: "assets/images/product-oil-power.jpeg", factory: "assets/images/factory-campus.jpeg" },
    relatedCases: ["Renewable energy electrical systems"],
    sourceNote: "PDF/DOCX brochure extraction"
  },
  {
    slug: "oil-immersed-24-pulse-phase-shifting-rectifier-transformer",
    name: "Oil-Immersed 24-Pulse Phase-Shifting Rectifier Transformer",
    category: "Special Transformer",
    tags: ["24-pulse", "Phase-shifting", "Rectifier transformer"],
    shortDescription: "Oil-immersed phase-shifting rectifier transformer for multi-pulse power conversion systems.",
    overview: "The brochure lists an oil-immersed 24-pulse phase-shifting rectifier transformer under transformer equipment. Extracted table data provides input/output voltages, rated frequency, capacity options and neutral grounding mode.",
    applications: ["Multi-pulse rectifier systems", "Renewable energy conversion systems", "Industrial DC power systems"],
    features: ["Input and output voltage data shown in brochure", "Capacity range examples shown in brochure", "Grounded or ungrounded neutral modes referenced"],
    advantages: ["Project-customized rectifier transformer design"],
    technicalParameters: {
      note: "Typical technical data from brochure. Final design can be customized according to project requirements.",
      rows: [
        ["Rated voltage input", "0.54 / 0.69 / 0.8 / 0.95 / 1.14 kV"],
        ["Rated voltage output", "12 / 40.5 kV"],
        ["Rated frequency", "50 Hz"],
        ["Rated capacity examples", "500-12500 kVA shown in brochure table"],
        ["Rated short-time withstand voltage input", "5 kV / 1 min"],
        ["Rated short-time withstand voltage output", "85 kV / 1 min"],
        ["Neutral grounding mode", "Grounded / ungrounded"]
      ]
    },
    performanceIndicators: { note: "To be confirmed from final datasheet.", rows: [["Performance indicators", "To be confirmed"]] },
    configurationOptions: baseOptions,
    standards: ["Applicable standards to be confirmed"],
    drawings: docs,
    images: { hero: "assets/images/product-special-container.jpeg", full: "assets/images/product-special-container.jpeg", detail: "assets/images/product-rectifier.jpeg", factory: "assets/images/factory-campus.jpeg" },
    relatedCases: ["Industrial rectifier and renewable conversion systems"],
    sourceNote: "PDF/DOCX brochure extraction"
  }
];
