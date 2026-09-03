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
fs.writeFileSync(home, html, "utf8");
console.log("Homepage map-to-evidence transition and certificate presentation refined.");
