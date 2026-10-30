"""Build the site's CSS bundles from src/css.

    python tools/build_css.py          # build bundles and update <link data-css-bundle> hrefs
    python tools/build_css.py --check  # CI: fail if bundles or HTML links are out of date

src/css/css.manifest.json lists every bundle and its ordered source files. Order is the cascade:
later files win ties, so add new rules to the file that owns the component instead of appending
a new "fix" file at the end. Each page links exactly one bundle:

    <link data-css-bundle="page" href="assets/css/page.3f2a9c1e0b.css" rel="stylesheet"/>

The href is rewritten by this script; edit the data-css-bundle name only.
"""
from pathlib import Path
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "css"
OUT = ROOT / "dist" / "assets" / "css"
BUNDLE_LINK = re.compile(r'<link\b[^>]*\bdata-css-bundle="(?P<name>[\w-]+)"[^>]*>')


def minify(css):
    """Conservative minifier: drops comments and redundant whitespace, never touches strings."""
    out, i, n = [], 0, len(css)
    while i < n:
        c = css[i]
        if c in "\"'":
            j = i + 1
            while j < n and css[j] != c:
                j += 2 if css[j] == "\\" else 1
            out.append(css[i:j + 1])
            i = j + 1
        elif css.startswith("/*", i):
            end = css.find("*/", i + 2)
            i = n if end < 0 else end + 2
        elif c.isspace():
            while i < n and css[i].isspace():
                i += 1
            prev = out[-1][-1:] if out else ""
            nxt = css[i:i + 1]
            if prev and nxt and prev not in "{};" and nxt not in "{};":
                out.append(" ")
        else:
            out.append(c)
            i += 1
    return "".join(out).replace(";}", "}").strip() + "\n"


def build():
    manifest = json.loads((SRC / "css.manifest.json").read_text(encoding="utf-8"))
    outputs = {}
    for name, sources in manifest["bundles"].items():
        parts = []
        for source in sources:
            path = SRC / source
            if not path.is_file():
                sys.exit(f"css.manifest.json: bundle '{name}' lists missing file {source}")
            parts.append(minify(path.read_text(encoding="utf-8")))
        css = "".join(parts)
        digest = hashlib.sha256(css.encode("utf-8")).hexdigest()[:10]
        outputs[name] = (f"{name}.{digest}.css", css)
    return manifest, outputs


def html_files():
    return [ROOT / "index.html", *sorted((ROOT / "dist").rglob("*.html"))]


def main():
    check = "--check" in sys.argv
    manifest, outputs = build()
    problems = []
    expected = {filename for filename, _ in outputs.values()}
    for filename, css in outputs.values():
        target = OUT / filename
        if not target.exists() or target.read_text(encoding="utf-8") != css:
            problems.append(f"stale bundle {filename}")
            if not check:
                target.write_text(css, encoding="utf-8", newline="\n")
    for stale in OUT.glob("*.css"):
        if stale.name not in expected:
            problems.append(f"unexpected stylesheet {stale.name}")
            if not check:
                stale.unlink()
    used = set()
    for page in html_files():
        text = page.read_text(encoding="utf-8")

        def relink(match):
            name = match.group("name")
            if name not in outputs:
                problems.append(f"{page.relative_to(ROOT)}: unknown bundle '{name}'")
                return match.group(0)
            used.add(name)
            prefix = "dist/assets/css/" if page.parent == ROOT else re.sub(r"[^/]+$", "", re.search(r'href="([^"]+)"', match.group(0)).group(1))
            return f'<link data-css-bundle="{name}" href="{prefix}{outputs[name][0]}" rel="stylesheet"/>'

        updated = BUNDLE_LINK.sub(relink, text)
        if updated != text:
            problems.append(f"{page.relative_to(ROOT)}: stylesheet link out of date")
            if not check:
                page.write_text(updated, encoding="utf-8", newline="")
        if re.search(r'<link\b(?![^>]*data-css-bundle)[^>]*rel="stylesheet"[^>]*assets/css/', updated) or \
           re.search(r'<link\b(?![^>]*data-css-bundle)[^>]*assets/css/[^>]*rel="stylesheet"', updated):
            problems.append(f"{page.relative_to(ROOT)}: links a stylesheet outside the bundle system")
    for name in manifest["bundles"]:
        if name not in used:
            problems.append(f"bundle '{name}' is not used by any page")
    total = sum(len(css.encode("utf-8")) for _, css in outputs.values())
    print(f"{len(outputs)} CSS bundles, {total / 1024:.1f} KB total")
    if check and problems:
        print("\n".join(problems))
        print("Run: python tools/build_css.py")
        sys.exit(1)
    hard = [p for p in problems if "outside the bundle" in p or "unknown bundle" in p or "not used" in p]
    if hard:
        print("\n".join(hard))
        sys.exit(1)


if __name__ == "__main__":
    main()
