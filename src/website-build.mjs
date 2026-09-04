import { runStages } from "./pipeline-runner.mjs";

runStages("Tianyu website build", [
  "site-foundation.mjs",
  "catalog-pipeline.mjs",
  "products-pipeline.mjs",
  "home-pipeline.mjs",
  "site-finalize.mjs",
]);

console.log("\nWebsite and catalog build completed through canonical pipelines.");
