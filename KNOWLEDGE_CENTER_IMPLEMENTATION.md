# Knowledge Center implementation

## Build

Run:

```bash
npm run build
```

The build order is:

1. Generate the existing static website.
2. Generate Knowledge Center topic and FAQ pages.
3. Finalize navigation and inquiry form integration.
4. Generate the root preview page.

## Generated structure

```text
dist/knowledge/index.html
dist/knowledge/<topic>.html
dist/knowledge/faq/<question>.html
dist/assets/css/knowledge.css
dist/assets/js/knowledge.js
dist/assets/knowledge-search-index.json
dist/robots.txt
dist/sitemap-paths.txt
```

## Production domain

Set `SITE_URL` during the production build to emit absolute canonical URLs and `dist/sitemap.xml`:

```bash
SITE_URL=https://www.example.com npm run build
```

Replace the example domain with the confirmed production domain.

## Content maintenance

Edit `src/knowledge-data.mjs` to add or revise topics and FAQ entries. The generator creates pages and cross-links automatically.

Each FAQ record includes:

- topic assignment;
- question and search summary;
- direct answer;
- detailed sections;
- related terms;
- related FAQ links;
- related product link;
- inquiry form prefill values.

## Remaining launch blockers

- Connect inquiry forms to email, CRM or another verified endpoint.
- Confirm company email, phone, WhatsApp and address.
- Confirm company capability figures and certificate files.
- Perform engineering and legal review of public technical content.
- Configure the final production domain through `SITE_URL`.
