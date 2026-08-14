(() => {
  const all = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const one = (selector, scope = document) => scope.querySelector(selector);

  all("[data-certificate-3d]").forEach((stage) => {
    const ring = one(".certificate-3d-ring", stage);
    if (!ring) return;

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let rotation = -12;
    let velocity = -.16;
    let paused = false;
    let dragging = false;
    let dragged = false;
    let lastX = 0;
    let travel = 0;

    const render = () => ring.style.setProperty("--rotation", `${rotation}deg`);
    const release = () => {
      dragging = false;
      stage.classList.remove("dragging");
      if (!stage.matches(":hover") && !stage.matches(":focus-within")) paused = false;
    };

    const tick = () => {
      if (!paused && !dragging && !reducedMotion.matches) {
        rotation += velocity;
        render();
      }
      requestAnimationFrame(tick);
    };

    stage.addEventListener("mouseenter", () => { paused = true; });
    stage.addEventListener("mouseleave", () => { if (!dragging && !stage.matches(":focus-within")) paused = false; });
    stage.addEventListener("focusin", () => { paused = true; });
    stage.addEventListener("focusout", () => { if (!dragging && !stage.matches(":hover")) paused = false; });

    stage.addEventListener("pointerdown", (event) => {
      dragging = true;
      dragged = false;
      travel = 0;
      paused = true;
      lastX = event.clientX;
      stage.classList.add("dragging");
      stage.setPointerCapture?.(event.pointerId);
    });

    stage.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const delta = event.clientX - lastX;
      lastX = event.clientX;
      travel += Math.abs(delta);
      if (travel > 7) dragged = true;
      rotation += delta * .38;
      if (Math.abs(delta) > .2) velocity = Math.max(-1.25, Math.min(1.25, delta * .08));
      render();
    });

    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);
    stage.addEventListener("click", (event) => {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    }, true);

    render();
    requestAnimationFrame(tick);
  });
})();
