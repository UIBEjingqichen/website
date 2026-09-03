from __future__ import annotations

import csv
import hashlib
import json
import math
import textwrap
from collections import defaultdict
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "source-media"
OUT = ROOT / "tmp" / "media-audit"
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
TEXT_EXTS = {".py", ".mjs", ".js", ".json", ".yaml", ".yml", ".md", ".html", ".css", ".txt", ".csv", ".xml"}
SKIP_DIRS = {".git", "dist", "tmp", "node_modules"}


def classify(rel: str) -> str:
    p = rel.lower()
    name = Path(rel).name.lower()
    if p.startswith("catalog-assets/certifications/"):
        return "report-certification-pages"
    if p.startswith("catalog-assets/drawings/"):
        return "report-drawing-pages"
    if p.startswith("catalog-assets/images/"):
        return "report-extracted-pages"
    if p.startswith("catalog-v3/"):
        return "catalog-curated"
    if p.startswith("evidence/"):
        return "evidence-generated"
    if p.startswith("drawings/"):
        return "drawing-curated"
    if p.startswith("products/"):
        if any(k in name for k in ("power-transformer-110kv", "power-transformer-132kv", "power-transformer-220kv", "dry-type-transformer-scb18")):
            return "product-report-derived"
        return "product-workbook"
    if name.startswith("image") and Path(name).stem[5:].isdigit():
        return "legacy-unnamed"
    if name.startswith("product-"):
        return "product-semantic"
    if name.startswith("case-"):
        return "project-semantic"
    if name.startswith("company-"):
        return "company-semantic"
    if name.startswith("hero-"):
        return "hero-semantic"
    if name.startswith("og-"):
        return "branding"
    return "other-root"


def file_digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        while chunk := f.read(1024 * 1024):
            h.update(chunk)
    return h.hexdigest()


def image_meta(path: Path) -> tuple[int, int, str]:
    try:
        with Image.open(path) as im:
            return im.width, im.height, im.mode
    except Exception as exc:
        return 0, 0, f"ERROR:{type(exc).__name__}"


def load_thumb(path: Path, max_w: int, max_h: int) -> Image.Image:
    with Image.open(path) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        im.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
        return im.copy()


def draw_multiline(draw: ImageDraw.ImageDraw, text: str, xy: tuple[int, int], font: ImageFont.ImageFont, fill: str, width: int = 42) -> None:
    lines = []
    for part in text.split("/"):
        wrapped = textwrap.wrap(part, width=width) or [part]
        lines.extend(wrapped)
    draw.multiline_text(xy, "\n".join(lines[:4]), font=font, fill=fill, spacing=3)


def make_sheets(group: str, records: list[dict]) -> list[str]:
    if not records:
        return []
    group_dir = OUT / "contact-sheets"
    group_dir.mkdir(parents=True, exist_ok=True)
    cols, rows = 4, 4
    cell_w, cell_h = 360, 330
    image_w, image_h = 332, 232
    per_page = cols * rows
    font = ImageFont.load_default()
    outputs = []
    for page in range(math.ceil(len(records) / per_page)):
        subset = records[page * per_page:(page + 1) * per_page]
        canvas = Image.new("RGB", (cols * cell_w, rows * cell_h), "white")
        draw = ImageDraw.Draw(canvas)
        for i, rec in enumerate(subset):
            col = i % cols
            row = i // cols
            x0, y0 = col * cell_w, row * cell_h
            draw.rectangle((x0, y0, x0 + cell_w - 1, y0 + cell_h - 1), outline="#cad3db", width=1)
            try:
                thumb = load_thumb(MEDIA / rec["path"], image_w, image_h)
                x = x0 + (cell_w - thumb.width) // 2
                y = y0 + 10 + (image_h - thumb.height) // 2
                canvas.paste(thumb, (x, y))
            except Exception:
                draw.rectangle((x0 + 14, y0 + 14, x0 + cell_w - 14, y0 + image_h), outline="#b00020", width=2)
                draw.text((x0 + 20, y0 + 25), "IMAGE READ ERROR", font=font, fill="#b00020")
            label_y = y0 + image_h + 20
            draw_multiline(draw, rec["path"], (x0 + 10, label_y), font, "#102a43", width=45)
            info = f'{rec["width"]}x{rec["height"]}  {rec["category"]}'
            draw.text((x0 + 10, y0 + cell_h - 18), info[:58], font=font, fill="#52606d")
        target = group_dir / f"{group}-{page + 1:02d}.jpg"
        canvas.save(target, quality=90, optimize=True)
        outputs.append(target.relative_to(OUT).as_posix())
    return outputs


def scan_references(records: list[dict]) -> dict[str, list[dict]]:
    # Search source/config/docs for exact media path or basename references. Generated dist is intentionally skipped.
    keys: dict[str, set[str]] = {}
    for rec in records:
        rel = rec["path"]
        keys[rel] = {rel, f"source-media/{rel}", f"assets/media/{rel}"}
        # Root-level names are commonly referenced by basename only.
        if "/" not in rel:
            keys[rel].add(Path(rel).name)

    refs: dict[str, list[dict]] = defaultdict(list)
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTS:
            continue
        rel_parts = path.relative_to(ROOT).parts
        if any(part in SKIP_DIRS for part in rel_parts):
            continue
        # Inventory/docs inside source-media are records, not consuming source-code references.
        if rel_parts and rel_parts[0] == "source-media" and path.suffix.lower() not in {".json", ".md"}:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        file_rel = path.relative_to(ROOT).as_posix()
        for media_rel, needles in keys.items():
            matched = [needle for needle in needles if needle in text]
            if not matched:
                continue
            refs[media_rel].append({
                "file": file_rel,
                "matches": sorted(set(matched)),
            })
    return dict(sorted(refs.items()))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    files = sorted(p for p in MEDIA.rglob("*") if p.is_file() and p.suffix.lower() in IMAGE_EXTS)
    digest_first: dict[str, str] = {}
    records: list[dict] = []

    for path in files:
        rel = path.relative_to(MEDIA).as_posix()
        digest = file_digest(path)
        w, h, mode = image_meta(path)
        duplicate_of = digest_first.get(digest, "")
        if not duplicate_of:
            digest_first[digest] = rel
        records.append({
            "path": rel,
            "category": classify(rel),
            "width": w,
            "height": h,
            "mode": mode,
            "bytes": path.stat().st_size,
            "sha256": digest,
            "duplicate_of": duplicate_of,
        })

    with (OUT / "media-inventory.csv").open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(records[0].keys()) if records else ["path"])
        writer.writeheader()
        writer.writerows(records)

    (OUT / "media-inventory.json").write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    references = scan_references(records)
    (OUT / "references.json").write_text(json.dumps(references, ensure_ascii=False, indent=2), encoding="utf-8")

    by_group: dict[str, list[dict]] = defaultdict(list)
    for rec in records:
        by_group[rec["category"]].append(rec)

    sheet_index = {}
    for group in sorted(by_group):
        sheet_index[group] = make_sheets(group, by_group[group])

    stats = {
        "image_paths": len(records),
        "unique_binary_images": len(digest_first),
        "duplicate_paths": sum(bool(r["duplicate_of"]) for r in records),
        "referenced_media_paths": len(references),
        "categories": {group: len(items) for group, items in sorted(by_group.items())},
        "contact_sheets": sheet_index,
    }
    (OUT / "summary.json").write_text(json.dumps(stats, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(stats, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
