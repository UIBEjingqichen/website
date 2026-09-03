from __future__ import annotations

import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "tmp" / "source-inspection" / "pdf-contacts"
OUT.mkdir(parents=True, exist_ok=True)
PDFTOPPM = Path(
    r"C:\Users\DELL\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe"
)

SAMPLES = {
    "high-voltage": ROOT / "新补充" / "油浸式高压" / "oil-immersed-power-transformer-240mva-220kv-ssz22-240000-220-nx1-test-report-23m1317-s.pdf",
    "dry-type": ROOT / "新补充" / "干式" / "SCB18-2500-10试验报告26N0286-S (1).pdf",
    "european-substation": ROOT / "新补充" / "欧式" / "35kv-prefabricated-substation-12500kva-yb-40.5-1.14-12500-type-test-report-26xb0131-s.pdf",
    "china-substation": ROOT / "新补充" / "华氏" / "35kV华变试验报告【YB口-40.5-1.14-12500 (GY)】 (1).pdf",
}


def render_contact(name: str, pdf: Path, first: int = 1, last: int = 24) -> Path:
    work = OUT / name
    work.mkdir(exist_ok=True)
    prefix = work / "page"
    subprocess.run([
        str(PDFTOPPM),
        "-f", str(first),
        "-l", str(last),
        "-jpeg",
        "-jpegopt", "quality=78",
        "-scale-to", "480",
        str(pdf),
        str(prefix),
    ], check=True)
    pages = sorted(work.glob("page-*.jpg"))
    cell_w, cell_h = 250, 370
    columns = 6
    rows = (len(pages) + columns - 1) // columns
    sheet = Image.new("RGB", (cell_w * columns, cell_h * rows), "#e9eef2")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for index, page in enumerate(pages):
        image = Image.open(page).convert("RGB")
        image.thumbnail((cell_w - 14, cell_h - 34), Image.Resampling.LANCZOS)
        x0 = (index % columns) * cell_w
        y0 = (index // columns) * cell_h
        x = x0 + (cell_w - image.width) // 2
        y = y0 + 8
        sheet.paste(image, (x, y))
        draw.text((x0 + 10, cell_h + y0 - 22), f"Page {first + index}", fill="#17324d", font=font)
    target = OUT / f"{name}-pages-{first}-{last}.jpg"
    sheet.save(target, quality=88)
    return target


for label, source in SAMPLES.items():
    print(render_contact(label, source).relative_to(ROOT).as_posix())
