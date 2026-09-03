import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const walk = (dir) => fs.existsSync(dir)
  ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return entry.isFile() && entry.name.endsWith(".html") ? [full] : [];
    })
  : [];

const replacements = [
  ['<p class="v3p-lead">The technical range below follows Tianyu\'s current product catalog. Product selection starts from voltage class, capacity ladder and application. Certificates and test reports are available separately in Resources.</p>', ''],
  ['<p class="v3p-mini-note">Catalog performance values are reference data. Final guaranteed values, interfaces and overall dimensions are confirmed in the approved technical specification and drawings for the order.</p>', ''],
  ['<span>Catalog product range</span>', ''],
  ['<li>Final dimensions confirmed by approved project drawings</li>', ''],
  ['Published rating ladder', 'Rating Range'],
  ['Product images stay uncropped; project photography gets the wide frame', 'Product Images & Engineering Drawings'],
  ['Project facts are drawn from Tianyu\'s project library and documented project materials.', ''],
  ['Project facts are drawn from Tianyu\'s existing project library.', ''],
  ['This reference presents project information supported by Tianyu\'s existing project records and documented project materials.', ''],
  ['Where a media-library image represents an application category rather than the exact project site, it is used only as contextual visual material.', ''],
  ['155 MW photovoltaic project reference in Brazil, supplied with 29 high-capacity 35 kV prefabricated substations.', '155 MW photovoltaic project in Brazil supplied with 29 high-capacity 35 kV prefabricated substations.'],
  ['Cement-industry power-transformer reference recorded in Tianyu\'s project library.', 'Power-transformer application for the BCL Hattar Line 2 7200 TPD cement plant.'],
  ['132 kV industrial-park substation reference recorded in Tianyu\'s project library.', '132 kV substation for Atlantic Industrial Park.'],
  ['Cement grinding project recorded under Tianyu\'s high-voltage power-transformer references.', 'High-voltage power-transformer application for the Long Son cement grinding project.'],
  ['Mobile-substation export reference for a chemical-industry infrastructure project.', 'Mobile-substation export project for chemical-industry infrastructure.'],
  ['100 MW solar reference recorded under Tianyu\'s oil-immersed prefabricated substations.', '100 MW solar project using oil-immersed prefabricated substations.'],
  ['500 MW mining / solar reference recorded under Tianyu\'s oil-immersed prefabricated substations.', '500 MW mining and solar project using oil-immersed prefabricated substations.'],
  ['Reference experience across substations, renewables and industrial distribution.', 'Project experience across substations, renewables and industrial distribution.'],
  ['Dedicated transformer test facilities and impulse-test equipment support routine testing, agreed FAT and product verification according to applicable project requirements.', 'Dedicated transformer test facilities and impulse-test equipment support routine testing, FAT and product verification.'],
  ['Technical coordination, FAT support, documentation, shipment handover, installation guidance and commissioning assistance are provided according to the agreed project scope.', 'Technical coordination, FAT support, documentation, shipment handover, installation guidance and commissioning assistance.'],
  ['REFERENCE DRAWING · Final drawing subject to project design.', 'REFERENCE DRAWING']
];

function cleanHtml(input) {
  let html = input;
  for (const [from, to] of replacements) html = html.split(from).join(to);

  // Class-specific source block only. This element contains no nested divs in generated product pages.
  html = html.replace(/<div class="v3p-source">[\s\S]*?<\/div>/g, '');

  // Remove the exact project-detail note wrapper after its sentence is cleared.
  html = html.replace(/<div class="ty16-note">\s*<\/div>/g, '');
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}

let changed = 0;
for (const file of walk(dist)) {
  const before = fs.readFileSync(file, "utf8");
  const after = cleanHtml(before);
  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    changed += 1;
  }
}

console.log(`Safe final copy cleanup updated ${changed} generated HTML files.`);
