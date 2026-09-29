"""Create mobile and tablet variants for heavy raster images in the built site."""

import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "dist" / "assets" / "media"
OUT = ROOT / "src" / "responsive-media"
MAPPING = ROOT / "src" / "responsive-media-map.json"
THRESHOLD = 120 * 1024


def main():
    result = {}
    referenced = '\n'.join(p.read_text(encoding='utf-8') for p in (ROOT / 'dist').rglob('*.html'))
    for file in MEDIA.rglob("*"):
        if not file.is_file() or file.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
            continue
        if file.stat().st_size <= THRESHOLD or "responsive" in file.relative_to(MEDIA).parts:
            continue
        with Image.open(file) as image:
            if image.width <= 960:
                continue
            original = "assets/media/" + file.relative_to(MEDIA).as_posix()
            if original not in referenced:
                continue
            variants = {}
            for width in (480, 960):
                height = round(image.height * width / image.width)
                name = file.relative_to(MEDIA).as_posix() + f".{width}.webp"
                target = OUT / name
                target.parent.mkdir(parents=True, exist_ok=True)
                converted = image.convert("RGBA" if "A" in image.getbands() else "RGB")
                converted.resize((width, height), Image.Resampling.LANCZOS).save(
                    target, "WEBP", quality=72, method=6
                )
                variants[str(width)] = "assets/media/responsive/" + name
            variants[str(image.width)] = original
            result[original] = variants
    MAPPING.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"Created 480/960px variants for {len(result)} images")


if __name__ == "__main__":
    main()
