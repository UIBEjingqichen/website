# CSS architecture

All styles are written here and compiled into one stylesheet per page type in `dist/assets/css/`.
Never edit files in `dist/assets/css/` — they are generated and their names change with every build.

```
src/css/
  tokens.css            design tokens (colours, fades, legacy aliases) — the only place to change a site-wide value
  core/                 shared by every modern page, in cascade order
    visual-system.css     base elements, header, footer, buttons
    site-experience.css   focus states and small shared finishes
    industrial-editorial.css
    tianyu-refresh.css    current brand layer (header, typography, kickers)
    product-refresh.css   .pd page system (heroes, sections, sub-nav, tables)
    page-refresh.css      .pg secondary pages
    mobile-adapt.css      small-screen adjustments
    secondary-refine.css  inquiry form and secondary-page polish
  pages/                one file per page type (home, product detail, directory, selector …)
  legacy/               older layers still used by 5 hub pages (applications and three product family hubs)
  css.manifest.json     bundle -> ordered list of source files
```

## Workflow

1. Edit the file that owns the component (search for its class prefix, e.g. `.pd-`, `.sel-`, `.tr-home`).
2. Run `python tools/build_css.py` — rebuilds bundles, gives them content-hashed names and updates every page's `<link data-css-bundle>`.
3. Commit `src/css`, `dist/assets/css` and the touched HTML together. CI runs `python tools/build_css.py --check` and fails if they are out of sync.

## Rules

- **No new "fix" files.** The previous setup grew to 43 files such as `ux-refine-v5…v8`, `ux-fix-v9`, `site-polish-v40`, each overriding the last. Change the owning rule instead.
- **Order is the cascade.** A file later in a bundle wins ties. A new page type gets its own file in `pages/` and its own bundle in the manifest.
- **Tokens first.** Use `var(--tr-…)` colours from `tokens.css`; add a token rather than a new hex value.
- **New components get a prefix** (`.sel-` for the selector) and no `!important`, unless it must beat an existing forced rule — then say so in a comment.

## Known debt (next phase)

- About 550 `!important` declarations (843 before the refactor) and `html body …` selectors remain from the patch era. They are safe to remove one component at a time, checked with screenshots.
- The `legacy-hub` and `applications` bundles still load 16 legacy layers. Moving those five pages onto the `core` + `pages` system removes them entirely.
