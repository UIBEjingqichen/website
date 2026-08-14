# Website V2 Media Map

All website media is stored under source-media and copied into dist/assets/media during the local build.

## Directories

| Directory | Purpose |
|---|---|
| products/ | Product gallery WebP images extracted from the supplied workbook or report sample-photo pages |
| evidence/ | Certificate and report key-page WebP previews |
| evidence/pdfs/ | Complete supplied PDF files with semantic names |
| drawings/ | Engineering drawing previews extracted from real report pages |
| projects/ | Reserved for verified project-site photos |
| factory/ | Reserved for verified equipment and workshop photos |

## Primary product gallery anchors

| Product family | Primary file |
|---|---|
| Oil-Immersed Distribution Transformer | products/oil-distribution-transformer-02.webp |
| High-Voltage Power Transformer | products/power-transformer-220kv-240mva-ssz22.webp |
| Cast Resin Dry-Type Transformer | products/dry-type-transformer-scb18-2500.webp |
| Dry-Type Prefabricated Substation | products/dry-type-prefabricated-substation-01.webp |
| Oil-Immersed Prefabricated Substation | products/oil-prefabricated-substation-01.webp |
| American-Type Combined Transformer | products/american-combined-transformer-01.webp |

## Evidence preview convention

- Certificates and one-page verifications: *-cover.webp
- Large reports: *-cover.webp, *-summary.webp, *-parameters.webp, *-product-photo.webp
- Drawing previews: drawings/*-outline.webp
- Full report: evidence/pdfs/document-id.pdf

evidence/manifest.json records the source-to-preview mapping. Do not invent a preview for a missing report. The American combined-transformer certificate remains a structured pending-asset record until its source PDF is supplied.

## Existing semantic brochure images

- hero-home-substation-grid.jpeg: home hero
- company-factory-campus.jpeg: company campus
- product-rectifier-transformer.jpeg: Other Transformer Solutions
- product-special-transformer-container.jpeg: Other Transformer Solutions
- product-amorphous-alloy-dry-type-transformer.jpeg: Other Transformer Solutions
- product-oil-immersed-energy-saving-transformer.jpeg: Other Transformer Solutions

Local workflow: npm run sync-images, then npm run build.
