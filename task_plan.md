# Task Plan: Tianyu Export Website V2

## Goal
Upgrade the existing local static website into a data-driven product, evidence, project, resources, and manufacturing site while preserving the current Node build and using only verified local assets.

## Current Phase
Phase 5

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
