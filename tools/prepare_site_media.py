from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "新补充"
MEDIA = ROOT / "source-media"
PDFTOPPM = Path(
    r"C:\Users\DELL\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe"
)

DOCUMENTS = [
    ("china-substation-10000kva-35kv", "华氏/35kV华变试验报告【YB-40.5-10000】26XB0129-S (1).pdf", [1, 2, 3, 4], 11),
    ("china-substation-12500kva-35kv", "华氏/35kV华变试验报告【YB口-40.5-1.14-12500 (GY)】 (1).pdf", [1, 2, 3, 4], 11),
    ("dry-type-scb18-1000kva-10kv", "干式/SCB18-1000-10-NX1 试验报告26N0284-S (1).pdf", [1, 2, 3, 4], None),
    ("dry-type-scb18-2500kva-10kv", "干式/SCB18-2500-10试验报告26N0286-S (1).pdf", [1, 2, 3, 4], None),
    ("european-substation-6300kva-35kv", "欧式/35kv-prefabricated-substation-6300kva-yb-40.5-1.14-6300-type-test-report-23xb0121-s.pdf", [1, 2, 3, 4], 11),
    ("european-substation-10000kva-35kv", "欧式/35kv-prefabricated-substation-10000kva-yb-40.5-1.14-10000-type-test-report-26xb0130-s.pdf", [1, 2, 3, 4], 11),
    ("european-substation-12500kva-35kv", "欧式/35kv-prefabricated-substation-12500kva-yb-40.5-1.14-12500-type-test-report-26xb0131-s.pdf", [1, 2, 3, 4], 11),
    ("oil-distribution-1600kva-ce", "油浸式/oil-immersed-transformer-1600kva-22kv-tier2-ce-ecodesign-verification-cn25ney4.pdf", [1], None),
    ("oil-distribution-1600kva-efficiency", "油浸式/oil-immersed-transformer-1600kva-22kv-tier2-efficiency-test-report-cn25ney4.pdf", [1, 3, 6, 7], None),
    ("oil-distribution-1600kva-type-test", "油浸式/oil-immersed-transformer-1600kva-22kv-tier2-iec-complete-type-test-report-cn25zjn4.pdf", [1, 4, 6, 15], None),
    ("oil-distribution-1600kva-tuv", "油浸式/oil-immersed-transformer-1600kva-22kv-tier2-tuv-certificate-cn25zjn4.pdf", [1], None),
    ("oil-distribution-630kva-ce", "油浸式/oil-immersed-transformer-630kva-22kv-tier2-ce-ecodesign-verification-cn2532px.pdf", [1], None),
    ("oil-distribution-630kva-efficiency", "油浸式/oil-immersed-transformer-630kva-22kv-tier2-efficiency-test-report-cn2532px.pdf", [1, 3, 6, 7], None),
    ("oil-distribution-630kva-type-test", "油浸式/oil-immersed-transformer-630kva-22kv-tier2-iec-complete-type-test-report-cn25im0t.pdf", [1, 4, 6, 15], None),
    ("oil-distribution-630kva-tuv", "油浸式/oil-immersed-transformer-630kva-22kv-tier2-tuv-certificate-cn25im0t.pdf", [1], None),
    ("power-transformer-150mva-132kv", "油浸式高压/oil-immersed-power-transformer-150mva-132kv-sfz-150000-132-test-report-21m2079-s.pdf", [1, 2, 3, 4], None),
    ("power-transformer-240mva-220kv-ssz20", "油浸式高压/oil-immersed-power-transformer-240mva-220kv-ssz20-240000-220-type-test-report-21m0905-s.pdf", [1, 2, 3, 4], None),
    ("power-transformer-240mva-220kv-ssz22", "油浸式高压/oil-immersed-power-transformer-240mva-220kv-ssz22-240000-220-nx1-test-report-23m1317-s.pdf", [1, 2, 3, 4], None),
    ("power-transformer-50mva-110kv", "油浸式高压/oil-immersed-power-transformer-50mva-110kv-sz22-50000-110-nx1-test-report-21m2078-s.pdf", [1, 2, 3, 4], None),
]


def ensure_dirs() -> None:
    for name in ("evidence", "evidence/pdfs", "drawings", "products", "projects", "factory"):
        (MEDIA / name).mkdir(parents=True, exist_ok=True)


def render_page(pdf: Path, page: int, target: Path) -> None:
    temporary = target.with_suffix("")
    subprocess.run([
        str(PDFTOPPM),
        "-f", str(page),
        "-l", str(page),
        "-singlefile",
        "-jpeg",
        "-jpegopt", "quality=90",
        "-r", "130",
        str(pdf),
        str(temporary),
    ], check=True)
    jpeg = temporary.with_suffix(".jpg")
    image = Image.open(jpeg).convert("RGB")
    if image.width > 1500:
        image.thumbnail((1500, 2200), Image.Resampling.LANCZOS)
    image.save(target, "WEBP", quality=86, method=6)
    jpeg.unlink()


def main() -> None:
    ensure_dirs()
    manifest = []
    for doc_id, relative, pages, drawing_page in DOCUMENTS:
        source_pdf = SOURCE / Path(relative)
        pdf_target = MEDIA / "evidence" / "pdfs" / f"{doc_id}.pdf"
        shutil.copy2(source_pdf, pdf_target)
        previews = []
        for index, page in enumerate(pages, start=1):
            labels = ["cover", "summary", "parameters", "sample-photo-page"]
            label = labels[index - 1] if index <= len(labels) else f"page-{page}"
            target = (MEDIA / "evidence" / "sample-photo-pages" / f"{doc_id}-sample-photo-page.webp") if label == "sample-photo-page" else (MEDIA / "evidence" / f"{doc_id}-{label}.webp")
            render_page(source_pdf, page, target)
            previews.append(target.relative_to(ROOT).as_posix())
        drawing = None
        if drawing_page:
            target = MEDIA / "drawings" / f"{doc_id}-outline.webp"
            render_page(source_pdf, drawing_page, target)
            drawing = target.relative_to(ROOT).as_posix()
        manifest.append({
            "id": doc_id,
            "source": source_pdf.relative_to(ROOT).as_posix(),
            "pdf": pdf_target.relative_to(ROOT).as_posix(),
            "previewImages": previews,
            "drawing": drawing,
        })

    # Report sample-photo pages remain evidence only; never copy them into products/.

    manifest_path = MEDIA / "evidence" / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({
        "documents": len(manifest),
        "previews": sum(len(item["previewImages"]) for item in manifest),
        "drawings": sum(bool(item["drawing"]) for item in manifest),
        "manifest": manifest_path.relative_to(ROOT).as_posix(),
    }))


if __name__ == "__main__":
    main()
