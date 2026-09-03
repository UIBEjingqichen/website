import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const planPath = path.join(root, "source-media", "MEDIA_RENAME_PLAN.json");
const distMedia = path.join(root, "dist", "assets", "media");

if (!fs.existsSync(planPath) || !fs.existsSync(distMedia)) {
  console.log("Legacy media aliases skipped: rename plan or dist media missing.");
  process.exit(0);
}

const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const created = [];
const missingTargets = [];
const skippedEvidence = [];

for (const item of plan.renames || []) {
  const oldRel = String(item.old || "").replaceAll("\\", "/");
  const newRel = String(item.new || "").replaceAll("\\", "/");
  if (!oldRel || !newRel || oldRel === newRel) continue;

  // Do not revive old test-report/sample-photo aliases. Those assets belong in
  // evidence only and must not silently become marketing imagery again.
  const evidenceLike =
    oldRel.startsWith("evidence/") ||
    newRel.startsWith("evidence/") ||
    String(item.category || "").startsWith("evidence");
  if (evidenceLike) {
    skippedEvidence.push({ old: oldRel, new: newRel });
    continue;
  }

  const source = path.join(distMedia, newRel);
  const target = path.join(distMedia, oldRel);
  if (fs.existsSync(target)) continue;
  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) {
    missingTargets.push({ old: oldRel, new: newRel });
    continue;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  created.push({ old: oldRel, new: newRel });
}

const report = {
  generated_at: new Date().toISOString(),
  created_count: created.length,
  missing_target_count: missingTargets.length,
  skipped_evidence_count: skippedEvidence.length,
  created,
  missing_targets: missingTargets,
  skipped_evidence: skippedEvidence,
};
fs.writeFileSync(
  path.join(root, "dist", "media-legacy-aliases.json"),
  JSON.stringify(report, null, 2) + "\n"
);

console.log(
  `Legacy media aliases: ${created.length} created, ${missingTargets.length} canonical targets missing, ${skippedEvidence.length} evidence aliases intentionally skipped.`
);
