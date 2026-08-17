import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "dist", "catalog.html");

if (!fs.existsSync(catalogPath)) throw new Error("dist/catalog.html is missing.");

let html = fs.readFileSync(catalogPath, "utf8");
html = html.replace(/<section class="catalog-sheet back-cover">[\s\S]*?<\/section>/, "");
fs.writeFileSync(catalogPath, html);
console.log("Removed catalog back-cover slogan section.");
