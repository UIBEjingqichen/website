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

// Homepage company snapshot: use official catalog scale/capability data instead of
// internal website counters. The establishment year is intentionally not changed
// here because the existing website (1996) and supplied catalog (1995) still need
// company-side reconciliation.
const companyStats = `<div class="yw-stat-grid"><article><small>01</small><strong>220 kV</strong><span>R&amp;D &amp; Manufacturing Capability</span></article><article><small>02</small><strong>30+</strong><span>Product Series</span></article><article><small>03</small><strong>317 mu</strong><span>Site Area</span></article><article><small>04</small><strong>100,000 m²</strong><span>Plant Area</span></article></div>`;

html = html.replace(/<div class="yw-stat-grid">[\s\S]*?<\/div>/, companyStats);

// Secondary proof strip: focus on factory scale and test capability. These values
// are published in the supplied Tianyu transformer catalog and remain separate
// from model-specific third-party certification evidence elsewhere on the site.
const capabilityStrip = `<section class="v3-capability-strip" data-v3-home-capability aria-label="Tianyu manufacturing and test capability"><div><span>Large mechanical equipment</span><strong>460 units / sets</strong></div><div><span>Supporting test equipment</span><strong>60 types</strong></div><div><span>Large main transformers</span><strong>1,200 / year</strong></div><div><span>Distribution transformers</span><strong>12,000 / year</strong></div><div><span>Lightning impulse test system</span><strong>2,400 kV</strong></div></section>`;

html = html.replace(/<section class="v3-capability-strip"[\s\S]*?<\/section>/, capabilityStrip);

fs.writeFileSync(file, html);
console.log("Homepage company/catalog metrics updated.");
