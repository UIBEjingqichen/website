document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("[data-catalog-nav]");
  const open = document.querySelector("[data-catalog-contents]");
  const close = document.querySelector("[data-catalog-close]");
  const print = document.querySelector("[data-catalog-print]");

  const setNav = (visible) => {
    if (!nav) return;
    nav.classList.toggle("open", visible);
    nav.setAttribute("aria-hidden", String(!visible));
  };

  open?.addEventListener("click", () => setNav(true));
  close?.addEventListener("click", () => setNav(false));
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setNav(false)));
  print?.addEventListener("click", () => window.print());

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNav(false);
  });
});
