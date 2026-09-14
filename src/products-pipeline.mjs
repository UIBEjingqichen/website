import { runStages } from "./pipeline-runner.mjs";

runStages("Products", [
  "product-contract-upgrade.mjs",
  "media-preflight.mjs",
  "product-media-compat-v43.mjs",
  "site-v3-upgrade.mjs",
  "image-quality-pass.mjs",
  "evidence-path-normalize.mjs",
  "media-legacy-aliases.mjs",
  "asset-reference-audit.mjs",
  "product-directory-v12.mjs",
  "product-page-refine-v19.mjs",
  "product-hero-split-v21.mjs",
]);
