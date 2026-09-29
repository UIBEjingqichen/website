"""Capture the eight review routes at the three agreed viewport widths."""

import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


PAGES = {
    "home": "index.html",
    "products": "products.html",
    "family": "products/oil-immersed-distribution-transformer/index.html",
    "detail": "products/110kv-power-transformer/index.html",
    "applications": "applications.html",
    "resources": "resources.html",
    "knowledge": "knowledge/index.html",
    "faq": "knowledge/faq/transformer-impedance-voltage.html",
}
VIEWPORTS = ((375, 812), (768, 1024), (1440, 900))


def main():
    destination = Path(sys.argv[1] if len(sys.argv) > 1 else "visual-artifacts")
    destination.mkdir(parents=True, exist_ok=True)
    failures = []
    with sync_playwright() as playwright:
        options = {"headless": True}
        if os.environ.get("CHROME_PATH"):
            options["executable_path"] = os.environ["CHROME_PATH"]
        browser = playwright.chromium.launch(**options)
        for width, height in VIEWPORTS:
            context = browser.new_context(
                viewport={"width": width, "height": height},
                device_scale_factor=1,
                reduced_motion="reduce",
            )
            page = context.new_page()
            for label, route in PAGES.items():
                response = page.goto(
                    f"http://127.0.0.1:4173/{route}", wait_until="domcontentloaded"
                )
                if not response or response.status >= 400:
                    failures.append(f"{route}: HTTP {response.status if response else 'no response'}")
                    continue
                page.wait_for_timeout(400)
                document_height = page.evaluate("document.documentElement.scrollHeight")
                for position in range(0, document_height, max(350, int(height * 0.7))):
                    page.evaluate(
                        "top => window.scrollTo({top, behavior: 'instant'})", position
                    )
                    page.wait_for_timeout(60)
                page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
                page.wait_for_timeout(1200)
                page.screenshot(
                    path=destination / f"{label}-{width}.png",
                    full_page=True,
                    animations="disabled",
                )
                overflow = page.evaluate(
                    "document.documentElement.scrollWidth > window.innerWidth + 1"
                )
                if overflow:
                    failures.append(f"{route}: horizontal overflow at {width}px")
            context.close()
        browser.close()
    (destination / "validation.txt").write_text(
        "8 pages × 375/768/1440px; full-page screenshots.\n"
        + ("\n".join(failures) if failures else "No HTTP errors or horizontal overflow.\n"),
        encoding="utf-8",
    )
    if failures:
        raise SystemExit("\n".join(failures))


if __name__ == "__main__":
    main()
