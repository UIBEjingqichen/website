export const navigation = [
  { label: "Home", href: "index.html" },
  {
    label: "Products",
    href: "products.html",
    items: [
      ["Distribution Transformer", "products/oil-immersed-distribution-transformer/"],
      ["Power Transformer", "products/high-voltage-power-transformer/"],
      ["Dry-Type Transformer", "products/cast-resin-dry-type-transformer/"],
      ["Prefabricated Substation", "products.html#prefabricated-substation"],
      ["Combined Transformer", "products/american-type-combined-transformer/"],
      ["Other Solutions", "products.html#other-solutions"]
    ]
  },
  { label: "Applications & Projects", href: "applications.html" },
  {
    label: "Resources",
    href: "resources.html",
    items: [
      ["Export Product Catalog", "catalog.html"],
      ["Certificates & Test Reports", "resources.html#certificates"],
      ["Engineering Drawings", "resources.html#drawings"],
      ["Knowledge Center", "knowledge/index.html"]
    ]
  },
  {
    label: "Company",
    href: "about.html",
    items: [
      ["About Tianyu", "about.html"],
      ["Manufacturing", "manufacturing.html"],
      ["Quality", "quality.html"]
    ]
  },
  { label: "News", href: "news.html" }
];

export const company = {
  name: "Tianyu Electric",
  legalName: "Fuzhou Tianyu Electric Co., Ltd.",
  tagline: "Power Transformer & Prefabricated Substation Solutions",
  established: "1996",
  registeredCapital: "RMB 327,907,200",
  groupBackground: "Wholly-owned subsidiary of XJ Group Corporation under China Electrical Equipment Group Co., Ltd.",
  manufacturingBase: "A southern manufacturing base for primary electrical equipment of China Electrical Equipment Group Co., Ltd.",
  productScope: "Transformer, prefabricated substation, switchgear and primary electrical equipment solutions for utility, renewable, industrial and infrastructure projects.",
  importExport: "Self-managed import and export rights"
};

export const companyStats = [
  { label: "Established", value: "1996" },
  { label: "Primary Product Families", value: "6" },
  { label: "Project Records", value: "36" },
  { label: "Evidence Files", value: "19" }
];

export const applications = [
  "Renewable Energy",
  "Utility Grid",
  "Industrial",
  "Infrastructure",
  "Energy Storage"
];

export const featuredProjectNames = [
  "Three Gorges Dongshan Xingchen 180 MW Offshore Solar Project",
  "Shanghai Lingang 500 MW Offshore Solar Project",
  "Sunshare Nambala 100 MW Solar Project",
  "CMOC Mining Area 500 MW Solar Project",
  "BCL Hattar Line 2 7200 TPD Cement Plant",
  "Atlantic Industrial Park 132 kV Substation"
];

export const knowledgeHighlights = [
  {
    title: "How to Prepare a Transformer Inquiry",
    category: "Engineering Guide",
    summary: "Capacity, voltage, frequency, installation environment, standards and drawings help the engineering team review an inquiry efficiently.",
    href: "knowledge/transformer-selection.html"
  },
  {
    title: "Dry-Type vs Oil-Immersed Transformer",
    category: "Selection Guide",
    summary: "Compare installation, fire safety, environmental conditions, voltage, capacity and maintenance requirements.",
    href: "knowledge/faq/dry-type-vs-oil-immersed-transformer.html"
  },
  {
    title: "ONAN vs ONAF Cooling",
    category: "Technical FAQ",
    summary: "Understand natural and forced-air cooling arrangements before defining transformer loading and accessories.",
    href: "knowledge/faq/onan-vs-onaf-transformer-cooling.html"
  }
];