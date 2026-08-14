const makeProjects = (productId, rows) => rows.map((row, index) => ({
  id: `${productId}-project-${String(index + 1).padStart(2, "0")}`,
  name: row[0],
  country: row[1] ?? null,
  industry: row[2],
  application: row[3],
  productIds: [productId],
  capacity: row[4] ?? null,
  image: row[5] ?? null,
  featured: Boolean(row[5])
}));

export const projects = [
  ...makeProjects("oil-immersed-distribution-transformer", [
    ["Tay Ninh Cement Milling Plant 2", null, "Cement", "Industrial", null],
    ["Neikeng Phase I Transformer Project", null, "Industrial", "Industrial", null],
    ["Wanhua Ningbo 450 Substation Grade 1 Efficiency Transformer", "China", "Chemical", "Industrial", null],
    ["SCC Cement Plant 6000 TPD", null, "Cement", "Industrial", "6000 TPD"],
    ["Yamama 6000 TPD Clinker Plant Project", null, "Cement", "Industrial", "6000 TPD"],
    ["Wanhua Chemical Haiyang Phase II & III Distribution Project", "China", "Chemical", "Industrial", null]
  ]),
  ...makeProjects("high-voltage-power-transformer", [
    ["BCL Hattar Line 2 7200 TPD Cement Plant", "Pakistan", "Cement", "Industrial", "7200 TPD"],
    ["Atlantic Industrial Park 132 kV Substation", "Nigeria", "Industrial Park", "Utility Grid", "132 kV"],
    ["Long Son Company Cement Grinding Project", "Vietnam", "Cement", "Industrial", null],
    ["Methanol Dayyer Mobile Substation Export Project", "United Arab Emirates", "Chemical", "Infrastructure", null],
    ["Feicheng 100 MW-Class Advanced Compressed Air Energy Storage Station Phase II", "China", "Energy Storage", "Energy Storage", "100 MW-class"],
    ["Xi'an Metro Lines 8, 10 and 15 Main Substations", "China", "Rail Transit", "Infrastructure", null]
  ]),
  ...makeProjects("cast-resin-dry-type-transformer", [
    ["Yinchuan Charging Infrastructure Phase II Lot 2", "China", "Charging Infrastructure", "Infrastructure", null],
    ["Baihong Nylon Texturing Workshop Phase I", "China", "Industrial", "Industrial", null],
    ["Zhangzhou Hospital", "China", "Healthcare", "Infrastructure", null],
    ["Anhui Xinyi Photovoltaic Glass Lines BA-D", "China", "Photovoltaic Manufacturing", "Industrial", null],
    ["Fujian Ruian Electric Power Construction Project", "China", "Power Construction", "Utility Grid", null],
    ["Zhenjiang Chunen Dry-Type Transformer Framework", "China", "Industrial", "Industrial", null]
  ]),
  ...makeProjects("dry-type-prefabricated-substation", [
    ["CR Power Laohekou 130 MW Wind Power Project", "China", "Wind", "Renewable Energy", "130 MW"],
    ["Shandong Rizhao 200 MW Energy Storage Project", "China", "Energy Storage", "Energy Storage", "200 MW"],
    ["Huaneng Weichang 200 MW Wind Power Project", "China", "Wind", "Renewable Energy", "200 MW"],
    ["Yinchuan Charging Infrastructure Project", "China", "Charging Infrastructure", "Infrastructure", null],
    ["Three Gorges Jiangsu Taizhou Hailing 100 MW Fishery-Solar Project", "China", "Solar", "Renewable Energy", "100 MW"],
    ["Huaneng Laoting 125 MW Wind Power Project", "China", "Wind", "Renewable Energy", "125 MW"]
  ]),
  ...makeProjects("oil-immersed-prefabricated-substation", [
    ["Yunnan Zhaotong Xiaozhai 350 MW Solar Project", "China", "Solar", "Renewable Energy", "350 MW"],
    ["Three Gorges Dongshan Xingchen 180 MW Offshore Solar Project", "China", "Offshore Solar", "Renewable Energy", "180 MW"],
    ["Sunshare Nambala 100 MW Solar Project", "Zambia", "Solar", "Renewable Energy", "100 MW"],
    ["Shanghai Lingang 500 MW Offshore Solar Project", "China", "Offshore Solar", "Renewable Energy", "500 MW"],
    ["CMOC Mining Area 500 MW Solar Project", "Democratic Republic of the Congo", "Mining / Solar", "Renewable Energy", "500 MW"],
    ["Luneng Ruoqiang 2 GW Solar Power Project", "China", "Solar", "Renewable Energy", "2 GW"]
  ]),
  ...makeProjects("american-type-combined-transformer", [
    ["Pianguan Jinlin 100 MW Solar + Storage Project", "China", "Solar / Storage", "Renewable Energy", "100 MW"],
    ["Qianxi Hongjiadu 150 MW Agriculture-Solar Project", "China", "Solar", "Renewable Energy", "150 MW"],
    ["Shexian 150 MW Solar Power Project", "China", "Solar", "Renewable Energy", "150 MW"],
    ["Qinhuangdao Juxing 200 MW Solar Project", "China", "Solar", "Renewable Energy", "200 MW"],
    ["Xinze Kaiping 150 MW Solar Project", "China", "Solar", "Renewable Energy", "150 MW"],
    ["CHN Energy Zhoushan Putuo Dengbu Island 213 MWp Fishery-Solar Project", "China", "Solar", "Renewable Energy", "213 MWp"]
  ])
];

export const projectApplications = ["Renewable Energy", "Utility Grid", "Industrial", "Infrastructure", "Energy Storage"];
