# Tianyu Electric Web Visual System

## Purpose

This system is for an overseas industrial B2B audience reviewing transformers, prefabricated substations, manufacturing capability, technical evidence and project references. Engineering credibility should come from real industrial photography, disciplined alignment, readable data and restrained interaction rather than decorative effects.

The representative baseline remains:

- Homepage
- Product Directory
- Canonical Product Detail: 110 kV Three-Winding Power Transformer
- Manufacturing

Phase 2 Task A refines these four pages before the system is propagated to other templates. Unmigrated pages remain on their legacy presentation until a later controlled migration.

## Design principles

1. **Engineering information before decoration.** Voltage, capacity, model, report identity and project evidence must be easy to scan and compare.
2. **Reduce height through structure, not tiny type.** Repetition, uncontrolled galleries and empty fixed-height cards should be compressed before font size is reduced.
3. **Real photography carries trust.** Factory, product, test-station and project imagery is preferred to abstract decoration.
4. **Image treatment is part of the system.** Subject scale, media well, crop, caption and alignment should be consistent within each component family.
5. **Restrained motion.** Motion may clarify a gallery or carousel but must not become a visual event of its own.
6. **Scope claims precisely.** A report for one tested model is never promoted as proof for an entire product family.
7. **Stable page rhythm.** Similar information receives similar spacing, borders, image ratios and heading scale.
8. **Do not cardify every paragraph.** Use lists, rules, parameter grids and image-text layouts where a bordered card adds no information.

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
| Shadow | light, mainly overlays, dialogs and selected floating states |

Avoid long sequences of pure-white sections. Alternate pale engineering surfaces with near-white content sections when that improves section recognition.

## Typography

The system uses the platform sans-serif stack beginning with Inter where available, then Segoe UI and Arial.

| Role | Target |
| --- | --- |
| H1 | 32–40 px; default display never above 42 px |
| H2 | 24–30 px |
| H3 | 16–20 px |
| Main body | 13–15 px; important explanatory copy prefers 15 px |
| Secondary label / kicker | normally 12 px or larger |
| Technical table | approximately 13 px body / 12 px header |

Headings use compact line-height and modest negative letter spacing. Body text must not be squeezed merely to compensate for oversized sections.

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
| Pale surface | `#EDF3F6` | alternate sections and media wells |
| Technical panel | `#D8E5EC` | CTA and technical summaries |
| Map section | `#DCE7ED` | project-map background |
| Map canvas | `#C4D6E0` | world-map canvas |

Do not add a new red accent. Do not globally tint industrial photography blue. Dark surfaces should be reserved for places where contrast has a functional purpose, such as the footer, photo overlay or floating project detail.

## Buttons, links and focus

Primary buttons use dark teal with white text, 4 px radius and approximately 40 px minimum height. Secondary buttons use a blue/teal outline. Hover is limited to a small color change and at most a subtle 1 px lift.

Text links use engineering blue with explicit labels such as `View product`, `All reports`, or `Request project drawing`. Keyboard focus uses a visible teal outline and must never be removed.

## Hero pattern

Desktop hero height is generally 400–440 px. Content-driven cases may approach about 480 px. A directory hero can be slightly shorter when orientation information is already compact. Mobile hero height may grow naturally to contain text.

Hero rules:

- Use a real substation, factory, project or product image.
- Create a controlled readable text area rather than placing text indiscriminately over busy photography.
- H1 remains within 32–40 px.
- One semantic H1 per page.
- Supporting copy is concise.
- Primary route should be visible without scrolling when practical.
- Avoid frame-inside-frame image treatments when a single media well is enough.
- Do not add parallax or conspicuous image zoom.

The Product Directory hero may rotate representative product images. Transition target is approximately 1.2–1.4 seconds with an approximately 8-second interval. Hover and keyboard focus pause rotation, a direct Pause/Play control is provided, and `prefers-reduced-motion` disables automatic rotation.

## Images and captions

### Product images

Product-directory thumbnails use `object-fit: contain` so bushings, radiators and accessories are not cropped merely to fill a box. Thumbnail wells should give different source images a comparable apparent subject scale and consistent center alignment.

A different photograph must not be substituted merely to create variety. If the media library contains only a generic family photograph, reuse is acceptable only where that image genuinely represents the family. The asset gap should be recorded for later sourcing rather than hidden through invented imagery.

### Factory and project images

Landscape evidence photography may use `object-fit: cover` where cropping does not remove the engineering subject. Repeated gallery items share one ratio within the component. Prefer raw workshop photography without catalog-page labels when both forms exist.

### Drawings

A drawing displayed on a product page is labeled **Reference outline drawing** unless it is explicitly project-specific. Final dimensions and interfaces are issued against the approved project design.

Engineering drawings may use a larger, natural-height contain treatment than product photos. Do not force a detailed drawing into the same small crop as photography. A thumbnail must remain visibly meaningful and its zoom/viewer action must preserve the whole drawing.

### Captions

Captions use secondary text color, approximately 11–12 px, with a separating border where useful. They identify the engineering subject rather than repeat visible catalog labels or provide promotional prose.

## Technical tables

Technical tables remain comparison-first components:

- 1 px structural border.
- Pale blue-gray header.
- Approximately 10 px vertical cell padding.
- Light alternating row surface.
- No forced wrapping of short rating headers.
- On narrow screens, the table container scrolls horizontally while the page itself remains within the viewport.
- Source rows and columns are preserved. Styling is not permission to simplify technical data.

The canonical 110 kV product detail retains all 11 Rating Range rows.

## Parameter and metric blocks

Parameter summaries use a structured grid with pale cells and 1 px separators. Labels are about 12 px and values about 14–15 px.

Manufacturing hero metrics are intentionally selective. A hero should show only a few distinctive values; the full set belongs in the overview immediately below. Numeric zero-to-target animation is not part of the representative system.

Where source documents contain conflicting company-scale figures, the discrepancy is tracked internally rather than explained in customer-facing rewrite notes or silently normalized across unrelated contexts.

## Homepage

The homepage should maintain one consistent 1200 px content boundary from hero support sections to the footer.

- Product families remain five genuine product routes.
- Manufacturing, testing and project support form one three-part evidence layer.
- Global project references use a blue-gray technical map, filters, project detail and compact summaries.
- Certificate/report evidence is manually browsable rather than an automatic 3D carousel.
- News uses a compact three-column desktop grid.
- The post-news factory/application evidence area is a controlled gallery, not a sequence of unrelated full-width images.
- Duplicate capability metrics must not be repeated at the page end.
- The final content section is a compact RFQ/project-inquiry CTA directly before the footer.

## Project map

The map image and pins must share one coordinate plane. The current map uses a Robinson-projection world map, so country-level reference anchors are projected into that same Robinson space before being expressed as percentages.

Project source records provide country/application facts but not verified site coordinates for every project. Therefore map pins are **country-level reference placement**, not exact project-site coordinates. The UI must not imply otherwise.

The world map should visually blend into the blue-gray canvas rather than appear as a separate white oval. Pins use restrained teal. Filtering, pin interaction, project detail and project links remain functional requirements. A compact set of project summaries sits adjacent to or below the map so customers can scan experience without opening every pin.

## Product Directory

The Product Directory separates orientation from comparison:

- Hero summarizes the four product directions without becoming a second catalogue.
- Four family routes are compact and the real product list should enter the viewport quickly.
- Directory groups use a concise family explanation and a comparison-oriented product list.
- Product row structure is `thumbnail | product name | voltage/capacity range | use/context`.
- Repeated family labels inside every product row are suppressed because the group heading already establishes context.
- Family explanation may stay sticky on desktop, but it must not create artificial blank height and becomes static on mobile.
- Section anchors account for sticky navigation.

The product row is intentionally flatter than a marketing card. Several products should be comparable in one desktop viewport.

## Canonical Product Detail

The representative detail template uses:

1. Breadcrumb and compact hero.
2. Clean product-image area with voltage/capacity summary.
3. RFQ action.
4. One-line, horizontally scrollable family switcher where necessary.
5. In-page navigation.
6. Key parameter blocks and the full Rating Range table.
7. Applications and Engineering Characteristics as clear lists.
8. Product photographs plus a larger reference-drawing treatment.
9. Standards & Documents with tested-model specificity.
10. Related Products.
11. Final RFQ.

A report card shows report number, tested model, capacity, voltage and testing organization when those fields exist in `documents-data.mjs`. Empty metadata is shown as not specified rather than filled from assumption. Applicability warnings remain, but their visual weight is lower than the report identity and viewing action.

## Manufacturing

Manufacturing reads as an evidence chain rather than a SaaS feature page:

- Real factory hero around 420 px with three concise capability highlights.
- Complete static manufacturing metrics are centralized in the overview below.
- Eight numbered process steps remain in order.
- Core cutting, coil winding, assembly and testing evidence is placed adjacent to the relevant step rather than in a detached generic gallery.
- A step without suitable evidence remains a text step. Do not use an unrelated image to fill space.
- SRM, MOM, QMS and WMS are simple operational evidence rows.
- Testing image is paired with Routine Tests, Type / Special Tests, Witness FAT and Traceable Records.
- The final gallery prioritizes raw workshop/assembly photography and consistent captions.
- Developer-facing rewrite commentary and internal source-conflict notes do not appear on customer pages.
- FAQ, factory visit and technical inquiry remain available.

## Certificates and reports

Homepage certificates are a manually browsable evidence shelf, not an automatic 3D showpiece. Cards remain document-like and the user controls horizontal browsing. The design must not imply that a certificate applies more broadly than its metadata supports.

## Responsive behavior

### 768 px and below

- Multi-column hero and content grids collapse naturally.
- Sticky family descriptions become static.
- Technical table scroll remains inside its own container.
- Product rows keep the thumbnail visible but reduce its width.
- Section navigation may horizontally scroll.
- Manufacturing process becomes two columns where space permits.
- Homepage evidence gallery becomes two columns.

### Approximately 390 px

- Page shell reduces to about 16 px side gutters.
- Hero grows vertically if needed.
- Major content becomes one column except compact metrics/gallery pairs where two columns remain readable.
- Product directory rows keep a small `contain` thumbnail plus stacked product/range/use copy.
- Manufacturing process becomes one column so evidence images remain legible.
- CTA groups wrap or stack.
- No component may force page-level horizontal overflow.

Responsive rules are implementation targets, not proof of visual verification. A viewport can only be marked visually accepted after an actual browser screenshot/interaction review at that size.

## Motion and accessibility

- Respect `prefers-reduced-motion`.
- Product carousel does not auto-advance under reduced motion.
- Hover and keyboard focus pause the product carousel.
- Modal close controls remain keyboard reachable.
- Existing modal logic returns focus to the opener.
- Section navigation and carousel controls use real links/buttons.
- Visible focus styles are retained.

## Source and generated-file relationship

The representative system is applied late in the canonical build so legacy generators can continue serving unmigrated pages while the representative pages receive a clean two-stylesheet contract.

| Source | Generated output / role |
| --- | --- |
| `src/visual-system.css` | `dist/assets/css/visual-system.css` |
| `src/home.css` | `dist/assets/css/home.css` |
| `src/product-directory.css` | `dist/assets/css/product-directory.css` |
| `src/product-detail.css` | `dist/assets/css/product-detail.css` |
| `src/manufacturing.css` | `dist/assets/css/manufacturing.css` |
| `src/visual-behavior.js` | `dist/assets/js/visual-behavior.js` |
| `src/home-project-map-v16.mjs` | builds calibrated project-map markup and project reference pages |
| `src/manufacturing-v34.mjs` | builds the manufacturing evidence structure upstream |
| `src/visual-system-phase1.mjs` | replaces stylesheet lists and applies the representative visual contract |
| `src/representative-page-polish.mjs` | Task A structural cleanup for the representative pages after migration |

For each representative page, the intended stylesheet contract remains exactly:

`visual-system.css + current page template stylesheet`

Do not add a new numbered patch stylesheet to solve a local visual issue. Fix the formal source component or canonical page stylesheet instead.
