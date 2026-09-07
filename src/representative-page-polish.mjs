import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

function read(relative) {
  const file = path.join(dist, relative);
  if (!fs.existsSync(file)) throw new Error(`Missing generated page: ${relative}`);
  return [file, fs.readFileSync(file, "utf8")];
}
function write(file, html) { fs.writeFileSync(file, html, "utf8"); }

function polishHome() {
  const [file, source] = read("index.html");
  let html = source;
  const evidence = `<section class="vs-home-evidence" aria-labelledby="home-evidence-title"><div class="v3p-shell"><header class="vs-home-evidence-head"><div><p class="v3p-kicker">Factory &amp; Application Evidence</p><h2 id="home-evidence-title">Manufacturing and operating environments</h2></div><p>Selected factory and application views complement the manufacturing, testing and project evidence above without repeating the same capability metrics.</p></header><div class="vs-home-evidence-grid"><figure><img src="assets/media/company/factory-campus-panorama.jpeg" alt="Tianyu Electric manufacturing campus" loading="lazy"><figcaption>Manufacturing campus</figcaption></figure><figure><img src="assets/media/factory/dry-type-prefabricated-substation-assembly-01.webp" alt="Prefabricated substation factory assembly" loading="lazy"><figcaption>Prefabricated substation assembly</figcaption></figure><figure><img src="assets/media/applications/grid-substation-yard.jpeg" alt="Grid substation application environment" loading="lazy"><figcaption>Grid substation environment</figcaption></figure><figure><img src="assets/media/applications/utility-scale-solar-farm-aerial-01.jpeg" alt="Utility-scale photovoltaic application environment" loading="lazy"><figcaption>Utility-scale photovoltaic environment</figcaption></figure></div></div></section><section class="vs-home-cta"><div class="v3p-shell"><div><p class="v3p-kicker">Project Inquiry</p><h2>Discuss your transformer or substation requirements.</h2><p>Share the application, ratings, site conditions and required documents for engineering review.</p></div><div class="vs-home-cta-actions"><a class="vs-button" href="products.html">Browse products</a><button class="vs-button primary" type="button" data-quote-open>Request RFQ</button></div></div></section>`;
  const tailPattern = /<section class="yw-landscape iq-landscape">[\s\S]*?<\/section>\s*<section class="v3-capability-strip"[\s\S]*?<\/section>/;
  if (!tailPattern.test(html)) throw new Error("Homepage evidence tail not found for Task A polish");
  html = html.replace(tailPattern, evidence);
  write(file, html);
  return html;
}

function polishProducts() {
  const [file, source] = read("products.html");
  let html = source;
  html = html.replace(/<p class="v3p-kicker">Product Family<\/p>/g, "");
  write(file, html);
}

function polishDetail() {
  const [file, source] = read("products/110kv-power-transformer/index.html");
  let html = source;
  html = html.replace(/<figure class="v3p-photo "><img src="([^\"]+)" alt="([^\"]+)" loading="lazy"><\/figure>/g, '<figure class="v3p-photo vs-product-photo"><img src="$1" alt="$2" loading="lazy"></figure>');
  html = html.replace('class="vs-drawing-open" type="button" data-drawing-open', 'class="vs-drawing-open" type="button" data-drawing-thumb data-drawing-open');
  write(file, html);
}

function writeRootMirror(homeHtml) {
  let mirror = homeHtml.replace(/\s*<base href="dist\/">/g, "");
  mirror = mirror.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n    <base href="dist/">');
  fs.writeFileSync(path.join(root, "index.html"), mirror, "utf8");
}

const home = polishHome();
polishProducts();
polishDetail();
writeRootMirror(home);
console.log("Representative-page Task A polish applied to homepage, products directory and canonical 110 kV detail page; root homepage mirror refreshed.");
