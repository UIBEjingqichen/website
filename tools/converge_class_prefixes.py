"""Rename legacy component prefixes in generators, CSS, runtime JS and checks.

Run one prefix per commit to keep visual regressions attributable.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src"
PREFIXES = {
    "ie-": "ty-editorial__",
    "vs-": "ty-system__",
    "yw-": "ty-home__",
    "ty15-": "ty-evidence__",
    "ty16-": "ty-proof__",
    "v5-": "ty-carousel__",
    "v6-": "ty-panel__",
    "v3p-": "ty-product__",
}


def main(prefix):
    if prefix not in PREFIXES:
        raise SystemExit(f"Unknown prefix: {prefix}")
    replacement = PREFIXES[prefix]
    # Stage filenames still use their historical names until the pipeline is
    # flattened. Keep those string references intact.
    pattern = re.compile(re.escape(prefix) + r"(?![\w-]*\.(?:mjs|js|css)\b)")
    changed = 0
    for file in ROOT.iterdir():
        if file.suffix not in {".css", ".js", ".mjs"}:
            continue
        original = file.read_text(encoding="utf-8")
        updated = pattern.sub(replacement, original)
        if updated != original:
            file.write_text(updated, encoding="utf-8")
            changed += 1
    print(f"Renamed {prefix} in {changed} files")


if __name__ == "__main__":
    main(sys.argv[1])
