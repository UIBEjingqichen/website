# Tianyu Export Catalog Content

This directory is the structured source for the export catalog. The website and the print catalog should consume the same product, certificate, project and drawing data, while using different presentation layers.

## Architecture

- **Notion**: editorial content management and review.
- **Markdown / YAML**: version-controlled canonical export in GitHub.
- **Website HTML**: interactive web presentation.
- **Typst**: fixed-layout PDF catalog.

## Notion workspace

Content hub: https://app.notion.com/p/3bf89c0b427f81fdaa42c937abacfc29

Databases:
- Products
- Certificates & Test Reports
- Project References
- Engineering Drawings

## Directory layout

```text
catalog-content/
├── catalog.yaml
├── products/
├── data/
│   ├── certificates.yaml
│   ├── projects.yaml
│   └── drawings.generated.yaml
└── typst/
    ├── catalog.typ
    └── styles.typ
```

## Print rules

1. Certificates appear once near the front of the catalog.
2. Certificate presentation is fixed at **3 pages × 4 documents**.
3. Product sections do not repeat certificate images.
4. Engineering drawings use **one drawing per page**.
5. Product photography uses workbook images or approved Tianyu company/brochure images. Type-test report screenshots are evidence assets, not marketing product photography.
6. Real project references remain attached to the product family recorded in the export workbook.
7. Tested reference configurations and configurable series capability are presented separately.

## PDF workflow

The intended production PDF is generated with Typst rather than browser print-to-PDF.

```bash
typst compile catalog-content/typst/catalog.typ dist/tianyu-export-catalog.pdf
```

The existing `dist/catalog.html` remains an interim browser catalog while the Typst template is completed.
