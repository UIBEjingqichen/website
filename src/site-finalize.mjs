import { runStages } from "./pipeline-runner.mjs";

runStages("Final site pass", [
  "copy-cleanup-v24.mjs",
  "applications-pipeline.mjs",
  "manufacturing-pipeline.mjs",
  "site-density-v36.mjs",
  "home-density-v37.mjs",
  "home-refine-v38.mjs",
  "company-build.mjs",
  "site-typography.mjs",
  "visual-system-phase1.mjs",
  "representative-page-polish.mjs",
  "product-taxonomy-v39.mjs",
  "product-detail-guard-v40.mjs",
  "product-reference-table-v41.mjs",
  "product-hero-carousel-v42.mjs",
]);
