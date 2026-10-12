"""Validate the deployable Tianyu static website without third-party dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []
references = 0


def check_url(source, value):
    global references
    value = value.strip()
    if not value or value.startswith(("#", "//", "data:")):
        return
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc or not parsed.path:
        return
    references += 1
    target = (ROOT / unquote(parsed.path.lstrip("/")) if parsed.path.startswith("/")
              else source.parent / unquote(parsed.path)).resolve()
    if not target.is_relative_to(ROOT):
        errors.append(f"{source.relative_to(ROOT)}: URL escapes website root: {value}")
    elif not target.exists():
        errors.append(f"{source.relative_to(ROOT)}: missing {value}")


class References(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.source = source

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        for key in ("src", "href", "poster", "data-src", "data-href"):
            if key in attributes:
                if tag == "link" and key == "href" and "canonical" in attributes.get("rel", "").split():
                    continue
                check_url(self.source, attributes[key] or "")
        if attributes.get("srcset") and not attributes["srcset"].startswith("data:"):
            for candidate in attributes["srcset"].split(","):
                if candidate.strip():
                    check_url(self.source, candidate.strip().split()[0])


html_files = [ROOT / "index.html", *sorted((ROOT / "dist").rglob("*.html"))]
root_home = (ROOT / "index.html").read_text(encoding="utf-8")
if not re.search(r"<main(?:\s|>)", root_home, re.I):
    errors.append("index.html: root entry must contain the full homepage")
if re.search(r"http-equiv\s*=\s*['\"]refresh['\"]", root_home, re.I):
    errors.append("index.html: root entry must not depend on a meta-refresh redirect")
css_files = sorted((ROOT / "dist").rglob("*.css"))
json_files = sorted((ROOT / "database").rglob("*.json"))
for source in html_files:
    parser = References(source)
    parser.feed(source.read_text(encoding="utf-8"))
for source in css_files:
    for value in re.findall(r"url\(\s*['\"]?([^)'\"]+)['\"]?\s*\)", source.read_text(encoding="utf-8")):
        check_url(source, value)
for source in json_files:
    try:
        json.loads(source.read_text(encoding="utf-8-sig"))
    except ValueError as error:
        errors.append(f"{source.relative_to(ROOT)}: invalid JSON: {error}")
for directory in ("dist", "images", "documents", "database"):
    if not (ROOT / directory).is_dir():
        errors.append(f"Missing runtime directory: {directory}")
for source in (ROOT / "documents").glob("*.pdf"):
    with source.open("rb") as document:
        if document.read(5) != b"%PDF-":
            errors.append(f"{source.relative_to(ROOT)}: invalid PDF header")
print(f"Checked {len(html_files)} HTML pages, {len(css_files)} stylesheets, "
      f"{len(json_files)} JSON databases and {references} local references.")
if errors:
    print("\n".join(sorted(set(errors))))
    sys.exit(1)
print("All static website checks passed.")
