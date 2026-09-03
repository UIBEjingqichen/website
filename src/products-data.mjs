export const categories = [
  {
    id: "oil-immersed-distribution-transformer",
    name: "Oil-Immersed Distribution Transformer",
    shortName: "Distribution Transformer",
    description: "S(B)20 and S(B)22 liquid-filled distribution transformers for efficient grid and industrial distribution.",
    image: "products/distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp"
  },
  {
    id: "high-voltage-power-transformer",
    name: "High-Voltage Power Transformer",
    shortName: "Power Transformer",
    description: "110 kV, 132 kV and 220 kV main transformers verified by independent type-test reports.",
    image: "evidence/sample-photo-pages/power-transformer-240mva-220kv-ssz22-sample-photo-page.webp"
  },
  {
    id: "cast-resin-dry-type-transformer",
    name: "Cast Resin Dry-Type Transformer",
    shortName: "Dry-Type Transformer",
    description: "SCB18 epoxy-resin cast dry-type transformers for indoor, fire-sensitive and infrastructure loads.",
    image: "evidence/sample-photo-pages/dry-type-scb18-2500kva-10kv-sample-photo-page.webp"
  },
  {
    id: "dry-type-prefabricated-substation",
    name: "Dry-Type Prefabricated Substation",
    shortName: "European-Type Substation",
    description: "35 kV and below prefabricated substations with dry-type transformers for renewable and distribution projects.",
    image: "products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp"
  },
  {
    id: "oil-immersed-prefabricated-substation",
    name: "Oil-Immersed Prefabricated Substation",
    shortName: "GY Series / China-Type Substation",
    description: "Compact 35 kV prefabricated substations with liquid-filled transformers for demanding outdoor service.",
    image: "products/prefabricated-substations/oil-prefabricated-substation-exterior-01.webp"
  },
  {
    id: "american-type-combined-transformer",
    name: "American-Type Combined Transformer",
    shortName: "American-Type / Pad-Mounted Solution",
    description: "Integrated pad-mounted transformer solutions for renewable energy and compact distribution sites.",
    image: "products/combined-transformers/american-type-combined-transformer-exterior-01.webp"
  }
];

export const products = [
  {
    id: "oil-immersed-distribution-transformer",
    slug: "oil-immersed-distribution-transformer",
    name: "Oil-Immersed Distribution Transformer",
    family: "Distribution Transformer",
    strapline: "S(B)20 / S(B)22 series for efficient distribution systems",
    description: "A sealed, low-loss distribution transformer family developed for industrial loads, utility distribution and noise-sensitive sites. The published series capability is kept separate from the exact 630 kVA and 1600 kVA models covered by the attached third-party reports.",
    seriesCapability: {
      voltage: "22 kV and below",
      capacity: "Up to 4,000 kVA",
      frequency: "50 / 60 Hz",
      cooling: "ONAN",
      installation: "Outdoor",
      standard: "GB 20052 / IEC project scope"
    },
    keyParameters: [
      ["Series", "S(B)20 / S(B)22"],
      ["Maximum design capacity", "4,000 kVA"],
      ["Noise", "≤ 50 dB"],
      ["Efficiency direction", "GB 20052 Grade 1 available"],
      ["Construction", "Sealed liquid-filled design"]
    ],
    gallery: [
      ["products/distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp", "Oil-immersed distribution transformer with radiators and conservator"],
      ["products/distribution-transformers/oil-immersed-distribution-transformer-sealed-01.webp", "Compact oil-immersed distribution transformer product view"],
      ["products/distribution-transformers/oil-immersed-distribution-transformer-cable-connected-01.webp", "Oil-immersed distribution transformer for compact equipment integration"]
    ],
    applications: ["Industrial power distribution", "Utility distribution networks", "Commercial and residential distribution", "Noise-sensitive sites"],
    features: ["Low-loss silicon steel core", "Sealed design reduces contact between oil and outside air", "Low-noise operation", "Copper winding options", "Project-specific voltage and impedance design"],
    productRange: [["Rated voltage", "Up to 22 kV"], ["Rated capacity", "Up to 4,000 kVA"], ["Verified models", "630 kVA and 1600 kVA at 22 kV"], ["Energy efficiency", "Tier 2 models independently evaluated"]],
    technicalParameters: [["Phases", "Three phase"], ["Cooling", "ONAN"], ["Installation", "Outdoor"], ["Frequency", "50 / 60 Hz"], ["Winding material", "Project-specific"], ["Tap range", "Project-specific"]],
    evidenceIds: ["oil-distribution-1600kva-tuv", "oil-distribution-1600kva-type-test", "oil-distribution-1600kva-efficiency", "oil-distribution-1600kva-ce", "oil-distribution-630kva-tuv", "oil-distribution-630kva-type-test", "oil-distribution-630kva-efficiency", "oil-distribution-630kva-ce"],
    drawingIds: [],
    testedModels: ["S-M-630/22-Tier2", "S-M-1600/22-Tier2"],
    standards: ["IEC 60076 series", "GB 20052"],
    faq: [
      ["What is the difference between series capability and a tested model?", "Series capability describes the configurable product family. A tested model is the exact capacity, voltage and construction covered by a named report."],
      ["Can the voltage and impedance be customized?", "Yes. Final ratings, tapping, impedance, accessories and losses are reviewed against the project specification."]
    ]
  },
  {
    id: "high-voltage-power-transformer",
    slug: "high-voltage-power-transformer",
    name: "High-Voltage Power Transformer",
    family: "Power Transformer",
    strapline: "Main transformer solutions for 110 kV to 220 kV systems",
    description: "Oil-immersed power transformers for substations, grid interconnection and major industrial systems. Four attached independent reports provide model-specific evidence from 50 MVA / 110 kV through 240 MVA / 220 kV.",
    seriesCapability: {
      voltage: "Up to 220 kV",
      capacity: "Project-engineered",
      frequency: "50 Hz",
      cooling: "ONAN / ONAF",
      installation: "Outdoor",
      standard: "Project specification"
    },
    keyParameters: [["Voltage range", "110 / 132 / 220 kV verified"], ["Verified capacity", "50 / 150 / 240 MVA"], ["Regulation", "On-load tap-changing models"], ["Construction", "Three-phase oil-immersed"]],
    gallery: [
      ["evidence/sample-photo-pages/power-transformer-240mva-220kv-ssz22-sample-photo-page.webp", "240 MVA 220 kV oil-immersed power transformer test sample"],
      ["evidence/sample-photo-pages/power-transformer-240mva-220kv-ssz20-sample-photo-page.webp", "SSZ20 240 MVA 220 kV power transformer test sample"],
      ["evidence/sample-photo-pages/power-transformer-150mva-132kv-sample-photo-page.webp", "150 MVA 132 kV oil-immersed power transformer test sample"],
      ["evidence/sample-photo-pages/power-transformer-50mva-110kv-sample-photo-page.webp", "50 MVA 110 kV oil-immersed power transformer test sample"]
    ],
    applications: ["Utility substations", "Renewable generation interconnection", "Industrial main substations", "Energy storage", "Rail transit power systems"],
    features: ["Low-loss magnetic circuit design", "Insulation coordination for high-voltage duty", "Short-circuit withstand design", "Project-specific cooling and monitoring", "Transport-oriented mechanical design"],
    productRange: [["Voltage", "110 kV, 132 kV and 220 kV verified"], ["Capacity", "50 MVA, 150 MVA and 240 MVA verified"], ["Tap changing", "On-load regulation models included"], ["System role", "Main transformer / grid interconnection"]],
    technicalParameters: [["Phases", "Three phase"], ["Cooling", "ONAN / ONAF by design"], ["Installation", "Outdoor"], ["Tap changer", "Project-specific"], ["Monitoring", "Project-specific"], ["Transport limits", "Reviewed for destination and route"]],
    evidenceIds: ["power-transformer-50mva-110kv", "power-transformer-150mva-132kv", "power-transformer-240mva-220kv-ssz20", "power-transformer-240mva-220kv-ssz22"],
    drawingIds: [],
    testedModels: ["SZ22-50000/110-NX1", "SFZ-150000/132", "SSZ20-240000/220", "SSZ22-240000/220-NX1"],
    standards: [],
    faq: [
      ["What information is needed for a power transformer quotation?", "Provide system voltages, capacity, vector group, impedance, tapping range, losses, cooling, insulation levels, accessories, site conditions and applicable standards."],
      ["Are 220 kV reports available?", "Yes. Two independent 240 MVA / 220 kV report sets are listed in Tested & Verified."]
    ]
  },
  {
    id: "cast-resin-dry-type-transformer",
    slug: "cast-resin-dry-type-transformer",
    name: "Cast Resin Dry-Type Transformer",
    family: "Dry-Type Transformer",
    strapline: "SCB18 epoxy-resin cast transformers for indoor distribution",
    description: "Cast-resin dry-type transformers for fire-sensitive, indoor and infrastructure applications. The current evidence set covers SCB18 1000 kVA and 2500 kVA models at 10 kV.",
    seriesCapability: {
      voltage: "35 kV and below",
      capacity: "Up to 2,500 kVA shown",
      frequency: "50 / 60 Hz",
      cooling: "AN / AF",
      installation: "Indoor",
      standard: "Project specification"
    },
    keyParameters: [["Series", "SCB18"], ["Verified models", "1000 / 2500 kVA"], ["Verified voltage", "10 kV"], ["Cooling", "AN / AF"], ["Insulation", "Cast resin"]],
    gallery: [
      ["evidence/sample-photo-pages/dry-type-scb18-2500kva-10kv-sample-photo-page.webp", "SCB18 2500 kVA 10 kV cast resin dry-type transformer test sample"],
      ["evidence/sample-photo-pages/dry-type-scb18-1000kva-10kv-sample-photo-page.webp", "SCB18 1000 kVA 10 kV cast resin dry-type transformer test sample"],
      ["products/dry-type-transformers/cast-resin-dry-type-transformer-red-01.jpeg", "Cast resin dry-type transformer winding and core assembly"],
      ["products/dry-type-transformers/cast-resin-transformer-core-coil-assembly.jpeg", "Cast resin dry-type transformer production view"]
    ],
    applications: ["Commercial buildings", "Hospitals", "Charging infrastructure", "Industrial facilities", "Rail and public infrastructure"],
    features: ["Flame-retardant cast-resin insulation", "Low maintenance", "Low partial-discharge design direction", "Temperature monitoring options", "Protective enclosure options"],
    productRange: [["Voltage", "35 kV and below"], ["Verified capacity", "1000 kVA and 2500 kVA"], ["Verified model", "SCB18"], ["Cooling", "AN / AF"]],
    technicalParameters: [["Phases", "Three phase"], ["Frequency", "50 / 60 Hz"], ["Vector groups", "Dyn11 / Yyn0 / project-specific"], ["Cooling", "AN / AF"], ["Enclosure", "Optional by project"], ["Temperature control", "Optional monitoring and fan control"]],
    evidenceIds: ["dry-type-scb18-1000kva-10kv", "dry-type-scb18-2500kva-10kv"],
    drawingIds: [],
    testedModels: ["SCB18-1000/10-NX1", "SCB18-2500/10"],
    standards: [],
    faq: [
      ["Where are cast-resin transformers typically installed?", "They are commonly considered for indoor, fire-sensitive, occupied or environmentally constrained sites."],
      ["Does the series include forced-air cooling?", "AN and AF arrangements can be reviewed for the selected model and enclosure."]
    ]
  },
  {
    id: "dry-type-prefabricated-substation",
    slug: "dry-type-prefabricated-substation",
    name: "Dry-Type Prefabricated Substation",
    family: "Prefabricated Substation",
    strapline: "European-Type Substation with a dry-type transformer inside",
    description: "A 35 kV and below prefabricated substation integrating primary equipment, transformer and low-voltage distribution. Its dry-type transformer configuration avoids oil leakage risk and suits renewable and environmentally sensitive sites.",
    seriesCapability: {
      voltage: "35 kV and below",
      capacity: "Up to 12,500 kVA",
      frequency: "50 Hz",
      cooling: "AN / AF",
      installation: "Outdoor",
      standard: "IEC 62271-202 project scope"
    },
    keyParameters: [["Primary voltage", "6 / 12 / 35 kV"], ["Secondary voltage", "400 / 690 / 800 / 1140 V"], ["Maximum capacity", "12,500 kVA"], ["Transformer", "Dry type"], ["Installation", "Outdoor prefabricated"]],
    gallery: [
      ["products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp", "35 kV dry-type prefabricated substation exterior"],
      ["products/prefabricated-substations/dry-type-prefabricated-substation-lineup.webp", "Dry-type prefabricated substation installed at an industrial site"],
      ["applications/wind-turbine-dry-type-prefabricated-substation-site.webp", "Dry-type prefabricated substation at a renewable energy project"],
      ["factory/dry-type-prefabricated-substation-assembly-01.webp", "Dry-type prefabricated substation production process"],
      ["factory/dry-type-prefabricated-substation-assembly-02.webp", "Prefabricated substation factory assembly"],
      ["products/prefabricated-substations/dry-type-prefabricated-substation-interior.webp", "Dry-type transformer compartment inside a prefabricated substation"]
    ],
    applications: ["Wind power", "Solar power", "Energy storage", "Urban distribution", "Environmentally sensitive sites"],
    features: ["Integrated transformation, protection and distribution", "Dry-type transformer inside", "Flexible primary and secondary schemes", "Factory assembly reduces site work", "Monitoring and remote-operation options"],
    productRange: [["Primary voltage", "Up to 35 kV"], ["Secondary voltage", "400 to 1140 V"], ["Series capability", "Up to 12,500 kVA"], ["Verified models", "6300 / 10000 / 12500 kVA"]],
    technicalParameters: [["Enclosure", "Outdoor prefabricated"], ["Transformer", "Dry type"], ["Cooling", "AN / AF"], ["Protection", "Project-specific"], ["Monitoring", "Optional"], ["Cable entry", "Project-specific"]],
    evidenceIds: ["european-substation-6300kva-35kv", "european-substation-10000kva-35kv", "european-substation-12500kva-35kv"],
    drawingIds: ["european-substation-6300kva-35kv-outline", "european-substation-10000kva-35kv-outline", "european-substation-12500kva-35kv-outline"],
    testedModels: ["YB-40.5/1.14-6300", "YB-40.5/1.14-10000", "YB-40.5/1.14-12500"],
    standards: ["IEC 62271-202 project scope"],
    faq: [
      ["Why use a dry-type transformer inside the substation?", "It removes transformer-oil leakage risk and can suit fire-sensitive or environmentally constrained projects."],
      ["Can the primary and secondary schemes be customized?", "Yes. Switchgear, protection, metering, auxiliary power, cable entry and enclosure design are reviewed for each project."]
    ]
  },
  {
    id: "oil-immersed-prefabricated-substation",
    slug: "oil-immersed-prefabricated-substation",
    name: "Oil-Immersed Prefabricated Substation",
    family: "Prefabricated Substation",
    strapline: "GY Series / China-Type Substation for compact outdoor projects",
    description: "A 35 kV and below prefabricated substation with an oil-immersed transformer, high-voltage equipment and low-voltage distribution integrated into a compact outdoor package.",
    seriesCapability: {
      voltage: "35 kV and below",
      capacity: "Up to 15,000 kVA",
      frequency: "50 Hz",
      cooling: "ONAN",
      installation: "Outdoor",
      standard: "Project specification"
    },
    keyParameters: [["Primary voltage", "6 / 12 / 35 kV"], ["Secondary voltage", "400 / 540 / 690 / 800 / 950 / 1140 V"], ["Maximum capacity", "15,000 kVA"], ["Transformer", "Oil immersed"], ["Form", "Compact prefabricated"]],
    gallery: [
      ["products/prefabricated-substations/oil-prefabricated-substation-exterior-01.webp", "Oil-immersed prefabricated substation with transformer and equipment compartments"],
      ["applications/industrial-platform-oil-prefabricated-substation-site.webp", "GY series substation installed for a water-side renewable project"],
      ["applications/oil-prefabricated-substation-site-01.webp", "Oil-immersed prefabricated substation project unit"],
      ["products/prefabricated-substations/oil-prefabricated-substation-lv-cabinet-interior.webp", "Low-voltage compartment in a prefabricated substation"],
      ["products/prefabricated-substations/oil-prefabricated-substation-hv-compartment-interior.webp", "Transformer and busbar compartment detail"],
      ["factory/oil-prefabricated-substation-assembly.webp", "Prefabricated substation factory inspection"]
    ],
    applications: ["Offshore and coastal solar", "Wind power", "Utility distribution", "Energy storage", "Industrial power"],
    features: ["Compact footprint", "High enclosure protection direction", "Integrated protection and distribution", "Factory assembly and testing", "Adaptable to demanding outdoor environments"],
    productRange: [["Primary voltage", "Up to 35 kV"], ["Secondary voltage", "400 to 1140 V"], ["Series capability", "Up to 15,000 kVA"], ["Verified models", "10000 / 12500 kVA"]],
    technicalParameters: [["Transformer", "Oil immersed"], ["Cooling", "ONAN"], ["Enclosure", "Outdoor"], ["Protection level", "Project-specific"], ["Anti-corrosion", "Project-specific"], ["Monitoring", "Optional"]],
    evidenceIds: ["china-substation-10000kva-35kv", "china-substation-12500kva-35kv"],
    drawingIds: ["china-substation-10000kva-35kv-outline", "china-substation-12500kva-35kv-outline"],
    testedModels: ["YB-40.5-10000", "YB-40.5/1.14-12500 (GY)"],
    standards: [],
    faq: [
      ["How does this differ from the dry-type prefabricated substation?", "This family integrates an oil-immersed transformer and offers a higher published maximum series capacity."],
      ["Can it be designed for coastal service?", "Anti-corrosion, sealing, ventilation, structural loads and site environmental data are reviewed during project design."]
    ]
  },
  {
    id: "american-type-combined-transformer",
    slug: "american-type-combined-transformer",
    name: "American-Type Combined Transformer",
    family: "Combined Transformer",
    strapline: "Compact pad-mounted solution for renewable and distribution sites",
    description: "An integrated transformer package placing the transformer body, high-voltage load switch and fuse components within a compact oil-filled assembly. The workbook records a ZGS22-4000/35/0.8 certificate item, but the separate PDF asset has not been supplied.",
    seriesCapability: {
      voltage: "Up to 35 kV",
      capacity: "Up to 4,500 kVA",
      frequency: "50 Hz",
      cooling: "ONAN",
      installation: "Outdoor / pad mounted",
      standard: "Project specification"
    },
    keyParameters: [["Maximum capacity", "4,500 kVA"], ["Protection level", "IP54"], ["HV breaking capacity", "31.5 kA"], ["Altitude", "Below 5,000 m"], ["Construction", "Fully insulated and sealed"]],
    gallery: [
      ["products/combined-transformers/american-type-combined-transformer-exterior-01.webp", "American-type combined transformer exterior and low-voltage compartment"],
      ["products/combined-transformers/american-type-combined-transformer-exterior-02.webp", "American-type combined transformer factory lineup"],
      ["applications/floating-solar-combined-transformer-site.webp", "Combined transformer at a floating solar project"],
      ["products/combined-transformers/american-type-combined-transformer-lv-cabinet-interior.webp", "Control and protection compartment detail"],
      ["factory/combined-transformer-wiring-assembly.webp", "Combined transformer production wiring"],
      ["products/combined-transformers/american-type-combined-transformer-busbar-interior.webp", "High-voltage compartment detail"]
    ],
    applications: ["Solar power", "Floating photovoltaic projects", "Wind power", "Compact distribution", "Energy storage"],
    features: ["Highly integrated construction", "Compact footprint", "Fully insulated and sealed design", "Low-maintenance operating direction", "Pad-mounted installation"],
    productRange: [["Primary voltage", "Up to 35 kV"], ["Series capability", "Up to 4,500 kVA"], ["Recorded model", "ZGS22-4000/35/0.8"], ["Installation", "Outdoor / pad mounted"]],
    technicalParameters: [["Cooling", "ONAN"], ["Enclosure", "IP54 published capability"], ["HV breaking capacity", "31.5 kA published capability"], ["Altitude", "Below 5,000 m published capability"], ["Protection", "Project-specific"], ["Cable entry", "Project-specific"]],
    evidenceIds: ["american-combined-transformer-pending"],
    drawingIds: [],
    testedModels: [],
    standards: [],
    faq: [
      ["Is the ZGS22 certificate available online?", "The workbook records the certificate item, but no separate PDF was supplied. The site therefore shows an asset-pending status without inventing a report."],
      ["Where is this solution typically used?", "It is suited to compact outdoor distribution and renewable projects where a pad-mounted integrated package is preferred."]
    ]
  }
];

export const otherSolutions = [
  {
    name: "Rectifier Transformer",
    description: "ZBS, ZBSCB and project-specific oil-immersed or dry-type rectifier transformer solutions for industrial DC systems.",
    image: "products/special-transformers/dry-type-rectifier-transformer-red.jpeg",
    tags: ["ZBS", "ZBSCB", "24-pulse"]
  },
  {
    name: "Special Transformer",
    description: "Project-engineered split, isolation and other special transformer configurations.",
    image: "products/prefabricated-substations/integrated-prefabricated-substation-render.jpeg",
    tags: ["Split transformer", "Custom duty"]
  },
  {
    name: "Amorphous Alloy Dry-Type Transformer",
    description: "SC(B)17/19 energy-saving dry-type transformer family with an amorphous alloy core.",
    image: "products/dry-type-transformers/amorphous-alloy-dry-type-transformer-with-fans.jpeg",
    tags: ["SC(B)17/19", "Amorphous alloy"]
  },
  {
    name: "S20 / SZ20 Energy-Saving Transformer",
    description: "Low-loss oil-immersed distribution transformer solutions with optional on-load voltage regulation.",
    image: "products/distribution-transformers/oil-immersed-distribution-transformer-green.jpeg",
    tags: ["S20", "SZ20"]
  }
];

export const productById = new Map(products.map((product) => [product.id, product]));
