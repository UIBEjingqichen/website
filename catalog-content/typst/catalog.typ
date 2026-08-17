#import "styles.typ": *
#setup()

#let products = yaml("../data/products.yaml").products
#let certificates = yaml("../data/certificates.yaml").documents
#let projects = yaml("../data/projects.yaml").projects
#let drawings = yaml("../data/drawings.generated.yaml").drawings

#let featured = certificates
  .filter(doc => doc.at("featured_order", default: none) != none)
  .sorted(key: doc => doc.featured_order)

// Cover
#set page(numbering: none)
#align(center + horizon)[
  #text(size: 11pt, weight: "bold", tracking: 2pt, fill: rgb("1f6fb4"))[TIANYU ELECTRIC]
  #v(10mm)
  #text(size: 30pt, weight: "bold", fill: navy)[Transformer & Substation Solutions]
  #v(5mm)
  #text(size: 12pt, fill: muted)[Distribution · Power · Dry-Type · Prefabricated · Pad-Mounted]
  #v(12mm)
  #text(size: 10pt)[Fuzhou Tianyu Electric Co., Ltd.]
  #v(2mm)
  #text(size: 8pt, fill: muted)[EXPORT PRODUCT CATALOG · 2026]
]

// Company overview
#pagebreak()
#set page(numbering: "1")
#section-kicker[COMPANY OVERVIEW]
= Fuzhou Tianyu Electric Co., Ltd.

Founded in 1996, Fuzhou Tianyu Electric Co., Ltd. manufactures transformers, prefabricated substations, switchgear and primary electrical equipment for utility, renewable-energy, industrial and infrastructure projects. The company operates as a wholly-owned subsidiary of XJ Group Corporation under China Electrical Equipment Group Co., Ltd.

Tianyu combines product engineering, manufacturing, testing and project documentation for medium- and high-voltage applications. The export portfolio includes energy-efficient distribution transformers, 110–220 kV power-transformer references, SCB18 cast-resin dry-type transformers, 35 kV prefabricated substations and pad-mounted transformer solutions.

#v(7mm)
#grid(columns: (1fr, 1fr, 1fr, 1fr), gutter: 5mm,
  [#text(weight: "bold", size: 18pt, fill: navy)[1996]#linebreak()#text(size: 7pt, fill: muted)[Established]],
  [#text(weight: "bold", size: 18pt, fill: navy)[6]#linebreak()#text(size: 7pt, fill: muted)[Core product families]],
  [#text(weight: "bold", size: 18pt, fill: navy)[36]#linebreak()#text(size: 7pt, fill: muted)[Project references]],
  [#text(weight: "bold", size: 18pt, fill: navy)[220 kV]#linebreak()#text(size: 7pt, fill: muted)[Power transformer reference]]
)

// Certificate register: exactly three pages, four documents per page.
#certificate-page("Certificates & Test Reports", featured.slice(0, 4))
#certificate-page("Certificates & Test Reports", featured.slice(4, 8))
#certificate-page("Certificates & Test Reports", featured.slice(8, 12))

// Product chapters.
#for product in products {
  pagebreak()
  section-kicker[PRODUCT]
  heading(level: 1)[#product.title]
  text(size: 10pt, fill: muted)[#product.subtitle]
  v(5mm)

  grid(columns: (1fr, 1fr), gutter: 6mm,
    image(product.image_1, width: 100%, height: 54mm, fit: "contain"),
    image(product.image_2, width: 100%, height: 54mm, fit: "contain")
  )
  v(5mm)
  product.description
  v(4mm)

  table(
    columns: (32mm, 1fr),
    stroke: (x, y) => (bottom: 0.4pt + rule),
    inset: 2.5mm,
    [#text(weight: "bold", fill: navy)[Voltage / class]], [#product.voltage],
    [#text(weight: "bold", fill: navy)[Capacity]], [#product.capacity],
    [#text(weight: "bold", fill: navy)[Tested references]], [#product.tested_models],
  )

  heading(level: 2)[Applications & Project References]
  let product-projects = projects.filter(item => item.product_id == product.id)
  table(
    columns: (2.6fr, 1.15fr, 1.2fr, 1fr, 0.9fr),
    stroke: (x, y) => (bottom: 0.35pt + rule),
    inset: 1.8mm,
    table.header(
      [#text(weight: "bold", fill: navy)[Project]],
      [#text(weight: "bold", fill: navy)[Application]],
      [#text(weight: "bold", fill: navy)[Industry]],
      [#text(weight: "bold", fill: navy)[Country]],
      [#text(weight: "bold", fill: navy)[Scale]],
    ),
    ..product-projects.map(item => (
      [#item.name],
      [#item.application],
      [#item.industry],
      [#if item.country == "" { [—] } else { item.country }],
      [#if item.scale == "" { [—] } else { item.scale }],
    )).flatten()
  )
}

// Engineering drawings are opt-in. Each included drawing occupies one page.
#let selected-drawings = drawings.filter(item => item.include_in_catalog == true)
#for drawing in selected-drawings {
  drawing-page(drawing)
}
