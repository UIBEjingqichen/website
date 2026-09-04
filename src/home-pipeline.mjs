import { runStages } from "./pipeline-runner.mjs";

runStages("Homepage", [
  "home-ui-finalize.mjs",
  "home-capabilities-map-v14.mjs",
  "home-capabilities-refine-v15.mjs",
  "home-project-map-v16.mjs",
  "home-evidence-transition-v17.mjs",
  "home-news-refine-v18.mjs",
  "home-image-cleanup-v13.mjs",
]);
