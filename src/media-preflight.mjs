import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const source = path.join(root, "source-media", "catalog-v3");
const target = path.join(root, "dist", "assets", "media", "catalog-v3");

if (!fs.existsSync(source)) {
  throw new Error("Canonical catalog-v3 media source is missing.");
}

fs.mkdirSync(target, { recursive: true });
let copied = 0;
for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  fs.copyFileSync(path.join(source, entry.name), path.join(target, entry.name));
  copied += 1;
}
console.log(`Catalog V3 media preflight: ${copied} canonical files restored.`);
