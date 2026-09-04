# Website source structure

The official build entry is `website-build.mjs`, called by `npm run build`.

Canonical pipelines:

- `site-foundation.mjs` for the base site, knowledge center and global visual foundation.
- `catalog-pipeline.mjs` for catalog generation and catalog refinements.
- `products-pipeline.mjs` for product range pages, product media and evidence normalization.
- `home-pipeline.mjs` for homepage capability, project and news sections.
- `applications-pipeline.mjs` for applications and project presentation.
- `manufacturing-pipeline.mjs` for manufacturing presentation.
- `company-build.mjs` for the Company / About page.
- `site-finalize.mjs` for final shared layout and density passes.

Files with old `vNN` names are internal migration stages retained only to preserve the current approved output. Do not add them directly to `package.json` or GitHub workflows. New work should update a canonical pipeline or replace an internal stage instead of adding another version layer.

`media-preflight.mjs` restores the canonical Catalog V3 reference media before product-page validation. `site-smoke-check.mjs` is the single post-build health check used by CI.
