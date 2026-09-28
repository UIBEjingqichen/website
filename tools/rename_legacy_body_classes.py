"""Replace historical homepage/density body flags with descriptive classes."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src"
RENAME = {
    "v7-home": "ty-home",
    "v8-home": "ty-home",
    "phase1-home": "ty-home",
    "site36-density": "ty-density",
}

for file in ROOT.iterdir():
    if file.suffix not in {".css", ".js", ".mjs"}:
        continue
    content = file.read_text(encoding="utf-8")
    updated = content
    for before, after in RENAME.items():
        updated = updated.replace(before, after)
    if updated != content:
        file.write_text(updated, encoding="utf-8")
        print(file.name)
