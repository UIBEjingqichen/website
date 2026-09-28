# Progress Log

## Session: 2026-08-14

### Phase 1: Requirements & Discovery
- **Status:** completed
- **Started:** 2026-08-14
- Actions taken:
  - Read the supplied V2 modification brief.
  - Confirmed local-only delivery and no GitHub authentication.
  - Inspected project scripts, primary source modules, media map, workbook/PDF inventory, and Git status.
  - Loaded the website, planning, spreadsheet, and PDF workflows.
  - Extracted 21 workbook-embedded product images to semantic WebP files.
  - Indexed all 19 PDFs (1,160 pages) and created a product-image contact sheet for verification.
  - Rendered and visually reviewed representative report contact sheets to select evidence and drawing preview pages.
- Files created/modified:
  - task_plan.md
  - findings.md
  - progress.md
  - tools/inspect_sources.py
  - source-media/products/*.webp
  - tmp/source-inspection/source-index.json
  - tmp/source-inspection/workbook-products-contact-sheet.jpg
  - tools/render_pdf_contacts.py
  - tmp/source-inspection/pdf-contacts/*.jpg

### Phase 2: Data & Media Foundation
- **Status:** completed
- Actions taken:
  - Created six core product-family records and retained four legacy/special solution records.
  - Created 20 document records: 19 supplied PDFs plus one explicit pending-asset record.
  - Created five real drawing previews and 36 project records.
  - Created manufacturing and quality capability records without unverified numeric claims.
- Files created/modified:
  - src/products-data.mjs
  - src/documents-data.mjs
  - src/projects-data.mjs
  - src/factory-data.mjs
  - source-media/products/
  - source-media/evidence/
  - source-media/drawings/

### Phase 3: Page & Interaction Implementation
- **Status:** completed
- Actions taken:
  - Rebuilt home, product index/detail, resources, projects, quality, manufacturing, company, contact, news and privacy pages.
  - Added 3D evidence carousel, evidence modal, product gallery/lightbox, drawing viewer, filters, responsive behavior and local SEO metadata.
  - Generated and added the Tianyu social preview image.
- Files created/modified:
  - src/build.mjs
  - src/evidence-render.mjs
  - src/main.js
  - src/styles.css
  - src/site-data.mjs
  - source-media/branding/og-tianyu-electric.png

### Phase 4: Testing & Verification
- **Status:** completed
- Actions taken:
  - Ran the complete build repeatedly until clean.
  - Validated 45 HTML files, six product families, 19 supplied PDFs, one pending document record and 36 projects.
  - Confirmed zero forbidden user-visible placeholder strings.
  - Browser-tested 1440, 1024, 768 and 390 pixel widths with no horizontal overflow or broken loaded images.
  - Verified evidence buttons/cards/keyboard controls, product gallery, drawing zoom, project filters, document filters and mobile navigation.
- Files created/modified:
  - tools/validate-site.mjs
  - dist/

## Test Results
| Test | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| Baseline inventory | rg --files | Source, media, workbook, PDFs found | Found | pass |
| Full build | npm run build | Build completes | Build completed | pass |
| Site validator | node tools/validate-site.mjs | Counts, links, media and placeholders pass | 45 HTML files passed | pass |
| Responsive browser QA | 1440 / 1024 / 768 / 390 | No overflow or broken images | Passed all sizes | pass |
| Evidence interaction | Buttons, card, keyboard, modal | Active record changes and modal opens | Passed | pass |
| Product interaction | Gallery and drawing viewer | Images switch and drawing zooms | Passed | pass |
| Filters | 220 kV and Energy Storage | 2 matching records each | Passed | pass |
| Local MIME | WebP and PDF requests | image/webp and application/pdf | Passed | pass |

## Error Log
| Timestamp | Error | Attempt | Resolution |
|-----------|-------|---------|------------|
| 2026-08-14 | Attachment displayed as mojibake in initial PowerShell output | 1 | Used explicit UTF-8 reads and intact source file |
| 2026-08-14 | Broad source inspection output truncated | 1 | Switch to targeted inspections |
| 2026-08-14 | Combined inspection command failed due to PowerShell quoting | 1 | Split into simpler targeted commands |
| 2026-08-14 | PowerShell could not resolve System.IO.Compression.ZipFile | 1 | Add the FileSystem compression assembly explicitly |
| 2026-08-14 | Combined documentation/code patch hit a JavaScript template-literal parse error | 1 | Split into literal-safe patches |
| 2026-08-14 | Initial link/media validator produced false positives and found two real path issues | 1 | Ignore canonical root URLs, accept decorative alt text, replace missing factory media, and correct product FAQ paths |
| 2026-08-14 | Foreground preview server exceeded the command timeout | 1 | Switch to a hidden background preview process |
| 2026-08-14 | Browser load-state networkidle unsupported | 1 | Use DOMContentLoaded and explicit readiness checks |
| 2026-08-14 | Combined server stop/start command blocked | 1 | Stop and start exact verified process in separate calls |

## 5-Question Reboot Check
| Question | Answer |
|----------|--------|
| Where am I? | Completed local delivery |
| Where am I going? | User handoff |
| What's the goal? | Complete the local data-driven website V2 |
| What have I learned? | See findings.md |
| What have I done? | Completed data, media, pages, interactions and verification |

## Session: 2026-09-15 Catalog Client-Edition Revision

### Changes
- Restored customer-facing technical parameter tables to the final `catalog-product-focus` generator for all six main product families.
- Added detailed series rows for 35 / 66 / 110 / 220 kV transformer platforms and tested reference tables for distribution, dry-type, prefabricated and combined-transformer configurations.
- Removed catalog toolbar, drawer navigation, buttons, hyperlink cards, quotation action strip and website-style chip treatment.
- Replaced internal evidence/asset-state wording with customer-facing certificate, test-report, model and drawing language.
- Reworked product images to use stable aspect-ratio stages and enlarged drawing presentation in print output.
- Changed print layout to A4 landscape and prevented certificate/drawing blocks from splitting through one another.

### Verification
- `npm run build` completed successfully after the revision.
- Browser QA at `http://127.0.0.1:4173/catalog.html`: 30 sheets, 16 tables, 9 technical parameter tables, 0 buttons, 0 links, 5 drawing figures, all catalog images loaded.
- Browser text scan found none of: `Evidence / record`, `Available evidence records`, `ASSET PENDING`, `recorded reference`, `under review`, `Request a quotation`, `Discuss this configuration`, or `To be confirmed`.
- Generated `tmp/catalog-qa.pdf` with 44 A4 landscape pages and rendered representative pages with Poppler for visual inspection; cover remains one page and drawings occupy dedicated large-format pages.
- Latest print QA after replacing the main-transformer right-side references with English-catalog exterior-dimension drawings remains 29 A4 landscape pages; pages 4–6 were re-rendered and checked for table/drawing pairing and clipping.
- `npm run check` passed the existing site smoke checks.
- Remaining site-wide validator failures are pre-existing unrelated generated-page asset/placeholder issues; the catalog-specific checks above pass.

## Session: 2026-09-15 A4 Layout and Readability Revision

### Changes
- Changed the catalog screen and print layout to a fixed 297 x 210 mm landscape A4 sheet; one `.pf-sheet` now maps to one PDF page.
- Rebuilt overview pages around one dominant product image and a compact two-column specification block; removed repeated platform/source-style copy and button-like application tags.
- Kept the full parameter tables, split the high-voltage tables by voltage series, restored 110 kV / 220 kV impedance and weight fields where the source rows contain them, and removed forced technical-page breaks.
- Removed one-card series pages that created mostly empty sheets and removed empty document placeholders.
- Added cropped drawing assets for the report-derived diagrams and enlarged the drawing area; actual prefab outline drawings are labeled as engineering drawings while report schematics are labeled as reference diagrams.
- Replaced the catalog contact placeholder sentence with customer-facing technical-review wording.

### Verification
- `npm run build` completed successfully and generated 28 catalog content sheets.
- Browser/PDF QA reports 30 rendered pages, 16 tables, 9 technical tables, 0 buttons, 0 links, 5 drawing figures, and all referenced images loaded.
- Final PDF is 30 pages, all 297.0 x 209.9 mm A4 landscape; overflow scan found no content below the printable page boundary.
- Final text scan found none of the forbidden internal phrases: `Evidence / record`, `Available evidence records`, `ASSET PENDING`, `recorded reference`, `under review`, `Request a quotation`, `Discuss this configuration`, or `To be confirmed`.
- `npm run check` passed.

## Session: 2026-09-16 Client Catalog Execution

### Changes
- Updated `src/catalog-product-focus.mjs` so the catalog no longer renders the selection-guide instruction, approval-schedule wording, or repeated report-request wording.
- Replaced the separate series/model presentation with one product-range page containing a quiet range table and a deduplicated reference-configuration table.
- Changed model rows to show the verified model identifier once; capacity and voltage remain in their own columns.
- Standardized every transformer overview to two equal-height image panels and a vertically balanced right-hand information column.
- Limited the high-voltage power-transformer detail output to two parameter tables, with a drawing reference placed to the right of each table.
- Added the missing oil-immersed distribution-transformer parameter page and applied the same left-table/right-drawing structure to the remaining transformer families.
- Added the catalog-wide visual system in `src/catalog-product-focus.css`: unified decorated headings, quiet tables, equal image geometry, A4 layout, and mobile overflow protection.

### Verification
- `npm run build` completed successfully and regenerated `dist/catalog.html` plus its catalog stylesheet.
- Browser QA: 29 rendered catalog sections; high-voltage parameter pages = 2; high-voltage parameter tables = 2; oil-immersed distribution parameter page = 1 table + 1 drawing; all images loaded.
- Forbidden-copy scan returned zero matches for the four user-specified sentences.
- Duplicate-capacity check confirmed no repeated `240 MVA · 220 / 115 / 38.5 kV` display string.
- Mobile QA at 390px: document width = 390px, body width = 390px, cover = 366 × 620px, and the two overview images = 328 × 242px each.
- Generated `tmp/catalog-executed-print.pdf`; Poppler reported 29 A4 landscape pages. Rendered pages 2–29 and visually checked product, range, parameter, drawing, resource, quotation and contact pages for clipping or overlap.

## Session: 2026-09-16 Final Catalog Execution

### Changes
- Rebuilt the catalog through the complete website pipeline after the client-edition changes.
- Generalized the layout rules across every product family: equal-height overview imagery, consistent decorated headings, quiet parameter tables, one table with one right-side visual reference, and no repeated resource pages.
- Replaced the high-voltage range layout with one full-width parameter-range table and two equal-size product images. Removed every model-only/reference-configuration table and omitted incomplete family range pages.
- Added complete 12 kV and 40.5 kV oil-immersed distribution parameter tables from the English catalog source.
- Cleaned English-catalog drawing crops so no explanatory note text or page marks remain. Enlarged the drawing panels and retained English-catalog product references for families without outline plates.
- Replaced the oil-immersed prefabricated overview's lower image with a clean crop without the previous Chinese banner.
- Removed duplicate document/resource pages, including the old pages corresponding to the requested 06 and 10 deletions; the final numbering is regenerated automatically.

### Verification
- `npm run build` completed successfully through all canonical site and catalog stages.
- `npm run check` passed.
- Browser QA: 19 catalog sections, 8 technical parameter pages, 1 table + 1 visual reference on each technical page, 0 broken images, and 0 matches for the prohibited instruction/reference phrases.
- Mobile QA at 390 px: document width = 390 px, body width = 390 px, no horizontal overflow.
- Final PDF: `output/pdf/catalog-executed-final.pdf`, 19 pages, 841.92 × 594.96 pt (A4 landscape). Representative pages 03–16 were rendered with Poppler and visually checked for table completeness, drawing clarity and clipping.

## Enriched catalog website update (2026-09-23)
- Updated src/site-v3-upgrade.mjs published ranges and voltage combinations.
- Added src/catalog-v8-web-update.mjs and CSS; integrated the stage into canonical npm build.
- Enriched 18 existing detail pages and created four new detail pages with directory/family links.
- Extended smoke check for catalog-only pages without assigning unrelated 110 kV test evidence.
- npm run build passed. npm run check passed with 27 detail pages. Verified four new pages' 46 local references each and zero missing local targets.
- Final website entry: dist/products.html.


## Product taxonomy correction (2026-09-23)
- Removed the standalone '2026 Catalog Additions / Additional product platforms' block from the products directory.
- Integrated split-winding under Power Transformers and SZ20, intelligent dry-type and ZBS/ZBSCB rectifier under Distribution Transformers; updated breadcrumbs and parent-family links.
- Rebuilt and passed npm run check; confirmed each new link appears once inside its intended directory family and the rejected heading is absent.


## Visual verification and correction (2026-09-23)
- Rendered products.html in Edge at 1440x900 and 390x844, and visually inspected Power and Distribution groups. Initial screenshots exposed a misplaced 220px-wide family-link panel in the directory grid.
- Fixed catalog-v8-family-links to occupy the product-content column on desktop and full width on mobile. Re-rendered both breakpoints and visually confirmed compact, aligned panels.
- Rendered the SZ20 detail hero and ratings on desktop and mobile. Added a mobile horizontal-table hint after observing the table's hidden columns. Replaced generic new-page hero images with product-specific images extracted from the supplied enriched PPTX.
- Final screenshot QA: zero body horizontal overflow and zero broken loaded images at both viewport widths. npm run build and npm run check passed.
- Screenshots are in tmp/visual-qa/*-verified.png.


## Product entry image correction (2026-09-23)
- User pointed out the newly integrated products had text-only links. Converted all four into image cards within their existing Power or Distribution category panels.
- Images come from the corresponding slides of the supplied enriched PPTX and are stored under source-media/products/catalog-v8.
- Rebuilt the site and visually inspected 1440px and 390px screenshots of both affected categories. Browser confirmed all four source images loaded and there was no horizontal overflow. npm run check passes and now requires those four images.

## Homepage energy-flow motion (2026-09-23)
- Researched MDN reduced-motion and animation compatibility guidance plus web.dev animation performance guidance. Chose a CSS transform/opacity energy-flow motif with a pause control.
- Added a generation → transformation → grid connection visual to the homepage. It overlays the lower right of the hero on desktop and sits beneath the hero on smaller screens.
- Visually inspected Edge screenshots at 1440×900, 1024×768, and 390×844, plus a reduced-motion mobile screenshot. The card is legible and no breakpoint has horizontal overflow.
- Browser verified the animation moves, pauses, resumes, and stops under reduced-motion preference. Both root and dist homepage files load the new assets without page script errors. The only empty image elements are existing dormant modal placeholders.
- `npm run build` and `npm run check` passed; smoke checks now require the homepage visual and its assets.

## Homepage world-map reliability (2026-09-24)
- Confirmed the world-map section and all seven country-level pins were still present. Its SVG base image came from a remote Wikimedia URL, making the local file-based page dependent on network access.
- Saved the existing Robinson map as a local source asset and updated the homepage build to copy and reference it from `dist/assets/media/applications`.
- Fixed the root homepage mirror to place its `base` element before stylesheets, so both direct file entry points render identically.
- Visually inspected desktop and mobile map sections with all external requests blocked. Both root and dist homepage files display the map, all seven pins remain, pin details open, and neither page overflows horizontally. `npm run build` and `npm run check` passed.

## Homepage product showcase redesign (2026-09-24)
- Replaced the generic three-card homepage product grid and small shortcut strip with a family selector, visible child-product list, and large product image/detail panel.
- The build reads the current product directory, exposing all 16 child entries across Power (5), Distribution (5), and Prefabricated Substations (6), including the enriched catalog additions.
- Products rotate every six seconds, continue into the next family, and support direct family/product selection, previous/next, pause, and reduced-motion preference.
- Visually inspected desktop, tablet, and mobile screenshots. Browser verified all 16 images and product links for both homepage entry points, automatic change, pause, manual next, and family rollover. No horizontal overflow or page script errors. `npm run build` and `npm run check` passed.

## Continuous product and certificate rows (2026-09-24)
- Replaced the category selector and large spotlight panel with one uninterrupted horizontal row of all 16 product image cards and their names, without descriptions.
- Converted the existing certificate row from manual-only scrolling to slow continuous movement. Both rows loop seamlessly, support arrows and a compact pause control, and stop automatically for reduced-motion preference.
- Rendered and visually inspected both rows on desktop and mobile. Browser measured product movement around 29–30 px and certificate movement around 20–21 px over 1.15 seconds, then zero movement when paused. Root and dist homepages have no horizontal overflow or script errors. `npm run build` and `npm run check` passed.


## 2026-09-24 Industrial Editorial implementation
- Started V-01 to V-10 from the approved visual audit; code modification now explicitly authorized by user.
- Confirmed active source directory, build pipeline, browser baseline, and absent Git metadata.
- Added a final Industrial Editorial build stage and stylesheet. The homepage now uses a stable product photo hero, three family links, and four selected platform cards. Product directory, project map, manufacturing and testing evidence, model-specific quality reports, applications, and mobile inquiry flow share the same visual contract.
- Kept original product photos and added seven compressed WebP derivatives to reduce transfer size. Below-fold images now load lazily. The resources hero is static to avoid a late carousel repaint.
- Final `npm run build` and `npm run check` pass. Browser QA across 12 page types and four widths found no document overflow, first-viewport broken images, or page script errors. Mobile menu, quote action, project map detail, and three evidence PDF links were verified.
- Lighthouse mobile lab scores after image optimization: home 87, products 87, 110 kV platform 96. Resources scored 73 on a later static-hero run, with 7.3 s LCP; it remains the main performance limitation. Desktop scores were 100, 100, 100, and 93 respectively before the static resources hero update.
