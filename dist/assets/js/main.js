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

  .page-image-hero { position: relative; height: clamp(340px, 44vw, 560px); overflow: hidden; background: var(--blue-dark); }
  .page-image-hero img { width: 100%; height: 100%; object-fit: cover; filter: saturate(.95); }
  .page-image-hero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(6,36,63,.02), rgba(6,36,63,.78)); }
  .image-hero-caption { position: absolute; left: clamp(22px, 5vw, 70px); right: clamp(22px, 5vw, 70px); bottom: clamp(24px, 5vw, 62px); z-index: 1; max-width: 760px; }
  .image-hero-caption h1 { color: white; font-size: clamp(38px, 5vw, 70px); margin-bottom: 12px; }
  .image-hero-caption p { color: rgba(255,255,255,.86); font-size: 18px; }
  .image-hero-caption .eyebrow { color: #8ef0e2; }

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

  .why-showcase { display: grid; grid-template-columns: minmax(340px, .92fr) minmax(420px, 1.08fr); gap: 24px; align-items: stretch; background: #f4f7fa; }
  .why-image-card { position: relative; display: block; min-height: 430px; overflow: hidden; border-radius: 12px; box-shadow: var(--shadow); background: var(--blue-dark); }
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
  .news-list { display: grid; gap: 18px; }
  .news-row { display: grid; grid-template-columns: 320px 1fr; gap: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: white; box-shadow: 0 10px 26px rgba(8,35,58,.06); transition: .22s ease; }
  .news-row:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
  .news-row img { width: 100%; height: 100%; min-height: 210px; object-fit: cover; }
  .news-row div { padding: 24px 28px; }
  .news-row small { display: block; color: var(--muted); margin-bottom: 10px; }
  .home-news-list .news-row { grid-template-columns: 280px 1fr; }

  .quote-modal { position: fixed; inset: 0; z-index: 80; display: none; align-items: center; justify-content: center; padding: 22px; }
  .quote-modal.open { display: flex; }
  .quote-backdrop { position: absolute; inset: 0; background: rgba(6, 20, 34, .62); backdrop-filter: blur(5px); }
  .quote-panel { position: relative; z-index: 1; width: min(1080px, 96vw); max-height: 90vh; overflow: auto; background: white; border-radius: 12px; padding: clamp(24px, 4vw, 42px); box-shadow: 0 30px 80px rgba(0,0,0,.28); }
  .quote-panel h2 { font-size: clamp(30px, 4vw, 46px); }
  .quote-panel > p:not(.eyebrow) { max-width: 760px; color: var(--muted); }
  .quote-close { position: absolute; top: 16px; right: 16px; width: 38px; height: 38px; border: 1px solid var(--line); background: white; font-size: 26px; line-height: 1; cursor: pointer; }
  body.modal-open { overflow: hidden; }
  .quote-form .obsolete-type-field { display: none !important; }
  .quote-form .quote-section { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 18px; padding: 18px; border: 1px solid var(--line); border-radius: 12px; background: #f7fafc; }
  .quote-form .quote-section h3, .quote-form .quote-section p { grid-column: 1 / -1; margin: 0; }
  .quote-form .quote-section h3 { font-size: 18px; }
  .quote-form .quote-section p { color: var(--muted); font-size: 14px; }
  .quote-form [hidden] { display: none !important; }
  .quote-form select { width: 100%; }

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
    .news-row, .home-news-list .news-row { grid-template-columns: 240px 1fr; }
  }
  @media (max-width: 1040px) {
    .company-snapshot, .company-page-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 720px) {
    .clean-hero-slider { height: 390px; }
    .page-image-hero { height: 360px; }
    .why-service-grid, .application-panel, .category-tile-grid { grid-template-columns: 1fr !important; }
    .why-image-card, .why-image-card img, .project-image-card img { min-height: 320px; }
    .news-row, .home-news-list .news-row { grid-template-columns: 1fr; }
    .news-row img { height: 210px; }
    .quote-form, .quote-form .quote-section { grid-template-columns: 1fr; }
  }
`;
document.head.appendChild(style);

const optionList = (items) => items.map((item) => `<option value="${item[0]}">${item[1]}</option>`).join("");

const technicalSelectorHtml = `
  <section class="quote-section technical-quote-block">
    <h3>Transformer Technical Selection</h3>
    <p>Choose mutually exclusive body structure first, then select voltage direction, application scenario and engineering role.</p>
    <label>Product Structure<select name="product_structure" data-product-structure>
      ${optionList([
        ["liquid", "Liquid-Immersed / Liquid-Filled Transformer"],
        ["dry", "Dry-Type Transformer"],
        ["substation", "Prefabricated Transformer Substation"],
        ["accessories", "Transformer Accessories & Components"],
        ["not_sure", "Not Sure / Need Recommendation"]
      ])}
    </select></label>
    <label>Voltage Transformation<select name="voltage_transformation">
      ${optionList([
        ["step_up", "Step-Up"],
        ["step_down", "Step-Down"],
        ["isolation", "Isolation / Same Voltage"],
        ["voltage_regulation", "Voltage Regulation"],
        ["not_sure", "Not Sure"]
      ])}
    </select></label>
    <label>Application Scenario<select name="application_scenario">
      ${optionList([
        ["utility_grid", "Utility Grid"],
        ["substation", "Substation"],
        ["solar", "Solar Power Plant"],
        ["wind", "Wind Farm"],
        ["bess", "Battery Energy Storage System"],
        ["data_center", "Data Center"],
        ["industrial", "Industrial Plant"],
        ["commercial", "Commercial Building"],
        ["mining", "Mining"],
        ["marine", "Marine / Offshore"],
        ["railway", "Railway / Traction"],
        ["testing", "Testing Laboratory"],
        ["other", "Other"]
      ])}
    </select></label>
    <label>Engineering Role<select name="engineering_role">
      ${optionList([
        ["distribution", "Distribution"],
        ["power_substation", "Power / Substation Main Transformer"],
        ["generation_interconnection", "Generation Interconnection"],
        ["auxiliary_power", "Facility Service / Auxiliary Power"],
        ["industrial_load", "Industrial Load Supply"],
        ["building_distribution", "Building Power Distribution"],
        ["temporary_mobile", "Temporary / Mobile Power Supply"],
        ["testing_power", "Testing Power Supply"],
        ["other", "Other"]
      ])}
    </select></label>
    <label>Primary Technical Function<select name="technical_function">
      ${optionList([
        ["general", "General Purpose"],
        ["isolation", "Isolation"],
        ["shielded_isolation", "Shielded Isolation"],
        ["rectifier_converter", "Rectifier / Converter"],
        ["harmonic", "Harmonic Mitigation"],
        ["k_rated", "K-Rated / Nonlinear Load"],
        ["grounding", "Grounding / Earthing"],
        ["zigzag_grounding", "Zigzag Grounding"],
        ["phase_shifting", "Phase-Shifting"],
        ["furnace", "Furnace Duty"],
        ["traction", "Traction Duty"],
        ["inverter", "Inverter Duty"],
        ["low_loss", "Low-Loss Design"],
        ["low_noise", "Low-Noise Design"],
        ["fire_resistant", "Fire-Resistant Design"],
        ["other", "Other"]
      ])}
    </select></label>
  </section>
  <section class="quote-section" data-structure-detail="liquid">
    <h3>Liquid-Immersed Structure</h3>
    <label>Insulating Liquid<select name="insulating_liquid">
      ${optionList([
        ["mineral_oil", "Mineral Oil"],
        ["natural_ester", "Natural Ester"],
        ["synthetic_ester", "Synthetic Ester"],
        ["silicone_fluid", "Silicone Fluid"],
        ["fire_resistant_liquid", "Fire-Resistant Liquid"],
        ["other", "Other"],
        ["not_sure", "Not Sure"]
      ])}
    </select></label>
    <label>Tank Structure<select name="tank_structure">
      ${optionList([
        ["hermetically_sealed", "Hermetically Sealed"],
        ["conservator", "Conservator Type"],
        ["corrugated_tank", "Corrugated Tank"],
        ["radiator_type", "Radiator Type"],
        ["gas_cushion", "Gas Cushion Type"],
        ["other", "Other"],
        ["not_sure", "Not Sure"]
      ])}
    </select></label>
    <label>Cooling Method<select name="liquid_cooling_method">
      ${optionList([
        ["onan", "ONAN"],
        ["onaf", "ONAF"],
        ["ofaf", "OFAF"],
        ["odaf", "ODAF"],
        ["ofwf_odwf", "OFWF / ODWF"],
        ["other", "Other"],
        ["not_sure", "Not Sure"]
      ])}
    </select></label>
  </section>
  <section class="quote-section" data-structure-detail="dry">
    <h3>Dry-Type Structure</h3>
    <label>Insulation / Material System<select name="dry_insulation_system">
      ${optionList([
        ["cast_resin", "Cast Resin"],
        ["resin_encapsulated", "Resin Encapsulated"],
        ["vpi", "VPI"],
        ["vpe", "VPE"],
        ["open_wound", "Open Wound"],
        ["amorphous_alloy_core", "Amorphous Alloy Core"],
        ["other", "Other"],
        ["not_sure", "Not Sure"]
      ])}
    </select></label>
    <label>Enclosure Type<select name="enclosure_type">
      ${optionList([
        ["open", "Open Type"],
        ["ventilated", "Ventilated Enclosure"],
        ["non_ventilated", "Non-Ventilated Enclosure"],
        ["sealed", "Sealed Enclosure"],
        ["indoor", "Indoor Enclosure"],
        ["outdoor", "Outdoor Enclosure"],
        ["ip_customized", "IP Customized"],
        ["other", "Other"],
        ["not_sure", "Not Sure"]
      ])}
    </select></label>
    <label>Cooling Method<select name="dry_cooling_method">
      ${optionList([
        ["an", "AN"],
        ["af", "AF"],
        ["an_af", "AN / AF"],
        ["other", "Other"],
        ["not_sure", "Not Sure"]
      ])}
    </select></label>
  </section>
`;

function enhanceQuoteForm(form) {
  if (!form || form.dataset.technicalSelector === "ready") return;
  const oldTypeSelect = form.querySelector('select[name="type"]');
  const oldTypeLabel = oldTypeSelect?.closest("label");
  const companyInput = form.querySelector('input[name="company"]');
  const anchor = companyInput?.closest("label") || oldTypeLabel || form.firstElementChild;
  if (oldTypeLabel) oldTypeLabel.classList.add("obsolete-type-field");
  if (anchor) anchor.insertAdjacentHTML("afterend", technicalSelectorHtml);
  const structureSelect = form.querySelector("[data-product-structure]");
  const updateStructureSections = () => {
    const value = structureSelect?.value;
    form.querySelectorAll("[data-structure-detail]").forEach((section) => {
      section.hidden = section.getAttribute("data-structure-detail") !== value;
    });
  };
  structureSelect?.addEventListener("change", updateStructureSections);
  updateStructureSections();
  form.dataset.technicalSelector = "ready";
}

document.querySelectorAll(".quote-form").forEach(enhanceQuoteForm);

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

const modal = document.querySelector("[data-quote-modal]");
const openModal = () => {
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
};
const closeModal = () => {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};
document.querySelectorAll("[data-quote-open]").forEach((button) => button.addEventListener("click", openModal));
document.querySelectorAll("[data-quote-close]").forEach((button) => button.addEventListener("click", closeModal));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

const revealTargets = document.querySelectorAll(".company-snapshot, .product-matrix, .why-showcase, .ap-showcase, .news-showcase, .page-image-hero");
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
