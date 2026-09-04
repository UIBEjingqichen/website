import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

export function runStages(scope, stages) {
  console.log(`\n=== ${scope} ===`);
  for (const stage of stages) {
    const absolute = path.join(__dirname, stage);
    console.log(`→ ${stage}`);
    const result = spawnSync(process.execPath, [absolute], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}
