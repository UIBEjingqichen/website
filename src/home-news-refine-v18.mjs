import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const home = path.join(dist, "index.html");
const cssSrc = path.join(__dirname, "home-news-refine-v18.css");
const cssDst = path.join(dist, "assets", "css", "home-news-refine-v18.css");

if (!fs.existsSync(home)) throw new Error("dist/index.html not found");
fs.mkdirSync(path.dirname(cssDst), { recursive: true });
fs.copyFileSync(cssSrc, cssDst);

let html = fs.readFileSync(home, "utf8");
html = html.replace(/<h2>TRANSFORMER INFORMATION NEWS<\/h2>/g, "<h2>Technical News &amp; Knowledge</h2>");
if (!html.includes("home-news-refine-v18.css")) {
  html = html.replace("</head>", '  <link rel="stylesheet" href="assets/css/home-news-refine-v18.css">\n</head>');
}
fs.writeFileSync(home, html, "utf8");
console.log("Homepage news typography and spacing refined.");
