import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "..", "dist");

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".html")) {
      let html = fs.readFileSync(full, "utf8");
      html = html
        .replaceAll(">European-Type Substation<", ">European-Type Prefabricated Substation<")
        .replaceAll(">Combined Transformer<", ">Pad-Mounted Transformer<");
      fs.writeFileSync(full, html);
    }
  }
}

walk(dist);
console.log("Applied V6.1 public product label normalization.");
