"""Replace audited CSS colour declarations with reviewed Tianyu tokens."""

import argparse
import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COLOURS = re.compile(r"#[a-f\d]{3,8}\b|rgba?\([^)]*\)", re.I)
DECLARATION = re.compile(r"([\w-]+\s*:\s*)([^;{}]+)")


def replacement(value, token):
    if value.startswith("rgba"):
        alpha = float(re.findall(r"[\d.]+", value)[-1])
        if alpha == 0:
            return "transparent"
        if alpha < 1:
            return f"color-mix(in srgb, var({token}) {alpha * 100:g}%, transparent)"
    return f"var({token})"


def apply(file, mapping):
    source = file.read_text(encoding="utf-8")
    changes = 0

    def declaration(match):
        nonlocal changes
        prefix, value = match.groups()
        prop = prefix.split(":", 1)[0].strip().lower()

        def colour(item):
            nonlocal changes
            old = item.group().lower()
            token = mapping.get(old)
            if token is None:
                return item.group()
            if prop == "color" and token == "--ty-n-500":
                token = "--ty-n-600"  # Keep text above the AA contrast threshold.
            changes += 1
            return replacement(old, token)

        return prefix + COLOURS.sub(colour, value)

    updated = DECLARATION.sub(declaration, source)
    if updated != source:
        file.write_text(updated, encoding="utf-8")
    return changes


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("file", type=Path)
    args = parser.parse_args()
    mapping = {row["value"].lower(): row["token"] for row in csv.DictReader((ROOT / "tools" / "color-map.csv").open(encoding="utf-8"))}
    file = args.file if args.file.is_absolute() else ROOT / args.file
    if file.name == "ty-foundation.css":
        raise SystemExit("The foundation holds the canonical palette and must keep its literals.")
    print(f"{file.relative_to(ROOT)}: {apply(file, mapping)} colour replacements")


if __name__ == "__main__":
    main()
