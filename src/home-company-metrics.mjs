import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const file = path.join(root, "dist", "index.html");

if (!fs.existsSync(file)) {
  console.log("Homepage metrics skipped: dist/index.html not found.");
  process.exit(0);
}

let html = fs.readFileSync(file, "utf8");

// Homepage company snapshot: keep the four headline metrics aligned with the
// selected current corporate-catalog figures used elsewhere on the site.
// Do not use 220 kV as a headline company metric here.
const companyStats = `<div class="yw-stat-grid"><article><small>01</small><strong>30+</strong><span>Product Series</span></article><article><small>02</small><strong>85,243 m²</strong><span>Plant Area</span></article><article><small>03</small><strong>460</strong><span>Large Mechanical Equipment</span></article><article><small>04</small><strong>60</strong><span>Supporting Test Equipment Types</span></article></div>`;

html = html.replace(/<div class="yw-stat-grid">[\s\S]*?<\/div>/, companyStats);

// Secondary proof strip: focus on factory scale and test capability.
const capabilityStrip = `<section class="v3-capability-strip" data-v3-home-capability aria-label="Tianyu manufacturing and test capability"><div><span>Large mechanical equipment</span><strong>460 units / sets</strong></div><div><span>Supporting test equipment</span><strong>60 types</strong></div><div><span>Large main transformers</span><strong>1,200 / year</strong></div><div><span>Distribution transformers</span><strong>12,000 / year</strong></div><div><span>Lightning impulse test system</span><strong>2,400 kV</strong></div></section>`;

html = html.replace(/<section class="v3-capability-strip"[\s\S]*?<\/section>/, capabilityStrip);

fs.writeFileSync(file, html);
console.log("Homepage company metrics stabilized: 30+, 85,243 m², 460 and 60.");
