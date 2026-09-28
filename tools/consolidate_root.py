"""Move live stylesheet custom properties into the shared foundation."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FOUNDATION = ROOT / "src" / "ty-foundation.css"
ROOT_BLOCK = re.compile(r":root\s*\{([^{}]*)\}", re.S)
PROPERTY = re.compile(r"(--[\w-]+)\s*:\s*([^;]+)")


def main():
    foundation = FOUNDATION.read_text(encoding="utf-8")
    known = set(re.findall(r"--[\w-]+(?=\s*:)", foundation))
    added = {}
    for shipped in (ROOT / "dist" / "assets" / "css").glob("*.css"):
        source = ROOT / "src" / shipped.name
        if source == FOUNDATION or not source.exists():
            continue
        text = source.read_text(encoding="utf-8")

        def remove(match):
            block = match.group(1)
            for name, value in PROPERTY.findall(block):
                if name not in known and name not in added:
                    added[name] = value.strip()
            return ""

        updated = ROOT_BLOCK.sub(remove, text)
        if updated != text:
            source.write_text(updated, encoding="utf-8")
            print(source.relative_to(ROOT))
    new_declarations = "\n".join(f"  {name}:{value};" for name, value in sorted(added.items()))
    if new_declarations:
        foundation = foundation.replace("  --ty-container:1200px;", "  --ty-container:1200px;\n  color-scheme:light;\n  /* Variables consumed by legacy page components. */\n" + new_declarations)
        FOUNDATION.write_text(foundation, encoding="utf-8")
    print(f"Moved {len(added)} variables into {FOUNDATION.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
