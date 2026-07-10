# Transformer Knowledge Base: 43-Page Engineering Review

**Source document:** `文字文稿_格式序号整理版.docx`  
**Review date:** 2026-07-10  
**Scope:** engineering terminology, standards applicability, numerical claims, classification boundaries, public-facing tone, and publication readiness.

## Review conclusion

The source material has broad topic coverage but is not ready for direct public publication. The main risks are:

1. Typical practices presented as mandatory global requirements.
2. Fixed values presented without rating conditions, source, edition, or test basis.
3. Distinct concepts merged together, including K-factor versus harmonic mitigation, electrostatic shielding versus galvanic isolation, BIL/LIWV versus thermal class, and IEC IP versus NEMA Type.
4. Product structure, application scenario, engineering role, mounting method, and technical requirement treated as parallel product classes.
5. Marketing-style absolute language such as “only legal choice”, “unlimited”, “maintenance-free”, “standard configuration”, and “cannot be used”.
6. Knowledge content implying that every described specialist transformer is within the company’s confirmed manufacturing scope.

## Disposition summary

- **Major revision:** 32 source pages
- **Moderate revision:** 11 source pages
- **Ready without revision:** 0 source pages

“Major revision” means the source paragraphs should be replaced before publication. “Moderate revision” means the core definition can remain, but technical boundaries, conditions, and verification notes must be added.

## Page-by-page register

| Source page | Main subject | Disposition | Primary correction |
|---:|---|---|---|
| 1 | Liquid-filled transformer definition, cooling and advantages | Major | Remove unlimited-rating and inherent-BIL claims; treat cooling ratings as nameplate-specific. |
| 2 | Liquid-filled risks, maintenance and dry-type definition | Major | Correct indoor fire-code and DGA claims; remove “absolute fire safety” and “maintenance-free”. |
| 3 | Dry-type voltage, capacity, thermal performance and cost | Major | Convert typical product ranges and price ratios into conditional examples. |
| 4 | Liquid-filled versus dry-type selection matrix | Major | Replace binary universal conclusions with project-condition criteria. |
| 5 | Ester fluids, renewables and inverter loads | Major | Separate optional measures from universal requirements; shielding is not isolation. |
| 6 | Thermal cycling, data centers and critical indoor facilities | Major | Remove universal ester, dry-type, H-class, E/C/F and busway requirements. |
| 7 | Heavy industry, mining, rail and marine environments | Major | Make impedance, Ex protection, vibration and corrosion requirements project-specific. |
| 8 | Traction, rectifier, main transformer and testing applications | Major | Treat OLTC, N-1, parallel operation and multi-pulse design as system decisions. |
| 9 | Engineering-role classification | Moderate | Keep roles separate from physical products and applications. |
| 10 | GSU, main transformer and distribution roles | Major | Remove assumed load factors, fixed cooling methods and default OLTC claims. |
| 11 | Power electronics, industrial processes, buildings and auxiliary power | Major | Do not generalize K-factor or dry-type construction to all applications. |
| 12 | Grounding, mobile, testing, control, isolation and instrument transformers | Major | Separate deployment, function and product scope; isolation transformers need not be 1:1. |
| 13 | Installation environment, pad-mounted and pole-mounted | Moderate | Pad-mounted is not generic ground-mounted; utility limits vary. |
| 14 | Ground, floor, skid and trailer mounting | Moderate | Treat mounting as mechanical deployment, not an electrical product category. |
| 15 | Wall mounting and primary technical functions | Major | Do not auto-select structure when the customer is uncertain. |
| 16 | General, isolation, rectifier, grounding, harmonic and K-rated functions | Major | Split harmonic withstand, K-rating and harmonic mitigation. |
| 17 | Phase shifting, furnace, traction, inverter and testing duty | Major | Create separate duty definitions and treat additional requirements as composable constraints. |
| 18 | Mineral insulating oil | Major | Remove universal ranking of base-oil families; specify tested fluid properties. |
| 19 | Natural ester, synthetic ester and silicone fluid | Major | Use product data for fire point, biodegradability and low-temperature performance. |
| 20 | Hermetic, conservator and corrugated tank structures | Moderate | Separate tank structure, oil-preservation system and cooling surface. |
| 21 | ONAN and ONAF | Moderate | Remove universal MVA limits and uprating percentages. |
| 22 | OFAF, ODAF, OFWF and ODWF | Major | Distinguish forced from directed oil flow and define the water system by project. |
| 23 | Multi-rating cooling and dry-type parameter introduction | Major | Delete 60/80/100 universal ratings; move amorphous core out of insulation-system fields. |
| 24 | Cast resin, resin encapsulated and VPI | Major | Use process and test descriptions; do not infer universal superiority from names. |
| 25 | VPE, open wound, CRGO and amorphous core | Major | Remove “upgrade”, “obsolete” and material-mandate claims; efficiency rules do not prescribe core material. |
| 26 | Dry-type enclosures, IP and NEMA | Major | State clearly that IEC IP and NEMA Type are not equivalent conversions. |
| 27 | Dry-type AN and AF cooling | Major | Make AF rating, duration and control settings nameplate-specific. |
| 28 | Rated capacity | Moderate | Define rating under specified voltage, frequency, cooling, environment and temperature rise. |
| 29 | Primary/secondary voltage and step-up/down/isolation | Moderate | Keep primary/secondary separate from HV/LV; isolation transformers may change voltage. |
| 30 | Rated frequency and 50/60 Hz use | Major | Evaluate V/f, losses, accessories and certification; remove automatic interchange rules. |
| 31 | Phase and polyphase systems | Moderate | Keep phase count separate from connection group and special traction topology. |
| 32 | Vector group, clock notation and parallel operation | Major | Correct phase-displacement explanation and include all parallel compatibility conditions. |
| 33 | Short-circuit impedance and voltage regulation | Major | Include resistance and reactance; typical percentages are not classification rules. |
| 34 | Insulation level, BIL/LIWV and AC withstand | Major | Separate dielectric coordination from thermal insulation class. |
| 35 | OCTC/DETC and OLTC | Major | Define regional terminology, safe operating condition, switching technology and maintenance. |
| 36 | Tap range and service conditions | Major | Do not infer output-voltage direction from positive/negative taps without winding-side context. |
| 37 | HV entry, cable boxes, bushings and CTs | Major | Do not treat ATC as a universal alias or IP54 as NEMA 3R equivalence. |
| 38 | LV cables, busbars and busway interfaces | Major | Busway is an option, not a universal data-center configuration. |
| 39 | Buchholz relay and pressure-relief devices | Major | Buchholz applies to suitable conservator systems; sudden-pressure relay is a different device. |
| 40 | Oil level, oil temperature and winding-temperature indication | Moderate | Label measured, simulated and calculated temperature values separately. |
| 41 | Temperature control, cooling fans and surge arresters | Moderate | Define sensor options, fan failure modes and insulation-coordination basis. |
| 42 | Rollers, special paint and accessory management | Moderate | Build an accessory compatibility matrix instead of a universal default list. |
| 43 | Publication governance, terminology and standards citations | Major | Add review metadata, source status, product-scope controls and consistent terminology governance. |

## Binding publication rules

1. Use **must/shall** only when the adopted standard, part, edition, scope, and requirement have been verified.
2. Label each statement as one of: standard requirement, typical practice, configurable option, or project-specific decision.
3. Every numerical value requires its object, rating condition, unit, source, and review date.
4. Use conditional comparisons. Do not declare a universal winner between liquid-filled and dry-type, mineral oil and ester, or CRGO and amorphous alloy.
5. Keep K-factor, harmonic withstand, harmonic mitigation, electrostatic shielding, and galvanic isolation as separate concepts.
6. Keep BIL/LIWV, AC withstand, and thermal insulation class as separate fields.
7. Keep Product Structure, Application Scenario, Engineering Role, Mounting Method, and Technical Requirement as separate dimensions.
8. Knowledge pages may explain broad market terminology, but product links must be limited to confirmed supply-capable product families.
9. Use four content states: `Draft`, `Engineering reviewed`, `Source verified`, and `Approved for publication`.

## Implementation priority

### P0

- Block unreviewed absolute claims and unsupported fixed values from public pages.
- Convert the source into canonical merged topics with stable anchors and do-not-merge terminology rules.
- Add `technical_review_status`, `source_status`, `reviewed_by`, `reviewed_date`, `applicable_standard_family`, and `open_questions` to the content model.

### P1

- Add verified standards editions, manufacturer data and project-condition boundaries.
- Complete the product-capability mapping before adding Related Products links.

### P2

- Obtain a second engineering sign-off for insulation coordination, short-circuit strength, temperature-rise design and specialist transformer duties.

## Limitation

This register is an engineering editorial review. It does not replace a project specification, power-system study, adopted standards text, manufacturer datasheet, certification record, or final transformer design approval.
