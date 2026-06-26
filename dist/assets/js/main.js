const style = document.createElement("style");
style.textContent = `
  html { scroll-behavior: smooth; scroll-padding-top: 92px; }
  .home-image-strip { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; align-items: stretch; }
  .home-image-strip img, .home-image-strip img:first-child { height: 185px !important; width: 100%; object-fit: cover; }
  .company-snapshot { grid-template-columns: .9fr 1.1fr; gap: clamp(24px, 4vw, 48px); align-items: center; }
  .company-copy h2 { font-size: clamp(28px, 3.2vw, 44px) !important; line-height: 1.12; max-width: 560px; }
  .company-copy p { font-size: 16px; max-width: 640px; }
  .company-stats { gap: 30px 42px; }
  .company-stats strong { font-size: clamp(32px, 4vw, 52px) !important; line-height: 1.08; overflow-wrap: anywhere; }
  .culture-section { grid-template-columns: minmax(280px, .72fr) minmax(420px, 1.28fr) !important; gap: 22px; background: #f4f7fa !important; padding-top: clamp(30px, 4vw, 50px) !important; padding-bottom: clamp(30px, 4vw, 50px) !important; align-items: stretch; }
  .culture-intro { color: var(--ink) !important; padding: 20px; background: white; border: 1px solid var(--line); border-radius: 6px; min-height: 230px; }
  .culture-intro h2, .culture-intro p { color: var(--blue-dark) !important; }
  .culture-intro .text-link { color: var(--teal) !important; }
  .culture-intro .eyebrow { color: var(--teal) !important; }
  .culture-intro h2 { font-size: clamp(24px, 2vw, 32px); }
  .culture-pillar-list { gap: 10px; }
  .culture-pillar-list article { grid-template-columns: 52px 1fr !important; padding: 15px !important; }
  .culture-pillar-list span { font-size: 22px !important; }
  .culture-pillar-list h3 { font-size: 18px; }
  .culture-image { grid-column: 1 / 2; width: 100%; height: 230px; object-fit: cover; border-radius: 6px; border: 1px solid var(--line); align-self: end; }
  .merged-ap-grid { grid-template-columns: 1fr 1fr !important; align-items: stretch; }
  .application-panel article { min-height: 128px; display: flex; flex-direction: column; justify-content: flex-start; }
  .application-panel h3 { min-height: 48px; }
  .case-feature { align-content: start; }
  .case-feature .case-card { height: 100%; }
  .case-feature .case-card img { height: 240px; aspect-ratio: auto; }
  .product-jump { padding-top: 34px !important; padding-bottom: 34px !important; }
  .company-page-grid { display: grid; grid-template-columns: 1fr .85fr; gap: 32px; align-items: center; }
  .company-page-grid img { width: 100%; height: 330px; border-radius: 6px; border: 1px solid var(--line); }
  .company-page-grid .fact-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: 18px; }
  @media (max-width: 1040px) {
    .home-image-strip, .merged-ap-grid, .company-snapshot, .culture-section, .company-page-grid { grid-template-columns: 1fr !important; }
    .home-image-strip img, .home-image-strip img:first-child { height: 210px !important; }
    .culture-image { grid-column: auto; height: 210px; }
  }
`;
document.head.appendChild(style);

const cultureImage = document.querySelector(".culture-image");
if (cultureImage) {
  cultureImage.src = "assets/images/factory-substation.jpeg";
}

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
