"""Publish the full dist homepage at the repository root with rebased URLs."""
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit
import posixpath
import re

ROOT = Path(__file__).resolve().parents[1]
URL_ATTRIBUTE = re.compile(
    r"(?P<prefix>\b(?:data-href|data-src|href|src|poster)\s*=\s*)"
    r"(?P<quote>[\"'])(?P<url>.*?)(?P=quote)"
)


def rebase(match):
    value = match.group("url")
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc or not parsed.path or value.startswith("/"):
        return match.group(0)
    path = posixpath.normpath(posixpath.join("dist", parsed.path))
    if path == "dist/index.html":
        path = "index.html"
    value = urlunsplit(("", "", path, parsed.query, parsed.fragment))
    return match.group("prefix") + match.group("quote") + value + match.group("quote")


source = (ROOT / "dist/index.html").read_text(encoding="utf-8")
newline = "\r\n" if b"\r\n" in (ROOT / "index.html").read_bytes() else "\n"
(ROOT / "index.html").write_text(URL_ATTRIBUTE.sub(rebase, source), encoding="utf-8", newline=newline)
print("Published full homepage at index.html with root-relative file locations.")
