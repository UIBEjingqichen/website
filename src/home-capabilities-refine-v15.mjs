import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const home = path.join(dist, "index.html");
const cssSrc = path.join(__dirname, "home-capabilities-refine-v15.css");
const jsSrc = path.join(__dirname, "home-capabilities-refine-v15.js");
const cssDst = path.join(dist, "assets", "css", "home-capabilities-refine-v15.css");
const jsDst = path.join(dist, "assets", "js", "home-capabilities-refine-v15.js");

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });
const copy = (from, to) => {
  if (!fs.existsSync(from)) return;
  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
};

const mediaCopies = [
  ["factory/large-oil-transformer-winding-line.png", "factory/large-oil-transformer-winding-line.png"],
  ["factory/large-transformer-test-station.png", "factory/large-transformer-test-station.png"],
  ["applications/catalog-grid-110kv-substation-project.png", "applications/catalog-grid-110kv-substation-project.png"]
];

function capabilitySection() {
  return `<section class="ty-capabilities-v15" id="manufacturing-support" data-ty15-capabilities><div class="ty15-shell"><p class="ty15-kicker">Manufacturing & Support</p><h2 class="ty15-title">Manufacturing, testing and project support</h2><p class="ty15-lead">A closer look at how Tianyu manufactures, verifies and supports transformer and substation equipment for project delivery.</p><div class="ty15-tabs" role="tablist" aria-label="Manufacturing and support capabilities"><button class="ty15-tab active" type="button" role="tab" aria-selected="true" data-ty15-tab="manufacturing"><span>01</span><strong>Intelligent Manufacturing</strong></button><button class="ty15-tab" type="button" role="tab" aria-selected="false" data-ty15-tab="testing"><span>02</span><strong>Advanced Equipment & Testing</strong></button><button class="ty15-tab" type="button" role="tab" aria-selected="false" data-ty15-tab="support"><span>03</span><strong>Project & After-Sales Support</strong></button></div><div class="ty15-stage"><article class="ty15-panel active" data-ty15-panel="manufacturing"><div class="ty15-media"><img src="assets/media/factory/large-oil-transformer-winding-line.png" alt="Tianyu large oil transformer winding line"></div><div class="ty15-copy"><span class="ty15-index">01 · Manufacturing</span><h3>Intelligent Manufacturing</h3><p>Automated winding, core processing, digital production management and controlled manufacturing processes support transformer production from component preparation through assembly.</p><div class="ty15-facts"><span>Winding</span><span>Core processing</span><span>Digital production</span></div><a href="manufacturing.html">EXPLORE MANUFACTURING →</a></div></article><article class="ty15-panel" data-ty15-panel="testing" hidden><div class="ty15-media"><img src="assets/media/factory/large-transformer-test-station.png" alt="Tianyu large transformer test station"></div><div class="ty15-copy"><span class="ty15-index">02 · Testing</span><h3>Advanced Equipment & Testing</h3><p>Dedicated transformer test facilities and impulse-test equipment support routine testing, agreed FAT and product verification according to the applicable project requirements.</p><div class="ty15-facts"><span>Transformer test station</span><span>Impulse testing</span><span>FAT support</span></div><a href="testing.html">EXPLORE TESTING →</a></div></article><article class="ty15-panel" data-ty15-panel="support" hidden><div class="ty15-media"><img src="assets/media/applications/catalog-grid-110kv-substation-project.png" alt="Tianyu transformer project site reference"></div><div class="ty15-copy"><span class="ty15-index">03 · Project Support</span><h3>Project & After-Sales Support</h3><p>Technical coordination, FAT support, documentation, shipment handover, installation guidance and commissioning assistance are provided according to the agreed project scope.</p><div class="ty15-facts"><span>Technical coordination</span><span>Documentation</span><span>Site assistance</span></div><a href="services.html">EXPLORE SUPPORT →</a></div></article></div></div></section>`;
}

function patchHome() {
  let html = fs.readFileSync(home, "utf8");
  const section = capabilitySection();
  if (/<section class="ty-capabilities(?:-v15)?"[\s\S]*?<\/section>/.test(html)) {
    html = html.replace(/<section class="ty-capabilities(?:-v15)?"[\s\S]*?<\/section>/, section);
  } else {
    const mapIndex = html.indexOf('<section class="ty-projects"');
    html = mapIndex >= 0 ? html.slice(0, mapIndex) + section + html.slice(mapIndex) : html.replace("</main>", section + "</main>");
  }
  if (!html.includes("home-capabilities-refine-v15.css")) {
    html = html.replace("</head>", '  <link rel="stylesheet" href="assets/css/home-capabilities-refine-v15.css">\n</head>');
  }
  if (!html.includes("home-capabilities-refine-v15.js")) {
    html = html.replace("</body>", '  <script src="assets/js/home-capabilities-refine-v15.js"></script>\n</body>');
  }
  fs.writeFileSync(home, html, "utf8");
}

function main() {
  if (!fs.existsSync(home)) throw new Error("dist/index.html not found");
  copy(cssSrc, cssDst);
  copy(jsSrc, jsDst);
  for (const [from, to] of mediaCopies) {
    copy(path.join(root, "source-media", from), path.join(dist, "assets", "media", to));
  }
  patchHome();
  console.log("Homepage capability section refined to tabbed image-led presentation.");
}

main();
