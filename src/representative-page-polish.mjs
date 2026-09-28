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
  const evidence = `<section class="ty-system__home-evidence" aria-labelledby="home-evidence-title"><div class="ty-product__shell"><header class="ty-system__home-evidence-head"><div><p class="ty-product__kicker">Factory &amp; Application Evidence</p><h2 id="home-evidence-title">Manufacturing and operating environments</h2></div><p>Selected factory and application views complement the manufacturing, testing and project evidence above without repeating the same capability metrics.</p></header><div class="ty-system__home-evidence-grid"><figure><img src="assets/media/company/factory-campus-panorama.jpeg" alt="Tianyu Electric manufacturing campus" loading="lazy"><figcaption>Manufacturing campus</figcaption></figure><figure><img src="assets/media/factory/dry-type-prefabricated-substation-assembly-01.webp" alt="Prefabricated substation factory assembly" loading="lazy"><figcaption>Prefabricated substation assembly</figcaption></figure><figure><img src="assets/media/applications/grid-substation-yard.jpeg" alt="Grid substation application environment" loading="lazy"><figcaption>Grid substation environment</figcaption></figure><figure><img src="assets/media/applications/utility-scale-solar-farm-aerial-01.jpeg" alt="Utility-scale photovoltaic application environment" loading="lazy"><figcaption>Utility-scale photovoltaic environment</figcaption></figure></div></div></section><section class="ty-system__home-cta"><div class="ty-product__shell"><div><p class="ty-product__kicker">Project Inquiry</p><h2>Discuss your transformer or substation requirements.</h2><p>Share the application, ratings, site conditions and required documents for engineering review.</p></div><div class="ty-system__home-cta-actions"><a class="ty-system__button" href="products.html">Browse products</a><button class="ty-system__button primary" type="button" data-quote-open>Request RFQ</button></div></div></section>`;
  const tailPattern = /<section class="ty-home__landscape iq-landscape">[\s\S]*?<\/section>\s*<section class="v3-capability-strip"[\s\S]*?<\/section>/;
  if (!tailPattern.test(html)) throw new Error("Homepage evidence tail not found for Task A polish");
  html = html.replace(tailPattern, evidence);
  write(file, html);
  return html;
}

function polishProducts() {
  const [file, source] = read("products.html");
  let html = source;
  html = html.replace(/<p class="ty-product__kicker">Product Family<\/p>/g, "");
  write(file, html);
}

function polishDetail() {
  const [file, source] = read("products/110kv-power-transformer/index.html");
  let html = source;
  html = html.replace(/<figure class="ty-product__photo "><img src="([^\"]+)" alt="([^\"]+)" loading="lazy"><\/figure>/g, '<figure class="ty-product__photo ty-system__product-photo"><img src="$1" alt="$2" loading="lazy"></figure>');
  html = html.replace('class="ty-system__drawing-open" type="button" data-drawing-open', 'class="ty-system__drawing-open" type="button" data-drawing-thumb data-drawing-open');
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
