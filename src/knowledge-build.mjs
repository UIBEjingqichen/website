import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { nav, companyMenu, company, applications } from "./site-data.mjs";
import { categories } from "./products-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const knowledgeDir = path.join(dist, "knowledge");

const kbCategories = [
  {
    slug: "product-structure",
    name: "Product Structure",
    zh: "本体结构",
    description: "What kind of transformer is it? This layer separates liquid-immersed, dry-type and related structure terms before any application discussion."
  },
  {
    slug: "application-scenarios",
    name: "Application Scenarios",
    zh: "使用场景",
    description: "Where will the transformer be used? This layer connects the project environment to installation, load and safety requirements."
  },
  {
    slug: "engineering-roles",
    name: "Engineering Roles",
    zh: "工程职能",
    description: "What job does the transformer perform in the power system? This prevents confusing product names with system duties."
  },
  {
    slug: "technical-requirements",
    name: "Technical Requirements",
    zh: "技术要求",
    description: "What special ability or design requirement is needed, such as K-rated, harmonic mitigation, isolation or low noise."
  },
  {
    slug: "electrical-parameters",
    name: "Electrical Parameters",
    zh: "电气参数",
    description: "Why do rated capacity, voltage ratio, impedance, insulation level and tap changer affect transformer selection?"
  }
];

const pages = [
  {
    slug: "oil-immersed-transformer",
    category: "product-structure",
    title: "What is a Liquid-Immersed / Oil-Immersed Transformer?",
    zh: "什么是液浸式 / 油浸式变压器？",
    summary: "A liquid-immersed transformer places the core and windings in insulating liquid. The liquid provides insulation and carries heat away from the active part.",
    tags: ["Oil", "Outdoor", "Distribution", "Power Transformer"],
    sections: [
      { title: "Simple explanation", text: "Liquid-immersed transformers are usually filled with mineral oil, natural ester, synthetic ester or another insulating liquid. The liquid is a core part of the insulation and cooling system, not an optional accessory." },
      { title: "Why it matters", text: "This structure is commonly selected for outdoor operation, medium and large capacity, utility networks, substations, renewable projects and industrial power supply." },
      { title: "Selection notes", bullets: ["Confirm rated capacity, primary voltage, secondary voltage and frequency.", "Confirm indoor or outdoor installation, cooling method, insulating liquid and tap changer.", "Check fire safety, leakage control, oil pit, environmental and maintenance requirements."] },
      { title: "Related nodes", links: ["Insulating Liquid / 绝缘液体", "Cooling Method / 冷却方式", "ONAN", "ONAF", "Tap Changer / 调压方式", "Dry-Type Transformer / 干式变压器"] }
    ],
    products: ["Oil-Immersed Distribution Transformer", "Oil-Immersed Power Transformer", "Solar Step-Up Transformer", "Wind Farm Transformer"]
  },
  {
    slug: "dry-type-transformer",
    category: "product-structure",
    title: "What is a Dry-Type Transformer?",
    zh: "什么是干式变压器？",
    summary: "A dry-type transformer uses air and solid insulation instead of insulating oil, making it suitable for many indoor and fire-sensitive locations.",
    tags: ["Indoor", "No Oil", "Building", "Data Center"],
    sections: [
      { title: "Simple explanation", text: "Dry-type transformers commonly use cast resin, resin encapsulation, VPI or VPE insulation systems. They are not simply smaller oil transformers, but a different insulation and cooling structure." },
      { title: "Why it matters", text: "They are often used in commercial buildings, hospitals, data centers, metro systems and indoor industrial distribution because they reduce oil leakage and fire-related concerns." },
      { title: "Selection notes", bullets: ["Confirm insulation system, enclosure type, IP rating and cooling method.", "For UPS, server loads or VFD systems, check nonlinear load, K-rated and harmonic requirements.", "For outdoor use, confirm weatherproof enclosure, ventilation, condensation and anti-corrosion design."] },
      { title: "Related nodes", links: ["K-Rated Transformer / K 系数变压器", "Harmonic Mitigation / 谐波抑制", "Low Noise Design / 低噪音设计", "Cast Resin Transformer / 环氧浇注变压器", "VPI Transformer / 真空压力浸渍变压器"] }
    ],
    products: ["Dry-Type Distribution Transformer", "Cast Resin Dry-Type Transformer", "K-Rated Dry-Type Transformer", "Data Center Dry-Type Transformer"]
  },
  {
    slug: "insulating-liquid",
    category: "product-structure",
    title: "What is Insulating Liquid in a Transformer?",
    zh: "什么是变压器绝缘液体？",
    summary: "Insulating liquid supports electrical insulation, heat transfer and internal material protection in liquid-filled transformers.",
    tags: ["Mineral Oil", "Natural Ester", "Synthetic Ester"],
    sections: [
      { title: "Common liquids", bullets: ["Mineral oil: mature, common and cost-effective for many utility and industrial projects.", "Natural ester: higher fire point and better environmental profile, often considered for fire-sensitive or environmental projects.", "Synthetic ester: stable performance and good fire-resistant properties for special safety scenarios."] },
      { title: "Selection notes", text: "If the customer mentions indoor installation, fire safety, environmental sensitivity, coastal location or special project standards, the liquid type should be confirmed instead of assuming mineral oil." },
      { title: "Related nodes", links: ["Oil-Immersed Transformer / 油浸式变压器", "Fire-Resistant Design / 防火设计", "Natural Ester / 天然酯", "Synthetic Ester / 合成酯", "Mineral Oil / 矿物油"] }
    ],
    products: ["Natural Ester Liquid-Immersed Transformer", "Fire-Resistant Liquid-Filled Transformer"]
  },
  {
    slug: "cooling-method",
    category: "product-structure",
    title: "What are Transformer Cooling Methods?",
    zh: "什么是变压器冷却方式？",
    summary: "Cooling method describes how heat is removed from transformer windings and core during operation.",
    tags: ["ONAN", "ONAF", "AN", "AF"],
    sections: [
      { title: "Common oil-immersed cooling", bullets: ["ONAN: oil natural air natural, common for many medium and smaller liquid-filled units.", "ONAF: oil natural air forced, using fans to increase cooling capacity.", "OFAF / ODAF: forced or directed oil circulation with forced air for larger power transformers."] },
      { title: "Common dry-type cooling", bullets: ["AN: air natural cooling.", "AF: forced air cooling.", "AN/AF: natural cooling with fan-assisted capacity increase."] },
      { title: "Related nodes", links: ["ONAN", "ONAF", "Dry-Type Transformer / 干式变压器", "Oil-Immersed Transformer / 油浸式变压器", "Temperature Rise / 温升"] }
    ],
    products: ["Oil-Immersed Power Transformer", "Dry-Type Distribution Transformer"]
  },
  {
    slug: "utility-grid",
    category: "application-scenarios",
    title: "What Transformers are Used in Utility Grid Projects?",
    zh: "公用电网项目常用哪些变压器？",
    summary: "Utility grid projects usually need standardized distribution transformers, outdoor durability, low losses and protection coordination.",
    tags: ["Grid", "Distribution", "Outdoor"],
    sections: [
      { title: "Scenario overview", text: "This scenario usually refers to transformers used by power utilities or distribution networks to step medium voltage down to low voltage for residential, commercial, rural or urban distribution." },
      { title: "Key requirements", bullets: ["Long-term reliability and low losses.", "Outdoor weather resistance and lightning protection.", "Compatibility with distribution lines, protection devices and mounting method."] },
      { title: "Related nodes", links: ["Distribution / 配电", "Step-Down / 降压", "Pole-Mounted Transformer / 柱上变压器", "Pad-Mounted Transformer / 垫装式变压器"] }
    ],
    products: ["Oil-Immersed Distribution Transformer", "Dry-Type Distribution Transformer", "Pad-Mounted Transformer"]
  },
  {
    slug: "substation",
    category: "application-scenarios",
    title: "What Transformer Requirements Matter in a Substation?",
    zh: "变电站场景中哪些变压器要求重要？",
    summary: "Substation transformers often involve larger capacity, insulation level, impedance, tap changer, cooling and protection accessories.",
    tags: ["Substation", "Main Transformer", "OLTC"],
    sections: [
      { title: "Scenario overview", text: "Substation transformers may serve as main transformers or station service transformers. The role should be confirmed before quotation because the duty and specification are very different." },
      { title: "Key requirements", bullets: ["High reliability and short-circuit withstand capability.", "Insulation level, impedance voltage and cooling method.", "Protection accessories such as Buchholz relay, pressure relief device, oil level and temperature indicators."] },
      { title: "Related nodes", links: ["Substation Main Transformer / 变电站主变", "OLTC / 有载调压", "Insulation Level / 绝缘水平", "Impedance Voltage / 阻抗电压", "GA Drawing / 总装图"] }
    ],
    products: ["Oil-Immersed Power Transformer", "Station Service Transformer"]
  },
  {
    slug: "solar-power-plant",
    category: "application-scenarios",
    title: "What Transformer is Used in a Solar Power Plant?",
    zh: "光伏电站使用什么变压器？",
    summary: "Solar projects often use step-up transformers to connect inverter output to the collection system or grid connection voltage.",
    tags: ["Solar", "Step-Up", "Inverter"],
    sections: [
      { title: "Scenario overview", text: "Solar transformers are often connected to PV inverters, pad-mounted systems, prefabricated substations or booster substations." },
      { title: "Key requirements", bullets: ["Inverter output voltage and grid-side voltage.", "Outdoor temperature, dust, sand, altitude and anti-corrosion needs.", "Low losses and adaptation to power electronics and harmonics."] },
      { title: "Related nodes", links: ["Generation Step-Up / 发电升压", "Inverter Duty / 逆变器专用", "Harmonic Mitigation / 谐波抑制", "Pad-Mounted Transformer / 垫装变压器"] }
    ],
    products: ["Solar Step-Up Transformer", "Pad-Mounted Step-Up Transformer", "Prefabricated Transformer Substation"]
  },
  {
    slug: "wind-farm",
    category: "application-scenarios",
    title: "What Transformer Requirements Matter in Wind Farm Projects?",
    zh: "风电场变压器需要关注哪些要求？",
    summary: "Wind farm transformers handle fluctuating generation, outdoor operation, temperature differences, vibration and sometimes coastal anti-corrosion requirements.",
    tags: ["Wind", "Outdoor", "Anti-Corrosion"],
    sections: [
      { title: "Scenario overview", text: "Wind farm transformers step up turbine or collector system voltage and connect wind generation to field collection lines or substations." },
      { title: "Key requirements", bullets: ["Load fluctuation and reliability.", "Low-temperature, high-temperature, high-altitude, dust or salt fog adaptation.", "Anti-corrosion, humidity and vibration requirements, especially for offshore wind."] },
      { title: "Related nodes", links: ["Generation Step-Up / 发电升压", "Anti-Corrosion Design / 防腐设计", "High-Altitude Design / 高海拔设计", "Seismic / Vibration Requirement / 抗震与振动要求"] }
    ],
    products: ["Wind Farm Transformer", "Offshore Wind Transformer", "Oil-Immersed Step-Up Transformer"]
  },
  {
    slug: "bess",
    category: "application-scenarios",
    title: "What Transformer is Used in a BESS Project?",
    zh: "储能系统使用什么变压器？",
    summary: "BESS transformers connect PCS equipment to the grid and must consider bidirectional power flow, harmonics, thermal cycling and fire safety.",
    tags: ["BESS", "PCS", "Bidirectional"],
    sections: [
      { title: "Scenario overview", text: "Battery energy storage transformers may provide voltage matching, isolation, step-up and grid interconnection between PCS and the grid." },
      { title: "Key requirements", bullets: ["PCS interface and bidirectional power flow.", "Harmonic adaptation, short-time overload and thermal cycling.", "Fire-resistant design and installation environment."] },
      { title: "Related nodes", links: ["Power Electronics Interface / 电力电子接口", "Inverter Duty / 逆变器专用", "Harmonic Mitigation / 谐波抑制", "Isolation Transformer / 隔离变压器"] }
    ],
    products: ["BESS Transformer", "Inverter Duty Transformer", "Prefabricated Transformer Substation"]
  },
  {
    slug: "data-center",
    category: "application-scenarios",
    title: "What Transformer is Used in a Data Center?",
    zh: "数据中心通常使用什么变压器？",
    summary: "Data center transformer selection often focuses on dry-type structure, UPS compatibility, nonlinear loads, K-rated design, isolation, low noise and low losses.",
    tags: ["Data Center", "UPS", "K-Rated", "Low Noise"],
    sections: [
      { title: "Scenario overview", text: "Data centers have high reliability requirements and many power electronic loads, including UPS systems, server power supplies and distribution equipment." },
      { title: "Key requirements", bullets: ["Indoor fire safety and low noise.", "UPS compatibility, nonlinear load and K-rated requirement.", "Isolation, shielded isolation, harmonic mitigation and low-loss design."] },
      { title: "Related nodes", links: ["Dry-Type Transformer / 干式变压器", "K-Rated Transformer / K 系数变压器", "Harmonic Mitigation / 谐波抑制", "Isolation Transformer / 隔离变压器", "Low Noise Design / 低噪音设计"] }
    ],
    products: ["Data Center Dry-Type Transformer", "K-Rated Dry-Type Transformer", "UPS Isolation Transformer"]
  },
  {
    slug: "industrial-plant",
    category: "application-scenarios",
    title: "How Should Transformers be Selected for an Industrial Plant?",
    zh: "工业工厂如何选择变压器？",
    summary: "Industrial plants may have motors, VFDs, rectifiers, furnaces, welding equipment and process loads, so load type matters more than the word factory itself.",
    tags: ["Industrial", "VFD", "Rectifier", "Furnace"],
    sections: [
      { title: "Scenario overview", text: "Industrial transformer selection depends on whether the transformer supplies general distribution or directly feeds process equipment." },
      { title: "Key requirements", bullets: ["Load type, duty cycle, starting current and overload requirement.", "Harmonics from rectifiers, converters and VFDs.", "Dust, corrosion, pollution level, cooling and protection coordination."] },
      { title: "Related nodes", links: ["Industrial Process Power Supply / 工业工艺设备供电", "Power Electronics Interface / 电力电子接口", "Rectifier Transformer / 整流变压器", "Furnace Duty / 炉用", "Harmonic Mitigation / 谐波抑制"] }
    ],
    products: ["Oil-Immersed Industrial Transformer", "Industrial Dry-Type Transformer", "Rectifier Transformer"]
  },
  {
    slug: "distribution",
    category: "engineering-roles",
    title: "What is a Distribution Transformer Role?",
    zh: "什么是配电工程职能？",
    summary: "Distribution means the transformer supplies users, buildings or equipment at usable voltage levels, often near the load center.",
    tags: ["Distribution", "Step-Down", "Load Center"],
    sections: [
      { title: "Simple explanation", text: "Distribution is an engineering role rather than a complete specification. It usually means stepping medium voltage down to a lower voltage for users or equipment." },
      { title: "Parameters to confirm", bullets: ["Rated capacity, primary voltage and secondary voltage.", "Frequency, phase, connection group and impedance voltage.", "Indoor or outdoor installation and inlet / outlet method."] },
      { title: "Related nodes", links: ["Utility Grid / 公用电网", "Commercial Building / 商业建筑", "Dry-Type Transformer / 干式变压器", "Oil-Immersed Transformer / 油浸式变压器"] }
    ],
    products: ["Oil-Immersed Distribution Transformer", "Dry-Type Distribution Transformer"]
  },
  {
    slug: "substation-main-transformer",
    category: "engineering-roles",
    title: "What is a Substation Main Transformer?",
    zh: "什么是变电站主变？",
    summary: "A substation main transformer performs large-capacity voltage conversion in a substation and is a core power system asset.",
    tags: ["Main Transformer", "Power Transformer", "Substation"],
    sections: [
      { title: "Why it matters", text: "A main transformer often involves large capacity, high insulation level, cooling system, OLTC, protection accessories, online monitoring, civil foundation and transport constraints." },
      { title: "Documents to request", bullets: ["Single Line Diagram / SLD.", "Technical specification and drawings.", "Rated voltage, capacity, cooling method, tap changer, impedance and standards."] },
      { title: "Related nodes", links: ["Substation / 变电站", "OLTC / 有载调压", "Insulation Level / 绝缘水平", "Power Transformer / 电力变压器"] }
    ],
    products: ["Oil-Immersed Power Transformer", "OLTC Power Transformer"]
  },
  {
    slug: "generation-step-up",
    category: "engineering-roles",
    title: "What is Generation Step-Up / Grid Interconnection?",
    zh: "什么是发电升压 / 并网职能？",
    summary: "Generation step-up transformers raise generator, inverter or PCS output voltage to collection line or grid connection voltage.",
    tags: ["Step-Up", "Grid Connection", "Renewable"],
    sections: [
      { title: "Why it matters", text: "Generation-side transformers are not ordinary distribution transformers. They must match the generator, inverter or power electronics interface and grid connection requirements." },
      { title: "Parameters to confirm", bullets: ["Inverter or generator output voltage and grid-side voltage.", "Capacity per transformer, impedance, connection group and cooling method.", "Outdoor environment, anti-corrosion and grid code requirements."] },
      { title: "Related nodes", links: ["Solar Power Plant / 光伏电站", "Wind Farm / 风电场", "BESS / 储能系统", "Inverter Duty / 逆变器专用"] }
    ],
    products: ["Solar Step-Up Transformer", "Wind Farm Transformer", "Generator Step-Up Transformer"]
  },
  {
    slug: "power-electronics-interface",
    category: "engineering-roles",
    title: "What is a Power Electronics Interface Transformer Role?",
    zh: "什么是电力电子接口职能？",
    summary: "This role describes transformers connected to UPS, rectifiers, inverters, PCS, VFDs or other power electronic equipment.",
    tags: ["UPS", "PCS", "Rectifier", "Inverter"],
    sections: [
      { title: "Why it matters", text: "Power electronic equipment may introduce harmonics, distorted current, extra heating, dv/dt stress, grounding requirements and shielding requirements." },
      { title: "Hidden requirements", bullets: ["K-rated or harmonic-resistant design.", "Isolation or shielded isolation.", "Special impedance, phase-shifting, temperature rise or cooling design."] },
      { title: "Related nodes", links: ["Data Center / 数据中心", "BESS / 储能系统", "Harmonic Mitigation / 谐波抑制", "K-Rated Transformer / K 系数变压器", "Isolation Transformer / 隔离变压器"] }
    ],
    products: ["UPS Isolation Transformer", "Rectifier Transformer", "Inverter Duty Transformer"]
  },
  {
    slug: "system-grounding",
    category: "engineering-roles",
    title: "What is System Grounding / Neutral Reference?",
    zh: "什么是系统接地 / 中性点建立？",
    summary: "A grounding transformer creates a neutral reference or grounding path for systems that need controlled ground fault detection and limitation.",
    tags: ["Grounding", "Neutral", "Protection"],
    sections: [
      { title: "Why it matters", text: "Grounding transformers are not ordinary supply transformers. They are part of protection and system stability design." },
      { title: "Parameters to confirm", bullets: ["System voltage and grounding method.", "Fault current and fault duration.", "Zigzag or other connection and whether a grounding resistor is required."] },
      { title: "Related nodes", links: ["Grounding Transformer / 接地变压器", "Zigzag Grounding / 曲折形接地", "Neutral Grounding Resistor / 中性点接地电阻"] }
    ],
    products: ["Grounding Transformer", "Zigzag Grounding Transformer"]
  },
  {
    slug: "k-rated-transformer",
    category: "technical-requirements",
    title: "What is a K-Rated Transformer?",
    zh: "什么是 K 系数变压器？",
    summary: "A K-rated transformer is designed to withstand extra heating caused by harmonic currents from nonlinear loads. It does not automatically eliminate all harmonics.",
    tags: ["K-13", "UPS", "Nonlinear Load", "Data Center"],
    sections: [
      { title: "Simple explanation", text: "K-rated design focuses on thermal withstand under harmonic load. It is often considered for UPS systems, data centers, server loads and other nonlinear electrical systems." },
      { title: "Important distinction", text: "K-rated means the transformer can better tolerate harmonic heating. Harmonic mitigation means reducing harmonic influence through transformer or system design." },
      { title: "Questions to ask", bullets: ["What percentage of the load is nonlinear?", "Is there a required K value such as K-4, K-13 or K-20?", "Is there a harmonic study or technical specification?"] },
      { title: "Related nodes", links: ["Harmonic Mitigation / 谐波抑制", "Data Center / 数据中心", "UPS Isolation Transformer / UPS 隔离变压器", "Nonlinear Load / 非线性负载"] }
    ],
    products: ["K-Rated Dry-Type Transformer", "K-Rated Isolation Transformer", "Data Center Dry-Type Transformer"]
  },
  {
    slug: "harmonic-mitigation",
    category: "technical-requirements",
    title: "What is Harmonic Mitigation in Transformers?",
    zh: "什么是变压器谐波抑制？",
    summary: "Harmonic mitigation reduces the impact of harmonic currents from nonlinear loads such as UPS, rectifiers, VFDs, inverters and PCS equipment.",
    tags: ["Harmonics", "Power Quality", "UPS", "VFD"],
    sections: [
      { title: "Why it matters", text: "Harmonics can increase transformer losses and temperature rise, shorten insulation life, increase noise and affect power quality or protection behavior." },
      { title: "Common approaches", bullets: ["K-rated or harmonic-resistant transformer design.", "Phase-shifting transformer design in rectifier systems.", "Shielded isolation or special impedance where required by the system design."] },
      { title: "Related nodes", links: ["K-Rated Transformer / K 系数变压器", "Power Electronics Interface / 电力电子接口", "Phase-Shifting Transformer / 移相变压器", "Rectifier Transformer / 整流变压器"] }
    ],
    products: ["Harmonic Mitigating Transformer", "K-Rated Transformer", "Phase-Shifting Transformer"]
  },
  {
    slug: "isolation-transformer",
    category: "technical-requirements",
    title: "What is an Isolation Transformer?",
    zh: "什么是隔离变压器？",
    summary: "An isolation transformer electrically separates input and output while transferring AC power. It may be 1:1 or include voltage transformation.",
    tags: ["Isolation", "UPS", "Safety", "Shielding"],
    sections: [
      { title: "Why it matters", text: "Isolation can support grounding design, sensitive equipment protection, safety separation and some common-mode noise reduction needs." },
      { title: "Questions to ask", bullets: ["Is it 1:1 isolation or with voltage transformation?", "Is electrostatic shielding required?", "Is it for UPS, data center, hospital, test lab or industrial equipment?"] },
      { title: "Related nodes", links: ["Shielded Isolation / 屏蔽隔离", "Data Center / 数据中心", "UPS System / UPS 系统", "Grounding / 接地"] }
    ],
    products: ["Dry-Type Isolation Transformer", "UPS Isolation Transformer", "Shielded Isolation Transformer"]
  },
  {
    slug: "low-noise-design",
    category: "technical-requirements",
    title: "What is Low Noise Transformer Design?",
    zh: "什么是低噪音变压器设计？",
    summary: "Low-noise design reduces electromagnetic noise and fan noise for sensitive locations such as data centers, hospitals, offices and residential areas.",
    tags: ["Noise", "Building", "Hospital", "Data Center"],
    sections: [
      { title: "Design factors", bullets: ["Core material, lamination process and magnetic flux density.", "Enclosure structure, fan selection and vibration reduction.", "Installation location, acoustic requirements and dB limit."] },
      { title: "Default handling", text: "If the project is near offices, hospitals, residences or data centers, ask whether there is a specified noise limit." },
      { title: "Related nodes", links: ["Dry-Type Transformer / 干式变压器", "Data Center / 数据中心", "Commercial Building / 商业建筑", "Temperature Rise / 温升"] }
    ],
    products: ["Low-Noise Dry-Type Transformer", "Data Center Dry-Type Transformer"]
  },
  {
    slug: "fire-resistant-design",
    category: "technical-requirements",
    title: "What is Fire-Resistant Transformer Design?",
    zh: "什么是变压器防火设计？",
    summary: "Fire-resistant design reduces fire risk through dry-type structure, cast resin insulation, ester liquid, fire-resistant liquid, spacing and civil design.",
    tags: ["Fire Safety", "Indoor", "Ester"],
    sections: [
      { title: "Common approaches", bullets: ["Select dry-type or cast resin transformer for many indoor building projects.", "Use natural ester, synthetic ester or fire-resistant liquid where liquid-filled design is needed.", "Confirm oil pit, fire separation, ventilation and local project standards."] },
      { title: "Related nodes", links: ["Dry-Type Transformer / 干式变压器", "Insulating Liquid / 绝缘液体", "Natural Ester / 天然酯", "Commercial Building / 商业建筑", "Data Center / 数据中心"] }
    ],
    products: ["Cast Resin Transformer", "Natural Ester Transformer", "Fire-Resistant Liquid-Filled Transformer"]
  },
  {
    slug: "tap-changer",
    category: "electrical-parameters",
    title: "What is a Transformer Tap Changer?",
    zh: "什么是变压器调压方式？",
    summary: "A tap changer adjusts the winding turns ratio to change output voltage within a defined tap range.",
    tags: ["OLTC", "OCTC", "Voltage Regulation"],
    sections: [
      { title: "Main types", bullets: ["OCTC or off-circuit tap changer: adjustment when the transformer is not energized or not carrying load.", "OLTC or on-load tap changer: adjustment while the transformer is operating under load."] },
      { title: "Why it matters", text: "Tap changer requirement affects transformer structure, cost, maintenance and control. It is not the same as step-up or step-down direction." },
      { title: "Related nodes", links: ["OLTC / 有载调压", "OCTC / 无励磁调压", "Tap Range / 分接范围", "Substation Main Transformer / 变电站主变"] }
    ],
    products: ["OLTC Power Transformer", "Distribution Transformer"]
  },
  {
    slug: "impedance-voltage",
    category: "electrical-parameters",
    title: "What is Transformer Impedance Voltage?",
    zh: "什么是变压器阻抗电压？",
    summary: "Impedance voltage influences short-circuit current, voltage drop, parallel operation and system protection coordination.",
    tags: ["Short Circuit", "Voltage Drop", "Protection"],
    sections: [
      { title: "Why it matters", text: "A lower impedance can allow higher short-circuit current, while a higher impedance can increase voltage drop. It must match the system design rather than be chosen casually." },
      { title: "Where it appears", bullets: ["Substation main transformer specifications.", "Parallel transformer operation.", "Industrial systems with motor starting or rectifier loads."] },
      { title: "Related nodes", links: ["Short-Circuit Withstand / 短路承受能力", "Connection Group / 联结组别", "Substation / 变电站", "Industrial Plant / 工业工厂"] }
    ],
    products: ["Power Transformer", "Rectifier Transformer", "Distribution Transformer"]
  },
  {
    slug: "insulation-level",
    category: "electrical-parameters",
    title: "What is Transformer Insulation Level?",
    zh: "什么是变压器绝缘水平？",
    summary: "Insulation level defines the transformer ability to withstand lightning impulse and power-frequency voltage stress.",
    tags: ["BIL", "Impulse", "Withstand"],
    sections: [
      { title: "Why it matters", text: "Insulation level is central to safety and reliability in medium-voltage and high-voltage systems. It must match system voltage, standards, altitude and project requirements." },
      { title: "Parameters to confirm", bullets: ["Rated voltage and highest voltage for equipment.", "Lightning impulse withstand level.", "Power-frequency withstand voltage and external insulation conditions."] },
      { title: "Related nodes", links: ["Substation / 变电站", "High-Altitude Design / 高海拔设计", "Outdoor / 户外", "Power Transformer / 电力变压器"] }
    ],
    products: ["Power Transformer", "Substation Transformer", "Step-Up Transformer"]
  }
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function esc(value = "") {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function slugify(value = "") {
  return value.toLowerCase().replace(/\s*\/\s*/g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "term";
}

function depthFor(canonical) {
  return "../".repeat(canonical.split("/").length - 1);
}

function dropdown(label, href, active, depth, items) {
  const menu = items.map(([name, itemHref]) => `<a href="${depth}${itemHref}">${esc(name)}</a>`).join("");
  return `<div class="nav-item nav-dropdown"><a class="${active === label ? "active" : ""}" href="${depth}${href}">${esc(label)}</a><div class="dropdown-menu">${menu}</div></div>`;
}

function renderNav(active, depth = "") {
  return nav.map(([label, href]) => {
    if (label === "Products") return dropdown(label, href, active, depth, categories.map((c) => [c.name, `products.html#${c.slug}`]));
    if (label === "Knowledge") return dropdown(label, href, active, depth, kbCategories.map((c) => [`${c.name}`, `knowledge/${c.slug}/index.html`]));
    if (label === "Company") return dropdown(label, href, active, depth, companyMenu);
    return `<a class="${active === label ? "active" : ""}" href="${depth}${href}">${label}</a>`;
  }).join("");
}

function quoteForm(compact = false) {
  return `<form class="quote-form ${compact ? "compact" : ""}">
    <label>Name<input name="name" required></label>
    <label>Email<input name="email" type="email" required></label>
    <label>Company Name<input name="company"></label>
    <label>Transformer Type<select name="type">${categories.map((c) => `<option>${esc(c.name)}</option>`).join("")}</select></label>
    <label>Rated Capacity<input name="capacity" placeholder="e.g. 630 kVA"></label>
    <label>Rated Voltage<input name="voltage" placeholder="e.g. 10/0.4 kV"></label>
    <label>Country<input name="country"></label>
    <label class="full">Message<textarea name="message" rows="4"></textarea></label>
    <button class="btn btn-primary" type="submit">Submit Inquiry</button>
  </form>`;
}

function quoteModal(depth = "") {
  return `<div class="quote-modal" data-quote-modal aria-hidden="true">
    <div class="quote-backdrop" data-quote-close></div>
    <section class="quote-panel" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title">
      <button class="quote-close" type="button" aria-label="Close quote form" data-quote-close>×</button>
      <p class="eyebrow">Quick Inquiry</p>
      <h2 id="quote-modal-title">Get a Free Quote</h2>
      <p>Send transformer type, capacity, voltage, country and project notes. Drawings or specifications can be uploaded if available.</p>
      ${quoteForm(true)}
    </section>
  </div>`;
}

function footer(depth = "") {
  return `<footer class="footer">
    <div class="footer-grid">
      <div><h2>Tianyu Electric</h2><p>${esc(company.tagline)}. Transformer-focused B2B website first version.</p></div>
      <div><h3>Products</h3>${categories.map((c) => `<a href="${depth}products.html#${c.slug}">${esc(c.name)}</a>`).join("")}</div>
      <div><h3>Knowledge</h3>${kbCategories.slice(0, 4).map((c) => `<a href="${depth}knowledge/${c.slug}/index.html">${esc(c.name)}</a>`).join("")}</div>
      <div><h3>Applications</h3>${applications.slice(0, 4).map((a) => `<a href="${depth}applications.html">${esc(a)}</a>`).join("")}<p>Email: ${esc(company.email)}</p></div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} Tianyu Electric</span><a href="${depth}privacy.html">Privacy Policy</a></div>
  </footer>`;
}

function htmlPage({ canonical, title, description, content, extraHead = "" }) {
  const depth = depthFor(canonical);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${extraHead}
  <link rel="stylesheet" href="${depth}assets/css/styles.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="${depth}index.html"><span class="brand-mark">TY</span><span><strong>Tianyu Electric</strong><small>Power Primary Equipment</small></span></a>
    <button class="menu-toggle" aria-label="Open navigation" data-menu-toggle>Menu</button>
    <nav class="main-nav" data-nav>${renderNav("Knowledge", depth)}</nav>
    <div class="header-actions"><span class="language">EN</span><button class="btn btn-primary quote-open" type="button" data-quote-open>Get a Free Quote</button></div>
  </header>
  <main>${content}</main>
  ${footer(depth)}
  ${quoteModal(depth)}
  <script src="${depth}assets/js/main.js"></script>
</body>
</html>`;
}

const categoryBySlug = Object.fromEntries(kbCategories.map((c) => [c.slug, c]));
const pagePathBySlug = Object.fromEntries(pages.map((p) => [p.slug, `knowledge/${p.category}/${p.slug}/index.html`]));
const termToSlug = new Map();
for (const p of pages) {
  termToSlug.set(slugify(p.title), p.slug);
  termToSlug.set(slugify(p.zh), p.slug);
  termToSlug.set(p.slug, p.slug);
  for (const tag of p.tags || []) termToSlug.set(slugify(tag), p.slug);
}
const aliases = {
  "oil-immersed-transformer": "oil-immersed-transformer",
  "liquid-immersed-transformer": "oil-immersed-transformer",
  "dry-type-transformer": "dry-type-transformer",
  "k-rated": "k-rated-transformer",
  "k-rated-transformer": "k-rated-transformer",
  "harmonic-mitigation": "harmonic-mitigation",
  "isolation-transformer": "isolation-transformer",
  "low-noise-design": "low-noise-design",
  "fire-resistant-design": "fire-resistant-design",
  "tap-changer": "tap-changer",
  "impedance-voltage": "impedance-voltage",
  "insulation-level": "insulation-level",
  "cooling-method": "cooling-method",
  "insulating-liquid": "insulating-liquid",
  "data-center": "data-center",
  "bess": "bess",
  "battery-energy-storage-system": "bess",
  "solar-power-plant": "solar-power-plant",
  "wind-farm": "wind-farm",
  "utility-grid": "utility-grid",
  "substation": "substation",
  "industrial-plant": "industrial-plant",
  "distribution": "distribution",
  "generation-step-up": "generation-step-up",
  "power-electronics-interface": "power-electronics-interface",
  "system-grounding": "system-grounding",
  "substation-main-transformer": "substation-main-transformer"
};
for (const [alias, slug] of Object.entries(aliases)) termToSlug.set(alias, slug);

const pendingTerms = new Map();
function linkTerm(label, depth) {
  const key = slugify(label.split("/")[0]);
  const slug = termToSlug.get(key) || aliases[key];
  if (slug && pagePathBySlug[slug]) return `<a class="kb-xlink" href="${depth}${pagePathBySlug[slug]}">[[${esc(label)}]]</a>`;
  const pendingSlug = slugify(label);
  pendingTerms.set(pendingSlug, label);
  return `<a class="kb-xlink pending" href="${depth}knowledge/pending.html#${pendingSlug}">[[${esc(label)}]]</a>`;
}

function linkList(labels = [], depth = "") {
  if (!labels.length) return "";
  return `<div class="kb-link-cloud">${labels.map((label) => linkTerm(label, depth)).join("")}</div>`;
}

function card(p, depth) {
  return `<a class="kb-card" href="${depth}${pagePathBySlug[p.slug]}">
    <p class="eyebrow">${esc(categoryBySlug[p.category].name)}</p>
    <h3>${esc(p.title)}</h3>
    <small>${esc(p.zh)}</small>
    <p>${esc(p.summary)}</p>
    <div class="tags">${(p.tags || []).slice(0, 4).map((t) => `<span>${esc(t)}</span>`).join("")}</div>
  </a>`;
}

function knowledgeHome() {
  const depth = "../";
  const featured = ["oil-immersed-transformer", "dry-type-transformer", "data-center", "k-rated-transformer", "harmonic-mitigation", "generation-step-up"].map((slug) => pages.find((p) => p.slug === slug));
  const content = `<section class="kb-hero">
    <div><p class="eyebrow">Knowledge Base V0.1</p><h1>Transformer Knowledge Base</h1><p>Understand product structure, application scenarios, engineering roles, technical requirements and key electrical parameters before preparing a transformer inquiry.</p><div class="hero-actions"><a class="btn btn-primary" href="product-structure/index.html">Start with Product Structure</a><a class="btn outline-dark" href="technical-requirements/index.html">Explore Technical Requirements</a></div></div>
    <aside class="kb-hero-panel"><strong>[[ ]] Cross References</strong><p>Green links point to completed knowledge pages. Amber links point to pending glossary nodes that should be expanded later.</p></aside>
  </section>
  <section class="section kb-home-grid"><div class="section-head"><div><p class="eyebrow">Architecture</p><h2>Main Knowledge Layers</h2></div></div><div class="kb-category-grid">${kbCategories.map((c) => `<a class="kb-category-card" href="${c.slug}/index.html"><span>${esc(c.zh)}</span><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p></a>`).join("")}</div></section>
  <section class="section pale"><div class="section-head"><div><p class="eyebrow">Featured</p><h2>Core V0.1 Articles</h2></div></div><div class="kb-card-grid">${featured.map((p) => card(p, depth)).join("")}</div></section>`;
  return htmlPage({ canonical: "knowledge/index.html", title: "Transformer Knowledge Base | Tianyu Electric", description: "Transformer knowledge base covering product structure, application scenarios, engineering roles, technical requirements and electrical parameters.", content });
}

function categoryPage(category) {
  const depth = "../../";
  const list = pages.filter((p) => p.category === category.slug);
  const content = `<section class="kb-title-block"><p class="eyebrow">Knowledge Category</p><h1>${esc(category.name)} / ${esc(category.zh)}</h1><p>${esc(category.description)}</p></section>
  <section class="section"><div class="kb-card-grid">${list.map((p) => card(p, depth)).join("")}</div></section>`;
  return htmlPage({ canonical: `knowledge/${category.slug}/index.html`, title: `${category.name} | Transformer Knowledge Base`, description: category.description, content });
}

function articlePage(p) {
  const canonical = pagePathBySlug[p.slug];
  const depth = depthFor(canonical);
  const category = categoryBySlug[p.category];
  const related = pages.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);
  const allLinks = p.sections.flatMap((s) => s.links || []);
  const content = `<section class="kb-article-shell">
    <aside class="kb-sidebar"><a class="text-link" href="${depth}knowledge/index.html">← Knowledge Home</a><h2>Knowledge Tree</h2>${kbCategories.map((c) => `<a class="${c.slug === p.category ? "active" : ""}" href="${depth}knowledge/${c.slug}/index.html">${esc(c.name)}<small>${esc(c.zh)}</small></a>`).join("")}</aside>
    <article class="kb-article">
      <p class="eyebrow">${esc(category.name)} / ${esc(category.zh)}</p>
      <h1>${esc(p.title)}</h1>
      <h2 class="kb-zh-title">${esc(p.zh)}</h2>
      <p class="kb-lead">${esc(p.summary)}</p>
      <div class="tags">${(p.tags || []).map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      ${p.sections.map((s) => `<section><h2>${esc(s.title)}</h2>${s.text ? `<p>${esc(s.text)}</p>` : ""}${s.bullets ? `<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}${s.links ? linkList(s.links, depth) : ""}</section>`).join("")}
      <section class="kb-quote-checklist"><h2>Quote form checklist</h2><p>Before quotation, confirm capacity, primary and secondary voltage, frequency, phase, installation environment, load type, standards, drawings and special requirements.</p><button class="btn btn-primary quote-open" type="button" data-quote-open>Request Selection Support</button></section>
    </article>
    <aside class="kb-related"><h2>Related Nodes</h2>${linkList(allLinks.slice(0, 10), depth)}<h2>Related Products</h2>${(p.products || []).map((x) => `<p>${esc(x)}</p>`).join("")}<h2>Same Category</h2>${related.map((x) => `<a class="text-link" href="${depth}${pagePathBySlug[x.slug]}">${esc(x.title)}</a>`).join("")}</aside>
  </section>`;
  return htmlPage({ canonical, title: `${p.title} | Tianyu Electric Knowledge Base`, description: p.summary, content });
}

function pendingPage() {
  const depth = "../";
  const pending = [...pendingTerms.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  const content = `<section class="kb-title-block"><p class="eyebrow">Internal Draft Index</p><h1>Pending Knowledge Nodes</h1><p>These terms are referenced by V0.1 articles but are not yet complete pages. Keep this page noindex until the glossary is expanded.</p></section><section class="section"><div class="kb-pending-list">${pending.map(([slug, label]) => `<article id="${slug}"><strong>[[${esc(label)}]]</strong><p>Status: pending glossary article or anchor target.</p></article>`).join("")}</div></section>`;
  return htmlPage({ canonical: "knowledge/pending.html", title: "Pending Knowledge Nodes | Tianyu Electric", description: "Internal pending transformer knowledge nodes.", extraHead: '<meta name="robots" content="noindex">', content });
}

function write(canonical, html) {
  const target = path.join(dist, canonical);
  ensureDir(path.dirname(target));
  fs.writeFileSync(target, html);
}

ensureDir(knowledgeDir);
write("knowledge/index.html", knowledgeHome());
for (const category of kbCategories) write(`knowledge/${category.slug}/index.html`, categoryPage(category));
for (const p of pages) write(pagePathBySlug[p.slug], articlePage(p));
write("knowledge/pending.html", pendingPage());
console.log(`Built knowledge base V0.1 with ${pages.length} articles and ${pendingTerms.size} pending nodes.`);
