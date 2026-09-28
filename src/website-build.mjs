import { runStages } from "./pipeline-runner.mjs";

runStages("Tianyu website build", [
  "site-foundation.mjs",
  "catalog-pipeline.mjs",
  "products-pipeline.mjs",
  "home-pipeline.mjs",
  "site-finalize.mjs",
  "catalog-product-focus.mjs",
  "catalog-v8-web-update.mjs",
  "home-energy-flow.mjs",
  "home-product-showcase.mjs",
  "site-experience.mjs",
  "industrial-editorial.mjs",
  "site-hygiene.mjs",
]);

console.log("\nWebsite and catalog build completed through canonical pipelines.");
