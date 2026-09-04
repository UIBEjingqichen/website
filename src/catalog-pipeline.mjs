import { runStages } from "./pipeline-runner.mjs";

runStages("Catalog", [
  "catalog-content-sync.mjs",
  "catalog-build.mjs",
  "catalog-enrich-v2.mjs",
  "catalog-fix-v2-1.mjs",
  "catalog-remove-backcover.mjs",
  "catalog-refine-v3.mjs",
  "catalog-refine-v4.mjs",
  "catalog-cleanup-v4-1.mjs",
  "catalog-layout-v5.mjs",
  "catalog-layout-v6.mjs",
  "catalog-copy-cleanup-v6-1.mjs",
  "catalog-layout-v7.mjs",
  "catalog-core-parameters-v8.mjs",
  "catalog-layout-v9.mjs",
  "catalog-layout-v10.mjs",
  "catalog-layout-v11.mjs",
  "catalog-v3-refresh.mjs",
  "catalog-v3-finalize.mjs",
]);
