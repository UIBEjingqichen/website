import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

let filesChanged = 0;
let refsChanged = 0;

for (const file of walk(dist).filter((f) => /\.html$/i.test(f))) {
  const before = fs.readFileSync(file, "utf8");
  let localCount = 0;
  const after = before.replace(
    /assets\/media\/evidence\/([a-z0-9-]+)-product-photo\.webp/gi,
    (_match, id) => {
      const canonical = path.join(
        dist,
        "assets",
        "media",
        "evidence",
        "sample-photo-pages",
        `${id}-sample-photo-page.webp`
      );
      if (!fs.existsSync(canonical)) return _match;
      localCount += 1;
      return `assets/media/evidence/sample-photo-pages/${id}-sample-photo-page.webp`;
    }
  );

  if (after !== before) {
    fs.writeFileSync(file, after);
    filesChanged += 1;
    refsChanged += localCount;
  }
}

console.log(`Evidence path normalization: ${refsChanged} references updated across ${filesChanged} HTML files.`);
