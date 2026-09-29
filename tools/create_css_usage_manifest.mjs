// One-time coverage capture companion. Regenerate after a deliberate layout
// redesign; the build keeps any previously unseen selectors automatically.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import postcss from 'postcss';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const coverage = JSON.parse(fs.readFileSync(path.join(root, 'tmp', 'css-coverage.json'), 'utf8'));
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
const htmlAndJs = walk(dist).filter((file) => /\.(?:html|js)$/i.test(file))
  .map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const contextKey = (rule) => {
  const parents = [];
  for (let node = rule.parent; node?.type === 'atrule'; node = node.parent) parents.unshift(`@${node.name} ${node.params}`);
  return crypto.createHash('sha1').update(`${parents.join('|')}|${rule.toString().replace(/\r\n?/g, '\n')}`).digest('hex').slice(0, 20);
};
const manifest = {};
for (const name of fs.readdirSync(path.join(dist, 'assets', 'css')).filter((file) => file.endsWith('.css'))) {
  const ranges = coverage[name] || [];
  if (name === 'ty-foundation.css') continue;
  const source = fs.readFileSync(path.join(dist, 'assets', 'css', name), 'utf8');
  const used = new Set(ranges.map(([start, end]) => `${start}:${end}`));
  const known = new Set();
  const keep = new Set();
  const ast = postcss.parse(source, { from: name });
  ast.walkRules((rule) => {
    if (/@(?:-\w+-)?keyframes\b/i.test(rule.parent?.name || '')) return;
    const key = contextKey(rule);
    known.add(key);
    // Chrome's CSS coverage offsets and PostCSS offsets are both UTF-16 code units.
    const start = rule.source.start.offset;
    const end = rule.source.end.offset;
    const token = rule.selector.match(/\.([\w-]+)/)?.[1] || rule.selector.match(/#([\w-]+)/)?.[1];
    const dynamic = /:(?:hover|focus|active|checked|disabled|focus-visible|focus-within)|\.(?:active|is-open|is-visible|open|selected|current)|\[aria-/i.test(rule.selector)
      && (!token || htmlAndJs.includes(token));
    if (used.has(`${start}:${end}`) || dynamic) keep.add(key);
  });
  manifest[name] = { known: [...known], keep: [...keep] };
}
const target = path.join(root, 'src', 'css-usage-manifest.json');
fs.writeFileSync(target, JSON.stringify(manifest));
console.log(`Wrote ${target} for ${Object.keys(manifest).length} stylesheets`);
