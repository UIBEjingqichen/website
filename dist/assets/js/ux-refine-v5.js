(() => {
  const all = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const one = (selector, scope = document) => scope.querySelector(selector);

  all("[data-v5-coverflow]").forEach((carousel) => {
    const stage = one("[data-v5-coverflow-stage]", carousel);
    const cards = all("[data-v5-coverflow-card]", carousel);
    const previous = one("[data-v5-coverflow-prev]", carousel);
    const next = one("[data-v5-coverflow-next]", carousel);
    if (!stage || cards.length < 2) return;

    let active = 0;
    let dragging = false;
    let startX = 0;
    let dragX = 0;
    let timer;
    let moved = false;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

    const shortestOffset = (index) => {
      let offset = index - active;
      const half = cards.length / 2;
      if (offset > half) offset -= cards.length;
      if (offset < -half) offset += cards.length;
      return offset;
    };

    const render = () => {
      const spacing = innerWidth < 720 ? 112 : innerWidth < 1080 ? 150 : 188;
      cards.forEach((card, index) => {
        const offset = shortestOffset(index);
        const distance = Math.abs(offset);
        const visible = distance <= 3;
        card.style.setProperty("--x", `${offset * spacing}px`);
        card.style.setProperty("--depth", `${-Math.min(distance, 3) * 72}px`);
        card.style.setProperty("--rotate", `${offset * -13}deg`);
        card.style.setProperty("--scale", `${Math.max(.72, 1 - distance * .085)}`);
        card.style.setProperty("--opacity", visible ? `${Math.max(.28, 1 - distance * .23)}` : "0");
        card.style.setProperty("--z", `${10 - Math.min(distance, 9)}`);
        card.style.setProperty("--drag", `${dragX}px`);
        card.dataset.active = offset === 0 ? "true" : "false";
        card.style.pointerEvents = visible ? "auto" : "none";
      });
    };

    const go = (step) => {
      active = (active + step + cards.length) % cards.length;
      dragX = 0;
      render();
    };
    const stop = () => clearInterval(timer);
    const start = () => {
      stop();
      if (!reducedMotion.matches) timer = setInterval(() => go(1), 2700);
    };

    previous?.addEventListener("click", () => { go(-1); start(); });
    next?.addEventListener("click", () => { go(1); start(); });
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", () => { if (!dragging) start(); });
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);

    stage.addEventListener("pointerdown", (event) => {
      dragging = true;
      moved = false;
      startX = event.clientX;
      dragX = 0;
      stage.classList.add("dragging");
      stop();
      stage.setPointerCapture?.(event.pointerId);
    });
    stage.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      dragX = event.clientX - startX;
      if (Math.abs(dragX) > 7) moved = true;
      render();
    });
    const release = () => {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove("dragging");
      if (Math.abs(dragX) > 48) go(dragX < 0 ? 1 : -1);
      else { dragX = 0; render(); }
      setTimeout(start, 600);
    };
    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);
    stage.addEventListener("click", (event) => {
      if (moved) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
    addEventListener("resize", render);

    render();
    start();
  });

  all(".v5-model-gallery").forEach((gallery) => {
    const main = one(".v5-model-main-image", gallery);
    const thumbs = all("[data-v5-model-thumb]", gallery);
    if (!main) return;
    thumbs.forEach((thumb) => thumb.addEventListener("click", () => {
      const source = thumb.dataset.src;
      if (!source) return;
      main.src = source;
      thumbs.forEach((item) => item.classList.toggle("active", item === thumb));
    }));
  });
})();
