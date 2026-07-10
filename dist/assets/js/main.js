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
  .quote-panel { position: relative; z-index: 1; width: min(1180px, 96vw); max-height: 90vh; overflow: auto; background: white; border-radius: 12px; padding: clamp(24px, 4vw, 42px); box-shadow: 0 30px 80px rgba(0,0,0,.28); }
  .quote-panel h2 { font-size: clamp(30px, 4vw, 46px); }
  .quote-panel > p:not(.eyebrow) { max-width: 780px; color: var(--muted); }
  .quote-close { position: absolute; top: 16px; right: 16px; width: 38px; height: 38px; border: 1px solid var(--line); background: white; font-size: 26px; line-height: 1; cursor: pointer; }
  body.modal-open { overflow: hidden; }
  .quote-form .obsolete-basic-field { display: none !important; }
  .quote-form .quote-section { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 18px; padding: 18px; border: 1px solid var(--line); border-radius: 12px; background: #f7fafc; }
  .quote-form .quote-section h3, .quote-form .quote-section p { grid-column: 1 / -1; margin: 0; }
  .quote-form .quote-section h3 { font-size: 18px; }
  .quote-form .quote-section p { color: var(--muted); font-size: 14px; }
  .quote-form [hidden] { display: none !important; }
  .quote-form select, .quote-form input, .quote-form textarea { width: 100%; }
  .quote-form .field-label-text { display: inline-flex; align-items: center; gap: 6px; margin-bottom: 6px; }
  .field-help-wrap { position: relative; display: inline-flex; align-items: center; }
  .field-help { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 999px; border: 1px solid rgba(0,139,139,.42); background: white; color: var(--teal); font-size: 12px; font-weight: 800; cursor: help; line-height: 1; }
  .help-bubble { position: absolute; left: 50%; bottom: calc(100% + 10px); transform: translateX(-50%) translateY(6px); z-index: 30; width: min(300px, 72vw); padding: 12px 14px; border-radius: 10px; background: #06243f; color: white; box-shadow: 0 18px 40px rgba(0,0,0,.24); font-size: 13px; line-height: 1.45; opacity: 0; visibility: hidden; pointer-events: none; transition: .16s ease; }
  .help-bubble::after { content: ""; position: absolute; left: 50%; top: 100%; transform: translateX(-50%); border: 7px solid transparent; border-top-color: #06243f; }
  .field-help-wrap:hover .help-bubble, .field-help-wrap:focus-within .help-bubble, .field-help-wrap.open .help-bubble { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }
  .choice-grid { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 14px; }
  .choice-grid label { display: flex !important; flex-direction: row !important; align-items: flex-start; gap: 9px; padding: 10px 12px; background: white; border: 1px solid var(--line); border-radius: 8px; font-size: 14px; }
  .choice-grid input { width: auto !important; margin-top: 3px; }
  .quote-form .full-width { grid-column: 1 / -1; }

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
    .quote-form, .quote-form .quote-section, .choice-grid { grid-template-columns: 1fr; }
  }
`;
document.head.appendChild(style);

const optionList = (items) => items.map((item) => `<option value="${item[0]}">${item[1]}</option>`).join("");
const escHtml = (value = "") => String(value).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const help = (text) => `<span class="field-help-wrap"><button class="field-help" type="button" aria-label="Help">?</button><span class="help-bubble">${escHtml(text)}</span></span>`;
const fieldLabel = (label, text) => `<span class="field-label-text">${label} ${help(text)}</span>`;
const selectField = (label, name, items, text, attrs = "") => `<label>${fieldLabel(label, text)}<select name="${name}" ${attrs}>${optionList(items)}</select></label>`;
const inputField = (label, name, placeholder, text, attrs = "") => `<label>${fieldLabel(label, text)}<input name="${name}" placeholder="${placeholder}" ${attrs}></label>`;
const textareaField = (label, name, placeholder, text, attrs = "") => `<label class="full-width">${fieldLabel(label, text)}<textarea name="${name}" rows="3" placeholder="${placeholder}" ${attrs}></textarea></label>`;
const checkboxGrid = (label, name, items, text) => `
  <div class="full-width">
    <div class="field-label-text">${label} ${help(text)}</div>
    <div class="choice-grid">${items.map(([value, title]) => `<label><input type="checkbox" name="${name}" value="${value}"><span>${title}</span></label>`).join("")}</div>
  </div>`;

const technicalSelectorHtml = `
  <section class="quote-section technical-quote-block">
    <h3>1. Core Technical Selection</h3>
    <p>Start broad. These fields create a common framework before detailed electrical data is confirmed by drawings or tender documents.</p>
    ${selectField("Product Structure", "product_structure", [
      ["liquid", "Liquid-Immersed / Liquid-Filled Transformer"],
      ["dry", "Dry-Type Transformer"],
      ["substation", "Prefabricated Transformer Substation"],
      ["accessories", "Transformer Accessories & Components"],
      ["not_sure", "Not Sure / Need Recommendation"]
    ], "The mutually exclusive body category. Oil/liquid, dry-type, box-type substation and accessories should not be mixed in one product body.", "data-product-structure")}
    ${selectField("Voltage Transformation", "voltage_transformation", [
      ["step_up", "Step-Up"],
      ["step_down", "Step-Down"],
      ["isolation", "Isolation / Same Voltage"],
      ["not_sure", "Not Sure"]
    ], "Whether the transformer mainly raises voltage, lowers voltage, or provides isolation at the same or similar voltage. Voltage regulation is handled later as tap changer and tap range.")}
    ${selectField("Application Scenario", "application_scenario", [
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
    ], "The project environment or industry. It helps engineers judge climate, load profile, safety requirements, installation constraints and documents needed.")}
    ${selectField("Engineering Role", "engineering_role", [
      ["distribution", "Distribution"],
      ["substation_main", "Substation Main Transformer"],
      ["generation_interconnection", "Generation Step-Up / Grid Interconnection"],
      ["power_electronics", "Power Electronics Interface"],
      ["auxiliary_power", "Facility Service / Auxiliary Power"],
      ["building_distribution", "Building / Load Center Distribution"],
      ["industrial_process", "Industrial Process Power Supply"],
      ["system_grounding", "System Grounding / Neutral Reference"],
      ["temporary_mobile", "Temporary / Mobile Power Supply"],
      ["testing_power", "Testing Power Supply"],
      ["other", "Other"]
    ], "The duty inside the power system. It is different from scenario: a solar project may need grid interconnection, auxiliary power, or inverter interface.")}
    ${selectField("Installation Environment", "installation_environment", [
      ["indoor", "Indoor"],
      ["outdoor", "Outdoor"],
      ["semi_outdoor", "Semi-Outdoor / Shelter"],
      ["containerized", "Containerized"],
      ["underground", "Underground"],
      ["submersible", "Submersible"],
      ["not_sure", "Not Sure"]
    ], "The surrounding environment. This affects enclosure, insulation distance, anti-corrosion design, cooling, IP rating and maintenance access.")}
    ${selectField("Mounting Method", "mounting_method", [
      ["ground_mounted", "Ground-Mounted"],
      ["pad_mounted", "Pad-Mounted"],
      ["pole_mounted", "Pole-Mounted"],
      ["floor_standing", "Floor-Standing"],
      ["skid_mounted", "Skid-Mounted"],
      ["trailer_mobile", "Trailer-Mounted / Mobile"],
      ["wall_mounted", "Wall-Mounted"],
      ["not_sure", "Not Sure"]
    ], "How the unit is physically installed. Outdoor is an environment; pad-mounted, pole-mounted and mobile are mounting or deployment methods.")}
    ${selectField("Primary Technical Function", "technical_function", [
      ["general", "General Purpose"],
      ["isolation", "Isolation"],
      ["rectifier_converter", "Rectifier / Converter"],
      ["grounding", "Grounding / Earthing"],
      ["harmonic", "Harmonic Mitigation"],
      ["k_rated", "K-Rated / Nonlinear Load"],
      ["phase_shifting", "Phase-Shifting"],
      ["furnace", "Furnace Duty"],
      ["traction", "Traction Duty"],
      ["inverter", "Inverter Duty"],
      ["testing", "Testing Duty"],
      ["other", "Other"]
    ], "The main special function, if any. Keep this as one main duty so the inquiry has a clear technical center of gravity.")}
    ${checkboxGrid("Additional Technical Requirements", "additional_requirements", [
      ["shielded_isolation", "Shielded Isolation"],
      ["low_loss", "Low-Loss Design"],
      ["low_noise", "Low-Noise Design"],
      ["fire_resistant", "Fire-Resistant Design"],
      ["harmonic_resistance", "Harmonic Resistance"],
      ["k_rated_requirement", "K-Rated Requirement"],
      ["oltc_required", "OLTC Required"],
      ["special_enclosure", "Special Enclosure"],
      ["anti_corrosion", "Anti-Corrosion"],
      ["high_altitude", "High-Altitude Design"],
      ["seismic", "Seismic Requirement"],
      ["monitoring", "Monitoring / Sensors"]
    ], "Multiple requirements can coexist. For example, a data center unit may need dry-type, isolation, K-rated, low noise and low loss at the same time.")}
  </section>

  <section class="quote-section" data-structure-detail="liquid">
    <h3>2A. Liquid-Immersed Structure</h3>
    ${selectField("Insulating Liquid", "insulating_liquid", [
      ["mineral_oil", "Mineral Oil"],
      ["natural_ester", "Natural Ester"],
      ["synthetic_ester", "Synthetic Ester"],
      ["silicone_fluid", "Silicone Fluid"],
      ["fire_resistant_liquid", "Fire-Resistant Liquid"],
      ["other", "Other"],
      ["not_sure", "Not Sure"]
    ], "The fluid used for insulation and heat dissipation. It affects fire safety, environmental performance, temperature rise, maintenance and price.")}
    ${selectField("Tank Structure", "tank_structure", [
      ["hermetically_sealed", "Hermetically Sealed"],
      ["conservator", "Conservator Type"],
      ["corrugated_tank", "Corrugated Tank"],
      ["radiator_type", "Radiator Type"],
      ["gas_cushion", "Gas Cushion Type"],
      ["other", "Other"],
      ["not_sure", "Not Sure"]
    ], "The oil tank and expansion design. It affects oil preservation, footprint, maintenance and accessory configuration.")}
    ${selectField("Cooling Method", "liquid_cooling_method", [
      ["onan", "ONAN"],
      ["onaf", "ONAF"],
      ["ofaf", "OFAF"],
      ["odaf", "ODAF"],
      ["ofwf_odwf", "OFWF / ODWF"],
      ["other", "Other"],
      ["not_sure", "Not Sure"]
    ], "Cooling code for oil-filled transformers. Higher capacity or harsher environments may need forced air, forced oil or oil-water cooling.")}
  </section>

  <section class="quote-section" data-structure-detail="dry">
    <h3>2B. Dry-Type Structure</h3>
    ${selectField("Insulation / Material System", "dry_insulation_system", [
      ["cast_resin", "Cast Resin"],
      ["resin_encapsulated", "Resin Encapsulated"],
      ["vpi", "VPI"],
      ["vpe", "VPE"],
      ["open_wound", "Open Wound"],
      ["amorphous_alloy_core", "Amorphous Alloy Core"],
      ["other", "Other"],
      ["not_sure", "Not Sure"]
    ], "Dry-type insulation and material choice. It affects fire safety, moisture resistance, partial discharge, losses and indoor suitability.")}
    ${selectField("Enclosure Type", "enclosure_type", [
      ["open", "Open Type"],
      ["ventilated", "Ventilated Enclosure"],
      ["non_ventilated", "Non-Ventilated Enclosure"],
      ["sealed", "Sealed Enclosure"],
      ["indoor", "Indoor Enclosure"],
      ["outdoor", "Outdoor Enclosure"],
      ["ip_customized", "IP Customized"],
      ["other", "Other"],
      ["not_sure", "Not Sure"]
    ], "The protective housing. It affects ventilation, touch safety, dust/moisture protection, acoustic performance and installation location.")}
    ${selectField("Cooling Method", "dry_cooling_method", [
      ["an", "AN"],
      ["af", "AF"],
      ["an_af", "AN / AF"],
      ["other", "Other"],
      ["not_sure", "Not Sure"]
    ], "Cooling method for dry-type transformers. AN is natural air cooling; AF uses fans to increase heat removal and sometimes rated output.")}
  </section>

  <section class="quote-section">
    <h3>3. Electrical Parameters</h3>
    <p>These fields are closer to the traditional order sheet. Customers who already have drawings can fill these directly.</p>
    ${inputField("Transformer Model", "transformer_model", "e.g. SCB18 / S20 / custom model", "Existing or target model name. Leave blank if the manufacturer should recommend a model.")}
    ${inputField("Rated Capacity", "rated_capacity", "e.g. 630 kVA / 20 MVA", "The apparent power rating. It is one of the strongest drivers of size, loss, temperature rise and price.")}
    ${inputField("Primary Voltage", "primary_voltage", "e.g. 11 kV", "Input-side voltage. Together with secondary voltage it defines the voltage ratio.")}
    ${inputField("Secondary Voltage", "secondary_voltage", "e.g. 0.4 kV", "Output-side voltage. Many inquiries are expressed as 11/0.4 kV, 33/0.69 kV or 13.8 kV/480 V.")}
    ${selectField("Rated Frequency", "rated_frequency", [["50hz", "50Hz"], ["60hz", "60Hz"], ["other", "Other"]], "Power system frequency. Export projects often differ by region, usually 50Hz or 60Hz.")}
    ${selectField("Phase", "phase", [["three_phase", "Three Phase"], ["single_phase", "Single Phase"], ["not_sure", "Not Sure"]], "Most power transformers are three-phase, but some distribution and special applications may be single-phase.")}
    ${inputField("Connection Group", "connection_group", "e.g. Dyn11 / Yyn0 / YNd11", "Vector group and winding connection. It affects phase shift, grounding, parallel operation and system compatibility.")}
    ${inputField("Impedance Voltage", "impedance_voltage", "e.g. 4% / 6% / 10%", "Short-circuit impedance. It affects fault current, voltage drop and parallel operation.")}
    ${inputField("Insulation Level", "insulation_level", "e.g. LI75 AC35 / project standard", "Required withstand voltage level. It is tied to system voltage, standards and overvoltage protection.")}
    ${selectField("Tap Changer", "tap_changer", [["none", "No Tap Changer"], ["octc", "Off-Circuit Tap Changer / OCTC"], ["oltc", "On-Load Tap Changer / OLTC"], ["not_sure", "Not Sure"]], "Voltage regulation device. This can coexist with step-up or step-down transformers; it is not the same as voltage transformation direction.")}
    ${inputField("Tap Range", "tap_range", "e.g. ±2×2.5% / ±5% / custom", "Adjustment range of the tap changer. It helps adapt the transformer to grid voltage fluctuation.")}
  </section>

  <section class="quote-section">
    <h3>4. Operating Conditions</h3>
    ${textareaField("Conditions of Use", "conditions_of_use", "Describe load type, duty cycle, indoor/outdoor location, special environment, etc.", "General working conditions. This captures anything that cannot be expressed by simple drop-down fields.")}
    ${inputField("Altitude", "altitude", "e.g. ≤1000 m / 2500 m", "High altitude reduces air insulation and cooling capacity. It may require design correction.")}
    ${inputField("Environment Temperature", "environment_temperature", "e.g. -25°C to +45°C", "Ambient temperature range. It affects cooling, temperature rise and material selection.")}
    ${selectField("Indoor / Outdoor", "indoor_outdoor", [["indoor", "Indoor"], ["outdoor", "Outdoor"], ["both", "Both / To Be Confirmed"], ["not_sure", "Not Sure"]], "Simple installation location requested by many order sheets. More detailed environment and mounting fields are above.")}
    ${selectField("Humidity / Climate", "humidity_climate", [["normal", "Normal"], ["high_humidity", "High Humidity"], ["coastal", "Coastal / Salt Fog"], ["desert", "Desert / Dust"], ["tropical", "Tropical"], ["not_sure", "Not Sure"]], "Climate affects enclosure, anti-corrosion, creepage distance, painting and insulation system.")}
    ${selectField("Pollution Level", "pollution_level", [["normal", "Normal"], ["heavy", "Heavy Pollution"], ["industrial", "Industrial Area"], ["salt_fog", "Salt Fog"], ["not_sure", "Not Sure"]], "Pollution level affects external insulation, bushing choice, enclosure protection and maintenance plan.")}
  </section>

  <section class="quote-section">
    <h3>5. Inlet / Outlet & Accessories</h3>
    ${checkboxGrid("High-Voltage Inlet Method", "hv_inlet_method", [
      ["bottom_cable", "Bottom Cable Entry"],
      ["top_cable", "Top Cable Entry"],
      ["ct", "Equipped with Current Transformer CT"],
      ["cable_box", "Cable Box"],
      ["bushing_terminal", "Bushing Terminal"],
      ["other", "Other"]
    ], "How the high-voltage side enters the transformer. CT can be an accessory and may coexist with cable entry.")}
    ${checkboxGrid("Low-Voltage Outlet Method", "lv_outlet_method", [
      ["conventional", "Conventional Outlet"],
      ["cable_outlet", "Cable Outlet"],
      ["copper_busbar", "Copper Busbar"],
      ["bus_duct", "Bus Duct Interface"],
      ["other", "Other"]
    ], "How the low-voltage side leaves the transformer. This affects cabinet layout, busbar design, cable routing and installation.")}
    ${checkboxGrid("Accessories", "accessories", [
      ["temperature_controller", "Temperature Controller"],
      ["cooling_fan", "Cooling Fan"],
      ["surge_arrester", "Surge Arrester"],
      ["pressure_relief", "Pressure Relief Device"],
      ["buchholz_relay", "Buchholz Relay"],
      ["oil_level_indicator", "Oil Level Indicator"],
      ["winding_temp", "Winding Temperature Indicator"],
      ["ct", "Current Transformer CT"],
      ["wheels", "Wheels / Rollers"],
      ["special_paint", "Special Paint / Coating"]
    ], "Optional devices for protection, monitoring, installation and maintenance. Some accessories apply only to oil-filled or dry-type designs.")}
  </section>
`;

function enhanceQuoteForm(form) {
  if (!form || form.dataset.technicalSelector === "ready") return;
  ["type", "capacity", "voltage"].forEach((name) => {
    const oldControl = form.querySelector(`[name="${name}"]`);
    oldControl?.closest("label")?.classList.add("obsolete-basic-field");
  });
  const companyInput = form.querySelector('input[name="company"]');
  const anchor = companyInput?.closest("label") || form.firstElementChild;
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

document.addEventListener("click", (event) => {
  const button = event.target.closest(".field-help");
  document.querySelectorAll(".field-help-wrap.open").forEach((wrap) => {
    if (!button || wrap !== button.closest(".field-help-wrap")) wrap.classList.remove("open");
  });
  if (button) {
    event.preventDefault();
    button.closest(".field-help-wrap")?.classList.toggle("open");
  }
});

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
