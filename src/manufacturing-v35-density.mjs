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
  ['Scale, capacity and equipment in one view.', 'Manufacturing at a Glance'],
  ['From incoming materials to tested transformer.', 'Manufacturing Process'],
  ['Four systems across supply, production, quality and logistics.', 'Digital Manufacturing Systems'],
  ['Testing presented as project evidence, not decoration.', 'Testing &amp; Quality Assurance'],
  ['Workshop, equipment and assembly evidence.', 'Factory Gallery'],
  ['Questions buyers usually need answered before a factory review.', 'Manufacturing FAQ'],
  ['See the manufacturing capability behind your project.', 'Manufacturing capability for your project.']
]);
for (const [from, to] of replacements) html = html.replaceAll(from, to);

fs.writeFileSync(page, html, 'utf8');
console.log('Manufacturing V35 applied: tighter typography, reduced section scale, denser cards and concise section headings.');
