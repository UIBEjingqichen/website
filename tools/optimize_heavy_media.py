"""Create reproducible, source-controlled WebP replacements for shipped heavy images.

Run after a build. The build reads the resulting map and copies files from
src/optimized-media; source-media remains the untouched archive.
"""

import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DIST_MEDIA = ROOT / "dist" / "assets" / "media"
OUT = ROOT / "src" / "optimized-media"
MAP_FILE = ROOT / "src" / "media-optimization-map.json"
LIMIT = 400 * 1024


def main():
    mapping = json.loads(MAP_FILE.read_text(encoding="utf-8")) if MAP_FILE.exists() else {}
    changed = 0
    for original in DIST_MEDIA.rglob("*"):
        if not original.is_file() or original.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
            continue
        if "site-hygiene" in original.parts or original.stat().st_size <= LIMIT:
            continue
        rel = original.relative_to(DIST_MEDIA)
        key = "assets/media/" + rel.as_posix()
        social = original.name.startswith("og-")
        target_rel = Path("site-hygiene") / rel.with_suffix(".jpg" if social else ".webp")
        target = OUT / target_rel
        target.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(original) as image:
            image = ImageOps.exif_transpose(image)
            image.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
            if social:
                image.convert("RGB").save(target, "JPEG", quality=82, optimize=True)
            else:
                image.save(target, "WEBP", quality=82, method=6)
        if target.stat().st_size >= original.stat().st_size:
            target.unlink()
            continue
        mapping[key] = "assets/media/" + target_rel.as_posix()
        changed += 1
    # Social preview files need JPEG for broad crawler compatibility. Rebuild them
    # from the archive even when a later build has already pruned the PNG source.
    for key, value in list(mapping.items()):
        if not Path(key).name.startswith("og-") or value.endswith(".jpg"):
            continue
        original = ROOT / "source-media" / key.removeprefix("assets/media/")
        if not original.exists():
            original = OUT / value.removeprefix("assets/media/")
        if not original.exists():
            continue
        target_rel = Path("site-hygiene") / Path(key.removeprefix("assets/media/")).with_suffix(".jpg")
        target = OUT / target_rel
        target.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(original) as image:
            image.convert("RGB").save(target, "JPEG", quality=82, optimize=True)
        mapping[key] = "assets/media/" + target_rel.as_posix()
        (OUT / value.removeprefix("assets/media/")).unlink(missing_ok=True)
    mapping = {k: v for k, v in sorted(mapping.items()) if (OUT / v.removeprefix("assets/media/")).exists()}
    MAP_FILE.write_text(json.dumps(mapping, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Optimized {changed} images; {len(mapping)} mapped replacements retained.")


if __name__ == "__main__":
    main()
