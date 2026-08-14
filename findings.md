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
