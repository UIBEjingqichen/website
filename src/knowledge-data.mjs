export const knowledgeTopics = [
  {
    slug: "transformer-basics",
    name: "Transformer Basics",
    description: "Core transformer structures, operating principles and terminology used during early project communication.",
    sections: [
      ["Product structure", "Understand the practical differences between liquid-immersed and dry-type transformer construction."],
      ["Voltage transformation", "Distinguish step-up, step-down and isolation duties from voltage regulation by tap changer."],
      ["Installation and mounting", "Connect indoor, outdoor, pad-mounted, pole-mounted, floor-standing and mobile arrangements to project conditions."]
    ]
  },
  {
    slug: "transformer-selection",
    name: "Transformer Selection",
    description: "Selection guidance based on voltage, capacity, load profile, fire safety, environment and lifecycle requirements.",
    sections: [
      ["Initial selection", "Start with application, engineering role and installation environment before choosing a product family."],
      ["Technical confirmation", "Confirm rated capacity, voltage ratio, frequency, vector group, impedance, insulation level and tap range."],
      ["Project-specific review", "Nonlinear loads, high altitude, salt fog, seismic duty and low-noise requirements require additional review."]
    ]
  },
  {
    slug: "engineering-roles",
    name: "Engineering Roles",
    description: "How transformers function inside generation, transmission, distribution, industrial and auxiliary power systems.",
    sections: [
      ["Grid and generation", "Generation step-up, grid interconnection, substation main and distribution transformer duties."],
      ["Industrial power", "Power-electronics interface, rectifier, furnace, traction and industrial process transformer duties."],
      ["Special functions", "Grounding, isolation, testing, temporary power and facility auxiliary supply duties."]
    ]
  },
  {
    slug: "applications",
    name: "Applications",
    description: "Transformer requirements for utility, renewable energy, data center, industrial, mining, marine and infrastructure projects.",
    sections: [
      ["Renewable energy", "Solar, wind and battery energy storage projects may require inverter-duty insulation, split windings and thermal cycling capability."],
      ["Critical facilities", "Data centers, hospitals and commercial buildings emphasize fire safety, harmonic loading, noise and service continuity."],
      ["Harsh environments", "Mining, marine, railway and heavy-industry projects may require mechanical reinforcement, corrosion protection and special cooling."]
    ]
  },
  {
    slug: "liquid-immersed-transformers",
    name: "Liquid-Immersed Transformers",
    description: "Insulating liquids, tank structures, cooling codes, accessories and maintenance considerations for liquid-filled transformers.",
    sections: [
      ["Insulating liquids", "Compare mineral oil, natural ester, synthetic ester and other fire-resistant liquids."],
      ["Tank and preservation", "Review hermetically sealed, corrugated tank and conservator arrangements."],
      ["Cooling systems", "Understand ONAN, ONAF, OFAF, ODAF, OFWF and ODWF designations."]
    ]
  },
  {
    slug: "dry-type-transformers",
    name: "Dry-Type Transformers",
    description: "Dry-type insulation systems, enclosures, core materials and cooling arrangements for indoor and fire-sensitive installations.",
    sections: [
      ["Insulation systems", "Compare cast resin, resin encapsulated, VPI, VPE and open-wound construction."],
      ["Enclosures", "Relate open, ventilated, non-ventilated and sealed enclosures to IP and NEMA requirements."],
      ["Thermal management", "Understand AN, AF and combined AN/AF ratings and their effect on noise and capacity."]
    ]
  },
  {
    slug: "electrical-parameters",
    name: "Electrical Parameters",
    description: "Definitions and selection effects of capacity, voltage ratio, frequency, vector group, impedance, insulation level and tap range.",
    sections: [
      ["Ratings", "Rated capacity and voltage define the basic electrical duty but do not fully define the transformer design."],
      ["System compatibility", "Frequency, phase, vector group, grounding and impedance affect system integration and parallel operation."],
      ["Voltage regulation", "OCTC and OLTC arrangements provide different methods of adjusting transformer ratio."]
    ]
  },
  {
    slug: "standards-and-testing",
    name: "Standards & Testing",
    description: "How project standards, routine tests, type tests and documentation should be confirmed for an export transformer inquiry.",
    sections: [
      ["Applicable standards", "IEC, IEEE, ANSI, UL, DOE and regional requirements must be confirmed against the destination market and project specification."],
      ["Testing", "Routine, type and special tests should be agreed before order confirmation."],
      ["Documents", "Datasheets, drawings, test reports, certificates and inspection plans should be listed as contractual deliverables."]
    ]
  }
];

export const knowledgeFaqs = [
  {
    slug: "dry-type-vs-oil-immersed-transformer",
    topic: "transformer-selection",
    question: "Dry-type vs oil-immersed transformer: how should a project choose?",
    summary: "The selection depends on installation location, fire and environmental requirements, voltage and capacity, maintenance conditions and lifecycle cost.",
    answer: "Dry-type transformers are commonly selected for indoor or fire-sensitive locations where leakage prevention and simplified maintenance are important. Liquid-immersed transformers are widely used for outdoor, higher-voltage and higher-capacity duties because the insulating liquid provides effective insulation and heat transfer. The final decision should be based on the complete project specification rather than product type alone.",
    sections: [
      ["When dry-type is commonly selected", "Indoor distribution rooms, commercial buildings, data centers and other locations with strict fire or leakage controls often use dry-type construction. Enclosure, ventilation, ambient temperature and harmonic load must still be reviewed."],
      ["When liquid-immersed is commonly selected", "Outdoor substations, utility networks, renewable-energy plants and high-capacity industrial projects often use liquid-immersed transformers. Fire protection, oil containment, fluid type and maintenance access must be considered."],
      ["What should be compared", "Compare voltage and capacity range, fire classification, environmental impact, losses, noise, footprint, maintenance plan, overload duty and total lifecycle cost."]
    ],
    relatedTerms: ["Cast resin", "VPI", "Mineral oil", "Natural ester", "Fire-resistant fluid"],
    relatedFaqs: ["mineral-oil-vs-natural-ester", "cast-resin-vs-vpi", "information-required-for-transformer-quotation"],
    productLink: "../../products.html",
    prefill: { structure: "not_sure", function: "general" }
  },
  {
    slug: "what-is-transformer-k-factor",
    topic: "electrical-parameters",
    question: "What is transformer K-factor?",
    summary: "K-factor indicates the transformer's ability to carry specified nonlinear load currents without exceeding its thermal limits.",
    answer: "A K-rated transformer is designed to withstand additional heating caused by harmonic currents from nonlinear loads. The rating does not remove harmonics from the electrical system. It normally involves conductor, neutral, magnetic and thermal design measures that allow the transformer to carry the specified harmonic load within its temperature limits.",
    sections: [
      ["Why it matters", "Servers, variable-frequency drives, rectifiers and switched-mode power supplies can produce harmonic currents. These currents increase winding and stray losses and may cause excessive neutral current."],
      ["What K-factor does not mean", "K-rating is a harmonic-withstand specification. It is different from harmonic mitigation, phase shifting, filtering or power-quality correction."],
      ["Information required", "Provide the load type, harmonic spectrum or design K-factor, neutral loading, capacity, voltage ratio, enclosure, ambient temperature and applicable standard."]
    ],
    relatedTerms: ["Nonlinear load", "Harmonic current", "Neutral current", "Harmonic mitigation"],
    relatedFaqs: ["transformer-for-data-center", "inverter-duty-transformer", "transformer-impedance-voltage"],
    productLink: "../../products.html#dry-type-transformer",
    prefill: { structure: "dry", function: "k_rated" }
  },
  {
    slug: "onan-vs-onaf-transformer-cooling",
    topic: "liquid-immersed-transformers",
    question: "What is the difference between ONAN and ONAF transformer cooling?",
    summary: "ONAN uses natural oil circulation and natural air cooling, while ONAF adds forced air from fans around the radiators.",
    answer: "In ONAN operation, transformer oil circulates by natural convection and heat leaves the radiators through natural airflow. In ONAF operation, oil circulation remains natural but fans force air across the radiators. A transformer may carry separate ONAN and ONAF ratings, but the exact capacity increase is a design value stated on the nameplate and datasheet.",
    sections: [
      ["ONAN characteristics", "ONAN has no cooling fans or oil pumps in operation. It offers low auxiliary power consumption, low mechanical noise and high simplicity."],
      ["ONAF characteristics", "ONAF uses radiator fans to increase external heat transfer. Fan controls, power supply, redundancy, noise and maintenance become part of the system design."],
      ["Selection considerations", "Confirm ambient temperature, loading profile, permissible temperature rise, noise limits, fan redundancy and whether the forced-cooling rating is continuous or conditional."]
    ],
    relatedTerms: ["Oil Natural Air Natural", "Oil Natural Air Forced", "Temperature rise", "Multi-rating"],
    relatedFaqs: ["mineral-oil-vs-natural-ester", "high-altitude-transformer-design", "transformer-impedance-voltage"],
    productLink: "../../products.html#oil-immersed-power-transformer",
    prefill: { structure: "liquid", function: "general" }
  },
  {
    slug: "mineral-oil-vs-natural-ester",
    topic: "liquid-immersed-transformers",
    question: "Mineral oil vs natural ester: which transformer fluid should be selected?",
    summary: "Mineral oil offers mature performance and broad application, while natural ester provides a higher fire point and improved biodegradability.",
    answer: "Mineral oil remains widely used because its performance, supply chain and maintenance practices are mature. Natural ester is often considered where fire safety, environmental protection or moisture management is important. Fluid choice must be coordinated with tank sealing, cooling design, low-temperature conditions, material compatibility and the applicable standard.",
    sections: [
      ["Mineral oil", "Mineral oil is widely available and suitable for many distribution and power transformer duties. Spill containment, fire protection and environmental controls may be required."],
      ["Natural ester", "Natural ester generally has a higher fire point and strong biodegradability. Its viscosity, oxidation sensitivity, cold-temperature behavior and sealing arrangement require design review."],
      ["Selection questions", "Confirm installation location, minimum ambient temperature, fire code, environmental sensitivity, voltage and capacity, maintenance plan and whether the unit is hermetically sealed."]
    ],
    relatedTerms: ["Insulating liquid", "Fire point", "Biodegradability", "Hermetically sealed tank"],
    relatedFaqs: ["dry-type-vs-oil-immersed-transformer", "onan-vs-onaf-transformer-cooling", "high-altitude-transformer-design"],
    productLink: "../../products.html#oil-immersed-energy-saving-transformer",
    prefill: { structure: "liquid", function: "general" }
  },
  {
    slug: "transformer-impedance-voltage",
    topic: "electrical-parameters",
    question: "What is transformer impedance voltage and why does it matter?",
    summary: "Impedance voltage affects fault current, voltage regulation, load sharing and the ability of transformers to operate in parallel.",
    answer: "Transformer impedance voltage, often expressed as a percentage, represents the voltage required to circulate rated current when one winding is short-circuited under specified test conditions. A higher percentage generally limits short-circuit current more strongly but can increase voltage drop. The required value must be coordinated with the system study and any parallel transformers.",
    sections: [
      ["System effect", "Impedance influences prospective fault current and voltage drop under load. It is therefore both a transformer parameter and a power-system coordination parameter."],
      ["Parallel operation", "Transformers intended to operate in parallel require compatible voltage ratios, vector groups and impedance values so that load is shared appropriately."],
      ["What to provide", "Provide the required percentage impedance, MVA base, tolerance, short-circuit level, loading duty and details of any existing transformer that must operate in parallel."]
    ],
    relatedTerms: ["Percentage impedance", "Short-circuit current", "Voltage drop", "Parallel operation"],
    relatedFaqs: ["transformer-vector-group", "oltc-vs-octc", "information-required-for-transformer-quotation"],
    productLink: "../../products.html",
    prefill: { structure: "not_sure", function: "general" }
  },
  {
    slug: "information-required-for-transformer-quotation",
    topic: "transformer-selection",
    question: "What information is required for a transformer quotation?",
    summary: "A useful quotation starts with electrical ratings, application, installation conditions, standards, accessories and required documents.",
    answer: "At minimum, provide rated capacity, primary and secondary voltage, frequency, phase, application, indoor or outdoor location and destination country. A technically reliable quotation should also define vector group, impedance, insulation level, tap changer and range, ambient conditions, cooling, enclosure, accessories, applicable standards, tests and document requirements.",
    sections: [
      ["Basic electrical information", "Rated capacity, voltage ratio, frequency, phase, vector group, impedance, insulation level and tap range."],
      ["Operating conditions", "Application, load profile, altitude, ambient temperature, humidity, pollution, indoor or outdoor location, mounting method and space limits."],
      ["Commercial and document scope", "Quantity, delivery destination, standards, routine or special tests, drawings, certificates, inspection requirements, packaging and requested delivery schedule."]
    ],
    relatedTerms: ["Datasheet", "Single-line diagram", "Technical specification", "Inspection and test plan"],
    relatedFaqs: ["dry-type-vs-oil-immersed-transformer", "transformer-impedance-voltage", "transformer-vector-group"],
    productLink: "../../contact.html",
    prefill: { structure: "not_sure", function: "general" }
  },
  {
    slug: "transformer-for-data-center",
    topic: "applications",
    question: "What transformer is suitable for a data center?",
    summary: "Data center transformer selection usually emphasizes fire safety, harmonic loading, efficiency, reliability, noise and integration with busway or switchgear.",
    answer: "Dry-type transformers are commonly used inside data center buildings, while liquid-immersed units may be used outdoors or in dedicated rooms where permitted. The design should be based on the actual power architecture and load profile. Harmonic currents, neutral loading, efficiency at expected load, redundancy, temperature rise, sound level, enclosure and low-voltage connection method require specific review.",
    sections: [
      ["Load characteristics", "UPS systems, server power supplies and power-electronic equipment can create nonlinear current. K-rating or other harmonic-withstand requirements should be based on the design study."],
      ["Installation requirements", "Confirm room ventilation, fire classification, enclosure, bus duct interface, cable entry, footprint, access, sound limit and monitoring interfaces."],
      ["Reliability and efficiency", "Review redundancy philosophy, loading under normal and contingency conditions, loss capitalization, temperature rise and fan dependency."]
    ],
    relatedTerms: ["K-rated transformer", "Bus duct", "Low-noise design", "Redundancy"],
    relatedFaqs: ["what-is-transformer-k-factor", "cast-resin-vs-vpi", "dry-type-vs-oil-immersed-transformer"],
    productLink: "../../products.html#dry-type-transformer",
    prefill: { structure: "dry", function: "k_rated" }
  },
  {
    slug: "inverter-duty-transformer",
    topic: "applications",
    question: "What is an inverter-duty transformer?",
    summary: "An inverter-duty transformer is designed for the electrical and thermal stresses associated with power-electronic converters and inverter-connected systems.",
    answer: "An inverter-duty transformer is specified for service with power-electronic equipment such as solar inverters, wind converters, battery PCS or industrial drives. Depending on the circuit, the design may need additional turn insulation, electrostatic shielding, harmonic-loss allowance, split windings, controlled impedance, reduced flux density and specific thermal cycling capability.",
    sections: [
      ["Why a standard transformer may be insufficient", "Fast switching can introduce steep-front voltage pulses and common-mode noise, while converter current may contain harmonics or a small DC component. The severity depends on topology, cable length, filters and switching frequency."],
      ["Typical design measures", "Possible measures include reinforced turn insulation, electrostatic shields, winding segmentation, thermal margin, optimized core flux density and mechanical reinforcement."],
      ["Information required", "Provide converter topology, waveform or harmonic spectrum, switching frequency, cable length, filters, voltage, capacity, duty cycle, grounding and expected overloads."]
    ],
    relatedTerms: ["dv/dt", "Electrostatic shield", "DC bias", "Split winding"],
    relatedFaqs: ["what-is-transformer-k-factor", "transformer-impedance-voltage", "information-required-for-transformer-quotation"],
    productLink: "../../products.html#special-transformer",
    prefill: { structure: "not_sure", function: "inverter" }
  },
  {
    slug: "cast-resin-vs-vpi",
    topic: "dry-type-transformers",
    question: "Cast resin vs VPI dry-type transformer: what is the difference?",
    summary: "Cast resin embeds the winding in a solid resin body, while VPI impregnates the winding insulation with varnish under vacuum and pressure.",
    answer: "Cast resin construction provides a solid encapsulated winding with strong resistance to moisture and contamination. VPI construction uses vacuum-pressure impregnation to fill winding voids with insulating varnish while retaining a more open winding structure. Neither system is universally superior; the selection depends on environment, thermal duty, mechanical requirements, repair strategy, standards and cost.",
    sections: [
      ["Cast resin characteristics", "Cast resin windings can provide strong environmental protection and low partial-discharge performance when correctly manufactured. Thermal expansion, resin formulation and quality control are important."],
      ["VPI characteristics", "VPI windings generally offer good heat transfer and avoid a thick rigid casting. Environmental protection may rely more heavily on insulation system quality and enclosure design."],
      ["How to choose", "Compare humidity and contamination, thermal cycling, overload duty, partial-discharge requirement, enclosure, repairability, certification and local market practice."]
    ],
    relatedTerms: ["Epoxy resin", "Vacuum pressure impregnation", "Partial discharge", "Thermal class"],
    relatedFaqs: ["transformer-for-data-center", "dry-type-vs-oil-immersed-transformer", "high-altitude-transformer-design"],
    productLink: "../../products.html#dry-type-transformer",
    prefill: { structure: "dry", function: "general" }
  },
  {
    slug: "oltc-vs-octc",
    topic: "electrical-parameters",
    question: "What is the difference between OLTC and OCTC?",
    summary: "An OLTC changes transformer taps while energized and carrying load, while an OCTC is operated only when the transformer is de-energized.",
    answer: "An on-load tap changer provides voltage-ratio adjustment without interrupting service and is used where operating voltage must be regulated during normal system operation. An off-circuit tap changer provides a simpler adjustment method but requires the transformer to be isolated and de-energized before changing position.",
    sections: [
      ["OLTC", "OLTC systems add switching equipment, drive mechanisms, controls, protection and maintenance requirements. They are common on grid and substation transformers requiring active voltage regulation."],
      ["OCTC", "OCTC arrangements are simpler and are commonly used where tap settings are selected during commissioning or infrequent maintenance outages."],
      ["Specification points", "Confirm tap range, number and size of steps, winding location, automatic voltage control, parallel operation, control supply and required monitoring."]
    ],
    relatedTerms: ["Tap range", "Automatic voltage regulator", "Voltage regulation", "Parallel operation"],
    relatedFaqs: ["transformer-impedance-voltage", "transformer-vector-group", "information-required-for-transformer-quotation"],
    productLink: "../../products.html#oil-immersed-power-transformer",
    prefill: { structure: "liquid", function: "general" }
  },
  {
    slug: "transformer-vector-group",
    topic: "electrical-parameters",
    question: "What is a transformer vector group?",
    summary: "The vector group identifies winding connections, neutral availability and the phase displacement between transformer windings.",
    answer: "A transformer vector group uses letter and clock notation to describe whether windings are connected in delta, star or zigzag, whether a neutral is brought out, and the phase displacement between high-voltage and low-voltage sides. It affects grounding, harmonic behavior, protection, system compatibility and parallel operation.",
    sections: [
      ["Reading the notation", "Letters identify the winding connection and lower-case notation normally refers to the lower-voltage winding. The clock number represents phase displacement in 30-degree increments."],
      ["Why it matters", "The selected group determines neutral availability, zero-sequence paths and compatibility with the upstream and downstream system."],
      ["Parallel operation", "Transformers intended for parallel operation generally require compatible vector groups, voltage ratios, tap settings and impedance values."]
    ],
    relatedTerms: ["Dyn11", "YNd11", "Zigzag", "Phase displacement"],
    relatedFaqs: ["transformer-impedance-voltage", "oltc-vs-octc", "information-required-for-transformer-quotation"],
    productLink: "../../products.html",
    prefill: { structure: "not_sure", function: "general" }
  },
  {
    slug: "high-altitude-transformer-design",
    topic: "transformer-selection",
    question: "How does high altitude affect transformer design?",
    summary: "Reduced air density at high altitude affects external insulation, cooling and the performance of air-insulated components.",
    answer: "At higher altitude, lower air density reduces dielectric strength and heat-transfer capability. Dry-type transformers, bushings, clearances, enclosures and cooling systems may require correction or redesign. The applicable standard, site altitude, ambient temperature and test altitude must be stated clearly because correction rules vary by equipment and standard.",
    sections: [
      ["Insulation effect", "External clearances and air-insulated parts may require increased distance or a higher insulation level to maintain the required withstand performance at site altitude."],
      ["Cooling effect", "Natural and forced-air cooling become less effective as air density decreases. Temperature rise, fan selection or rated output may require adjustment."],
      ["What to specify", "Provide site altitude, maximum and minimum ambient temperature, indoor or outdoor location, enclosure, required rating at site and the governing standard."]
    ],
    relatedTerms: ["Altitude correction", "Air clearance", "Temperature rise", "Derating"],
    relatedFaqs: ["onan-vs-onaf-transformer-cooling", "cast-resin-vs-vpi", "information-required-for-transformer-quotation"],
    productLink: "../../products.html",
    prefill: { structure: "not_sure", function: "general" }
  }
];

export const topicBySlug = new Map(knowledgeTopics.map((topic) => [topic.slug, topic]));
export const faqBySlug = new Map(knowledgeFaqs.map((faq) => [faq.slug, faq]));
