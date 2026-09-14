import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const cssSource = path.join(__dirname, "product-architecture-fix-v47.css");

function appendCss(target) {
  if (!fs.existsSync(target)) return;
  const current = fs.readFileSync(target, "utf8");
  if (current.includes("v47: final three-family layout polish")) return;
  const css = fs.readFileSync(cssSource, "utf8");
  fs.writeFileSync(target, `${current.trimEnd()}\n\n${css.trim()}\n`, "utf8");
}

for (const rel of [
  ["assets", "css", "visual-system.css"],
  ["assets", "css", "product-directory.css"],
  ["assets", "css", "site-v3-upgrade.css"],
]) appendCss(path.join(dist, ...rel));

const familyFile = path.join(dist, "products", "oil-immersed-distribution-transformer", "index.html");
if (fs.existsSync(familyFile)) {
  let html = fs.readFileSync(familyFile, "utf8");
  html = html.replace(/(<body\b[^<]*class="[^"]*v46-distribution-family[^"]*")(?=<header)/i, "$1>");
  if (!/<body\b[^>]*class="[^"]*v46-distribution-family[^"]*"[^>]*>/i.test(html)) {
    throw new Error("v47: distribution family body tag is malformed");
  }
  fs.writeFileSync(familyFile, html, "utf8");
}

const cleanPrefabCovers = {
  "zgs-prefabricated-substation": "02.webp",
  "yb-prefabricated-substation": "02.webp",
  "ybh-prefabricated-substation": "02.jpeg",
};

for (const [slug, cover] of Object.entries(cleanPrefabCovers)) {
  const file = path.join(dist, "products", slug, "index.html");
  if (!fs.existsSync(file)) throw new Error(`v47: missing prefab detail page ${slug}`);
  let html = fs.readFileSync(file, "utf8");
  const oldRelative = `../../assets/media/products/classified/${slug}/01.png`;
  const newRelative = `../../assets/media/products/classified/${slug}/${cover}`;
  const oldAbsolute = `/assets/media/products/classified/${slug}/01.png`;
  const newAbsolute = `/assets/media/products/classified/${slug}/${cover}`;
  html = html.split(oldRelative).join(newRelative);
  html = html.split(oldAbsolute).join(newAbsolute);
  html = html.replace(/(<meta\s+property=["']og:image["']\s+content=["'])[^"']+(["'][^>]*>)/i, `$1${newAbsolute}$2`);
  if (html.includes(`classified/${slug}/01.png`)) {
    throw new Error(`v47: captioned prefab cover still referenced by ${slug}`);
  }
  if (!html.includes(`classified/${slug}/${cover}`)) {
    throw new Error(`v47: clean prefab cover missing from ${slug}`);
  }
  fs.writeFileSync(file, html, "utf8");
}

console.log("v47 three-family layout polish applied with caption-free prefab detail media.");
