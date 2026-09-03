import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "..", "dist");

const externalHeroes = {
  "products.html": "https://images.unsplash.com/photo-1777734794648-2bd10e93f0b2?auto=format&fit=crop&fm=jpg&q=82&w=2400",
  "applications.html": "https://images.unsplash.com/photo-1509390559807-3144e7d29097?auto=format&fit=crop&fm=jpg&q=82&w=2400",
  "resources.html": "https://images.unsplash.com/photo-1780034766228-3fd70d9463c3?auto=format&fit=crop&fm=jpg&q=82&w=2200",
  "about.html": "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?auto=format&fit=crop&fm=jpg&q=82&w=2400",
  "news.html": "https://images.unsplash.com/photo-1758789667762-56175fe4601c?auto=format&fit=crop&fm=jpg&q=82&w=2400"
};

function depthFor(file) {
  const relative = path.relative(path.dirname(file), dist).replace(/\\/g, "/");
  return relative ? `${relative}/` : "";
}

function injectAssets(html, depth = "") {
  if (!html.includes("ux-refine-v8.css")) {
    html = html.replace("</head>", `    <link rel="stylesheet" href="${depth}assets/css/ux-refine-v8.css">\n</head>`);
  }
  if (!html.includes("ux-refine-v8.js")) {
    html = html.replace("</body>", `    <script src="${depth}assets/js/ux-refine-v8.js"></script>\n</body>`);
  }
  return html;
}

function addBodyClass(html, className) {
  if (/<body class="[^"]*">/.test(html)) {
    return html.replace(/<body class="([^"]*)">/, (_, classes) => {
      const all = new Set(classes.split(/\s+/).filter(Boolean));
      all.add(className);
      return `<body class="${[...all].join(" ")}">`;
    });
  }
  return html.replace("<body>", `<body class="${className}">`);
}

function replacePrimaryHeroImage(html, url) {
  return html.replace(
    /(<article class="v6-hero-slide active"[^>]*>[\s\S]*?<img src=")[^"]+("[^>]*>)/,
    `$1${url}$2`
  );
}

function updatePage(name) {
  const file = path.join(dist, name);
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, "utf8");
  if (externalHeroes[name]) html = replacePrimaryHeroImage(html, externalHeroes[name]);
  html = addBodyClass(html, "v8-top-page");
  html = injectAssets(html, depthFor(file));
  fs.writeFileSync(file, html);
}

function updateHome() {
  const file = path.join(dist, "index.html");
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, "utf8");
  html = addBodyClass(html, "v8-home");
  html = injectAssets(html);
  fs.writeFileSync(file, html);
}

function injectAllProductPages(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) injectAllProductPages(full);
    else if (entry.isFile() && entry.name.endsWith(".html")) {
      let html = fs.readFileSync(full, "utf8");
      html = injectAssets(html, depthFor(full));
      fs.writeFileSync(full, html);
    }
  }
}

fs.mkdirSync(path.join(dist, "assets", "css"), { recursive: true });
fs.mkdirSync(path.join(dist, "assets", "js"), { recursive: true });
fs.copyFileSync(path.join(__dirname, "ux-refine-v8.css"), path.join(dist, "assets", "css", "ux-refine-v8.css"));
fs.copyFileSync(path.join(__dirname, "ux-refine-v8.js"), path.join(dist, "assets", "js", "ux-refine-v8.js"));

updateHome();
for (const name of Object.keys(externalHeroes)) updatePage(name);
injectAllProductPages(path.join(dist, "products"));

console.log("Applied V8: softer industrial palette, unified metrics band, scroll-reveal motion, and independently sourced hero imagery.");
