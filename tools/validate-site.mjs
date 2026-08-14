import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const forbidden = /To be confirmed|Drawing to be provided|Test report sample to be provided|Lorem|TODO/gi;
const htmlFiles = [];
const issues = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith(".html")) htmlFiles.push(target);
  }
}

function localTarget(file, raw) {
  if (!raw || /^(https?:|mailto:|tel:|data:|javascript:|#|\/)/i.test(raw)) return null;
  const clean = raw.split(/[?#]/)[0];
  if (!clean) return null;
  let target = path.resolve(path.dirname(file), clean);
  if (clean.endsWith("/")) target = path.join(target, "index.html");
  return target;
}

walk(dist);
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const matches = [...html.matchAll(forbidden)];
  if (matches.length) issues.push(`${path.relative(dist, file)}: forbidden text ${[...new Set(matches.map((item) => item[0]))].join(", ")}`);
  for (const match of html.matchAll(/<(?:a|link|script|img)[^>]+(?:href|src)="([^"]+)"/gi)) {
    const target = localTarget(file, match[1]);
    if (target && !fs.existsSync(target)) issues.push(`${path.relative(dist, file)}: missing local target ${match[1]}`);
  }
  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt="[^"]*"/i.test(match[1])) issues.push(`${path.relative(dist, file)}: image missing alt attribute`);
  }
}

const products = JSON.parse(fs.readFileSync(path.join(dist, "data", "products.json"), "utf8"));
const documents = JSON.parse(fs.readFileSync(path.join(dist, "data", "documents.json"), "utf8"));
const projects = JSON.parse(fs.readFileSync(path.join(dist, "data", "projects.json"), "utf8"));
if (products.length !== 6) issues.push(`Expected 6 products, found ${products.length}`);
if (documents.filter((item) => item.pdf).length !== 19) issues.push(`Expected 19 supplied PDFs, found ${documents.filter((item) => item.pdf).length}`);
if (projects.length !== 36) issues.push(`Expected 36 projects, found ${projects.length}`);

const requiredPages = ["index.html", "products.html", "applications.html", "resources.html", "about.html", "manufacturing.html", "quality.html", "contact.html"];
for (const page of requiredPages) if (!fs.existsSync(path.join(dist, page))) issues.push(`Missing required page: ${page}`);
for (const product of products) if (!fs.existsSync(path.join(dist, "products", product.slug, "index.html"))) issues.push(`Missing product page: ${product.slug}`);

if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}
console.log(JSON.stringify({
  htmlFiles: htmlFiles.length,
  productFamilies: products.length,
  suppliedPdfs: documents.filter((item) => item.pdf).length,
  pendingDocumentRecords: documents.filter((item) => !item.pdf).length,
  projectRecords: projects.length,
  status: "pass"
}, null, 2));
