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
    let lastX = 0;

    const render = () => ring.style.setProperty("--rotation", `${rotation}deg`);
    const release = () => {
      dragging = false;
      stage.classList.remove("dragging");
      if (!stage.matches(":hover")) paused = false;
    };

    const tick = () => {
      if (!paused && !dragging && !reducedMotion.matches) {
        rotation += velocity;
        render();
      }
      requestAnimationFrame(tick);
    };

    stage.addEventListener("mouseenter", () => { paused = true; });
    stage.addEventListener("mouseleave", () => { if (!dragging) paused = false; });

    stage.addEventListener("pointerdown", (event) => {
      dragging = true;
      paused = true;
      lastX = event.clientX;
      stage.classList.add("dragging");
      stage.setPointerCapture?.(event.pointerId);
    });

    stage.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const delta = event.clientX - lastX;
      lastX = event.clientX;
      rotation += delta * .38;
      if (Math.abs(delta) > .2) velocity = Math.max(-1.25, Math.min(1.25, delta * .08));
      render();
    });

    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);

    render();
    requestAnimationFrame(tick);
  });
})();
