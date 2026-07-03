import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { rfqPage } from "./rfq-page.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, "rfq.html"), rfqPage());
console.log("RFQ selector page generated");
