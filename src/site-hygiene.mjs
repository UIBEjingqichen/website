import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const assets = path.join(dist, 'assets');
const htmlFiles = [];
const stats = { pages: 0, repaired: 0, dimensions: 0, deferred: 0, removedAssets: 0, removedMedia: 0 };
const walk = (dir) => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
  const target = path.join(dir, item.name);
  return item.isDirectory() ? walk(target) : [target];
}) : [];
const relative = (file) => path.relative(dist, file).replaceAll('\\', '/');
const copyTree = (source, target) => {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) copyTree(from, to);
    else fs.copyFileSync(from, to);
  }
};

copyTree(path.join(root, 'src', 'fonts'), path.join(assets, 'fonts'));
copyTree(path.join(root, 'src', 'branding'), path.join(assets, 'branding'));
fs.copyFileSync(path.join(root, 'src', 'ty-foundation.css'), path.join(assets, 'css', 'ty-foundation.css'));
fs.copyFileSync(path.join(root, 'src', 'branding', 'favicon.ico'), path.join(dist, 'favicon.ico'));
fs.writeFileSync(path.join(dist, 'site.webmanifest'), JSON.stringify({
  name: 'Tianyu Electric', short_name: 'Tianyu', start_url: '/', display: 'standalone',
  icons: [{ src: '/assets/branding/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/assets/branding/icon-512.png', sizes: '512x512', type: 'image/png' }],
}, null, 2));

const mediaMapPath = path.join(root, 'src', 'media-optimization-map.json');
const mediaMap = fs.existsSync(mediaMapPath) ? JSON.parse(fs.readFileSync(mediaMapPath, 'utf8')) : {};
for (const [from, to] of Object.entries(mediaMap)) {
  const source = path.join(root, 'src', 'optimized-media', to.replace(/^assets\/media\//, ''));
  const target = path.join(dist, to);
  if (!fs.existsSync(source)) throw new Error(`Missing optimized media: ${source}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function assetUrl(value, page) {
  if (!value || /^(?:[a-z]+:|\/\/|#|data:|mailto:|tel:)/i.test(value)) return null;
  const clean = value.split(/[?#]/)[0];
  if (!clean) return null;
  return path.resolve(clean.startsWith('/') ? dist : path.dirname(page), clean.replace(/^\//, ''));
}
function fixUrl(value, page) {
  const direct = assetUrl(value, page);
  if (!direct || fs.existsSync(direct)) return value;
  const clean = value.split(/[?#]/)[0];
  const suffix = value.slice(clean.length);
  const rootRelative = path.join(dist, clean.replace(/^(?:\.\.\/|\.\/)+/, '').replace(/^\//, ''));
  if (!fs.existsSync(rootRelative)) return value;
  stats.repaired++;
  return path.relative(path.dirname(page), rootRelative).replaceAll('\\', '/') + suffix;
}
function imageSize(file) {
  if (!file || !fs.existsSync(file)) return null;
  if (file.endsWith('.svg')) {
    const head = fs.readFileSync(file, 'utf8').slice(0, 2000);
    const width = head.match(/<svg\b[^>]*\bwidth="([\d.]+)/i)?.[1];
    const height = head.match(/<svg\b[^>]*\bheight="([\d.]+)/i)?.[1];
    if (width && height) return [Math.round(Number(width)), Math.round(Number(height))];
    const box = head.match(/<svg\b[^>]*\bviewBox="([\d.\s-]+)"/i)?.[1]?.trim().split(/\s+/).map(Number);
    return box?.length === 4 ? [Math.round(box[2]), Math.round(box[3])] : null;
  }
  const fd = fs.openSync(file, 'r');
  const b = Buffer.alloc(32);
  try {
    const len = fs.readSync(fd, b, 0, b.length, 0);
    if (len < 24) return null;
    if (b.subarray(1, 4).toString() === 'PNG') return [b.readUInt32BE(16), b.readUInt32BE(20)];
    if (b.subarray(0, 3).toString() === 'GIF') return [b.readUInt16LE(6), b.readUInt16LE(8)];
    if (b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') {
      const kind = b.subarray(12, 16).toString();
      if (kind === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
      if (kind === 'VP8 ' && b[23] === 0x9d) return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
      if (kind === 'VP8L') return [1 + (((b[22] & 0x3f) << 8) | b[21]), 1 + (((b[24] & 0x0f) << 10) | (b[23] << 2) | ((b[22] & 0xc0) >> 6))];
    }
    if (b[0] === 0xff && b[1] === 0xd8) {
      let offset = 2;
      const size = fs.fstatSync(fd).size;
      while (offset < size) {
        const marker = Buffer.alloc(4);
        fs.readSync(fd, marker, 0, 4, offset);
        if (marker[0] !== 0xff) break;
        const segment = marker.readUInt16BE(2);
        if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker[1])) {
          const dims = Buffer.alloc(5);
          fs.readSync(fd, dims, 0, 5, offset + 4);
          return [dims.readUInt16BE(3), dims.readUInt16BE(1)];
        }
        offset += segment + 2;
      }
    }
    return null;
  } finally { fs.closeSync(fd); }
}

for (const page of walk(dist).filter((file) => file.endsWith('.html'))) {
  htmlFiles.push(page);
  let html = fs.readFileSync(page, 'utf8');
  const depth = '../'.repeat(relative(page).split('/').length - 1);
  html = html.replace(/<(link|script)\b[^>]*>/gi, (tag) => tag.replace(/\b(href|src)="([^"]+)"/gi, (_all, attr, url) => `${attr}="${fixUrl(url, page)}"`));
  const foundation = `${depth}assets/css/ty-foundation.css`;
  if (!html.includes('ty-foundation.css')) html = html.replace(/<\/head>/i, `<link rel="stylesheet" href="${foundation}"></head>`);
  if (!/rel="(?:shortcut )?icon"/i.test(html)) html = html.replace(/<\/head>/i, `<link rel="icon" href="${depth}favicon.ico" sizes="any"><link rel="apple-touch-icon" href="${depth}assets/branding/apple-touch-icon.png"><link rel="manifest" href="${depth}site.webmanifest"></head>`);
  for (const font of ['inter-latin-400-normal.woff2', 'archivo-latin-700-normal.woff2']) {
    if (!html.includes(font)) html = html.replace(/<\/head>/i, `<link rel="preload" href="${depth}assets/fonts/${font}" as="font" type="font/woff2" crossorigin></head>`);
  }
  html = html.replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, (tag) => {
    const url = tag.match(/href="([^"]+)"/i)?.[1];
    if (!url) return tag;
    let pathname;
    try { pathname = new URL(url, 'https://example.invalid').pathname; } catch { return tag; }
    if (fs.existsSync(path.join(dist, pathname.replace(/^\//, '')))) return tag;
    const candidate = `products/${pathname.replace(/^\//, '')}`;
    if (fs.existsSync(path.join(dist, candidate))) return tag.replace(url, url.replace(pathname, `/${candidate}`));
    return tag;
  });
  for (const [from, to] of Object.entries(mediaMap)) html = html.replaceAll(from, to);
  html = html.replace(/<(?:img|source)\b[^>]*>/gi, (tag) => {
    let output = tag.replace(/\bsrc="([^"]+)"/i, (_all, url) => `src="${fixUrl(url, page)}"`);
    if (!/^<img\b/i.test(output)) return output;
    const url = output.match(/\bsrc="([^"]+)"/i)?.[1];
    if (!url) return output;
    if (/fetchpriority="high"/i.test(output)) output = output.replace(/\sloading="lazy"/i, '');
    if (!/\bdecoding=/i.test(output)) output = output.replace(/>$/, ' decoding="async">');
    if (!/\bwidth=|\bheight=/i.test(output)) {
      const dimensions = imageSize(assetUrl(url, page));
      if (dimensions && dimensions.every(Number.isFinite)) {
        output = output.replace(/>$/, ` width="${dimensions[0]}" height="${dimensions[1]}">`);
        stats.dimensions++;
      }
    }
    return output;
  });
  html = html.replace(/<script\b[^>]*\bsrc="[^"]+"[^>]*>/gi, (tag) => {
    if (/\b(?:defer|async|type="module")\b/i.test(tag)) return tag;
    stats.deferred++;
    return tag.replace(/>$/, ' defer>');
  });
  let h1 = 0;
  html = html.replace(/<\/?h1\b[^>]*>/gi, (tag) => {
    if (!tag.startsWith('</')) h1++;
    return h1 > 1 ? tag.replace(/h1/i, 'h2') : tag;
  });
  fs.writeFileSync(page, html);
  stats.pages++;
}

for (const file of walk(assets).filter((item) => /\.(?:css|js)$/i.test(item))) {
  let body = fs.readFileSync(file, 'utf8');
  for (const [from, to] of Object.entries(mediaMap)) body = body.replaceAll(from, to);
  fs.writeFileSync(file, body);
}

// Delete CSS and JS with no page reference. CSS imports and JS module imports also keep their dependencies.
const content = walk(dist).filter((file) => /\.(?:html|css|js)$/i.test(file)).map((file) => fs.readFileSync(file, 'utf8')).join('\n');
for (const file of walk(path.join(assets, 'css')).concat(walk(path.join(assets, 'js')))) {
  if (!/\.(?:css|js)$/i.test(file)) continue;
  const rel = relative(file);
  if (content.includes(rel) || content.includes(path.basename(file))) continue;
  fs.rmSync(file);
  stats.removedAssets++;
}

// Match complete media paths to avoid keeping every file named 01.jpg in unrelated folders.
const liveText = walk(dist).filter((file) => /\.(?:html|css|js)$/i.test(file)).map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const mediaRoot = path.join(assets, 'media');
for (const file of walk(mediaRoot)) {
  if (/\.pdf$/i.test(file)) continue;
  const rel = relative(file);
  const mediaRel = rel.replace(/^assets\/media\//, '');
  if (liveText.includes(rel) || liveText.includes(mediaRel) || liveText.includes(encodeURI(rel))) continue;
  fs.rmSync(file);
  stats.removedMedia++;
}
console.log('Site hygiene:', stats);
