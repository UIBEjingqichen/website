"""Inventory shipped CSS colours and suggest Tianyu palette tokens for review."""

import argparse
import colorsys
import csv
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PALETTE = {
    "navy-900": "061C31", "navy-800": "0A2540", "navy-700": "103353",
    "navy-600": "1B4570", "navy-500": "2A5D8F", "copper-700": "9A4E1C",
    "copper-600": "B05E22", "copper-500": "C97A3C", "copper-300": "E8A86A",
    "copper-100": "F7E6D6", "n-0": "FFFFFF", "n-50": "F6F8FA",
    "n-100": "ECF0F4", "n-200": "DCE3EA", "n-300": "C2CCD6",
    "n-400": "94A3B1", "n-500": "6B7C8C", "n-600": "4E5F6F",
    "n-700": "374754", "n-800": "22303B", "n-900": "0F1A24",
}
OVERRIDES = {
    "#17577e": "copper-700",  # Legacy primary links and actions.
    "#007f89": "copper-600",  # Legacy focus outline.
    "#087c83": "copper-700",
    "#06636a": "copper-700",
    "#0b7790": "copper-700",
}
HEX = re.compile(r"#[a-f\d]{3,8}\b", re.I)
RGB = re.compile(r"rgba?\(\s*\d+(?:\.\d+)?\s*,\s*\d+(?:\.\d+)?\s*,\s*\d+(?:\.\d+)?(?:\s*,\s*[\d.]+)?\s*\)", re.I)
DECL = re.compile(r"([\w-]+)\s*:\s*([^;{}]+)")


def channels(value):
    if value.startswith("#"):
        h = value[1:]
        if len(h) in (3, 4):
            h = "".join(x * 2 for x in h)
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
    return tuple(round(float(x)) for x in re.findall(r"\d+(?:\.\d+)?", value)[:3])


def hsl(value):
    r, g, b = (x / 255 for x in channels(value))
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return round(h * 360), round(s * 100), round(l * 100)


def suggested(value):
    if value.lower() in OVERRIDES:
        return OVERRIDES[value.lower()]
    h, s, l = hsl(value)
    if 170 <= h <= 195 and s >= 26 and l < 72:
        family = ["copper-700", "copper-600", "copper-500", "copper-300"]
    elif s < 15 or l > 84:
        family = [key for key in PALETTE if key.startswith("n-")]
    elif 195 <= h <= 260:
        family = [key for key in PALETTE if key.startswith("navy-")]
    else:
        family = list(PALETTE)
    source = channels(value)
    return min(family, key=lambda name: sum((a - b) ** 2 for a, b in zip(source, channels("#" + PALETTE[name]))))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=str(ROOT / "tools" / "color-audit.csv"))
    args = parser.parse_args()
    counts = Counter()
    files = defaultdict(set)
    properties = defaultdict(set)
    for css in (ROOT / "dist" / "assets" / "css").glob("*.css"):
        text = css.read_text(encoding="utf-8")
        for declaration in DECL.finditer(text):
            prop, body = declaration.groups()
            for match in list(HEX.finditer(body)) + list(RGB.finditer(body)):
                value = match.group().lower()
                counts[value] += 1
                files[value].add(css.name)
                properties[value].add(prop)
    with open(args.output, "w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["value", "count", "hue", "saturation", "lightness", "suggested_token", "properties", "files"])
        for value, count in counts.most_common():
            writer.writerow([value, count, *hsl(value), "--ty-" + suggested(value), "; ".join(sorted(properties[value])), "; ".join(sorted(files[value]))])
    map_path = ROOT / "tools" / "color-map.csv"
    with map_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["value", "token"])
        for value in sorted(counts):
            writer.writerow([value, "--ty-" + suggested(value)])
    print(f"Audited {len(counts)} colour values; wrote {args.output}")
    print("Most frequent:")
    for value, count in counts.most_common(25):
        print(f"  {value:24} {count:4}  -> --ty-{suggested(value)}")


if __name__ == "__main__":
    main()
