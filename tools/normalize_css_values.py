"""Map legacy shadows to the shared elevation scale without changing content."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SHADOW = re.compile(r"(box-shadow\s*:\s*)([^;{}]+)", re.I)
PX = re.compile(r"-?\d+(?:\.\d+)?px")


def shadow_token(value):
    clean = re.sub(r"\s*!important\b", "", value, flags=re.I).strip()
    if clean == "none":
        return "none"
    if clean.startswith("var(--ty-e-"):
        return clean
    if clean.startswith("var("):
        return "var(--ty-e-2)"
    dimensions = [abs(float(number[:-2])) for number in PX.findall(clean)]
    if len(dimensions) >= 4 and dimensions[:3] == [0, 0, 0]:
        return "var(--ty-e-focus)"
    blur = dimensions[2] if len(dimensions) >= 3 else 0
    if blur <= 16:
        return "var(--ty-e-1)"
    if blur <= 30:
        return "var(--ty-e-2)"
    if blur <= 50:
        return "var(--ty-e-3)"
    return "var(--ty-e-4)"


def main():
    total = 0
    for css in (ROOT / "src").glob("*.css"):
        if css.name == "ty-foundation.css":
            continue
        text = css.read_text(encoding="utf-8")
        updated, count = SHADOW.subn(lambda match: match.group(1) + shadow_token(match.group(2)), text)
        if updated != text:
            css.write_text(updated, encoding="utf-8")
            total += count
    print(f"Normalized {total} shadow declarations")


if __name__ == "__main__":
    main()
