# Tianyu Electric Web Visual System

## Purpose

This visual system is designed for an overseas industrial B2B audience reviewing transformers, prefabricated substations, manufacturing capability, technical evidence and project references. The visual hierarchy should communicate engineering credibility through real industrial photography, disciplined alignment, readable technical data and restrained interaction.

Phase 1 applies the system deeply to four representative templates only:

- Homepage
- Product Directory
- Canonical Product Detail: 110 kV Three-Winding Power Transformer
- Manufacturing

Unmigrated pages remain on their legacy presentation until a later controlled migration.

## Design principles

1. **Engineering information before decoration.** Voltage, capacity, model, test-report identity and project evidence must be easy to scan and compare.
2. **Reduce height before reducing type.** Dense pages become shorter through layout, grouping and multi-column composition, not 8–10 px labels.
3. **Real photography carries trust.** Factory, product, test-station and project imagery is preferred to abstract decoration.
4. **Restrained motion.** Motion may clarify a gallery or carousel but must not become a visual event of its own.
5. **Scope claims precisely.** A report for one tested model is never visually or verbally promoted as proof for an entire product family.
6. **Stable page rhythm.** Similar information receives similar spacing, borders, image ratios and heading scale across templates.

## Core layout

| Token | Standard |
| --- | --- |
| Maximum content width | 1200 px |
| Standard desktop section spacing | 48–64 px vertical |
| Standard page shell | `min(1200px, 100% - 48px)` |
| Mobile page shell | approximately `100% - 32px` |
| Desktop header height | approximately 72 px |
| Compact/tablet header height | approximately 64 px |
| Primary card padding | 16–20 px |
| Primary radius | 4 px |
| Border | 1 px cool gray-blue |
| Shadow | light, used only for overlays, dialogs and selected floating states |

The layout should avoid long sequences of pure-white sections. Alternate pale engineering surfaces with near-white content sections where this improves section recognition.

## Typography

The system uses the platform sans-serif stack beginning with Inter where available, then Segoe UI and Arial.

| Role | Desktop target |
| --- | --- |
| H1 | 32–40 px; never above 42 px at default desktop sizing |
| H2 | 24–30 px |
| H3 | 16–20 px |
| Main body | 13–15 px; primary explanatory copy prefers 15 px |
| Secondary label / kicker | normally 12 px or larger |
| Technical table | approximately 13 px body / 12 px header |

Headings use compact line-height and modest negative letter spacing. Body text is not condensed to compensate for oversized sections.

## Color system

| Name | Value | Use |
| --- | --- | --- |
| Deep navy | `#102E46` | headings, footer, high-contrast industrial surfaces |
| Engineering blue | `#17577E` | links and secondary actions |
| Teal | `#087C83` | interaction and engineering accent |
| Dark teal | `#06636A` | primary buttons, active states, data emphasis |
| Main text | `#203B50` | body and technical text |
| Secondary text | `#566C7C` | supporting copy and captions |
| Border | `#CBD8DF` | cards, tables, structural separators |
| Pale surface | `#EDF3F6` | alternate sections and card media wells |
| Technical panel | `#D8E5EC` | CTA and technical summary panels |
| Map section | `#DCE7ED` | project-map section background |
| Map canvas | `#C4D6E0` | world-map canvas |

Avoid adding a new red accent. Avoid long runs of dark navy sections. Dark surfaces should be reserved for places where contrast has a functional purpose, such as the footer, photo overlay, or floating project detail.

## Buttons and links

Primary buttons use dark teal with white text, 4 px radius and approximately 40 px minimum height. Secondary buttons use a blue/teal outline. Hover should be limited to a small color change and at most a subtle 1 px lift.

Text links use engineering blue with clear labels such as `View product`, `All reports`, or `Request project drawing`. Avoid vague CTA language when the destination can be named.

Keyboard focus uses a visible teal outline and should never be removed.

## Borders, radius and shadow

Cards, data blocks and image frames use a 1 px `#CBD8DF` border and 4 px radius as the default industrial grammar. Heavy shadows and floating marketing-card treatments are discouraged. Overlays and dialogs may use a larger soft shadow because separation from the page is functional there.

## Hero pattern

Desktop hero height is generally 400–440 px. Content-driven cases may approach about 480 px. Mobile hero height may grow naturally to contain text.

Hero rules:

- Use a real substation, factory, project or product image.
- Create a controlled readable text area rather than placing text indiscriminately over busy photography.
- H1 remains within 32–40 px.
- One semantic H1 per page.
- Supporting copy is concise.
- Primary route should be visible without scrolling when practical.
- Do not add parallax or conspicuous image zoom.

The Product Directory hero may rotate representative product images. The transition target is approximately 1.2–1.4 seconds with an approximately 8-second interval. Hover and keyboard focus pause the rotation, and a direct Pause/Play control is provided. `prefers-reduced-motion` disables automatic rotation.

## Images and captions

### Product images

Product-directory thumbnails use `object-fit: contain` so bushings, radiators and accessories are not cropped merely to fill a box. Technical product imagery should prioritize completeness over dramatic crop.

### Factory and project images

Landscape evidence photography may use `object-fit: cover` where cropping does not remove the engineering subject. Repeated gallery items should share a consistent ratio within the same component.

### Drawings

A drawing displayed on a product page must be labeled as a **Reference outline drawing** unless it is explicitly project-specific. Supporting text must state that final dimensions and interfaces are issued against the approved project design.

### Captions

Captions use secondary text color, approximately 12 px, with a separating border where useful. They should identify the engineering subject rather than offer promotional prose.

## Technical tables

Technical tables are compact, comparison-first components:

- 1 px structural border.
- Distinct pale blue-gray header.
- Approximately 10 px vertical cell padding.
- Light alternating row surface.
- No forced wrapping of short rating headers.
- On narrow screens, the table container scrolls horizontally while the page itself remains within the viewport.
- Source rows and columns are preserved. Styling is not permission to simplify technical data.

The canonical 110 kV product detail retains all 11 Rating Range rows.

## Parameter and metric blocks

Parameter summaries use a structured grid with pale cells and 1 px separators. Labels are about 12 px and values about 14–15 px.

Manufacturing metrics are displayed as static accurate values. Numeric zero-to-target animation is not part of the Phase 1 system. Where source documents contain conflicting company-scale figures, the UI must retain the selected source context and the discrepancy must be tracked rather than silently normalized.

## Product Directory

The Product Directory separates orientation from comparison:

- Hero gives the four product directions.
- Product-family explanation is placed on the left on desktop.
- Product rows are placed on the right.
- Row structure is `thumbnail | product/use | voltage/capacity range`.
- Family explanation may stay sticky on desktop.
- Sticky behavior is disabled on mobile.
- Section anchors account for the fixed/sticky navigation offset.

The product row is intentionally shorter and flatter than a marketing card. The user should be able to scan several products in one viewport.

## Canonical Product Detail

The representative detail template uses:

1. Breadcrumb and compact hero.
2. Product image and voltage/capacity summary.
3. RFQ action.
4. In-page navigation.
5. Key parameter blocks.
6. Full Rating Range table.
7. Applications.
8. Engineering Characteristics and configuration-review action.
9. Product photographs and reference drawing.
10. Standards & Documents with tested-model specificity.
11. Related Products.
12. Final RFQ.

A report card must show report number, tested model, capacity, voltage and testing organization when those fields exist in `documents-data.mjs`. Empty metadata is shown as unverified/not specified rather than filled from assumption.

## Manufacturing

Manufacturing should read as an evidence chain rather than a SaaS feature page:

- Real factory hero around 420 px.
- Compact static manufacturing metrics.
- Eight process steps, four columns on desktop and two on small mobile layouts.
- Winding and core-processing photos directly support the process explanation.
- SRM, MOM, QMS and WMS are compact operational information blocks.
- Testing image is paired with Routine Tests, Type / Special Tests, Witness FAT and Traceable Records.
- Equipment gallery uses consistent image proportions and captions.
- FAQ, factory visit and technical inquiry remain available.

## Project map and project cards

The project-map area uses medium-value blue-gray backgrounds so the map outline remains legible without becoming a dark visual centerpiece. Pins use restrained teal. Project detail is shown in a compact floating panel containing application, industry, scale, product and documented scope.

Map filtering, project pins, project detail and links are functional requirements and should not be removed during visual cleanup.

## Certificates and reports

Homepage certificates are treated as a manually browsable evidence shelf, not an automatic 3D showpiece. Cards remain document-like and the user controls horizontal browsing. The design should not imply a certificate applies more broadly than its metadata supports.

## Responsive behavior

### 768 px and below

- Multi-column hero and content grids collapse naturally.
- Sticky family descriptions become static.
- Technical table scroll remains inside its own container.
- Product rows keep the thumbnail visible but reduce its width.
- Section navigation may horizontally scroll.
- Manufacturing process remains readable as a two-column step grid where space permits.

### Approximately 390 px

- Page shell reduces to about 16 px side gutters.
- Hero grows vertically if needed.
- Major content becomes one column except compact metric/process pairs where two columns remain readable.
- Product directory rows keep a small `contain` thumbnail plus stacked product/range copy.
- CTA groups wrap or stack.
- No component may force page-level horizontal overflow.

## Motion and accessibility

- Respect `prefers-reduced-motion`.
- Product carousel does not auto-advance under reduced motion.
- Hover and keyboard focus pause the product carousel.
- Modal close controls remain keyboard reachable.
- Existing modal logic returns focus to the element that opened the dialog.
- Section navigation and carousel controls use actual links/buttons rather than click-only generic elements.
- Visible focus styles must be retained.

## Source and generated-file relationship

The Phase 1 design system is applied by `src/visual-system-phase1.mjs`, which runs as the final site stage after legacy generators. The legacy generators remain available for unmigrated pages, while the four representative pages have their stylesheet lists replaced at the end of the canonical build.

| Source | Generated output |
| --- | --- |
| `src/visual-system.css` | `dist/assets/css/visual-system.css` |
| `src/home.css` | `dist/assets/css/home.css` |
| `src/product-directory.css` | `dist/assets/css/product-directory.css` |
| `src/product-detail.css` | `dist/assets/css/product-detail.css` |
| `src/manufacturing.css` | `dist/assets/css/manufacturing.css` |
| `src/visual-behavior.js` | `dist/assets/js/visual-behavior.js` |
| `src/visual-system-phase1.mjs` | migrates the four generated representative pages and mirrors the homepage to root `index.html` |

For each migrated page, the intended stylesheet contract is exactly:

`visual-system.css + current page template stylesheet`

The rest of the site continues to use the pre-existing styles until explicitly migrated.
