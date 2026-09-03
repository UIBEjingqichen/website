#let navy = rgb("0a2f56")
#let ink = rgb("263d52")
#let muted = rgb("6e8192")
#let rule = rgb("d8e0e7")

#let setup() = {
  set page(paper: "a4", margin: (x: 16mm, y: 15mm), numbering: "1")
  set text(font: ("Helvetica Neue", "Arial"), size: 9.5pt, fill: ink)
  set par(leading: 0.72em, justify: false)
  show heading.where(level: 1): it => {
    set text(size: 23pt, weight: "bold", fill: navy)
    block(above: 2mm, below: 5mm)[#it.body]
  }
  show heading.where(level: 2): it => {
    set text(size: 13pt, weight: "bold", fill: navy)
    block(above: 5mm, below: 2.5mm)[#it.body]
  }
}

#let section-kicker(body) = text(size: 7.5pt, weight: "bold", tracking: 1.2pt, fill: rgb("1f6fb4"), body)

#let certificate-card(doc) = {
  block(width: 100%, inset: 0pt)[
    #line(length: 100%, stroke: 0.5pt + rule)
    #v(2mm)
    #image(doc.preview, width: 100%, height: 118mm, fit: "contain")
    #v(2mm)
    #text(size: 8pt, weight: "bold", fill: navy)[#doc.type]
    #linebreak()
    #text(size: 7.5pt, weight: "bold")[#doc.model]
    #linebreak()
    #text(size: 6.8pt, fill: muted)[#doc.rating · #doc.voltage]
    #linebreak()
    #text(size: 6.8pt, fill: muted)[#doc.report_no]
  ]
}

#let certificate-page(title, docs) = {
  pagebreak(weak: true)
  section-kicker[QUALITY & CERTIFICATION]
  heading(level: 1)[#title]
  grid(columns: (1fr, 1fr, 1fr, 1fr), gutter: 5mm,
    ..docs.map(certificate-card)
  )
}

#let drawing-page(drawing) = {
  pagebreak(weak: true)
  section-kicker[ENGINEERING DRAWING]
  heading(level: 1)[#drawing.document_id]
  align(center)[#image(drawing.image, width: 100%, height: 220mm, fit: "contain")]
  v(2mm)
  text(size: 7pt, fill: muted)[Source page #drawing.source_page · Reference drawing]
}
