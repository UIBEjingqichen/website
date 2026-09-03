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
  console.log("Product refinement skipped: dist/products.html not found.");
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

/* Use a true full-width site photo for the hero. The previous isolated transformer image contains composition space that reads as an empty right column on wide screens. */
html = html.replace(
  '<div class="media"><img src="assets/media/products/power-transformers/oil-immersed-power-transformer-installed.png" alt="Tianyu power transformer"></div>',
  '<div class="media"><img src="assets/media/applications/grid-substation-yard.jpeg" alt="Tianyu transformer substation project"></div>'
);

const quickNav = `<nav class="v20-product-jump" aria-label="Product quick navigation"><div class="v20-product-jump-inner"><span class="v20-product-jump-label">Quick navigation</span><a href="#all-platforms">All Products</a><a href="#power-transformers">Power Transformers</a><a href="#distribution-transformers">Distribution Transformers</a><a href="#special-transformers">Special &amp; Renewable</a><a href="#prefabricated-substations">Prefabricated Substations</a></div></nav>`;

if (!html.includes("v20-product-jump")) {
  html = html.replace(/(<section class="v3p-index-hero">[\s\S]*?<\/section>)/, `$1\n${quickNav}`);
}

fs.writeFileSync(productsFile, html, "utf8");
console.log("Applied product-page hero, quick navigation and card-rhythm refinement.");
