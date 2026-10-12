# Tianyu Electric website

This repository contains the current static website synchronized from
`tianyu-website-v61` on 2026-10-12, including the integrated V63 updates and
2026-10-08 product images.

## Preview

Open `index.html` directly, or double-click `打开网站.cmd` on Windows.
For HTTP preview, run `python -m http.server 8000` from this directory and
open `http://localhost:8000/`. The root entry displays the complete homepage
directly, without a redirect or an "Open website" intermediary.

## Website files

- `dist/`: HTML pages, CSS and JavaScript.
- `images/`: page and shared images.
- `documents/`: downloadable certificates, test reports and drawings.
- `database/`: product, project, document and knowledge data.

Deploy the repository root and preserve the relative locations of all four
directories. No npm installation or build step is required. The previous
source generator is available in Git history; running it against these pages
would replace the current website with an older version.

Local image-library management, repair reports and temporary working notes
remain in the desktop source folder and are not required to serve this website.

## Validation

After editing `dist/index.html`, run `python tools/generate_root_home.py` to
refresh the root homepage and adjust its image, asset and navigation URLs.

Run `python tools/validate_site.py` to check local HTML/CSS links, JSON databases
and PDF headers. The master workflow also checks JavaScript syntax.
