from __future__ import annotations

import hashlib
import json
import re
import shutil
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "source-media"
PLAN_PATH = MEDIA / "MEDIA_RENAME_PLAN.json"
TEXT_EXTS = {".py", ".mjs", ".js", ".json", ".yaml", ".yml", ".md", ".html", ".css", ".txt", ".csv", ".xml"}
SKIP_DIRS = {".git", "dist", "tmp", "node_modules"}
PLAN_SKIP = {PLAN_PATH.resolve()}
EXPECTED_RENAMES = 124


def digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        while chunk := f.read(1024 * 1024):
            h.update(chunk)
    return h.hexdigest()


def load_plan() -> list[dict]:
    data = json.loads(PLAN_PATH.read_text(encoding="utf-8"))
    items = data["renames"]
    if len(items) != EXPECTED_RENAMES:
        raise RuntimeError(f"Rename plan expected {EXPECTED_RENAMES} entries, got {len(items)}")
    return items


def validate_sources(items: list[dict]) -> None:
    missing = []
    mismatched = []
    for item in items:
        path = MEDIA / item["old"]
        if not path.exists():
            missing.append(item["old"])
            continue
        actual = digest(path)
        if actual != item["sha256"]:
            mismatched.append((item["old"], item["sha256"], actual))
    if missing:
        raise RuntimeError(f"Missing planned source assets ({len(missing)}): {missing[:12]}")
    if mismatched:
        raise RuntimeError(f"Source assets changed since audit: {mismatched[:6]}")


def rename_assets(items: list[dict]) -> tuple[int, int]:
    grouped: dict[str, list[dict]] = defaultdict(list)
    for item in items:
        grouped[item["new"]].append(item)

    renamed = 0
    duplicates_removed = 0
    for new_rel, group in sorted(grouped.items()):
        sources = [MEDIA / item["old"] for item in group]
        shas = {item["sha256"] for item in group}
        if len(shas) != 1:
            raise RuntimeError(f"Non-identical files converge to {new_rel}")
        target = MEDIA / new_rel
        target.parent.mkdir(parents=True, exist_ok=True)

        # If target already exists, it must be exactly the audited image.
        if target.exists():
            if digest(target) != next(iter(shas)):
                raise RuntimeError(f"Destination collision with different bytes: {new_rel}")
        else:
            shutil.move(str(sources[0]), str(target))
            renamed += 1

        for source in sources:
            if source == target:
                continue
            if source.exists():
                if digest(source) != digest(target):
                    raise RuntimeError(f"Duplicate source differs from canonical target: {source}")
                source.unlink()
                duplicates_removed += 1
    return renamed, duplicates_removed


def replace_references(items: list[dict]) -> dict[str, int]:
    mapping = {item["old"]: item["new"] for item in items}
    changes: dict[str, int] = {}
    # Longest first avoids partial path substitutions.
    pairs = sorted(mapping.items(), key=lambda kv: len(kv[0]), reverse=True)

    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTS:
            continue
        rel_parts = path.relative_to(ROOT).parts
        if any(part in SKIP_DIRS for part in rel_parts):
            continue
        if path.resolve() in PLAN_SKIP:
            continue
        try:
            original = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        text = original
        count = 0
        for old, new in pairs:
            # Exact relative media path in source/config data.
            n = text.count(old)
            if n:
                text = text.replace(old, new)
                count += n
        if text != original:
            path.write_text(text, encoding="utf-8")
            changes[path.relative_to(ROOT).as_posix()] = count
    return changes


def fix_prepare_site_media() -> None:
    path = ROOT / "tools" / "prepare_site_media.py"
    text = path.read_text(encoding="utf-8")
    text = text.replace('["cover", "summary", "parameters", "product-photo"]', '["cover", "summary", "parameters", "sample-photo-page"]')
    old_target = 'target = MEDIA / "evidence" / f"{doc_id}-{label}.webp"\n            render_page(source_pdf, page, target)'
    new_target = 'target = (MEDIA / "evidence" / "sample-photo-pages" / f"{doc_id}-sample-photo-page.webp") if label == "sample-photo-page" else (MEDIA / "evidence" / f"{doc_id}-{label}.webp")\n            render_page(source_pdf, page, target)'
    if old_target in text:
        text = text.replace(old_target, new_target)
    # Permanently remove the old behavior that copied report pages into products/.
    text = re.sub(
        r'\n    gallery_sources = \{[\s\S]*?\n    for product_name, evidence_name in gallery_sources\.items\(\):\n        shutil\.copy2\(MEDIA / "evidence" / evidence_name, MEDIA / "products" / product_name\)\n',
        '\n    # Report sample-photo pages remain evidence only; never copy them into products/.\n',
        text,
        count=1,
    )
    path.write_text(text, encoding="utf-8")


def fix_workbook_extractor(items: list[dict]) -> None:
    path = ROOT / "tools" / "inspect_sources.py"
    text = path.read_text(encoding="utf-8")
    workbook = {item["old"]: item["new"] for item in items if item.get("source") == "workbook"}
    for old, new in workbook.items():
        old_name = Path(old).name
        text = text.replace(f'"{old_name}"', f'"{new}"')
    text = text.replace('out_dir = ROOT / "source-media" / "products"', 'out_dir = ROOT / "source-media"')
    text = text.replace('target = out_dir / IMAGE_NAMES[name]\n            image.save', 'target = out_dir / IMAGE_NAMES[name]\n            target.parent.mkdir(parents=True, exist_ok=True)\n            image.save')
    path.write_text(text, encoding="utf-8")


def rewrite_legacy_sync(items: list[dict]) -> None:
    required = sorted({item["new"] for item in items if item.get("marketing_use") == "yes"})
    path = ROOT / "src" / "rename-images.mjs"
    required_js = ",\n  ".join(json.dumps(x) for x in required)
    content = f'''import fs from "fs";\nimport path from "path";\nimport {{ fileURLToPath }} from "url";\n\nconst __dirname = path.dirname(fileURLToPath(import.meta.url));\nconst root = path.resolve(__dirname, "..");\nconst mediaDir = path.join(root, "source-media");\n\n// V3 media library is canonical. This command validates names; it never recreates legacy imageXX aliases.\nconst requiredMedia = [\n  {required_js}\n];\n\nconst missing = requiredMedia.filter((relativePath) => !fs.existsSync(path.join(mediaDir, relativePath)));\nif (missing.length) {{\n  throw new Error(`Missing canonical media: ${{missing.join(", ")}}`);\n}}\n\nconst legacy = fs.readdirSync(mediaDir).filter((name) => /^image\\d+\\.(?:jpe?g|png|webp)$/i.test(name));\nif (legacy.length) {{\n  throw new Error(`Legacy root image aliases remain: ${{legacy.join(", ")}}`);\n}}\n\nconsole.log(`Canonical media validation complete. Verified ${{requiredMedia.length}} marketing-capable assets.`);\n'''
    path.write_text(content, encoding="utf-8")


def rewrite_usage_doc() -> None:
    content = '''# Tianyu Source Media Library\n\nThis folder is the canonical media source for the website. Names use lowercase English kebab-case and semantic folders.\n\n## Canonical folders\n\n- `products/power-transformers/`: power transformer product imagery\n- `products/distribution-transformers/`: oil-immersed distribution transformer imagery\n- `products/dry-type-transformers/`: dry-type transformer imagery\n- `products/combined-transformers/`: American-type / combined transformer imagery\n- `products/prefabricated-substations/`: prefabricated / compact substation product imagery\n- `products/switchgear/`: switchgear and circuit-breaker product imagery\n- `products/special-transformers/`: special transformer imagery\n- `factory/`: manufacturing, wiring, assembly and inspection photographs\n- `company/`: company and campus imagery\n- `applications/`: contextual/site/application imagery whose project provenance is not independently verified\n- `branding/`: logos and social/OG artwork\n- `decorative/`: brochure backgrounds and non-product illustrations; not preferred for website product cards\n- `catalog-v3/`: curated plates derived from the supplied catalog\n- `evidence/`: certificate and test-report evidence\n- `evidence/sample-photo-pages/`: **full report sample-photo pages; evidence only**\n- `drawings/`: engineering drawing previews\n- `catalog-assets/`: generated report-page derivatives retained by document id and page number\n\n## Hard rules\n\n1. Files under `evidence/`, `catalog-assets/`, and `drawings/` are evidence/reference assets, not marketing product photography.\n2. In particular, `evidence/sample-photo-pages/` must never be used as a product card, hero, homepage gallery, or product gallery image.\n3. Prefer clean catalog imagery, workbook product originals, and independent product-library images for marketing pages.\n4. `applications/` does not imply a verified Tianyu project. Do not relabel an application image as a project/case without provenance.\n5. Legacy root names such as `applications/utility-scale-solar-farm-aerial-02.jpeg` are prohibited.\n\nSee `MEDIA_RENAME_PLAN.json` for the audited old-to-canonical path history and `MEDIA_INVENTORY.json` for the post-cleanup library inventory.\n'''
    (MEDIA / "IMAGE_USAGE.md").write_text(content, encoding="utf-8")


def classify_canonical(rel: str) -> tuple[str, str]:
    p = rel.lower()
    if p.startswith("products/"):
        return "product", "yes"
    if p.startswith("factory/") or p.startswith("company/") or p.startswith("branding/"):
        return p.split("/", 1)[0], "yes"
    if p.startswith("applications/"):
        return "application", "conditional"
    if p.startswith("decorative/"):
        return "decorative", "no"
    if p.startswith("catalog-v3/"):
        return "catalog-curated", "conditional"
    if p.startswith("evidence/sample-photo-pages/"):
        return "evidence-sample-page", "no"
    if p.startswith("evidence/"):
        return "evidence", "no"
    if p.startswith("drawings/"):
        return "evidence-drawing", "no"
    if p.startswith("catalog-assets/certifications/"):
        return "generated-report-certification-page", "no"
    if p.startswith("catalog-assets/drawings/"):
        return "generated-report-drawing-page", "no"
    if p.startswith("catalog-assets/images/"):
        return "generated-report-page", "no"
    return "other", "conditional"


def write_inventory() -> None:
    exts = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
    assets = []
    for path in sorted(p for p in MEDIA.rglob("*") if p.is_file() and p.suffix.lower() in exts):
        rel = path.relative_to(MEDIA).as_posix()
        category, marketing = classify_canonical(rel)
        assets.append({
            "path": rel,
            "category": category,
            "marketing_use": marketing,
            "bytes": path.stat().st_size,
            "sha256": digest(path),
        })
    dups = defaultdict(list)
    for a in assets:
        dups[a["sha256"]].append(a["path"])
    duplicate_groups = [paths for paths in dups.values() if len(paths) > 1]
    result = {
        "version": 1,
        "image_paths": len(assets),
        "unique_binary_images": len(dups),
        "duplicate_groups": duplicate_groups,
        "category_counts": dict(sorted(Counter(a["category"] for a in assets).items())),
        "assets": assets,
    }
    (MEDIA / "MEDIA_INVENTORY.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")


def validate_post_cleanup(items: list[dict]) -> None:
    legacy = [p.name for p in MEDIA.iterdir() if p.is_file() and re.fullmatch(r"image\d+\.(?:jpe?g|png|webp)", p.name, re.I)]
    if legacy:
        raise RuntimeError(f"Legacy imageXX files remain: {legacy}")
    for item in items:
        if (MEDIA / item["old"]).exists() and item["old"] != item["new"]:
            raise RuntimeError(f"Old media path remains: {item['old']}")
        if not (MEDIA / item["new"]).exists():
            raise RuntimeError(f"Canonical media path missing: {item['new']}")
    # The most dangerous historical copies must be gone from products/.
    bad = list((MEDIA / "products").glob("power-transformer-*mva*.webp")) + list((MEDIA / "products").glob("dry-type-transformer-scb18-*.webp"))
    if bad:
        raise RuntimeError(f"Report-derived full pages still masquerade as products: {[p.name for p in bad]}")


def main() -> None:
    items = load_plan()
    validate_sources(items)
    renamed, duplicates_removed = rename_assets(items)
    changed_refs = replace_references(items)
    fix_prepare_site_media()
    fix_workbook_extractor(items)
    rewrite_legacy_sync(items)
    rewrite_usage_doc()
    write_inventory()
    validate_post_cleanup(items)
    print(json.dumps({
        "planned_paths": len(items),
        "canonical_destinations": len({i['new'] for i in items}),
        "files_moved_to_new_names": renamed,
        "duplicate_old_paths_removed": duplicates_removed,
        "text_files_with_reference_updates": len(changed_refs),
        "reference_replacements": sum(changed_refs.values()),
        "changed_reference_files": changed_refs,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
