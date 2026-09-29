import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import postcss from 'postcss';
import { minify } from 'csso';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const cssDir = path.join(dist, 'assets', 'css');
const manifest = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'css-usage-manifest.json'), 'utf8'));
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
const pageFiles = walk(dist).filter((file) => file.endsWith('.html'));
const link = /<link\b(?=[^>]*\brel=(['"])stylesheet\1)[^>]*>/gi;
const href = (tag) => tag.match(/\bhref=(['"])(.*?)\1/i)?.[2];
const cssName = (tag) => {
  const value = href(tag)?.split(/[?#]/)[0];
  return value && /(?:^|\/)assets\/css\/[^/]+\.css$/i.test(value) ? path.basename(value) : null;
};
const pageStyles = new Map();
const edges = new Map();
const names = new Set();
for (const file of pageFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const sequence = [...html.matchAll(link)].map((match) => cssName(match[0]))
    .filter((name) => name && name !== 'ty-foundation.css');
  pageStyles.set(file, sequence);
  for (const name of sequence) names.add(name);
  for (let i = 1; i < sequence.length; i++) {
    if (!edges.has(sequence[i - 1])) edges.set(sequence[i - 1], new Set());
    edges.get(sequence[i - 1]).add(sequence[i]);
  }
}
const order = [];
while (names.size) {
  const next = [...names].sort().find((name) => ![...names].some((prior) => edges.get(prior)?.has(name)));
  if (!next) throw new Error(`Incompatible stylesheet order: ${[...names].join(', ')}`);
  order.push(next);
  names.delete(next);
}
const contextKey = (rule) => {
  const parents = [];
  for (let node = rule.parent; node?.type === 'atrule'; node = node.parent) parents.unshift(`@${node.name} ${node.params}`);
  return crypto.createHash('sha1').update(`${parents.join('|')}|${rule.toString()}`).digest('hex').slice(0, 20);
};
let removed = 0;
const chunks = new Map(order.map((name) => {
  const source = fs.readFileSync(path.join(cssDir, name), 'utf8');
  const ast = postcss.parse(source, { from: name });
  const known = new Set(manifest[name]?.known || []);
  const keep = new Set(manifest[name]?.keep || []);
  ast.walkRules((rule) => {
    if (/@(?:-\w+-)?keyframes\b/i.test(rule.parent?.name || '')) return;
    for (let parent = rule.parent; parent?.type === 'atrule'; parent = parent.parent) {
      if (parent.name === 'media' && /\bprint\b/i.test(parent.params)) return;
    }
    const key = contextKey(rule);
    if (known.has(key) && !keep.has(key)) { rule.remove(); removed++; }
  });
  ast.walkAtRules((at) => { if (at.nodes && at.nodes.length === 0 && !/keyframes/i.test(at.name)) at.remove(); });
  ast.walkDecls((decl) => {
    if (decl.important && !['display', 'transform'].includes(decl.prop)) decl.important = false;
  });
  const compact = minify(ast.toString()).css;
  return [name, `@scope (html[data-ty-css~="${name}"]){${compact}}`];
}));
const pageGroup = (file) => {
  const relative = path.relative(dist, file).replaceAll('\\', '/');
  if (relative === 'index.html') return 'home';
  if (relative === 'resources.html') return 'resources';
  if (relative === 'products.html' || relative.startsWith('products/')) return 'product';
  if (relative.startsWith('knowledge/')) return 'knowledge';
  return 'general';
};
const groupNames = new Map(['home', 'product', 'knowledge', 'resources', 'general'].map((group) => [group, new Set()]));
for (const [file, sequence] of pageStyles) {
  for (const name of sequence) groupNames.get(pageGroup(file)).add(name);
}
for (const [group, selected] of groupNames) {
  const bundle = order.filter((name) => selected.has(name)).map((name) => chunks.get(name)).join('');
  fs.writeFileSync(path.join(cssDir, `ty-${group}.css`), bundle);
  console.log(`CSS ${group}: ${Math.ceil(Buffer.byteLength(bundle) / 1024)} KB`);
}
const base = ['ty-base.css', 'ty-components.css']
  .map((name) => fs.readFileSync(path.join(import.meta.dirname, name), 'utf8')).join('\n');
fs.writeFileSync(path.join(cssDir, 'ty-base.css'), minify(base).css);

function rewrite(file) {
  let html = fs.readFileSync(file, 'utf8');
  const sequence = pageStyles.get(file) || [];
  const bundleName = `ty-${pageGroup(file)}.css`;
  const bundleHref = path.relative(path.dirname(file), path.join(cssDir, bundleName)).replaceAll('\\', '/');
  let inserted = false;
  html = html.replace(link, (tag) => {
    const name = cssName(tag);
    if (!name || name === 'ty-foundation.css') return tag;
    if (inserted) return '';
    inserted = true;
    return `<link rel="stylesheet" href="${bundleHref}">`;
  });
  if (sequence.length) {
    const value = [...new Set(sequence)].join(' ');
    html = html.replace(/<html\b([^>]*)>/i, (_, attrs) => `<html${attrs} data-ty-css="${value}">`);
  }
  html = html.replace(/<link\b[^>]*\bty-foundation\.css[^>]*>/i, (tag) => {
    const baseHref = bundleHref.replace(bundleName, 'ty-base.css');
    return `${tag}<link rel="stylesheet" href="${baseHref}">`;
  });
  fs.writeFileSync(file, html);
}
for (const file of pageFiles) rewrite(file);
const mirror = fs.readFileSync(path.join(dist, 'index.html'), 'utf8').replace('<head>', '<head><base href="dist/">');
fs.writeFileSync(path.join(root, 'index.html'), mirror);
for (const name of order) fs.rmSync(path.join(cssDir, name));
console.log(`CSS bundles: ${order.length} legacy stylesheets → 5 page bundles; pruned ${removed} inactive rules.`);
