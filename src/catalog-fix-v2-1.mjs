import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "dist", "catalog.html");

if (!fs.existsSync(catalogPath)) throw new Error("dist/catalog.html is missing.");
let html = fs.readFileSync(catalogPath, "utf8");
html = html.replace('<span>Evidence Files</span><strong>19</strong>', '<span>Evidence Records</span><strong>20</strong>');
fs.writeFileSync(catalogPath, html);
console.log("Aligned catalog company metrics with the complete 20-record evidence register.");