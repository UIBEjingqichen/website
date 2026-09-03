import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const replacements = [
  ["catalog-v3/testing-220kv-lab.webp", "factory/oil-prefabricated-substation-assembly.webp"],
  ["catalog-v3/manufacturing-overview.webp", "factory/combined-transformer-wiring-assembly.webp"],
  ["alt=\"High-voltage transformer testing laboratory\"", "alt=\"Oil-immersed prefabricated substation factory assembly\""],
  ["alt=\"Transformer test laboratory\"", "alt=\"Combined transformer wiring and factory assembly\""],
  ["<figcaption>Transformer test and inspection capability.</figcaption>", "<figcaption>Factory wiring, assembly and integration capability.</figcaption>"],
  ["<figcaption>Manufacturing overview. Composite production imagery is kept as one wide visual rather than repeated across process cards.</figcaption>", "<figcaption>Transformer and prefabricated-substation manufacturing in the Tianyu factory.</figcaption>"]
];

function patchFile(file) {
  if (!fs.existsSync(file) || !file.endsWith(".html")) return;
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  for (const [from, to] of replacements) html = html.split(from).join(to);
  if (html !== before) fs.writeFileSync(file, html, "utf8");
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else patchFile(full);
  }
}

walk(dist);
patchFile(path.join(root, "index.html"));
