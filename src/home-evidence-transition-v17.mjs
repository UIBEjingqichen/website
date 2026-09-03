import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const home = path.join(dist, "index.html");
const cssSrc = path.join(__dirname, "home-evidence-transition-v17.css");
const cssDst = path.join(dist, "assets", "css", "home-evidence-transition-v17.css");

if (!fs.existsSync(home)) throw new Error("dist/index.html not found");
fs.mkdirSync(path.dirname(cssDst), { recursive: true });
fs.copyFileSync(cssSrc, cssDst);

let html = fs.readFileSync(home, "utf8");
if (!html.includes("home-evidence-transition-v17.css")) {
  html = html.replace("</head>", '  <link rel="stylesheet" href="assets/css/home-evidence-transition-v17.css">\n</head>');
}

// The homepage already presents project cases and manufacturing immediately above.
// Remove the duplicated proof-card pair under the certificate carousel so the
// evidence section can transition directly into News.
html = html.replace(/<div class="v5-proof-grid">[\s\S]*?<\/div>\s*<\/section>/, "</section>");

fs.writeFileSync(home, html, "utf8");
console.log("Homepage certificate presentation refined and duplicated proof cards removed.");
