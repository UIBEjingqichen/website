import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const selections = [
  {
    from: "assets/media/products/classified/12kv-oil-immersed-distribution-transformer/01.webp",
    to: "assets/media/products/classified/12kv-oil-immersed-distribution-transformer/02.webp",
  },
  {
    from: "assets/media/products/classified/dry-type-distribution-transformer/01.jpg",
    to: "assets/media/products/classified/dry-type-distribution-transformer/03.jpeg",
  },
];

for (const { to } of selections) {
  const asset = path.join(dist, ...to.split("/"));
  if (!fs.existsSync(asset)) throw new Error(`v48: selected thumbnail is missing: ${to}`);
}

function update(rel, prefix = "") {
  const file = path.join(dist, ...rel.split("/"));
  if (!fs.existsSync(file)) throw new Error(`v48: page missing: ${rel}`);
  let html = fs.readFileSync(file, "utf8");
  for (const { from, to } of selections) {
    html = html.split(`${prefix}${from}`).join(`${prefix}${to}`);
  }
  if (!html.includes('data-v48-clean-thumbnails="true"')) {
    html = html.replace(/<body\b/i, '<body data-v48-clean-thumbnails="true"');
  }
  fs.writeFileSync(file, html, "utf8");
}

update("products.html");
update("products/oil-immersed-distribution-transformer/index.html", "../../");

const directory = fs.readFileSync(path.join(dist, "products.html"), "utf8");
const family = fs.readFileSync(path.join(dist, "products", "oil-immersed-distribution-transformer", "index.html"), "utf8");
for (const expected of [
  "classified/12kv-oil-immersed-distribution-transformer/02.webp",
  "classified/dry-type-distribution-transformer/03.jpeg",
]) {
  if (!directory.includes(expected) || !family.includes(expected)) {
    throw new Error(`v48: clean thumbnail selection did not reach both product views: ${expected}`);
  }
}

console.log("v48 distribution thumbnails updated to cleaner product photography.");
