from __future__ import annotations

import json
import re
import zipfile
from io import BytesIO
from pathlib import Path
from xml.etree import ElementTree as ET

from PIL import Image, ImageDraw, ImageFont
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
WORKBOOK = ROOT / "新补充" / "天宇电气外贸出口.xlsx"
TMP = ROOT / "tmp" / "source-inspection"
TMP.mkdir(parents=True, exist_ok=True)


IMAGE_NAMES = {
    "ID_73B49DC56D2443C4B2E25F63A2215904": "products/distribution-transformers/oil-immersed-distribution-transformer-sealed-01.webp",
    "ID_D482E6ED46B24789A2C21E1FB5F6490D": "products/distribution-transformers/oil-immersed-distribution-transformer-conservator-01.webp",
    "ID_0F2F2AA739994CCBA7B4683E1C9F2304": "products/distribution-transformers/oil-immersed-distribution-transformer-cable-connected-01.webp",
    "ID_707F999734454CAEA1FA1818F7B340C3": "products/prefabricated-substations/dry-type-prefabricated-substation-exterior-01.webp",
    "ID_A8F2DCFF122D425BA63F6BA0DB13ABB3": "products/prefabricated-substations/dry-type-prefabricated-substation-lineup.webp",
    "ID_393312FDD89F494D939EE3B712C9FDAF": "applications/wind-turbine-dry-type-prefabricated-substation-site.webp",
    "ID_73C5914E475241E388FC7C55AE7DC605": "factory/dry-type-prefabricated-substation-assembly-01.webp",
    "ID_FD4626FFDFAC45B1B4B3D246390E0E94": "factory/dry-type-prefabricated-substation-assembly-02.webp",
    "ID_C0DB3D162D6D4B2489E4219820A9F221": "products/prefabricated-substations/dry-type-prefabricated-substation-interior.webp",
    "ID_4F2348D3ACE8439E9A4AFA4DDBD07DF6": "products/prefabricated-substations/oil-prefabricated-substation-exterior-01.webp",
    "ID_4499B70310BF4FBE848DB6CD603C3AFE": "applications/industrial-platform-oil-prefabricated-substation-site.webp",
    "ID_9286071A979E4118BF70E81B99473020": "applications/oil-prefabricated-substation-site-01.webp",
    "ID_CEA0248887CB4E6F98FF5C7C1A648D93": "products/prefabricated-substations/oil-prefabricated-substation-lv-cabinet-interior.webp",
    "ID_6C6920D2F677470ABAE32640E71498CA": "products/prefabricated-substations/oil-prefabricated-substation-hv-compartment-interior.webp",
    "ID_457A3724F8AF4D38A8E32B2338A6359B": "factory/oil-prefabricated-substation-assembly.webp",
    "ID_4489069894E94C7EBE69D2B59EAF467B": "products/combined-transformers/american-type-combined-transformer-exterior-01.webp",
    "ID_75C0E11ADE7A4FFEB35FCE5CAFBF4F83": "products/combined-transformers/american-type-combined-transformer-exterior-02.webp",
    "ID_6F271BFCD3A04EA68BEF5C6D5DADEE74": "applications/floating-solar-combined-transformer-site.webp",
    "ID_C156CD7BA84A4A2F960A0F4DB1352603": "products/combined-transformers/american-type-combined-transformer-lv-cabinet-interior.webp",
    "ID_7BB3CA0295F54E1ABB76019633FCEACB": "factory/combined-transformer-wiring-assembly.webp",
    "ID_9B211A4C2CEE4729A12219F332AEB64F": "products/combined-transformers/american-type-combined-transformer-busbar-interior.webp",
}


def extract_workbook_images() -> list[dict]:
    out_dir = ROOT / "source-media"
    out_dir.mkdir(parents=True, exist_ok=True)
    records = []
    with zipfile.ZipFile(WORKBOOK) as archive:
        images_xml = ET.fromstring(archive.read("xl/cellimages.xml"))
        rels_xml = ET.fromstring(archive.read("xl/_rels/cellimages.xml.rels"))
        rel_targets = {
            rel.attrib["Id"]: rel.attrib["Target"]
            for rel in rels_xml
        }
        ns = {
            "xdr": "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing",
            "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
            "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        }
        for cell_image in images_xml:
            name = cell_image.find(".//xdr:cNvPr", ns).attrib["name"]
            if name not in IMAGE_NAMES:
                continue
            rid = cell_image.find(".//a:blip", ns).attrib[f"{{{ns['r']}}}embed"]
            member = "xl/" + rel_targets[rid]
            image = Image.open(BytesIO(archive.read(member))).convert("RGB")
            if image.width > 1800:
                height = round(image.height * 1800 / image.width)
                image = image.resize((1800, height), Image.Resampling.LANCZOS)
            target = out_dir / IMAGE_NAMES[name]
            target.parent.mkdir(parents=True, exist_ok=True)
            image.save(target, "WEBP", quality=88, method=6)
            records.append({
                "id": name,
                "source": member,
                "target": target.relative_to(ROOT).as_posix(),
                "width": image.width,
                "height": image.height,
            })
    return records


def make_contact_sheet(records: list[dict]) -> Path:
    thumb_w, thumb_h = 320, 240
    columns = 3
    rows = (len(records) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * thumb_w, rows * (thumb_h + 44)), "#eef2f5")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for index, record in enumerate(records):
        image = Image.open(ROOT / record["target"]).convert("RGB")
        image.thumbnail((thumb_w - 16, thumb_h - 16), Image.Resampling.LANCZOS)
        x = (index % columns) * thumb_w + (thumb_w - image.width) // 2
        y = (index // columns) * (thumb_h + 44) + (thumb_h - image.height) // 2
        sheet.paste(image, (x, y))
        label = Path(record["target"]).stem
        draw.text(((index % columns) * thumb_w + 8, y + image.height + 8), label, fill="#17324d", font=font)
    target = TMP / "workbook-products-contact-sheet.jpg"
    sheet.save(target, quality=90)
    return target


def compact_text(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def index_pdfs() -> list[dict]:
    records = []
    for pdf in sorted((ROOT / "新补充").rglob("*.pdf")):
        reader = PdfReader(str(pdf))
        pages = []
        for number, page in enumerate(reader.pages, start=1):
            try:
                text = compact_text(page.extract_text() or "")
            except Exception as exc:
                text = f"[extract-error: {exc}]"
            pages.append({"page": number, "text": text[:1400]})
        records.append({
            "path": pdf.relative_to(ROOT).as_posix(),
            "pages": len(reader.pages),
            "sizeMb": round(pdf.stat().st_size / 1024 / 1024, 2),
            "pageText": pages,
        })
    return records


def main() -> None:
    images = extract_workbook_images()
    contact_sheet = make_contact_sheet(images)
    pdfs = index_pdfs()
    result = {
        "workbookImages": images,
        "contactSheet": contact_sheet.relative_to(ROOT).as_posix(),
        "pdfs": pdfs,
    }
    output = TMP / "source-index.json"
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({
        "images": len(images),
        "pdfs": len(pdfs),
        "pages": sum(item["pages"] for item in pdfs),
        "index": output.relative_to(ROOT).as_posix(),
        "contactSheet": contact_sheet.relative_to(ROOT).as_posix(),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
