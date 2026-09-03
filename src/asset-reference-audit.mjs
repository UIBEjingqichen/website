import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const imageExt = /\.(?:png|jpe?g|webp|gif|svg|avif|bmp|ico)(?:[?#].*)?$/i;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function normalizeRef(raw) {
  let ref = String(raw || "").trim().replace(/^['\"]|['\"]$/g, "");
  if (!ref) return null;
  // HTML file inputs often contain accept lists such as
  // ".pdf,.doc,.jpg,.png". They are not asset URLs.
  if (ref.includes(",")) return null;
  if (/^(?:https?:|data:|blob:|mailto:|tel:|javascript:|#|\/\/)/i.test(ref)) return null;
  ref = ref.split("#")[0].split("?")[0].trim();
  if (!imageExt.test(ref)) return null;
  try { ref = decodeURIComponent(ref); } catch {}
  return ref;
}

function resolveRef(origin, ref) {
  if (ref.startsWith("/")) return path.join(dist, ref.slice(1));
  return path.resolve(path.dirname(origin), ref);
}

const checkedFiles = walk(dist).filter((f) => /\.(?:html|css|js)$/i.test(f));
const missingMap = new Map();
let referenceCount = 0;

for (const file of checkedFiles) {
  const text = fs.readFileSync(file, "utf8");
  const refs = [];

  if (/\.html$/i.test(file)) {
    for (const m of text.matchAll(/\b(?:src|poster)\s*=\s*["']([^"']+)["']/gi)) refs.push(m[1]);
    for (const m of text.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)) {
      for (const candidate of m[1].split(",")) refs.push(candidate.trim().split(/\s+/)[0]);
    }
  }

  // Covers stylesheets, inline CSS and JS strings that point at image files.
  for (const m of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) refs.push(m[1]);
  for (const m of text.matchAll(/["']([^"']+\.(?:png|jpe?g|webp|gif|svg|avif|bmp|ico)(?:[?#][^"']*)?)["']/gi)) refs.push(m[1]);

  for (const raw of refs) {
    const ref = normalizeRef(raw);
    if (!ref) continue;
    referenceCount += 1;
    const target = resolveRef(file, ref);
    if (fs.existsSync(target)) continue;
    const origin = path.relative(dist, file).replaceAll("\\", "/");
    const key = `${origin}\u0000${ref}`;
    missingMap.set(key, {
      origin,
      reference: ref.replaceAll("\\", "/"),
      resolved: path.relative(dist, target).replaceAll("\\", "/"),
    });
  }
}

const missing = [...missingMap.values()].sort((a, b) =>
  `${a.origin}:${a.reference}`.localeCompare(`${b.origin}:${b.reference}`)
);
const report = {
  generated_at: new Date().toISOString(),
  scanned_files: checkedFiles.length,
  image_references_checked: referenceCount,
  missing_count: missing.length,
  missing,
};

fs.writeFileSync(
  path.join(dist, "asset-reference-audit.json"),
  JSON.stringify(report, null, 2) + "\n"
);

if (missing.length) {
  console.error(`Asset reference audit found ${missing.length} missing local image references.`);
  for (const item of missing.slice(0, 80)) {
    console.error(`  ${item.origin} -> ${item.reference}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Asset reference audit passed: ${referenceCount} local image references checked.`);
}
