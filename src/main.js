const body = document.body;
const bySelector = (selector, scope = document) => scope.querySelector(selector);
const all = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const menuButton = bySelector("[data-menu-toggle]");
const navigation = bySelector("[data-nav]");
menuButton?.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

const quoteModal = bySelector("[data-quote-modal]");
let lastFocused = null;
function setModalState(modal, open) {
  if (!modal) return;
  modal.classList.toggle("open", open);
  modal.setAttribute("aria-hidden", String(!open));
  body.classList.toggle("modal-open", open);
  if (open) {
    lastFocused = document.activeElement;
    bySelector("input,button,a,select,textarea", modal)?.focus();
  } else {
    lastFocused?.focus?.();
  }
}
all("[data-quote-open]").forEach((button) => button.addEventListener("click", () => setModalState(quoteModal, true)));
all("[data-quote-close]", quoteModal || document).forEach((button) => button.addEventListener("click", () => setModalState(quoteModal, false)));

all(".quote-form").forEach((form) => form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = bySelector(".form-message", form);
  if (message) message.textContent = "Your inquiry details are ready for the Tianyu engineering review workflow.";
}));

function setupEvidenceCarousel(carousel) {
  const slides = all("[data-carousel-slide]", carousel);
  if (!slides.length) return;
  let active = 0;
  let timer = null;
  let dragging = false;
  let startX = 0;

  const render = () => {
    slides.forEach((slide, index) => {
      let delta = index - active;
      if (delta > slides.length / 2) delta -= slides.length;
      if (delta < -slides.length / 2) delta += slides.length;
      const position = Math.max(-3, Math.min(3, delta));
      slide.dataset.position = String(position);
      slide.setAttribute("aria-hidden", String(Math.abs(position) > 2));
    });
  };
  const move = (direction) => {
    active = (active + direction + slides.length) % slides.length;
    render();
  };
  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };
  const start = () => {
    stop();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.innerWidth > 760) {
      timer = window.setInterval(() => move(1), 5600);
    }
  };
  bySelector("[data-carousel-prev]", carousel)?.addEventListener("click", () => move(-1));
  bySelector("[data-carousel-next]", carousel)?.addEventListener("click", () => move(1));
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });
  carousel.addEventListener("pointerdown", (event) => {
    dragging = true;
    startX = event.clientX;
    carousel.setPointerCapture?.(event.pointerId);
    stop();
  });
  carousel.addEventListener("pointerup", (event) => {
    if (!dragging) return;
    const distance = event.clientX - startX;
    if (Math.abs(distance) > 40) move(distance > 0 ? -1 : 1);
    dragging = false;
    start();
  });
  carousel.addEventListener("pointercancel", () => {
    dragging = false;
    start();
  });
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);
  render();
  start();
}
all("[data-evidence-carousel]").forEach(setupEvidenceCarousel);

const evidenceModal = bySelector("[data-evidence-modal]");
const evidenceContent = bySelector("[data-evidence-content]", evidenceModal || document);
all("[data-evidence-open]").forEach((button) => button.addEventListener("click", () => {
  const template = bySelector(`[data-evidence-template="${CSS.escape(button.dataset.evidenceOpen)}"]`);
  if (!template || !evidenceContent) return;
  evidenceContent.replaceChildren(template.content.cloneNode(true));
  setModalState(evidenceModal, true);
}));
all("[data-evidence-close]", evidenceModal || document).forEach((button) => button.addEventListener("click", () => setModalState(evidenceModal, false)));

function setupGallery(gallery) {
  const main = bySelector("[data-gallery-main]", gallery);
  const thumbs = all("[data-gallery-thumb]", gallery);
  let active = 0;
  let startX = null;
  const show = (index) => {
    active = (index + thumbs.length) % thumbs.length;
    const thumb = thumbs[active];
    main.src = thumb.dataset.src;
    main.alt = thumb.dataset.alt;
    thumbs.forEach((item, itemIndex) => item.classList.toggle("active", itemIndex === active));
  };
  thumbs.forEach((thumb, index) => thumb.addEventListener("click", () => show(index)));
  bySelector("[data-gallery-prev]", gallery)?.addEventListener("click", () => show(active - 1));
  bySelector("[data-gallery-next]", gallery)?.addEventListener("click", () => show(active + 1));
  bySelector("[data-gallery-open]", gallery)?.addEventListener("click", () => openImageLightbox(main.src, main.alt));
  const mainButton = bySelector("[data-gallery-open]", gallery);
  mainButton?.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
    mainButton.setPointerCapture?.(event.pointerId);
  });
  mainButton?.addEventListener("pointerup", (event) => {
    if (startX == null) return;
    const distance = event.clientX - startX;
    startX = null;
    if (Math.abs(distance) > 42) {
      event.preventDefault();
      show(active + (distance < 0 ? 1 : -1));
    }
  });
  mainButton?.addEventListener("pointercancel", () => { startX = null; });
}
all("[data-product-gallery]").forEach(setupGallery);

let imageLightbox = null;
function openImageLightbox(source, alt) {
  if (!imageLightbox) {
    imageLightbox = document.createElement("div");
    imageLightbox.className = "image-lightbox";
    imageLightbox.innerHTML = '<div class="modal-backdrop" data-image-close></div><section role="dialog" aria-modal="true" aria-label="Product image"><button class="modal-close" type="button" data-image-close aria-label="Close image">×</button><img data-image-full></section>';
    body.append(imageLightbox);
    all("[data-image-close]", imageLightbox).forEach((button) => button.addEventListener("click", () => setModalState(imageLightbox, false)));
  }
  const image = bySelector("[data-image-full]", imageLightbox);
  image.src = source;
  image.alt = alt;
  setModalState(imageLightbox, true);
}

const drawingViewer = bySelector("[data-drawing-viewer]");
const drawingImage = bySelector("[data-drawing-image]", drawingViewer || document);
const drawingStage = bySelector("[data-drawing-stage]", drawingViewer || document);
let drawingScale = 1;
let drawingX = 0;
let drawingY = 0;
let drawingDragging = false;
let drawingStart = [0, 0];
function renderDrawing() {
  if (drawingImage) drawingImage.style.transform = `translate(${drawingX}px,${drawingY}px) scale(${drawingScale})`;
}
function resetDrawing() {
  drawingScale = 1;
  drawingX = 0;
  drawingY = 0;
  renderDrawing();
}
all("[data-drawing-open]").forEach((button) => button.addEventListener("click", () => {
  if (!drawingViewer || !drawingImage) return;
  drawingImage.src = button.dataset.drawingSrc;
  drawingImage.alt = button.dataset.drawingTitle;
  bySelector("[data-drawing-title]", drawingViewer).textContent = button.dataset.drawingTitle;
  resetDrawing();
  setModalState(drawingViewer, true);
}));
all("[data-drawing-close]", drawingViewer || document).forEach((button) => button.addEventListener("click", () => setModalState(drawingViewer, false)));
bySelector("[data-drawing-zoom-in]", drawingViewer || document)?.addEventListener("click", () => {
  drawingScale = Math.min(4, drawingScale + 0.25);
  renderDrawing();
});
bySelector("[data-drawing-zoom-out]", drawingViewer || document)?.addEventListener("click", () => {
  drawingScale = Math.max(0.5, drawingScale - 0.25);
  renderDrawing();
});
bySelector("[data-drawing-reset]", drawingViewer || document)?.addEventListener("click", resetDrawing);
bySelector("[data-drawing-fullscreen]", drawingViewer || document)?.addEventListener("click", () => drawingViewer?.requestFullscreen?.());
drawingStage?.addEventListener("pointerdown", (event) => {
  drawingDragging = true;
  drawingStart = [event.clientX - drawingX, event.clientY - drawingY];
  drawingStage.setPointerCapture?.(event.pointerId);
});
drawingStage?.addEventListener("pointermove", (event) => {
  if (!drawingDragging) return;
  drawingX = event.clientX - drawingStart[0];
  drawingY = event.clientY - drawingStart[1];
  renderDrawing();
});
drawingStage?.addEventListener("pointerup", () => { drawingDragging = false; });
drawingStage?.addEventListener("pointercancel", () => { drawingDragging = false; });

function setupProductFilter(panel) {
  const cards = all("[data-product-index]");
  const type = bySelector("[data-filter-type]", panel);
  const voltage = bySelector("[data-filter-voltage]", panel);
  const application = bySelector("[data-filter-application]", panel);
  const filter = () => cards.forEach((card) => {
    const typeMatch = type.value === "all" || card.dataset.type === type.value;
    const voltageMatch = voltage.value === "all" || card.dataset.voltage.split(" ").includes(voltage.value);
    const applicationMatch = application.value === "all" || card.dataset.application.includes(application.value);
    card.hidden = !(typeMatch && voltageMatch && applicationMatch);
  });
  [type, voltage, application].forEach((input) => input?.addEventListener("change", filter));
}
all("[data-product-filter]").forEach(setupProductFilter);

function setupProjectFilter(panel) {
  const cards = all("[data-project-card]");
  const application = bySelector("[data-project-application]", panel);
  const product = bySelector("[data-project-product]", panel);
  const count = bySelector("[data-project-count]", panel);
  const filter = () => {
    let visible = 0;
    cards.forEach((card) => {
      const match = (application.value === "all" || card.dataset.application === application.value)
        && (product.value === "all" || card.dataset.product === product.value);
      card.hidden = !match;
      if (match) visible += 1;
    });
    if (count) count.textContent = String(visible);
  };
  [application, product].forEach((input) => input?.addEventListener("change", filter));
}
all("[data-project-filter]").forEach(setupProjectFilter);

function setupDocumentFilter(panel) {
  const cards = all("[data-evidence-card]");
  const controls = {
    product: bySelector("[data-document-product]", panel),
    type: bySelector("[data-document-type]", panel),
    voltage: bySelector("[data-document-voltage]", panel),
    issuer: bySelector("[data-document-issuer]", panel)
  };
  const filter = () => cards.forEach((card) => {
    const match = (controls.product.value === "all" || card.dataset.product.includes(controls.product.value))
      && (controls.type.value === "all" || card.dataset.type === controls.type.value)
      && (controls.voltage.value === "all" || card.dataset.voltage === controls.voltage.value)
      && (controls.issuer.value === "all" || card.dataset.issuer === controls.issuer.value);
    card.hidden = !match;
  });
  Object.values(controls).forEach((input) => input?.addEventListener("change", filter));
}
all("[data-document-filter]").forEach(setupDocumentFilter);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  [quoteModal, evidenceModal, drawingViewer, imageLightbox].forEach((modal) => {
    if (modal?.classList.contains("open")) setModalState(modal, false);
  });
});
