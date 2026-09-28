import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const source = path.join(dist, "index.html");
const target = path.join(root, "index.html");

if (!fs.existsSync(source)) throw new Error("v57: dist homepage is missing");

const html = fs.readFileSync(source, "utf8");
const section = html.match(/<section class="ty-product__section ty-product__products-home"[\s\S]*?<\/section>/i)?.[0] || "";
const expectedFamilies = ["Power Transformers", "Distribution Transformers", "Prefabricated Substations"];

if ((section.match(/class="ty-product__family-card"/g) || []).length !== expectedFamilies.length) {
  throw new Error("v57: homepage product-family count is not synchronized with the product directory");
}
for (const family of expectedFamilies) {
  if (!section.includes(`<h3>${family}</h3>`)) throw new Error(`v57: homepage family is missing: ${family}`);
}
if (/Special &(?:amp; )?Renewable Solutions|Dry-Type Transformers/.test(section)) {
  throw new Error("v57: homepage contains a retired top-level product family");
}

for (const match of section.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/gi)) {
  const src = match[1];
  if (/^(?:https?:|data:|\/)/i.test(src)) continue;
  if (!fs.existsSync(path.join(dist, ...src.split("/")))) throw new Error(`v57: homepage image is missing: ${src}`);
}

const mirror = html
  .replace(/<base\b[^>]*>/gi, "")
  .replace("<head>", '<head><base href="dist/">');
fs.writeFileSync(target, mirror, "utf8");

console.log("v57 homepage mirror synchronized from the validated dist homepage.");
