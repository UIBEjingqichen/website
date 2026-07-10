import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { knowledgeTopics, knowledgeFaqs, topicBySlug, faqBySlug } from "./knowledge-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const knowledgeDir = path.join(dist, "knowledge");
const faqDir = path.join(knowledgeDir, "faq");
const assetDir = path.join(dist, "assets");
const siteUrl = (process.env.SITE_URL || "").replace(/\/$/, "");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function esc(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
}

function canonicalHref(canonical) {
  return siteUrl ? `${siteUrl}/${canonical}` : `/${canonical}`;
}

function jsonLd(value) {
  return `<script type="application/ld+json">${JSON.stringify(value).replace(/</g, "\\u003c")}</script>`;
}

function nav(active = "") {
  const links = [
    ["Home", "../../index.html"],
    ["Products", "../../products.html"],
    ["Applications & Projects", "../../applications.html"],
    ["News", "../../news.html"],
    ["Knowledge Center", "../index.html"],
    ["Company", "../../about.html"],
    ["Contact", "../../contact.html"]
  ];
  return links.map(([label, href]) => `<a class="${active === label ? "active" : ""}" href="${href}">${esc(label)}</a>`).join("");
}

function knowledgeShell({ title, description, canonical, content, depth = "../", structuredData = "" }) {
  const homeHref = `${depth}index.html`;
  const knowledgeHref = depth === "../../" ? "../index.html" : "index.html";
  const navLinks = [
    ["Home", homeHref],
    ["Products", `${depth}products.html`],
    ["Applications & Projects", `${depth}applications.html`],
    ["News", `${depth}news.html`],
    ["Knowledge Center", knowledgeHref],
    ["Company", `${depth}about.html`],
    ["Contact", `${depth}contact.html`]
  ];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonicalHref(canonical)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonicalHref(canonical)}">
  <link rel="stylesheet" href="${depth}assets/css/styles.css">
  <link rel="stylesheet" href="${depth}assets/css/knowledge.css">
  ${structuredData}
</head>
<body>
  <header class="site-header">
    <a class="brand" href="${homeHref}"><span class="brand-mark">TY</span><span><strong>Tianyu Electric</strong><small>Power Primary Equipment</small></span></a>
    <button class="menu-toggle" aria-label="Open navigation" data-menu-toggle>Menu</button>
    <nav class="main-nav" data-nav data-knowledge-nav>${navLinks.map(([label, href]) => `<a class="${label === "Knowledge Center" ? "active" : ""}" href="${href}">${esc(label)}</a>`).join("")}</nav>
    <div class="header-actions"><span class="language">EN</span><button class="btn btn-primary quote-open" type="button" data-quote-open>Get a Free Quote</button></div>
  </header>
  <main>${content}</main>
  <footer class="footer">
    <div class="footer-grid">
      <div><h2>Tianyu Electric</h2><p>Transformer product information, engineering selection guidance and project inquiry support.</p></div>
      <div><h3>Knowledge</h3><a href="${knowledgeHref}">Knowledge Center</a>${knowledgeTopics.slice(0, 3).map((topic) => `<a href="${depth === "../../" ? `../${topic.slug}.html` : `${topic.slug}.html`}">${esc(topic.name)}</a>`).join("")}</div>
      <div><h3>Products</h3><a href="${depth}products.html#oil-immersed-power-transformer">Oil-Immersed Transformers</a><a href="${depth}products.html#dry-type-transformer">Dry-Type Transformers</a><a href="${depth}products.html#rectifier-transformer">Rectifier Transformers</a></div>
      <div><h3>Contact</h3><a href="${depth}contact.html">Send project requirements</a><a href="${depth}privacy.html">Privacy Policy</a></div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} Tianyu Electric</span><a href="${knowledgeHref}">Transformer Knowledge Center</a></div>
  </footer>
  <div class="quote-modal" data-quote-modal aria-hidden="true">
    <div class="quote-backdrop" data-quote-close></div>
    <section class="quote-panel" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title">
      <button class="quote-close" type="button" aria-label="Close quote form" data-quote-close>×</button>
      <p class="eyebrow">Technical Inquiry</p>
      <h2 id="quote-modal-title">Discuss This Transformer Requirement</h2>
      <p>Provide capacity, voltage, application, destination country and available drawings or technical specifications.</p>
      <form class="quote-form compact">
        <label>Name<input name="name" required></label>
        <label>Email<input name="email" type="email" required></label>
        <label>Company Name<input name="company"></label>
        <label>Product Structure<select name="product_structure"><option value="not_sure">Not Sure / Need Recommendation</option><option value="liquid">Liquid-Immersed / Liquid-Filled Transformer</option><option value="dry">Dry-Type Transformer</option></select></label>
        <label>Primary Technical Function<select name="technical_function"><option value="general">General Purpose</option><option value="k_rated">K-Rated / Nonlinear Load</option><option value="inverter">Inverter Duty</option><option value="harmonic">Harmonic Mitigation</option><option value="isolation">Isolation</option></select></label>
        <label>Country<input name="country"></label>
        <label class="full">Message<textarea name="message" rows="5"></textarea></label>
        <label class="full">Upload File<input name="file" type="file"></label>
        <button class="btn btn-primary" type="submit">Submit Inquiry</button>
      </form>
    </section>
  </div>
  <script src="${depth}assets/js/main.js"></script>
  <script src="${depth}assets/js/knowledge.js"></script>
</body>
</html>`;
}

function breadcrumb(items) {
  return `<nav class="knowledge-breadcrumb" aria-label="Breadcrumb">${items.map(([label, href], index) => href ? `<a href="${href}">${esc(label)}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${esc(label)}</span>`).join("")}</nav>`;
}

function topicCard(topic) {
  const faqCount = knowledgeFaqs.filter((faq) => faq.topic === topic.slug).length;
  return `<a class="knowledge-topic-card" href="${topic.slug}.html" data-search-card data-search-text="${esc(`${topic.name} ${topic.description}`.toLowerCase())}"><span>${String(faqCount).padStart(2, "0")} FAQs</span><h2>${esc(topic.name)}</h2><p>${esc(topic.description)}</p><strong>Explore topic →</strong></a>`;
}

function faqCard(faq, prefix = "faq/") {
  return `<a class="knowledge-faq-card" href="${prefix}${faq.slug}.html" data-search-card data-search-text="${esc(`${faq.question} ${faq.summary} ${faq.relatedTerms.join(" ")}`.toLowerCase())}"><p class="eyebrow">FAQ</p><h3>${esc(faq.question)}</h3><p>${esc(faq.summary)}</p><span>Read engineering answer →</span></a>`;
}

function knowledgeIndexPage() {
  const content = `${breadcrumb([["Home", "../index.html"], ["Knowledge Center", ""]])}
  <section class="knowledge-hero">
    <div><p class="eyebrow">Transformer Knowledge Center</p><h1>Engineering answers for transformer selection and project communication</h1><p>Browse objective explanations of transformer structures, applications, electrical parameters, cooling systems and quotation requirements.</p></div>
    <div class="knowledge-search-panel"><label for="knowledge-search">Search the knowledge base</label><input id="knowledge-search" type="search" placeholder="Try: K-factor, ONAN, impedance, natural ester..." data-knowledge-search><small data-search-status>${knowledgeFaqs.length + knowledgeTopics.length} entries available</small></div>
  </section>
  <section class="section knowledge-topics"><div class="section-head"><div><p class="eyebrow">Browse by topic</p><h2>Knowledge organized around engineering decisions</h2></div></div><div class="knowledge-topic-grid">${knowledgeTopics.map(topicCard).join("")}</div></section>
  <section class="section pale knowledge-faqs"><div class="section-head"><div><p class="eyebrow">Frequently asked questions</p><h2>Start with a specific project question</h2></div></div><div class="knowledge-faq-grid">${knowledgeFaqs.map((faq) => faqCard(faq)).join("")}</div><p class="knowledge-empty" data-search-empty hidden>No matching knowledge entries were found. Try a broader technical term.</p></section>
  <section class="section knowledge-cta"><div><p class="eyebrow">Project-specific review</p><h2>Knowledge pages explain the decision. Project data determines the final design.</h2><p>Send the rated capacity, voltage ratio, application, site conditions and applicable standards for engineering review.</p></div><button class="btn btn-primary" type="button" data-quote-open>Prepare an Inquiry</button></section>`;
  return knowledgeShell({
    title: "Transformer Knowledge Center | Tianyu Electric",
    description: "Transformer FAQs and engineering guidance covering selection, dry-type and liquid-immersed construction, applications, electrical parameters and quotation requirements.",
    canonical: "knowledge/index.html",
    depth: "../",
    content
  });
}

function topicPage(topic) {
  const faqs = knowledgeFaqs.filter((faq) => faq.topic === topic.slug);
  const content = `${breadcrumb([["Home", "../index.html"], ["Knowledge Center", "index.html"], [topic.name, ""]])}
  <section class="knowledge-topic-hero"><p class="eyebrow">Knowledge Topic</p><h1>${esc(topic.name)}</h1><p>${esc(topic.description)}</p></section>
  <section class="section knowledge-topic-layout"><aside><strong>On this page</strong>${topic.sections.map(([heading], index) => `<a href="#section-${index + 1}">${esc(heading)}</a>`).join("")}<a href="#related-faqs">Related FAQs</a></aside><div class="knowledge-prose">${topic.sections.map(([heading, body], index) => `<section id="section-${index + 1}"><h2>${esc(heading)}</h2><p>${esc(body)}</p></section>`).join("")}<section id="related-faqs"><h2>Related questions</h2><div class="knowledge-faq-grid">${faqs.length ? faqs.map((faq) => faqCard(faq)).join("") : `<p>Additional questions for this topic will be added after engineering review.</p>`}</div></section></div></section>`;
  return knowledgeShell({
    title: `${topic.name} | Transformer Knowledge Center`,
    description: topic.description,
    canonical: `knowledge/${topic.slug}.html`,
    depth: "../",
    content
  });
}

function faqPage(faq) {
  const topic = topicBySlug.get(faq.topic);
  const related = faq.relatedFaqs.map((slug) => faqBySlug.get(slug)).filter(Boolean);
  const structuredData = `${jsonLd({
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: faq.question,
    description: faq.summary,
    about: faq.relatedTerms,
    author: { "@type": "Organization", name: "Tianyu Electric" },
    publisher: { "@type": "Organization", name: "Tianyu Electric" },
    mainEntityOfPage: canonicalHref(`knowledge/faq/${faq.slug}.html`)
  })}${jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalHref("index.html") },
      { "@type": "ListItem", position: 2, name: "Knowledge Center", item: canonicalHref("knowledge/index.html") },
      { "@type": "ListItem", position: 3, name: topic?.name || "FAQ", item: canonicalHref(`knowledge/${topic?.slug || "index"}.html`) },
      { "@type": "ListItem", position: 4, name: faq.question, item: canonicalHref(`knowledge/faq/${faq.slug}.html`) }
    ]
  })}`;
  const content = `${breadcrumb([["Home", "../../index.html"], ["Knowledge Center", "../index.html"], [topic?.name || "Topic", `../${topic?.slug || "index"}.html`], [faq.question, ""]])}
  <article class="knowledge-article">
    <header><p class="eyebrow">Transformer FAQ</p><h1>${esc(faq.question)}</h1><p class="knowledge-summary">${esc(faq.summary)}</p><div class="knowledge-meta"><span>Engineering guidance</span><span>Last reviewed: July 2026</span></div></header>
    <section class="knowledge-direct-answer"><p class="eyebrow">Direct answer</p><p>${esc(faq.answer)}</p></section>
    <div class="knowledge-article-layout"><aside><strong>Article contents</strong>${faq.sections.map(([heading], index) => `<a href="#section-${index + 1}">${esc(heading)}</a>`).join("")}<a href="#related-terms">Related terms</a><a href="#next-step">Project review</a></aside><div class="knowledge-prose">${faq.sections.map(([heading, body], index) => `<section id="section-${index + 1}"><h2>${esc(heading)}</h2><p>${esc(body)}</p></section>`).join("")}<section id="related-terms"><h2>Related terms</h2><div class="knowledge-term-list">${faq.relatedTerms.map((term) => `<span>${esc(term)}</span>`).join("")}</div></section><section id="next-step" class="knowledge-inline-cta"><h2>Apply this to a project</h2><p>The final transformer design should be confirmed against the complete load, site and standard requirements.</p><div><a class="btn outline-dark" href="${faq.productLink}">View related products</a><button class="btn btn-primary" type="button" data-quote-open data-quote-prefill data-question="${esc(faq.question)}" data-structure="${esc(faq.prefill.structure)}" data-function="${esc(faq.prefill.function)}">Ask an Engineer</button></div></section></div></div>
  </article>
  <section class="section pale"><div class="section-head"><div><p class="eyebrow">Continue reading</p><h2>Related transformer questions</h2></div></div><div class="knowledge-faq-grid">${related.map((item) => faqCard(item, "")).join("")}</div></section>`;
  return knowledgeShell({
    title: `${faq.question} | Tianyu Electric`,
    description: faq.summary,
    canonical: `knowledge/faq/${faq.slug}.html`,
    depth: "../../",
    structuredData,
    content
  });
}

function walkHtml(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkHtml(target);
    return entry.isFile() && entry.name.endsWith(".html") ? [target] : [];
  });
}

function relativeDepth(relativePath) {
  const segments = relativePath.split("/");
  return "../".repeat(Math.max(0, segments.length - 1));
}

function relatedFaqsForProduct(relativePath) {
  const lower = relativePath.toLowerCase();
  if (lower.includes("dry") || lower.includes("cast") || lower.includes("amorphous")) return ["what-is-transformer-k-factor", "transformer-for-data-center", "cast-resin-vs-vpi"];
  if (lower.includes("rectifier") || lower.includes("phase-shifting")) return ["inverter-duty-transformer", "what-is-transformer-k-factor", "transformer-impedance-voltage"];
  return ["onan-vs-onaf-transformer-cooling", "mineral-oil-vs-natural-ester", "transformer-impedance-voltage"];
}

function injectBaseEnhancements(file) {
  const relativePath = path.relative(dist, file).replaceAll(path.sep, "/");
  const depth = relativeDepth(relativePath);
  let html = fs.readFileSync(file, "utf8");
  if (!html.includes("assets/css/knowledge.css")) html = html.replace("</head>", `  <link rel="stylesheet" href="${depth}assets/css/knowledge.css">\n</head>`);
  if (!html.includes('rel="canonical"')) {
    const title = html.match(/<title>(.*?)<\/title>/i)?.[1] || "Tianyu Electric";
    const description = html.match(/<meta name="description" content="(.*?)">/i)?.[1] || "Transformer products and engineering information.";
    html = html.replace("</head>", `  <link rel="canonical" href="${canonicalHref(relativePath)}">\n  <meta property="og:type" content="website">\n  <meta property="og:title" content="${title}">\n  <meta property="og:description" content="${description}">\n  <meta property="og:url" content="${canonicalHref(relativePath)}">\n</head>`);
  }
  if (!html.includes("data-knowledge-nav") && html.includes("</nav>")) {
    html = html.replace("</nav>", `<a href="${depth}knowledge/index.html" data-knowledge-nav>Knowledge Center</a></nav>`);
  }
  if (relativePath === "index.html" && !html.includes("data-knowledge-home")) {
    const cards = knowledgeFaqs.slice(0, 3).map((faq) => `<a href="knowledge/faq/${faq.slug}.html"><p class="eyebrow">FAQ</p><h3>${esc(faq.question)}</h3><p>${esc(faq.summary)}</p></a>`).join("");
    const section = `<section class="section knowledge-home" data-knowledge-home><div class="section-head"><div><p class="eyebrow">Knowledge Center</p><h2>Transformer answers built around real engineering decisions</h2></div><a class="text-link" href="knowledge/index.html">Explore all knowledge →</a></div><div class="knowledge-home-grid">${cards}</div></section>`;
    html = html.replace("</main>", `${section}</main>`);
  }
  if (relativePath.startsWith("products/") && !html.includes("data-product-faqs")) {
    const faqs = relatedFaqsForProduct(relativePath).map((slug) => faqBySlug.get(slug)).filter(Boolean);
    const section = `<section class="section pale product-faq-links" data-product-faqs><div class="section-head"><div><p class="eyebrow">Related Knowledge</p><h2>Questions to confirm before project selection</h2></div></div><div class="knowledge-faq-grid">${faqs.map((faq) => `<a class="knowledge-faq-card" href="../knowledge/faq/${faq.slug}.html"><p class="eyebrow">FAQ</p><h3>${esc(faq.question)}</h3><p>${esc(faq.summary)}</p><span>Read engineering answer →</span></a>`).join("")}</div></section>`;
    html = html.replace("</main>", `${section}</main>`);
  }
  if (!html.includes("assets/js/knowledge.js")) html = html.replace("</body>", `  <script src="${depth}assets/js/knowledge.js"></script>\n</body>`);
  fs.writeFileSync(file, html);
}

function writeRedirect(fileName, target) {
  fs.writeFileSync(path.join(dist, fileName), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page moved | Tianyu Electric</title><link rel="canonical" href="${canonicalHref(target)}"><meta http-equiv="refresh" content="0; url=${target}"><script>location.replace(${JSON.stringify(target)});</script></head><body><p>This page has moved to <a href="${target}">${target}</a>.</p></body></html>`);
}

function writeSearchIndex() {
  const records = [
    ...knowledgeTopics.map((topic) => ({ type: "topic", title: topic.name, summary: topic.description, url: `knowledge/${topic.slug}.html` })),
    ...knowledgeFaqs.map((faq) => ({ type: "faq", title: faq.question, summary: faq.summary, terms: faq.relatedTerms, url: `knowledge/faq/${faq.slug}.html` }))
  ];
  fs.writeFileSync(path.join(assetDir, "knowledge-search-index.json"), JSON.stringify(records, null, 2));
}

function writeCrawlerFiles() {
  const paths = walkHtml(dist).map((file) => path.relative(dist, file).replaceAll(path.sep, "/")).filter((item) => !["projects.html", "factory.html", "quality.html"].includes(item)).sort();
  fs.writeFileSync(path.join(dist, "sitemap-paths.txt"), paths.map((item) => `/${item}`).join("\n") + "\n");
  const robots = ["User-agent: *", "Allow: /"];
  if (siteUrl) {
    const urls = paths.map((item) => `  <url><loc>${siteUrl}/${item}</loc></url>`).join("\n");
    fs.writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
    robots.push(`Sitemap: ${siteUrl}/sitemap.xml`);
  }
  fs.writeFileSync(path.join(dist, "robots.txt"), robots.join("\n") + "\n");
}

function buildKnowledgeCenter() {
  ensureDir(faqDir);
  ensureDir(path.join(assetDir, "css"));
  ensureDir(path.join(assetDir, "js"));
  fs.copyFileSync(path.join(__dirname, "knowledge.css"), path.join(assetDir, "css", "knowledge.css"));
  fs.copyFileSync(path.join(__dirname, "knowledge.js"), path.join(assetDir, "js", "knowledge.js"));
  fs.writeFileSync(path.join(knowledgeDir, "index.html"), knowledgeIndexPage());
  knowledgeTopics.forEach((topic) => fs.writeFileSync(path.join(knowledgeDir, `${topic.slug}.html`), topicPage(topic)));
  knowledgeFaqs.forEach((faq) => fs.writeFileSync(path.join(faqDir, `${faq.slug}.html`), faqPage(faq)));
  writeSearchIndex();
  walkHtml(dist).forEach(injectBaseEnhancements);
  writeRedirect("projects.html", "applications.html#projects");
  writeRedirect("factory.html", "about.html#factory");
  writeRedirect("quality.html", "about.html#quality");
  writeCrawlerFiles();
}

if (!fs.existsSync(dist)) throw new Error("dist directory does not exist. Run src/build.mjs before src/knowledge-build.mjs.");
buildKnowledgeCenter();
console.log(`Built ${knowledgeTopics.length} knowledge topics and ${knowledgeFaqs.length} FAQ pages.`);
if (!siteUrl) console.warn("SITE_URL is not set. Canonical links use root-relative URLs and sitemap.xml was not emitted.");
