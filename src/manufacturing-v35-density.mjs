import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const page = path.join(root, 'dist', 'manufacturing.html');
const cssSource = path.join(__dirname, 'manufacturing-v35-density.css');
const cssTarget = path.join(root, 'dist', 'assets', 'css', 'manufacturing-v35-density.css');

if (!fs.existsSync(page)) process.exit(0);
fs.mkdirSync(path.dirname(cssTarget), { recursive: true });
fs.copyFileSync(cssSource, cssTarget);

let html = fs.readFileSync(page, 'utf8');
html = html.replace(/\s*<link rel="stylesheet" href="assets\/css\/manufacturing-v35-density\.css">/g, '');
html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/manufacturing-v35-density.css">\n</head>');

const replacements = new Map([
  ['<p class="mfg34-kicker">Factory at a Glance</p><h2 class="mfg34-title">Scale, capacity and equipment in one view.</h2>', '<p class="mfg34-kicker">Overview</p><h2 class="mfg34-title">Manufacturing at a Glance</h2>'],
  ['<p class="mfg34-kicker">Factory at a Glance</p><h2 class="mfg34-title">Manufacturing at a Glance</h2>', '<p class="mfg34-kicker">Overview</p><h2 class="mfg34-title">Manufacturing at a Glance</h2>'],
  ['<p class="mfg34-kicker">End-to-End Manufacturing Flow</p><h2 class="mfg34-title">From incoming materials to tested transformer.</h2>', '<p class="mfg34-kicker">Production Flow</p><h2 class="mfg34-title">Manufacturing Process</h2>'],
  ['<p class="mfg34-kicker">End-to-End Manufacturing Flow</p><h2 class="mfg34-title">Manufacturing Process</h2>', '<p class="mfg34-kicker">Production Flow</p><h2 class="mfg34-title">Manufacturing Process</h2>'],
  ['The page now presents manufacturing as a controlled delivery chain instead of isolated workshop cards, making each production stage easier to understand at a glance.', 'Incoming materials, core processing, winding, insulation, assembly, drying and FAT are managed as linked production stages.'],
  ['<p class="mfg34-kicker">Digital Manufacturing Systems</p><h2 class="mfg34-title">Four systems across supply, production, quality and logistics.</h2>', '<p class="mfg34-kicker">Digital Layer</p><h2 class="mfg34-title">Connected Production Systems</h2>'],
  ['<p class="mfg34-kicker">Digital Manufacturing Systems</p><h2 class="mfg34-title">Digital Manufacturing Systems</h2>', '<p class="mfg34-kicker">Digital Layer</p><h2 class="mfg34-title">Connected Production Systems</h2>'],
  ['SRM, MOM, QMS and WMS are separated into distinct business functions so customers can understand what the digital layer is intended to control.', 'SRM, MOM, QMS and WMS connect supplier coordination, production execution, quality records and material flow.'],
  ['<p class="mfg34-kicker">Testing &amp; Quality Assurance</p><h2 class="mfg34-title">Testing presented as project evidence, not decoration.</h2>', '<p class="mfg34-kicker">Testing</p><h2 class="mfg34-title">Testing and Traceability</h2>'],
  ['<p class="mfg34-kicker">Testing &amp; Quality Assurance</p><h2 class="mfg34-title">Testing &amp; Quality Assurance</h2>', '<p class="mfg34-kicker">Testing</p><h2 class="mfg34-title">Testing and Traceability</h2>'],
  ['Testing scope depends on the product, applicable specification and project contract. The page separates routine, special and witness activities so buyers can see how FAT requirements fit into delivery.', 'Routine tests, project-specific tests and witness FAT are defined against the applicable product standard, customer specification and contract.'],
  ['<p class="mfg34-kicker">Factory Gallery</p>\n      <h2 class="mfg34-title">Workshop, equipment and assembly evidence.</h2>', '<p class="mfg34-kicker">Factory Evidence</p>\n      <h2 class="mfg34-title">Workshop &amp; Equipment</h2>'],
  ['<p class="mfg34-kicker">Factory Gallery</p>\n      <h2 class="mfg34-title">Factory Gallery</h2>', '<p class="mfg34-kicker">Factory Evidence</p>\n      <h2 class="mfg34-title">Workshop &amp; Equipment</h2>'],
  ['<p class="mfg34-kicker">Manufacturing FAQ</p><h2 class="mfg34-title">Questions buyers usually need answered before a factory review.</h2>', '<p class="mfg34-kicker">Buyer Questions</p><h2 class="mfg34-title">Manufacturing FAQ</h2>'],
  ['<p class="mfg34-kicker">Manufacturing FAQ</p><h2 class="mfg34-title">Manufacturing FAQ</h2>', '<p class="mfg34-kicker">Buyer Questions</p><h2 class="mfg34-title">Manufacturing FAQ</h2>'],
  ['See the manufacturing capability behind your project.', 'Manufacturing capability for your project.']
]);
for (const [from, to] of replacements) html = html.replaceAll(from, to);

fs.writeFileSync(page, html, 'utf8');
console.log('Manufacturing V35 applied: tighter typography, denser layout, concise headings and customer-facing copy.');
