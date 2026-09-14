import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const read = (file) => fs.readFileSync(file, "utf8");
const write = (file, content) => fs.writeFileSync(file, content, "utf8");

const productsFile = path.join(dist, "products.html");
let products = read(productsFile);
products = products.replace(/assets\/media\/products\/classified\/40-5kv-renewable-oil-immersed-transformer\/01\.png/g, "assets/media/products/classified/oil-immersed-distribution-transformer/01.png");
products = products.replace(/Two construction families only: oil-immersed distribution transformers and dry-type distribution transformers\./g, "Oil-immersed and dry-type transformers up to 35 kV.");
write(productsFile, products);

const oilFile = path.join(dist, "products", "oil-immersed-distribution-transformer", "index.html");
let oil = read(oilFile);
oil = oil.replace("The product hierarchy is organized by construction type, not by voltage. Voltage-specific tables below remain as engineering references so 22 kV and 35 kV-class configurations are not lost.", "Published ranges vary by voltage class and project configuration. The tables below retain the standard distribution range, a tested 22 kV reference and the 35 kV-class project range.");
write(oilFile, oil);

const stack = [dist];
let linkUpdates = 0;
while (stack.length) {
  const dir = stack.pop();
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { stack.push(full); continue; }
    if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
    let html = read(full);
    const before = html;
    html = html.replace(/products\/40-5kv-renewable-oil-immersed-transformer\//g, "products/oil-immersed-distribution-transformer/");
    html = html.replace(/\.\.\/40-5kv-renewable-oil-immersed-transformer\//g, "../oil-immersed-distribution-transformer/");
    if (html !== before) {
      write(full, html);
      linkUpdates += 1;
    }
  }
}

const finalProducts = read(productsFile);
if (finalProducts.includes("classified/40-5kv-renewable-oil-immersed-transformer/01.png")) throw new Error("v53: Products hero still uses the old voltage-specific distribution image");
if (!finalProducts.includes("Oil-immersed and dry-type transformers up to 35 kV.")) throw new Error("v53: consolidated distribution directory copy missing");

console.log(`v53 distribution polish: generic distribution hero cover applied, customer-facing range note restored, ${linkUpdates} legacy 40.5 kV link(s) redirected to the consolidated oil-distribution page.`);
