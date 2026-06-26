const style = document.createElement("style");
style.textContent = `
  html { scroll-behavior: smooth; scroll-padding-top: 92px; }

  .clean-hero-slider {
    position: relative;
    height: clamp(420px, 62vw, 720px);
    overflow: hidden;
    background: #eef3f7;
  }
  .hero-slide { position: absolute; inset: 0; margin: 0; opacity: 0; transition: opacity 900ms ease; }
  .hero-slide.active { opacity: 1; z-index: 1; }
  .hero-slide img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.02); transition: transform 5200ms ease; }
  .hero-slide.active img { transform: scale(1); }
  .hero-dots { position: absolute; left: 50%; bottom: 20px; z-index: 2; transform: translateX(-50%); display: flex; gap: 10px; }
  .hero-dots button { width: 34px; height: 4px; border: 0; padding: 0; background: rgba(255,255,255,.58); cursor: pointer; }
  .hero-dots button.active { background: var(--teal); }
  .hero-intro { padding: clamp(42px, 5vw, 70px) clamp(18px, 5vw, 70px); background: white; text-align: center; }
  .hero-intro h1 { max-width: 980px; margin: 0 auto 16px; font-size: clamp(40px, 5.2vw, 74px); }
  .hero-intro p { max-width: 760px; margin: 0 auto; font-size: 19px; color: var(--muted); }
  .hero-intro .hero-actions { justify-content: center; margin-top: 28px; }

  .home-image-strip { display: none !important; }
  .company-snapshot { grid-template-columns: .9fr 1.1fr; gap: clamp(24px, 4vw, 48px); align-items: center; }
  .company-copy h2 { font-size: clamp(28px, 3.2vw, 44px) !important; line-height: 1.12; max-width: 560px; }
  .company-copy p { font-size: 16px; max-width: 640px; }
  .company-stats { gap: 30px 42px; }
  .company-stats strong { font-size: clamp(32px, 4vw, 52px) !important; line-height: 1.08; overflow-wrap: anywhere; }

  .product-matrix .section-head { margin-bottom: 30px; }
  .category-tile-grid { gap: 20px !important; }
  .category-tile { border-radius: 10px !important; min-height: 285px !important; box-shadow: 0 10px 28px rgba(8,35,58,.08); }
  .category-tile img { min-height: 285px !important; transition: transform .45s ease; }
  .category-tile:hover img { transform: scale(1.045); }
  .category-tile h3 { font-size: 19px !important; line-height: 1.18; }

  .why-showcase {
    display: grid;
    grid-template-columns: minmax(340px, .92fr) minmax(420px, 1.08fr);
    gap: 24px;
    align-items: stretch;
    background: #f4f7fa;
  }
  .why-image-card {
    position: relative;
    display: block;
    min-height: 430px;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: var(--shadow);
    background: var(--blue-dark);
  }
  .why-image-card img { width: 100%; height: 100%; min-height: 430px; object-fit: cover; transition: transform .55s ease; }
  .why-image-card:hover img { transform: scale(1.04); }
  .why-image-card::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(6,36,63,.05), rgba(6,36,63,.76)); }
  .why-image-card div { position: absolute; left: 28px; right: 28px; bottom: 28px; z-index: 1; }
  .why-image-card h2, .why-image-card p { color: white; }
  .why-image-card .eyebrow { color: #8ef0e2; }
  .why-image-card h2 { font-size: clamp(28px, 3vw, 42px); }
  .why-service-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
  .why-service-grid article { background: white; border: 1px solid var(--line); border-radius: 12px; padding: 24px; box-shadow: 0 10px 26px rgba(8,35,58,.06); }
  .why-service-grid span { display: inline-block; color: var(--teal); font-size: 28px; font-weight: 800; margin-bottom: 16px; }
  .why-service-grid h3 { font-size: 21px; }
  .why-service-grid p { margin-bottom: 0; }

  .ap-showcase .section-head { align-items: start; }
  .ap-grid { display: grid; grid-template-columns: 1fr 1.05fr; gap: 24px; align-items: stretch; }
  .application-panel { display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .application-panel a { display: block; background: white; border: 1px solid var(--line); border-radius: 10px; padding: 22px; min-height: 150px; transition: .22s ease; }
  .application-panel a:hover { transform: translateY(-3px); box-shadow: var(--shadow); border-color: rgba(0,139,139,.34); }
  .application-panel h3 { min-height: 48px; }
  .project-image-card { position: relative; min-height: 100%; overflow: hidden; border-radius: 12px; background: var(--blue-dark); box-shadow: var(--shadow); }
  .project-image-card img { width: 100%; height: 100%; min-height: 470px; object-fit: cover; transition: transform .55s ease; }
  .project-image-card:hover img { transform: scale(1.04); }
  .project-image-card::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(6,36,63,.08), rgba(6,36,63,.82)); }
  .project-image-card div { position: absolute; z-index: 1; left: 26px; right: 26px; bottom: 26px; }
  .project-image-card h3, .project-image-card p { color: white; }
  .project-image-card .eyebrow { color: #8ef0e2; }

  .news-showcase .section-head { margin-bottom: 28px; }
  .news-card { display: block; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: white; box-shadow: 0 10px 26px rgba(8,35,58,.06); transition: .22s ease; }
  .news-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
  .news-card img { width: 100%; height: 190px; object-fit: cover; }
  .news-card div { padding: 22px; }
  .news-card small { display: block; color: var(--muted); margin-bottom: 10px; }

  .product-jump { padding-top: 34px !important; padding-bottom: 34px !important; }
  .company-page-grid { display: grid; grid-template-columns: 1fr .85fr; gap: 32px; align-items: center; }
  .company-page-grid img { width: 100%; height: 330px; border-radius: 6px; border: 1px solid var(--line); }
  .company-page-grid .fact-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: 18px; }

  .reveal { opacity: 0; transform: translateY(34px); transition: opacity 700ms ease, transform 700ms ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 1180px) {
    .category-tile-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
    .why-showcase, .ap-grid { grid-template-columns: 1fr; }
    .why-image-card, .why-image-card img, .project-image-card img { min-height: 380px; }
  }
  @media (max-width: 1040px) {
    .company-snapshot, .company-page-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 720px) {
    .clean-hero-slider { height: 390px; }
    .why-service-grid, .application-panel, .category-tile-grid, .news-grid { grid-template-columns: 1fr !important; }
    .why-image-card, .why-image-card img, .project-image-card img { min-height: 320px; }
  }
`;
document.head.appendChild(style);

const slider = document.querySelector("[data-hero-slider]");
if (slider) {
  const slides = [...slider.querySelectorAll(".hero-slide")];
  const dots = [...slider.querySelectorAll("[data-slide-dot]")];
  let current = 0;
  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
  };
  dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));
  setInterval(() => showSlide(current + 1), 5200);
}

const revealTargets = document.querySelectorAll(".company-snapshot, .product-matrix, .why-showcase, .ap-showcase, .news-showcase");
revealTargets.forEach((el) => el.classList.add("reveal"));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach((el) => observer.observe(el));

const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
if (toggle && nav) {
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
}

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.classList.add("submitted");
    const existing = form.querySelector(".form-message");
    if (existing) existing.remove();
    const msg = document.createElement("p");
    msg.className = "form-message";
    msg.textContent = "Inquiry captured for this website prototype. Connect the form to CRM or email before launch.";
    form.appendChild(msg);
  });
});
