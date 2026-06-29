import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distIndexPath = path.join(root, "dist", "index.html");
const rootIndexPath = path.join(root, "index.html");

let html = fs.readFileSync(distIndexPath, "utf8");

if (!html.includes("<base href=\"dist/\">")) {
  html = html.replace(
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <base href=\"dist/\">"
  );
}

fs.writeFileSync(rootIndexPath, html);
console.log("Root preview index generated from dist/index.html");
