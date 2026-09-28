"""Converge live page font sizes on the eight foundation type tokens.

Only stylesheets currently shipped by the build are touched. Historical files
remain available until the pipeline cleanup removes them.
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCALE = (11, 12, 14, 16, 18, 24, 36, 56)
DECLARATION = re.compile(r"(font-size\s*:\s*)([^;{}]+)", re.I)
LENGTH = re.compile(r"(\d*\.?\d+)\s*(px|pt|rem)\b", re.I)


def token(value):
    value = re.sub(r"\s*!important\b", "", value, flags=re.I).strip()
    if value.startswith("var(--ty-fs-") or value in {"inherit", "initial", "unset", "0"}:
        return value
    if value == "var(--s36-hero)":
        return "var(--ty-fs-8)"
    if value == "var(--s36-title)":
        return "var(--ty-fs-7)"
    lengths = [float(number) * {"px": 1, "pt": 4 / 3, "rem": 16}[unit.lower()]
               for number, unit in LENGTH.findall(value)]
    if not lengths:
        return value
    target = max(lengths) if "clamp(" in value else lengths[0]
    index = min(range(len(SCALE)), key=lambda i: (abs(SCALE[i] - target), i))
    return f"var(--ty-fs-{index + 1})"


def main():
    total = 0
    for shipped in (ROOT / "dist" / "assets" / "css").glob("*.css"):
        source = ROOT / "src" / shipped.name
        if not source.exists() or source.name == "ty-foundation.css":
            continue
        css = source.read_text(encoding="utf-8")
        updated, count = DECLARATION.subn(lambda match: match.group(1) + token(match.group(2)), css)
        if updated != css:
            source.write_text(updated, encoding="utf-8")
            total += count
    print(f"Normalized {total} font-size declarations")


if __name__ == "__main__":
    main()
