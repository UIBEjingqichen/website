import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "..", "dist");

function walkHtml(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkHtml(target);
    return entry.isFile() && entry.name.endsWith(".html") ? [target] : [];
  });
}

for (const file of walkHtml(dist)) {
  let html = fs.readFileSync(file, "utf8");
  const relativePath = path.relative(dist, file).replaceAll(path.sep, "/");

  if (relativePath.startsWith("knowledge/")) {
    html = html.replace('<form class="quote-form compact">', '<form class="quote-form compact" data-technical-selector="ready">');
    html = html.replaceAll(">00 FAQs<", ">Topic Guide<");
  }

  const knowledgeLinks = html.match(/>Knowledge Center<\/a>/g) || [];
  if (knowledgeLinks.length > 1) {
    html = html.replace(/<a[^>]*data-knowledge-nav[^>]*>Knowledge Center<\/a>/, "");
  }

  html = html.replace(/(<link rel="canonical" href="[^"]+)#[^"]+(">)/, "$1$2");
  fs.writeFileSync(file, html);
}

console.log("Finalized Knowledge Center navigation, topic labels, redirects and inquiry forms.");
