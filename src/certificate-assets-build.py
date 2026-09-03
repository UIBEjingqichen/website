from __future__ import annotations
import json
import shutil
from pathlib import Path

import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "source-media" / "evidence" / "pdfs"
OUT_DIR = ROOT / "source-media" / "catalog-assets"

DOCS = {
    "oil-distribution-1600kva-tuv": {"pdf": "oil-distribution-1600kva-tuv.pdf", "certifications": [1, 2, 3], "images": [], "drawings": []},
    "oil-distribution-1600kva-efficiency": {"pdf": "oil-distribution-1600kva-efficiency.pdf", "certifications": [1], "images": [1, 20, 22, 25, 26, 27], "drawings": [25, 28]},
    "oil-distribution-630kva-efficiency": {"pdf": "oil-distribution-630kva-efficiency.pdf", "certifications": [1], "images": [1, 20, 22, 25, 26, 27], "drawings": [25, 28]},
    "oil-distribution-630kva-tuv": {"pdf": "oil-distribution-630kva-tuv.pdf", "certifications": [1, 2, 3], "images": [], "drawings": []},
    "oil-distribution-630kva-ce": {"pdf": "oil-distribution-630kva-ce.pdf", "certifications": [1], "images": [], "drawings": []},
    "oil-distribution-1600kva-ce": {"pdf": "oil-distribution-1600kva-ce.pdf", "certifications": [1], "images": [], "drawings": []},
    "oil-distribution-1600kva-type-test": {
        "pdf": "oil-distribution-1600kva-type-test.pdf", "certifications": [1],
        "images": [8, 9, 15, 17, 21, 24, 26, 28, 31, 51, 57, 61, 63, 65, 68, 70, 72, 74, 76, 78, 93, 98, 101, 102],
        "drawings": [11, 55, 102, 103]
    },
    "oil-distribution-630kva-type-test": {
        "pdf": "oil-distribution-630kva-type-test.pdf", "certifications": [1],
        "images": [8, 9, 15, 17, 21, 24, 26, 28, 31, 51, 57, 61, 63, 65, 68, 70, 72, 74, 76, 78, 93, 98, 101, 102],
        "drawings": [11, 55, 102, 103]
    },
    "power-transformer-240mva-220kv-ssz22": {"pdf": "power-transformer-240mva-220kv-ssz22.pdf", "certifications": [1], "images": [4, 57], "drawings": [67, 68, 69, 70, 71]},
    "power-transformer-50mva-110kv": {"pdf": "power-transformer-50mva-110kv.pdf", "certifications": [1], "images": [4, 36], "drawings": [40, 41, 42, 43, 44]},
    "power-transformer-150mva-132kv": {"pdf": "power-transformer-150mva-132kv.pdf", "certifications": [1], "images": [4, 34, 38], "drawings": [43, 44, 45, 46, 47]},
    "power-transformer-240mva-220kv-ssz20": {"pdf": "power-transformer-240mva-220kv-ssz20.pdf", "certifications": [1], "images": [4, 99, 105, 106], "drawings": [107, 108, 109]},
    "european-substation-6300kva-35kv": {"pdf": "european-substation-6300kva-35kv.pdf", "certifications": [1], "images": [4, 101, 102, 103, 104], "drawings": [11, 105, 106]},
    "european-substation-10000kva-35kv": {
        "pdf": "european-substation-10000kva-35kv.pdf", "certifications": [1], "images": [4, 95, 96, 97, 98, 99, 100],
        "drawings": [11, 44, 46, 50, 54, 57, 82, 87, 101, 102]
    },
    "european-substation-12500kva-35kv": {
        "pdf": "european-substation-12500kva-35kv.pdf", "certifications": [1], "images": [4, 94, 95, 96, 97, 98, 99],
        "drawings": [11, 44, 46, 50, 54, 57, 81, 86, 100, 101]
    },
    "china-substation-10000kva-35kv": {
        "pdf": "china-substation-10000kva-35kv.pdf", "certifications": [1], "images": [4, 91, 92, 93, 94, 95, 96],
        "drawings": [11, 37, 39, 43, 48, 51, 78, 83, 97]
    },
    "china-substation-12500kva-35kv": {
        "pdf": "china-substation-12500kva-35kv.pdf", "certifications": [1], "images": [4, 80, 81, 82, 83],
        "drawings": [11, 37, 39, 43, 48, 51, 75, 84]
    },
    "dry-type-scb18-1000kva-10kv": {"pdf": "dry-type-scb18-1000kva-10kv.pdf", "certifications": [1], "images": [4, 36, 37], "drawings": [38, 39, 40, 41, 42]},
    "dry-type-scb18-2500kva-10kv": {"pdf": "dry-type-scb18-2500kva-10kv.pdf", "certifications": [1], "images": [4, 36, 37], "drawings": [38, 39, 40, 41, 42]},
    "american-combined-zgs22-4000kva-35kv": {"pdf": "american-combined-zgs22-4000kva-35kv.pdf", "certifications": [1], "images": [4, 17], "drawings": [49, 50, 51, 52, 53]},
}

CATEGORY_LABELS = {
    "images": "Product / test photographs that may be reusable in catalog or product pages",
    "drawings": "Drawings, diagrams and layout figures",
    "certifications": "Certificate or official report cover pages",
}


def render_page(doc, page_no: int, output: Path, max_width=1000, quality=76):
    page = doc[page_no - 1]
    scale = max_width / page.rect.width
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    output.parent.mkdir(parents=True, exist_ok=True)
    img.save(output, "WEBP", quality=quality, method=4)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for category in CATEGORY_LABELS:
        (OUT_DIR / category).mkdir(parents=True, exist_ok=True)

    manifest = {"document_count": len(DOCS), "categories": CATEGORY_LABELS, "documents": []}
    missing = []
    total_assets = 0

    for doc_id, spec in DOCS.items():
        pdf_path = PDF_DIR / spec["pdf"]
        if not pdf_path.exists():
            missing.append(str(pdf_path.relative_to(ROOT)))
            manifest["documents"].append({"id": doc_id, **spec, "status": "missing-source-pdf"})
            continue

        doc = fitz.open(pdf_path)
        entry = {"id": doc_id, "pdf": spec["pdf"], "page_count": len(doc), "status": "ok", "assets": {}}

        for category in ("certifications", "images", "drawings"):
            items = []
            for page_no in spec[category]:
                if page_no < 1 or page_no > len(doc):
                    items.append({"page": page_no, "status": "out-of-range"})
                    continue
                filename = f"{doc_id}-p{page_no:03d}.webp"
                output = OUT_DIR / category / filename
                if not output.exists():
                    render_page(doc, page_no, output)
                items.append({"page": page_no, "file": f"{category}/{filename}"})
                total_assets += 1
            entry["assets"][category] = items

        manifest["documents"].append(entry)
        doc.close()

    manifest["total_assets"] = total_assets
    manifest["missing_source_pdfs"] = missing
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    lines = [
        "# Tianyu Certificate Asset Library",
        "",
        f"- Source documents: {len(DOCS)}",
        f"- Generated assets: {total_assets}",
        f"- Missing source PDFs: {len(missing)}",
        "",
        "Folders:",
        "- `certifications/`: official certificate/report cover pages",
        "- `images/`: product and test photographs that may be reused",
        "- `drawings/`: drawings, diagrams and layout figures",
        "",
        "The library is intentionally exhaustive. Assets are retained by source document and page number instead of selecting only a few representative pages.",
    ]
    if missing:
        lines += ["", "## Missing source PDFs"] + [f"- `{item}`" for item in missing]
    (OUT_DIR / "README.md").write_text("\n".join(lines), encoding="utf-8")

    print(f"Generated {total_assets} assets from {len(DOCS) - len(missing)} / {len(DOCS)} documents.")
    if missing:
        print("Missing source PDFs:")
        for item in missing:
            print(f"- {item}")


if __name__ == "__main__":
    main()
