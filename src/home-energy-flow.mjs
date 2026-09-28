import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const css = 'home-energy-flow.css';
const js = 'home-energy-flow.js';
fs.copyFileSync(path.join(root,'src',css),path.join(dist,'assets','css',css));
fs.copyFileSync(path.join(root,'src',js),path.join(dist,'assets','js',js));

const flow = `<section class="ty-energy-flow-wrap" aria-label="Energy flow from generation to grid"><div class="ty-energy-flow" data-energy-flow><div class="ty-energy-flow-head"><strong>Energy in motion</strong><button class="ty-energy-flow-toggle" type="button" data-energy-flow-toggle aria-label="Pause energy flow animation" aria-pressed="false">Pause motion</button></div><div class="ty-energy-flow-track" aria-hidden="true"><span class="ty-energy-flow-rail"></span><span class="ty-energy-flow-pulse"></span><span class="ty-energy-flow-node"></span><span class="ty-energy-flow-node"></span><span class="ty-energy-flow-node"></span></div><div class="ty-energy-flow-labels"><span>Generation</span><span>Transformation</span><span>Grid connection</span></div></div></section>`;

function update(file) {
  let html=fs.readFileSync(file,'utf8');
  if(html.includes('data-energy-flow')) return;
  const hero=html.indexOf('<section class="v6-hero" data-v6-hero>');
  if(hero<0) throw new Error(`Homepage hero missing in ${file}`);
  const end=html.indexOf('</section>',hero);
  if(end<0) throw new Error(`Homepage hero is incomplete in ${file}`);
  html=html.slice(0,end+10)+flow+html.slice(end+10);
  html=html.replace('</head>',`<link rel="stylesheet" href="assets/css/${css}"></head>`);
  html=html.replace('</body>',`<script src="assets/js/${js}" defer></script></body>`);
  fs.writeFileSync(file,html,'utf8');
}
update(path.join(dist,'index.html'));
update(path.join(root,'index.html'));
console.log('Homepage energy-flow visual added with pause and reduced-motion support.');
