import { runStages } from "./pipeline-runner.mjs";

runStages("Canonical recovery pass", [
  "product-page-refine-v19.mjs",
  "product-hero-split-v21.mjs",
  "home-news-refine-v18.mjs",
  "copy-cleanup-v24.mjs",
  "applications-projects-v26.mjs",
  "modal-center-fix-v27.mjs",
  "manufacturing-v34.mjs",
  "manufacturing-v35-density.mjs",
  "site-density-v36.mjs",
  "home-density-v37.mjs",
  "home-refine-v38.mjs",
  "company-build.mjs",
]);
