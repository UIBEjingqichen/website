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

console.log("v47 three-family layout polish applied.");
