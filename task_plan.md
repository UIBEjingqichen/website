# Task Plan: Tianyu Export Website V2

## Goal
Upgrade the existing local static website into a data-driven product, evidence, project, resources, and manufacturing site while preserving the current Node build and using only verified local assets.

## Current Phase
Phase 12

### Phase 12: Continuously moving homepage product and certificate rows
- [x] Remove homepage product family controls and explanatory copy
- [x] Place all 16 child products in one horizontal row and move it slowly and continuously
- [x] Make the certificate row move automatically with matching pause, navigation, and reduced-motion behavior
- [x] Visually inspect desktop and mobile layouts and verify both rows move and pause
- **Status:** completed

### Phase 11: Homepage product subcategory showcase
- [x] Replace the three generic family cards and compact shortcut strip with a product-led showcase
- [x] Draw all current child products from the product directory and rotate them automatically
- [x] Verify desktop, tablet, mobile, image links, manual controls, pause, reduced motion, and site build
- **Status:** completed

### Phase 10: Homepage energy-flow motion
- [x] Inspect current homepage and research browser motion/accessibility guidance
- [x] Add a lightweight, controllable energy-flow visual to the homepage
- [x] Verify desktop, tablet, mobile, pause control, reduced-motion mode, and site build
- **Status:** completed

### Phase 9: 2026 enriched catalog website integration
- [x] Locate active website source and compare the enriched PPTX with the English catalog and 519 PDF
- [x] Add missing product platforms and corrected published ranges to the website source
- [x] Add source-backed introductions and technical tables using the 110 kV page structure
- [x] Rebuild and verify navigation, data, media, and output pages
- **Status:** completed

## Phases

### Phase 1: Requirements & Discovery
- [x] Read the supplied V2 brief and local-only constraint
- [x] Inventory the existing generator, source data, workbook, PDFs, and media
- [x] Record verified mappings and missing assets
- **Status:** completed

### Phase 2: Data & Media Foundation
- [x] Create product-family, document, project, and factory datasets
- [x] Render selected PDF preview pages and organize WebP/PDF assets
- [x] Preserve legacy products under Other Transformer Solutions
- **Status:** completed

### Phase 3: Page & Interaction Implementation
- [x] Refactor navigation, home, products, product detail, resources, projects, quality, and manufacturing pages
- [x] Add gallery, evidence carousel/modal, drawing viewer, and filters
- [x] Add responsive, keyboard, touch, reduced-motion, and lazy-loading behavior
- **Status:** completed

### Phase 4: Build & Verification
- [x] Run the full static build and fix failures
- [x] Scan user-visible output for forbidden placeholder text
- [x] Verify generated routes, evidence bindings, counts, and media references
- [x] Perform local browser checks at required responsive widths
- **Status:** completed

### Phase 5: Local Delivery
- [x] Review changed files and final artifacts
- [x] Update persistent progress records
- [x] Hand off local build without GitHub login, push, PR, or hosting
- **Status:** completed

### Phase 6: Catalog Client-Edition Revision
- [x] Restore customer-facing technical parameter tables in the catalog source
- [x] Remove internal evidence/record wording from catalog output
- [x] Remove web-only toolbar, buttons, chips, and action panels from the catalog
- [x] Rebalance product imagery and enlarge engineering drawings
- [x] Rebuild and render the final catalog for visual and text QA
- **Status:** completed

### Phase 7: A4 Layout and Customer Readability Revision
- [x] Make browser and PDF pages use one fixed A4 landscape master
- [x] Rebalance overview pages around one large product image
- [x] Keep parameter tables complete while removing repeated explanatory copy
- [x] Remove sparse placeholder document pages and web-style visual controls
- [x] Render and inspect representative pages and final PDF
- **Status:** completed

### Phase 8: Client Catalog Simplification and Drawing Pairing
- [x] Replace website-style range cards with a merged product-range/reference-configuration table
- [x] Remove the specified generic instructional and approval-schedule copy
- [x] Standardize product introductions to two equal image panels with a balanced information column
- [x] Limit high-voltage power-transformer parameter output to two tables and pair each with a drawing
- [x] Add the missing oil-immersed distribution-transformer parameter table and pair it with a drawing
- [x] Apply the same parameter-page structure to all transformer families
- [x] Build and verify desktop, mobile, image-loading, forbidden-copy, duplication and print-page checks
- **Status:** completed

## Key Questions
1. Which workbook sheets and columns contain the six product groups, projects, and image mappings?
2. Which PDF pages provide the best cover, summary, parameter, sample-photo, result, and drawing previews?
3. Which verified existing company facts can safely remain visible?

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Preserve the zero-dependency Node static generator | Explicit requirement and lowest-risk path |
| Treat the workbook and PDFs as source evidence; keep missing values null/hidden | Prevents fabricated claims |
| Keep all work local; no GitHub authentication, push, PR, or hosting | Explicit user constraint |
| Generate only selected PDF preview pages | Matches the brief and keeps the site lightweight |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| Initial attachment text displayed as mojibake in PowerShell output | 1 | Re-read/interpret the UTF-8 source using explicit encoding and rely on the intact file content |
| Combined targeted inspection command had a PowerShell quote terminator error | 1 | Split the command into simpler calls with single-quoted patterns |
| Workbook ZIP inspection could not resolve ZipFile type | 1 | Load System.IO.Compression.FileSystem explicitly before opening the archive |
| Multi-file patch failed because Markdown backticks terminated the orchestration string | 1 | Split into smaller patches with literal-safe string construction |
| First site validator run reported canonical URLs and decorative empty alt text as missing files/content | 1 | Refined the validator and fixed genuine missing factory media plus product FAQ depth |
| Foreground local server command timed out because it is intentionally long-running | 1 | Launch the verified local server as a hidden background process for browser QA |
| Browser API did not support the networkidle load-state option | 1 | Used the supported DOMContentLoaded state and explicit image/error checks |
| Combined preview-server restart command was blocked by local command policy | 1 | Verified the exact listener, then stopped and restarted it in separate scoped commands |

## Notes
- Do not edit dist as source; build from src and source-media.
- Do not expose To be confirmed, TODO, Lorem, missing-report placeholders, or fabricated media.
- Catalog-specific revisions must preserve technical tables, use publication layout, and keep internal QA language out of customer pages.

### Phase 13: Industrial Editorial visual implementation
- [x] V-01 unify typography, navigation, buttons and page geometry
- [x] V-02 stabilize product-led homepage hero
- [x] V-03 simplify product directory hierarchy
- [x] V-04 improve homepage project evidence and touch use
- [x] V-05 improve manufacturing, about and testing evidence
- [x] V-06 connect quality evidence to resource search
- [x] V-07 improve project listing and photo context
- [x] V-08 responsive and keyboard interaction QA
- [x] V-09 clarify family-to-platform technical path
- [x] V-10 improve mobile inquiry order and finish details
- [x] Build, smoke check, browser screenshots at 375/768/1024/1440
- **Status:** complete
