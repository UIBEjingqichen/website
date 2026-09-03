import { documentById, drawingById } from "./documents-data.mjs";

const esc = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[character]));

export const mediaUrl = (source, depth = "") => `${depth}assets/media/${source}`;

const typeLabel = (type) => ({
  "certificate": "Certificate",
  "type-test": "Type Test",
  "test-report": "Test Report",
  "ce-verification": "CE Verification",
  "efficiency-report": "Efficiency Report",
  "drawing": "Drawing",
  "factory-document": "Factory Document"
}[type] || type);

export function evidenceCard(document, depth = "", compact = false) {
  const available = document.previewImages.length > 0;
  const cover = available ? mediaUrl(document.previewImages[0], depth) : "";
  return `<article class="evidence-card${compact ? " compact" : ""}" data-evidence-card data-product="${esc(document.productIds.join(" "))}" data-type="${esc(document.type)}" data-voltage="${esc(document.voltage || "")}" data-issuer="${esc(document.issuer || "")}">
    <${available ? "button" : "div"} class="evidence-cover" ${available ? `type="button" data-evidence-open="${esc(document.id)}" aria-label="View key pages for ${esc(document.title)}"` : ""}>
      ${available ? `<img src="${cover}" alt="${esc(document.title)} cover preview" loading="lazy">` : `<div class="asset-pending"><span>Asset pending</span><strong>${esc(document.testedModel)}</strong></div>`}
      <div class="document-tags">${document.tags.map((tag) => `<span class="document-tag">${esc(tag)}</span>`).join("")}</div>
    </${available ? "button" : "div"}>
    <div class="evidence-copy">
      <p class="eyebrow">${esc(document.issuer || "Recorded document")}</p>
      <h3>${esc(document.title)}</h3>
      <p>${esc(document.ratedPower)} · ${esc(document.ratedVoltage)}</p>
      ${document.reportNo ? `<small>${esc(document.reportNo)}</small>` : ""}
      <div class="card-actions">
        ${document.pdf ? `<a class="text-link" href="${mediaUrl(document.pdf, depth)}" target="_blank" rel="noopener">View Report</a>` : ""}
        ${available ? `<button class="text-button" type="button" data-evidence-open="${esc(document.id)}">View Key Pages</button>` : ""}
      </div>
    </div>
  </article>`;
}

export function evidenceTemplates(documents, depth = "") {
  return documents.filter((document) => document.previewImages.length).map((document) => `<template data-evidence-template="${esc(document.id)}">
    <div class="evidence-modal-layout">
      <div class="evidence-preview-strip">
        ${document.previewImages.map((image, index) => `<button type="button" data-evidence-page="${index}" aria-label="View page ${index + 1}"><img src="${mediaUrl(image, depth)}" alt="${esc(document.title)} key page ${index + 1}" loading="lazy"></button>`).join("")}
      </div>
      <div class="evidence-detail">
        <p class="eyebrow">${esc(typeLabel(document.type))}</p>
        <h2>${esc(document.title)}</h2>
        <dl>
          ${[
            ["Testing Organization", document.issuer],
            ["Report Number", document.reportNo],
            ["Tested Model", document.testedModel],
            ["Rated Capacity", document.ratedPower],
            ["Rated Voltage", document.ratedVoltage],
            ["Standard", document.standards.join(", ") || null],
            ["Report Type", typeLabel(document.type)]
          ].filter(([, value]) => value).map(([label, value]) => `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`).join("")}
        </dl>
        ${document.pdf ? `<a class="btn btn-primary" href="${mediaUrl(document.pdf, depth)}" target="_blank" rel="noopener">Open Full PDF</a>` : ""}
      </div>
    </div>
  </template>`).join("");
}

export function evidenceModal() {
  return `<div class="evidence-modal" data-evidence-modal aria-hidden="true">
    <div class="modal-backdrop" data-evidence-close></div>
    <section class="evidence-dialog" role="dialog" aria-modal="true" aria-label="Evidence document">
      <button class="modal-close" type="button" aria-label="Close evidence viewer" data-evidence-close>×</button>
      <div data-evidence-content></div>
    </section>
  </div>`;
}

export function evidenceCarousel(documents, depth = "", options = {}) {
  const id = options.id || "evidence-carousel";
  const compact = Boolean(options.compact);
  return `<div class="evidence-carousel${compact ? " compact" : ""}" data-evidence-carousel id="${esc(id)}" tabindex="0" aria-label="Certificates and test reports carousel">
    <button class="carousel-arrow previous" type="button" data-carousel-prev aria-label="Previous evidence">←</button>
    <div class="evidence-track" data-carousel-track>
      ${documents.map((document, index) => `<div class="evidence-slide" data-carousel-slide data-index="${index}">${evidenceCard(document, depth, compact)}</div>`).join("")}
    </div>
    <button class="carousel-arrow next" type="button" data-carousel-next aria-label="Next evidence">→</button>
  </div>
  ${evidenceTemplates(documents, depth)}`;
}

export function drawingGallery(ids, depth = "") {
  const drawings = ids.map((id) => drawingById.get(id)).filter(Boolean);
  if (!drawings.length) return "";
  return `<section class="product-section drawing-gallery" id="drawings">
    <div class="section-head"><div><p class="eyebrow">Engineering Drawings</p><h2>Reference Drawings</h2></div><p>Final drawings are issued against the approved project design.</p></div>
    <div class="drawing-grid">
      ${drawings.map((drawing) => `<article class="drawing-card">
        <button type="button" data-drawing-open data-drawing-src="${mediaUrl(drawing.image, depth)}" data-drawing-title="${esc(drawing.title)}">
          <img src="${mediaUrl(drawing.image, depth)}" alt="${esc(drawing.title)} preview" loading="lazy">
          <span>${esc(drawing.type)}</span><strong>${esc(drawing.title)}</strong>
        </button>
        <p>${esc(drawing.note)}</p>
      </article>`).join("")}
    </div>
  </section>`;
}

export function drawingViewer() {
  return `<div class="drawing-viewer" data-drawing-viewer aria-hidden="true">
    <div class="modal-backdrop" data-drawing-close></div>
    <section class="drawing-dialog" role="dialog" aria-modal="true" aria-label="Engineering drawing viewer">
      <header><div><p class="eyebrow">Reference Drawing</p><h2 data-drawing-title></h2></div><button type="button" class="modal-close" aria-label="Close drawing viewer" data-drawing-close>×</button></header>
      <div class="drawing-toolbar">
        <button type="button" data-drawing-zoom-out aria-label="Zoom out">−</button>
        <button type="button" data-drawing-zoom-in aria-label="Zoom in">+</button>
        <button type="button" data-drawing-reset>Reset</button>
        <button type="button" data-drawing-fullscreen>Fullscreen</button>
      </div>
      <div class="drawing-stage" data-drawing-stage><img data-drawing-image alt=""></div>
      <p>REFERENCE DRAWING · Final drawing subject to project design.</p>
    </section>
  </div>`;
}

export function documentsForProduct(product) {
  return product.evidenceIds.map((id) => documentById.get(id)).filter(Boolean);
}
