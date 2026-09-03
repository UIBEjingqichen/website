(() => {
  const all = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const one = (selector, scope = document) => scope.querySelector(selector);

  all("[data-wave-slider]").forEach((slider) => {
    const slides = all("[data-wave-slide]", slider);
    const dots = all("[data-wave-dot]", slider);
    if (slides.length < 2) return;
    let active = 0;
    let timer;
    const show = (index) => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("active", i === active));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === active));
    };
    const start = () => {
      clearInterval(timer);
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => show(active + 1), 5200);
    };
    dots.forEach((dot, index) => dot.addEventListener("click", () => { show(index); start(); }));
    show(0);
    start();
  });

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const animateCounter = (element) => {
    if (element.dataset.counted === "true") return;
    element.dataset.counted = "true";
    const raw = element.dataset.countUp || "0";
    const target = Number(String(raw).replace(/[^0-9.]/g, "")) || 0;
    const suffix = String(raw).replace(/[0-9.,\s]/g, "");
    const start = performance.now();
    const duration = target > 100 ? 1700 : 1300;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const value = Math.round(target * easeOut(progress));
      element.textContent = `${value.toLocaleString()}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counters = all("[data-count-up]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    }), { threshold: .35 });
    counters.forEach((counter) => observer.observe(counter));
  } else counters.forEach(animateCounter);

  all("[data-certificate-marquee]").forEach((viewport) => {
    const track = one(".certificate-marquee-track", viewport);
    if (!track) return;
    let paused = false;
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let last = performance.now();
    const run = (now) => {
      if (!paused && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const delta = Math.min(32, now - last);
        viewport.scrollLeft += delta * 0.035;
        const half = track.scrollWidth / 2;
        if (half > 0 && viewport.scrollLeft >= half) viewport.scrollLeft -= half;
      }
      last = now;
      requestAnimationFrame(run);
    };
    viewport.addEventListener("pointerdown", (event) => {
      dragging = true;
      paused = true;
      startX = event.clientX;
      startScroll = viewport.scrollLeft;
      viewport.classList.add("dragging");
      viewport.setPointerCapture?.(event.pointerId);
    });
    viewport.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      viewport.scrollLeft = startScroll - (event.clientX - startX);
    });
    const release = () => {
      dragging = false;
      paused = false;
      viewport.classList.remove("dragging");
    };
    viewport.addEventListener("pointerup", release);
    viewport.addEventListener("pointercancel", release);
    requestAnimationFrame(run);
  });

  all("[data-auto-gallery]").forEach((gallery) => {
    const next = one("[data-gallery-next]", gallery);
    if (!next) return;
    let timer;
    const stop = () => clearInterval(timer);
    const start = () => {
      stop();
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => next.click(), 4200);
    };
    gallery.addEventListener("pointerenter", stop);
    gallery.addEventListener("pointerleave", start);
    gallery.addEventListener("focusin", stop);
    gallery.addEventListener("focusout", start);
    gallery.addEventListener("pointerdown", stop);
    gallery.addEventListener("pointerup", start);
    start();
  });
})();
