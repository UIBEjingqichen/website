import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const productsFile = path.join(dist, "products.html");
const cssSource = path.join(__dirname, "product-page-refine-v19.css");
const cssTarget = path.join(dist, "assets", "css", "product-page-refine-v19.css");

if (!fs.existsSync(productsFile)) {
  console.log("Product V19 refinement skipped: dist/products.html not found.");
  process.exit(0);
}

fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);

let html = fs.readFileSync(productsFile, "utf8");

if (!html.includes("product-page-refine-v19.css")) {
  html = html.replace("</head>", '  <link rel="stylesheet" href="assets/css/product-page-refine-v19.css">\n</head>');
}

html = html.replace(/<body class="([^"]*)">/, (match, classes) => {
  const next = new Set(classes.split(/\s+/).filter(Boolean));
  next.add("v19-products-page");
  return `<body class="${[...next].join(" ")}">`;
});

html = html.replace(
  "Transformers and prefabricated substations for power, distribution and renewable projects.",
  "Transformer &amp; Prefabricated Substation Solutions"
);
html = html.replace(
  "Browse by transformer role first, then by voltage, capacity or application. Product navigation uses engineering terms that international buyers can read without decoding domestic model numbers.",
  "Power, distribution and renewable-energy equipment organized by transformer role, voltage, capacity and application."
);
html = html.replace(
  "Four routes into Tianyu's transformer portfolio",
  "Explore by product family"
);

fs.writeFileSync(productsFile, html, "utf8");
console.log("Applied V19 homepage-style refinement to the product portfolio page.");
