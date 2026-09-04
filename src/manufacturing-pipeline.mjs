import { runStages } from "./pipeline-runner.mjs";

runStages("Manufacturing", [
  "manufacturing-v34.mjs",
  "manufacturing-v35-density.mjs",
]);
