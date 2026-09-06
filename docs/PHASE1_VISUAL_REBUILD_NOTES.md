# Phase 1 Visual Rebuild Delivery Notes

## Scope and baseline

Repository: `UIBEjingqichen/website`

Base branch: `master`

Verified starting commit: `90078405f9a08c3936e0d00764cbdf36cf812d59`

Working branch: `visual-system-phase1-20260906`

Phase 1 intentionally migrates only four representative outputs plus the root homepage mirror:

- `dist/index.html`
- `dist/products.html`
- `dist/products/110kv-power-transformer/index.html`
- `dist/manufacturing.html`
- root `index.html` mirrors the generated homepage with `<base href="dist/">`

About, Quality, Applications, Resources, News and Knowledge remain on their existing presentation in this phase.

## Source and build architecture

The canonical build remains:

`npm run build` → `src/website-build.mjs`

`src/website-build.mjs` → `site-foundation.mjs` → `catalog-pipeline.mjs` → `products-pipeline.mjs` → `home-pipeline.mjs` → `site-finalize.mjs`

Phase 1 adds `visual-system-phase1.mjs` as the final migration stage in `site-finalize.mjs`. This deliberately allows legacy generators to continue serving unmigrated pages while the four representative pages have their old stylesheet lists replaced after generation.

`src/manufacturing-pipeline.mjs` now uses `manufacturing-v34.mjs` as its single manufacturing generator. The separate manufacturing density override stage is removed from that pipeline.

## Source-to-generated mapping

| Source | Generated / affected output |
| --- | --- |
| `src/visual-system.css` | `dist/assets/css/visual-system.css` |
| `src/home.css` | `dist/assets/css/home.css`; homepage presentation |
| `src/product-directory.css` | `dist/assets/css/product-directory.css`; Products presentation |
| `src/product-detail.css` | `dist/assets/css/product-detail.css`; canonical 110 kV detail presentation |
| `src/manufacturing.css` | `dist/assets/css/manufacturing.css`; Manufacturing presentation |
| `src/visual-behavior.js` | `dist/assets/js/visual-behavior.js`; product hero, evidence shelf and section-navigation behavior |
| `src/visual-system-phase1.mjs` | four representative generated HTML pages and root homepage mirror |
| `src/documents-data.mjs` | supplies the model-specific 110 kV report metadata used on the canonical detail page |
| `src/site-smoke-check.mjs` | validates migration contracts, technical data retention and root mirror consistency |

Each migrated page is required to load exactly two stylesheets:

1. `visual-system.css`
2. its own page-template stylesheet

Legacy styles remain available for unmigrated pages but are not loaded by the four migrated pages.

## Homepage changes

- Real substation / factory / renewable photography retained in the hero.
- Hero is capped to a compact industrial proportion; heading scale is constrained by the new design system.
- Three existing slides are retained but only the first slide is an H1; slides two and three use H2.
- Products and RFQ actions are added to the hero content area.
- Existing company facts are placed in a compact statistics band.
- Existing five product-entry cards are preserved.
- Manufacturing, Testing and Project Support are presented as compact parallel evidence modules rather than a tall sequence.
- Project map uses the light blue-gray system while preserving filters, pins, project detail and project links.
- The existing external Robinson-projection SVG is retained rather than introducing a new local SVG asset. Therefore no local `.svg` MIME change is claimed in this phase.
- Certificate/test-report presentation is converted from the auto-rotating 3D behavior to a manually browsable horizontal evidence shelf. The legacy `ux-refine-v5.js` auto-rotation behavior is removed from the homepage.
- News uses a readable three-column layout with labels kept at normal secondary-text size.

## Product Directory changes

- Hero is compact and introduces four product directions: Power Transformers, Distribution Transformers, Special & Renewable Transformers and Prefabricated Substations.
- Existing product-family structure and product links are preserved.
- Directory layout is converted from a marketing-card wall into a scan-oriented product catalog.
- Desktop family explanation is sticky; the behavior is disabled at mobile widths.
- Each product row prioritizes `complete product image | product/use | recorded range`.
- Product images use `object-fit: contain` to avoid cropping bushings, radiators and accessories.
- Existing hero media rotates approximately every 8 seconds with a 1.3-second fade.
- Pause/Play control is provided; hover and keyboard focus pause rotation.
- `prefers-reduced-motion` disables automatic product-hero rotation.
- Family anchors receive sticky-navigation offset handling through `scroll-margin`.

## Canonical 110 kV Product Detail changes

Canonical identity is preserved:

- Page title: `110 kV Three-Winding Power Transformer`
- Series: `SSZ-6300~63000/110`
- HV: `110 / 115 / 121 kV`
- Rating range: `6.3–63 MVA`

The page now includes:

- breadcrumb and compact hero
- RFQ and Ratings actions
- in-page section navigation
- original quick specification grid
- original full Rating Range table
- Applications
- Engineering Characteristics with configuration-review inquiry action
- product photos
- reference outline drawing with explicit reference/project-specific distinction
- Standards & Documents
- Related Products
- final RFQ

The Rating Range table remains 11 rows and retains all existing columns.

The document section reads the existing `power-transformer-50mva-110kv` record from `src/documents-data.mjs` and explicitly identifies:

- report number `21M2078-S`
- tested model `SZ22-50000/110-NX1`
- 50 MVA
- 110 kV
- testing organization recorded in the metadata

The current metadata has no populated standards array, so the page says the standard field is not specified in current document metadata rather than inventing a standard. The report is explicitly described as model-specific evidence, not family-wide certification.

## Manufacturing changes

- Existing real factory hero is retained at approximately 420 px on desktop.
- Existing manufacturing figures are presented as static values.
- `manufacturing-v34.js` is no longer loaded, removing the zero-to-value counter animation.
- Eight process steps remain present and are styled four columns on desktop / two columns on small mobile layouts where practical.
- Winding and core-processing photography remains directly adjacent to process content.
- SRM, MOM, QMS and WMS are presented as compact operational blocks rather than software-product cards.
- Testing presentation keeps Routine Tests, Type / Special Tests, Witness FAT and Traceable Records adjacent to testing photography.
- Equipment / workshop gallery receives a consistent visual frame and caption treatment.
- FAQ, factory-visit and technical-inquiry entry points remain.

## Validation completed

GitHub Actions branch validation ran the repository's actual canonical commands on Node 22:

- `npm run build` — passed
- `npm run check` — passed

The validation confirms, by generated-source inspection and smoke checks:

- all required generated assets exist
- the four representative pages each load exactly two intended stylesheets
- legacy `site-typography.css` is not loaded by migrated pages
- legacy pages such as About and Knowledge still retain their existing stylesheet system
- homepage contains one semantic H1
- homepage retains project filter markup and the evidence shelf
- homepage does not load the legacy auto-rotating certificate script
- Products retains the four required family directions and receives the new carousel control
- canonical 110 kV identity remains unchanged
- canonical 110 kV Rating Range still contains exactly 11 rows
- 110 kV report number and tested model remain bound to the detail page
- drawing is labeled as a reference outline drawing
- Engineering section anchor exists
- Manufacturing retains Routine Tests and Witness FAT
- Manufacturing no longer loads its count-animation script
- root `index.html` mirrors generated `dist/index.html` after the intentional `dist/` base tag is normalized

## Validation not claimed

No browser / visual automation environment was available in this execution. The following are therefore **not marked as visually passed** merely because source checks passed:

- final desktop visual composition of all four pages
- 390 px viewport visual inspection
- 768 px viewport visual inspection
- actual external SVG world-map rendering in a browser/network context
- visual crop quality of every product, factory and project image
- end-to-end keyboard traversal in a real browser
- modal visual centering and focus-return behavior in a real browser
- project-map hover/click positioning in a real browser
- product-carousel timing measured in a browser
- reduced-motion behavior observed through browser devtools / OS setting

These are the remaining manual review items before merging or publishing.

## Content questions and pre-existing functional defects

These items are deliberately not silently resolved by Phase 1:

1. **Products entry vs canonical detail scope**: an existing Products entry uses `110 / 132 kV`, while the representative detail is the 110 kV three-winding family. The detail page remains a 110 kV family rather than being widened to a new 132 kV / 150 MVA platform.
2. **Plant-area conflict**: the current website/company source uses `85,243 m²`, while another historical capability source uses `100,000 m²`. Phase 1 does not declare one figure universally correct. Material owner should reconcile the official public figure.
3. **220 kV capacity scope**: some directory/capability material reaches `420 MVA`, while a catalog series is recorded up to `240 MVA`. These should remain separately scoped until the product owner confirms the intended public range.
4. **Report applicability**: 110 kV and 132 kV reports correspond to different tested models. The canonical detail now labels the 110 kV report by exact tested model and does not broaden it to the family.
5. **Broken product anchors**: `#24-pulse`, `#pv` and `#ess` remain recorded as pre-existing navigation-target issues. Phase 1 does not invent missing product content in order to make those anchors appear valid.
6. **RFQ backend**: the current form has no confirmed sending backend. Phase 1 preserves the interface and does not claim a successful external submission.
7. **Deployment URL**: `SITE_URL` is not configured. Build output continues to warn that canonical links are root-relative and a sitemap is not emitted. Phase 1 does not guess a production domain.
8. **Map dependency**: the homepage continues to depend on the existing external Wikimedia world-map SVG. A local map asset was not introduced in this phase, so production availability should still be checked in-browser.
9. **Canonical-detail metadata**: the page's `<title>`, description and canonical were preserved. Existing Open Graph fields have not been independently normalized in this visual phase and should be reviewed during a later SEO/content pass if they disagree with the canonical product identity.

## Merge and deployment status

This phase is prepared on its own review branch. It must not be merged to `master` or published automatically as part of this task.
