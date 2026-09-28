# Findings & Decisions

## Requirements
- Six primary product families must lead the site.
- Legacy Rectifier, Special, and Amorphous Alloy offerings must remain under Other Transformer Solutions.
- Add structured documents, projects, and factory datasets.
- Use verified local PDFs for evidence records and selected key-page previews.
- Add evidence carousel/modal, product galleries, project/product filters, resource browsing, and drawing viewer.
- Build remains zero/low dependency and static.
- All work is local only; no GitHub login or remote publication.
- User explicitly removed the brief's former GitHub step; PDF screenshots/crops/previews are allowed.

## Research Findings
- Existing build is driven by src/products-data.mjs, src/site-data.mjs, src/build.mjs, src/main.js, and src/styles.css.
- package.json exposes sync-images, build, and serve scripts with no external project dependencies.
- Existing working tree is on master with only the user-provided 新补充 directory untracked.
- Local sources include 19 evidence PDFs, one workbook, brochure-extracted media, and existing semantic images.
- Existing product data contains visible placeholders such as To be confirmed and Drawing to be provided that must be removed from generated pages.
- Workbook extraction yielded 21 verified WebP product images: 3 distribution transformer images and 6 each for dry-type prefabricated, oil-immersed prefabricated, and American combined transformer families.
- The 19 local PDFs contain 1,160 pages in total.
- The final document database has 20 records: 19 supplied PDFs plus one explicit American combined-transformer pending-asset record.
- The final static output contains 45 HTML files and 254 files totaling about 163.7 MB, including complete local PDFs.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Keep source of truth in ES modules | Fits current generator and enables reusable render functions |
| Copy full PDFs into generated assets when practical and create WebP previews from key pages | Supports both download/view and lightweight browsing |
| Hide absent facts and drawings instead of rendering status text | Required by formal-site content rules |
| Use vanilla JS/CSS for all interactions | Preserves the current framework-free architecture |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Large source-file inspection output was truncated | Continue with targeted searches, line ranges, and structured scripts |

## Resources
- C:/Users/DELL/Desktop/变压器网站/新补充/天宇电气外贸出口.xlsx
- C:/Users/DELL/Desktop/变压器网站/新补充/**/*.pdf
- C:/Users/DELL/Desktop/变压器网站/source-media/
- C:/Users/DELL/Desktop/变压器网站/src/

## Visual/Browser Findings
- The workbook contact sheet confirms clean product, installation, internal-component, and factory-process imagery with no synthetic placeholders.
- Distribution images are isolated product shots on white; substation families include both exterior units and internal/factory detail shots, suitable for galleries.
- Representative high-voltage, dry-type, European-substation, and China-substation reports share a consistent structure: page 1 cover, page 2 report summary, page 3 tested-object parameters, and page 4 sample photo/nameplate.
- European and China substation reports include a useful engineering outline drawing on page 11.
- For the TÜV complete distribution-transformer reports, page 6 contains tested-object ratings and pages 15/17 include test photographs; page 1 is the cover.
- Pending PDF page rendering and local responsive browser review.
- Browser QA passed at 1440, 1024, 768 and 390 pixels with no horizontal overflow or broken loaded images.
- The generated social preview preserves the site palette and renders the requested text accurately.

## Catalog Revision Findings (2026-09-15)
- The active catalog generator is `src/catalog-product-focus.mjs`, invoked last by `src/website-build.mjs`.
- Its current output uses a four-column reference table, internal labels such as `Evidence / record` and `Available evidence records`, a sticky toolbar/drawer, action links, chip tags, and a two-column drawing/resource layout.
- The previous `src/catalog-core-parameters-v8.mjs` contains useful tested-reference values, but its insertion pattern targets an older catalog structure and is overwritten by the final product-focus stage.
- The revision must therefore restore parameter tables in the final product-focus generator itself (or a final stage after it), and cannot rely on an earlier pipeline stage.
- Active source used for this revision is `C:/Users/DELL/Desktop/website-master`; the similarly named `(2)` directory is empty and the nested duplicate contains an older build.

## A4 Layout Revision Findings (2026-09-15)
- The prior catalog PDF had 44 A4 pages while the HTML contained 30 logical sheets because variable-height screen sections and forced nested print breaks were combined.
- The active catalog now uses a fixed 297 x 210 mm landscape sheet in both screen and print media. The latest output has 30 PDF pages for 30 logical pages.
- High-voltage 110 kV and 220 kV rows use series-level impedance values; six-column source rows carry dimensions and weight, so the table mapper now preserves those weights.
- Single-series prefab and combined families created sparse range pages; those range pages are omitted and their series values remain in the overview/model pages.
- Three report-derived images previously labeled as drawings are now labeled reference diagrams; two actual prefab outline sheets remain engineering drawings.

## Client Catalog Execution Findings (2026-09-16)
- The active final catalog stage is `src/catalog-product-focus.mjs`; changes made there survive the complete `npm run build` pipeline.
- The generated catalog now has 29 HTML sections. The combined portfolio string contains the cover and contents sheets; the remaining product pages use the new overview, range, parameter and resource structure.
- High-voltage power-transformer output contains exactly two technical parameter pages and two technical parameter tables. The 66 kV table uses seven representative capacity rows so its table and right-side drawing fit one A4 landscape sheet without clipping.
- Oil-immersed distribution now has one dedicated technical parameter table with two tested model rows and a right-side drawing reference.
- All overview galleries render two equal 328 × 242 px image panels at 390 px viewport width; desktop and print use equal-height panels.
- The generated body contains no instances of the four user-specified generic sentences. No catalog image reference is broken.
- The main-transformer parameter pages use cropped exterior-dimension drawing plates from pages 6–7 of the English catalog reference (`power-transformer-35kv-english-catalog-drawing.png` and `power-transformer-66kv-english-catalog-drawing.png`) instead of report schematics.
- Technical-page audit found seven parameter pages in total; each has one parameter table and one loaded right-side drawing, including distribution, dry-type, prefabricated and American-type families.
- The merged high-voltage range page displays verified model identifiers (`SZ22-50000/110-NX1`, `SFZ-150000/132`, `SSZ20-240000/220`, `SSZ22-240000/220-NX1`) with capacity and voltage in separate columns, avoiding repeated combined labels.
- The temporary print QA PDF is `tmp/catalog-executed-print.pdf`, reported as 29 A4 landscape pages, and representative pages 2–29 were rendered and visually inspected.

## Client Catalog Execution Findings (2026-09-16 final pass)
- The final catalog is 19 logical A4 landscape sheets: cover, contents, six product overview sheets, one retained high-voltage range sheet, eight parameter sheets, special platforms and RFQ.
- The former document/resource sheets are intentionally absent, which removes the duplicate drawing/report pages corresponding to the requested old pages 06, 10 and related repeats.
- The retained high-voltage range sheet contains one full-width range table and two equal-size product images; no model-only or `Reference configurations` table is rendered.
- Oil-immersed distribution has two parameter sheets sourced from the English catalog: a complete 12 kV table with 19 capacity rows and a 40.5 kV renewable-energy table with 15 capacity rows. Every parameter sheet pairs one table with one right-side visual reference.
- English-catalog external-dimension plates are used for 35 kV, 66 kV, 12 kV and 40.5 kV pages. Dry-type and prefabricated pages use clean product references cropped from the English catalog where that source has no separate outline plate; the American-type page keeps a local appearance reference.
- Explanatory/source notes and page marks captured inside image crops were removed. The oil-immersed prefabricated overview now uses a clean second image without the previous Chinese banner.
- Desktop and print visual review shows enlarged, equal-height overview images, decorated unified headings, readable tables and no clipped parameter rows. Mobile QA at 390 px reports document and body widths of 390 px with no horizontal overflow.
- Final browser QA reports 19 sections, eight technical pages, one table plus one image on each technical page, zero broken images and zero matches for the prohibited instruction/reference phrases. `npm run build` and `npm run check` both pass. The final PDF is `output/pdf/catalog-executed-final.pdf` with 19 A4 pages.

## Enriched 2026 Catalog Website Integration (2026-09-23)
- Active project is C:/Users/DELL/Desktop/website-master; the environment's (2) path is absent. The nested website-master folder is an older copy.
- Enriched PPTX has 35 slides. Original 2026-05-19 PDF and English catalog provide corroborating background. The new PPTX is used for updated product introductions and published ranges.
- New PPTX shows ZGS 200–4,000 kVA; older website source showed 200–40,000 kVA. Website range and builder validation now use the newer 4,000 kVA figure. Treat this as a catalog-edition difference if tender data is requested.
- Existing 110/220 kV voltage-combination cards were aligned to the new PPTX (110 kV LV includes 21 kV; 220 kV LV includes 21 kV).
- Four catalog products did not have standalone pages: SZ20 on-load oil-immersed, split-winding oil-immersed, intelligent low-noise dry-type, and ZBS/ZBSCB rectifier. These now use the same product-detail visual vocabulary as the 110 kV reference.
- The 19-row SC(B)H17/H19 capacity ladder is now visible on the amorphous-alloy dry-type page. It is labeled published catalog data, separate from model-specific test evidence.


## Industrial Editorial audit, 2026-09-24
- The environment-provided website-master (2) path is absent; active workspace is C:\Users\DELL\Desktop\website-master.
- No Git repository is present at that path. Preserve existing files and apply changes through canonical source build.
- src/website-build.mjs finishes with site-experience.mjs, which updates all generated HTML and copies a shared finishing CSS/JS. A final visual stage after it can consolidate generated pages.
- Baseline browser audit found two visual systems: home uses Inter/15px body/#06636A CTA; product family uses Arial/16px body/#008B8B CTA.
- Baseline screenshots were captured in C:\Users\DELL\AppData\Local\Temp\ty-visual-qa.
- Final stage is src/industrial-editorial.mjs, with styles in src/industrial-editorial.css and seven compressed source media derivatives under src/optimized-media. Generated pages remain in dist.
- Post-change browser QA covered 12 page types at 1440, 1024, 768, and 375 px. No horizontal overflow, initial-viewport broken images, or runtime page errors were observed.
- Lighthouse mobile lab performance remains uneven: 87 on home, 87 on products, 96 on the 110 kV platform, and 73 on resources (7.3 s LCP in the later static-hero run). Do not describe resources as performance complete.
