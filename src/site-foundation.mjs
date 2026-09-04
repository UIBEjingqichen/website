import { runStages } from "./pipeline-runner.mjs";

runStages("Site foundation", [
  "build.mjs",
  "knowledge-build.mjs",
  "knowledge-finalize.mjs",
  "yawei-refine.mjs",
  "visual-refine-v4.mjs",
  "ux-refine-v5.mjs",
  "ux-fix-v5-1.mjs",
  "ux-refine-v6.mjs",
  "ux-fix-v6-1.mjs",
  "ux-refine-v7.mjs",
  "ux-refine-v8.mjs",
  "ux-fix-v9.mjs",
]);
