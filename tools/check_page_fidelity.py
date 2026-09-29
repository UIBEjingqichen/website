"""Guard the master page copy and destinations while allowing implementation refactors."""

import hashlib
import json
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
BASELINE = ROOT / "tools" / "master-page-fidelity.json"


class PageSnapshot(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = 0
        self.copy = []
        self.destinations = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in {"script", "style"}:
            self.skip += 1
        if tag == "a":
            self.destinations.append(["a", attrs.get("href", "")])
        if tag == "img":
            self.destinations.append(["img", attrs.get("src", "")])
        for key in ("alt", "aria-label", "placeholder", "title"):
            if attrs.get(key):
                self.copy.append(attrs[key])
        if tag == "meta" and attrs.get("name") in {"description", "keywords"}:
            self.copy.append(attrs.get("content", ""))

    def handle_endtag(self, tag):
        if tag in {"script", "style"}:
            self.skip = max(0, self.skip - 1)

    def handle_data(self, data):
        if not self.skip:
            self.copy.append(data)


def snapshot(html):
    parser = PageSnapshot()
    parser.feed(html)
    copy = re.sub(r"\s+", " ", " ".join(parser.copy)).strip()
    destinations = json.dumps(parser.destinations, ensure_ascii=False)
    return {
        "copy": hashlib.sha256(copy.encode()).hexdigest(),
        "destinations": hashlib.sha256(destinations.encode()).hexdigest(),
    }


def main():
    if "--write-master-baseline" in sys.argv:
        names = subprocess.check_output(
            ["git", "ls-tree", "-r", "--name-only", "origin/master", "dist"],
            cwd=ROOT,
            text=True,
        ).splitlines()
        result = {}
        for name in names:
            if not name.endswith(".html"):
                continue
            body = subprocess.check_output(["git", "show", f"origin/master:{name}"], cwd=ROOT)
            result[name.removeprefix("dist/")] = snapshot(body.decode("utf-8"))
        BASELINE.write_text(json.dumps(result, indent=2, sort_keys=True), encoding="utf-8")
        print(f"Recorded {len(result)} master pages")
        return

    expected = json.loads(BASELINE.read_text(encoding="utf-8"))
    actual = {
        page.relative_to(DIST).as_posix(): snapshot(page.read_text(encoding="utf-8"))
        for page in DIST.rglob("*.html")
    }
    differences = []
    for name in sorted(expected.keys() | actual.keys()):
        if expected.get(name) != actual.get(name):
            differences.append(name)
    if differences:
        raise SystemExit("Page copy or destinations differ from master: " + ", ".join(differences))
    print(f"Page copy and link/image destinations match master across {len(actual)} pages.")


if __name__ == "__main__":
    main()
