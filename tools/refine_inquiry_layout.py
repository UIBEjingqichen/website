"""Apply the approved static layout and inquiry field updates without reformatting pages."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
fields = '<label class="full">Product / Model<input name="model" placeholder="Product or model, if known"/></label><input name="sourcePage" type="hidden"/>'
for path in (ROOT / 'dist').rglob('*.html'):
    raw = path.read_bytes().decode('utf-8')
    newline = '\r\n' if '\r\n' in raw else '\n'
    text = raw.replace('\r\n', '\n')
    def add_fields(match):
        form = match.group(0)
        if 'name="model"' not in form:
            form = form.replace('<label>Capacity / Voltage', fields + '<label>Capacity / Voltage', 1)
        if 'data-inquiry-verification' not in form:
            form = form.replace('<button class="btn btn-primary" type="submit">', '<p class="inquiry-note full">Your inquiry and selected file will be emailed to Tianyu Electric. Attachment limit: 8 MB.</p><div class="full" data-inquiry-verification=""></div><button class="btn btn-primary" type="submit">', 1)
            form = form.replace('</form>', '<a class="inquiry-fallback full" href="mailto:tianyuelectric@yeah.net">Prefer email? tianyuelectric@yeah.net</a><noscript>Please email us directly; online inquiries require JavaScript.</noscript></form>')
        if 'action="/api/contact"' not in form:
            form = form.replace('<form ', '<form action="/api/contact" method="post" enctype="multipart/form-data" ', 1)
        return form
    updated = re.sub(r'<form\b[^>]*class="quote-form[^\"]*"[^>]*>.*?</form>', add_fields, text, flags=re.S)
    updated = re.sub(r'(assets/js/main\.js)(?:\?[^"\s]*)?(?=")', r'\1?v=direct-20261013', updated)
    updated = re.sub(r'(assets/css/tianyu-refresh\.css)(?:\?[^"\s]*)?(?=")', r'\1?v=direct-20261013', updated)
    if 'assets/js/inquiry.js' not in updated and 'class="quote-form' in updated:
        updated = re.sub(r'(<script[^>]*src="([^"\s]*assets/js/)main\.js[^\"]*"[^>]*></script>)', r'\1<script defer="" src="\2inquiry.js?v=direct-20261013"></script>', updated)
    if path == ROOT / 'dist/index.html':
        products = re.search(r'<section\b[^>]*class="tr-products"[^>]*>.*?</section>', updated, re.S)
        if products:
            updated = updated[:products.start()] + updated[products.end():]
            intro = re.search(r'<section class="tr-intro">.*?</section>', updated, re.S)
            assert intro, 'Home intro section missing'
            updated = updated[:intro.end()] + '\n' + products.group(0) + updated[intro.end():]
    if updated != text:
        path.write_text(updated, encoding='utf-8', newline=newline)
        print(path.relative_to(ROOT))
