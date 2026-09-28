from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "source-media" / "catalog-assets" / "drawings"

# These crops remove report margins while preserving the actual drawing or test layout.
jobs = {
    (SRC, "power-transformer-50mva-110kv-p040.webp"): ("power-transformer-50mva-110kv-cropped.webp", (190, 245, 825, 1235)),
    (SRC, "oil-distribution-1600kva-efficiency-p025.webp"): ("oil-distribution-1600kva-sound-layout.webp", (205, 170, 820, 690)),
    (SRC, "dry-type-scb18-2500kva-10kv-p038.webp"): ("dry-type-scb18-2500kva-cropped.webp", (190, 245, 825, 1235)),
    (ROOT / "source-media" / "drawings", "european-substation-6300kva-35kv-outline.webp"): ("european-substation-6300kva-cropped.webp", (180, 220, 835, 1240)),
    (ROOT / "source-media" / "drawings", "china-substation-10000kva-35kv-outline.webp"): ("china-substation-10000kva-cropped.webp", (180, 220, 835, 1240)),
}

for (source_root, source_name), (output_name, box) in jobs.items():
    source = source_root / source_name
    output = source_root / output_name
    with Image.open(source) as image:
        cropped = image.convert("RGB").crop(box)
        if source_name in {"power-transformer-50mva-110kv-p040.webp", "dry-type-scb18-2500kva-10kv-p038.webp"}:
            cropped = cropped.rotate(270, expand=True)
        cropped.save(output, "WEBP", quality=92, method=6)
    print(f"cropped {source_name} -> {output_name}")
