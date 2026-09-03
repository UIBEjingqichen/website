export const factoryCapabilities = [
  {
    id: "coil-winding",
    name: "Coil Winding",
    purpose: "Controlled winding of transformer high- and low-voltage coils for the selected conductor and insulation system.",
    applicableProducts: ["Distribution Transformer", "Power Transformer", "Dry-Type Transformer"],
    capability: "20T horizontal winding · full-servo HV horizontal winding · foil winding",
    photo: "catalog-v3/manufacturing-overview.webp"
  },
  {
    id: "core-processing",
    name: "Core Processing",
    purpose: "Magnetic-core cutting, stacking and assembly for loss and noise control.",
    applicableProducts: ["Distribution Transformer", "Power Transformer", "Dry-Type Transformer"],
    capability: "Belgium-imported Soenen cut-to-length line listed in the 2026 Tianyu catalog",
    photo: "catalog-v3/manufacturing-overview.webp"
  },
  {
    id: "vacuum-drying",
    name: "Vacuum Drying",
    purpose: "Insulation-system drying before liquid filling and final assembly.",
    applicableProducts: ["Distribution Transformer", "Power Transformer"],
    capability: "Process stage retained from the existing manufacturing workflow; no numeric equipment rating is stated in the supplied 2026 catalog pages",
    photo: "catalog-v3/manufacturing-overview.webp"
  },
  {
    id: "assembly",
    name: "Assembly & Tank Fabrication",
    purpose: "Transformer active-part, enclosure, switchgear and auxiliary-system integration, supported by dedicated transformer and welding plant areas.",
    applicableProducts: ["All product families"],
    capability: "Large Transformer Plant · Distribution Transformer Plant · Intelligent Switch Plant · Welding Plant",
    photo: "catalog-v3/manufacturing-overview.webp"
  },
  {
    id: "impulse-testing",
    name: "Impulse Testing",
    purpose: "Verification of insulation performance for the applicable product and project scope.",
    applicableProducts: ["Power Transformer", "Distribution Transformer", "Prefabricated Substation"],
    capability: "2,400 kV lightning impulse test system",
    photo: "catalog-v3/testing-220kv-lab.webp"
  },
  {
    id: "loss-measurement",
    name: "Loss Measurement",
    purpose: "No-load and load-loss measurement against the agreed technical schedule.",
    applicableProducts: ["Distribution Transformer", "Power Transformer", "Dry-Type Transformer"],
    capability: "WT3000 power analyzer listed in the transformer laboratory",
    photo: "catalog-v3/testing-220kv-lab.webp"
  },
  {
    id: "temperature-rise",
    name: "Test & Inspection Program",
    purpose: "Routine and type-test work for the applicable transformer and project scope, including thermal verification when required by the test program.",
    applicableProducts: ["Distribution Transformer", "Power Transformer", "Dry-Type Transformer"],
    capability: "Catalog-stated laboratory scope: routine / type tests for transformers of 220 kV and below",
    photo: "catalog-v3/testing-220kv-lab.webp"
  }
];

export const factorySections = [
  ["Manufacturing", "Four catalog-listed plant areas support large transformers, distribution transformers, intelligent switchgear and welding; the catalog also lists 460 units/sets of large mechanical equipment and 60 types of supporting test equipment."],
  ["Testing", "The catalog describes a six-sided shielded transformer laboratory with a 2,400 kV lightning impulse system, 300 kV power-frequency withstand system, 8-channel partial-discharge detector, WT3000 power analyzer and independent generator set."],
  ["Quality Control", "QMS is described as providing full-process quality traceability, alongside MES production planning, WMS warehouse management and SRM supply-chain collaboration."],
  ["Production Capacity", "Published catalog figures: 1,200 large main transformers, 12,000 distribution transformers, 10,000 box-type substations and 15,000 complete switchgear units/sets per year."]
];
