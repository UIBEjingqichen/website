import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { products } from "./products-data.mjs";
import { documents } from "./documents-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "..", "dist");
const esc = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[character]));
const slugify = (value = "") => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function productDocuments(product) {
  const ids = new Set(product.evidenceIds || []);
  return documents.filter((document) => ids.has(document.id));
}

function exactVariants(product) {
  const grouped = new Map();
  for (const document of productDocuments(product)) {
    if (!document.testedModel) continue;
    if (!grouped.has(document.testedModel)) grouped.set(document.testedModel, []);
    grouped.get(document.testedModel).push(document);
  }
  if (!grouped.size) {
    const model = (product.productRange || []).find(([label]) => /recorded model/i.test(label))?.[1] || product.name;
    return [{ model, docs: productDocuments(product), image: product.gallery?.[0]?.[0] }];
  }
  return [...grouped.entries()].map(([model, docs]) => {
    const representative = docs.find((document) => document.previewImages?.some((image) => image.includes("product-photo"))) || docs[0];
    const image = representative.previewImages?.find((item) => item.includes("product-photo")) || product.gallery?.[0]?.[0];
    return { model, docs, representative, image };
  });
}

for (const product of products) {
  for (const variant of exactVariants(product)) {
    const file = path.join(dist, "products", product.slug, `${slugify(variant.model)}.html`);
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, "utf8");
    const image = `../../assets/media/${variant.image}`;
    html = html.replace(/<div class="v5-model-gallery">[\s\S]*?<\/div><div class="v5-model-summary">/, `<div class="v5-model-gallery"><img class="v5-model-main-image" src="${image}" alt="${esc(variant.model)}"></div><div class="v5-model-summary">`);
    const ratedPower = variant.representative?.ratedPower || "project-rated";
    const ratedVoltage = variant.representative?.ratedVoltage || "";
    const overview = variant.representative
      ? `${variant.model} is a ${ratedPower} ${ratedVoltage} configuration within the ${product.name} family. The documents below are tied to this exact tested model. Final accessories, tapping, impedance, losses and project interfaces are reviewed against the customer specification.`
      : `${variant.model} is presented as a recorded configuration within the ${product.name} family. Final ratings and project interfaces are confirmed against the customer specification.`;
    html = html.replace(/<div class="v5-model-overview-copy">[\s\S]*?<\/div><div class="v5-feature-grid">/, `<div class="v5-model-overview-copy"><p class="eyebrow">PRODUCT OVERVIEW</p><h2>${esc(variant.model)}</h2><p>${esc(overview)}</p></div><div class="v5-feature-grid">`);
    fs.writeFileSync(file, html);
  }
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".html")) {
      let html = fs.readFileSync(full, "utf8");
      html = html.replace(/<a href="((?:\.\.\/)*)products\.html#products">Prefabricated Substation<\/a>/g, (_, prefix) => `<a href="${prefix}products/dry-type-prefabricated-substation/">European-Type Substation</a><a href="${prefix}products/oil-immersed-prefabricated-substation/">Oil-Immersed Prefabricated Substation</a>`);
      fs.writeFileSync(full, html);
    }
  }
}
walk(dist);

console.log("Applied V5.1 exact-model media and product navigation fixes.");
