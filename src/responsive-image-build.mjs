import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const sourceMedia = path.join(import.meta.dirname, 'responsive-media');
const map = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'responsive-media-map.json'), 'utf8'));
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});

for (const source of walk(sourceMedia)) {
  const relative = path.relative(sourceMedia, source);
  const destination = path.join(dist, 'assets', 'media', 'responsive', relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

let updated = 0;
for (const page of walk(dist).filter((file) => file.endsWith('.html'))) {
  let html = fs.readFileSync(page, 'utf8');
  html = html.replace(/<img\b[^>]*>/gi, (tag) => {
    if (/\bsrcset=/i.test(tag)) return tag;
    const src = tag.match(/\bsrc=(['"])(.*?)\1/i)?.[2];
    if (!src || /^(?:[a-z]+:|\/\/|data:)/i.test(src)) return tag;
    const original = path.resolve(path.dirname(page), src.split(/[?#]/)[0]);
    const key = path.relative(dist, original).replaceAll('\\', '/');
    const variants = map[key];
    if (!variants) return tag;
    const candidates = Object.entries(variants).sort(([a], [b]) => Number(a) - Number(b))
      .map(([width, target]) => {
        const url = path.relative(path.dirname(page), path.join(dist, target)).replaceAll('\\', '/');
        return `${url} ${width}w`;
      });
    updated++;
    return tag.replace(/>$/, ` srcset="${candidates.join(', ')}" sizes="100vw">`);
  });
  fs.writeFileSync(page, html);
}
console.log(`Responsive images: added srcset to ${updated} image elements.`);
