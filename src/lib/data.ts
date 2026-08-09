import {
  BatteryCharging,
  Building2,
  Factory,
  FileCheck2,
  Flame,
  FlaskConical,
  Gauge,
  Globe2,
  Layers3,
  ShieldCheck,
  Snowflake,
  ThermometerSun,
  Waves,
} from "lucide-react";

export const site = {
  name: "Cowin Materials",
  legalName: "Quzhou Qiying Import & Export Co., Ltd.",
  legalRelationshipText: "Cowin Materials is the international materials brand operated by Quzhou Qiying Import & Export Co., Ltd.",
  tagline: "Silica Aerogel Material Systems",
  phone: "+86 176 0125 2505",
  phoneHref: "+8617601252505",
  email: "davidsha@cowinmaterials.com",
  officeAddress: "Room 110, 1st Floor, Building 2, Qushidai Future Building, Kecheng District, Quzhou City, Zhejiang Province, China",
  manufacturingFacilityAddress: "Building 2, 777 Xinwei Road, Xinhe Town, Chongming District, Shanghai, China",
  domain: "cowinmaterials.com",
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/applications", label: "Applications" },
  { href: "/resources", label: "Technical Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const megaMenus = {
  Products: [
    { href: "/products/aerogel-powders-granules", label: "Aerogel powders & granules", note: "Raw material for formulation development" },
    { href: "/products/aerogel-blankets-felts-mats", label: "Aerogel blankets, felts & mats", note: "Flexible thermal insulation forms" },
    { href: "/products/aerogel-slurries-coatings-paste", label: "Aerogel slurries, coatings & paste", note: "Thin-layer thermal treatment systems" },
    { href: "/products/fireproof-waterproof-solutions", label: "Fireproof & waterproof solutions", note: "Steel and mineral-substrate systems" },
  ],
  Applications: [
    { href: "/applications/building-energy-retrofit", label: "Building energy retrofit", note: "Walls, roofs and retrofit areas" },
    { href: "/applications/industrial-pipe-equipment-insulation", label: "Industrial pipe insulation", note: "Pipes, valves, tanks and equipment" },
    { href: "/applications/ev-ess-thermal-barriers", label: "EV & ESS thermal barriers", note: "Battery modules and storage systems" },
    { href: "/applications/lng-cryogenic-insulation", label: "LNG & cryogenic insulation", note: "Cold-service pipes and equipment" },
    { href: "/applications/steel-fire-protection", label: "Steel fire protection", note: "Structural steel coating systems" },
    { href: "/applications/concrete-masonry-waterproofing", label: "Concrete waterproofing", note: "Porous mineral substrates" },
  ],
  Resources: [
    { href: "/resources#tds", label: "Technical Data Sheets", note: "Request product-specific TDS" },
    { href: "/resources#sds", label: "Safety Data Sheets", note: "Request applicable SDS" },
    { href: "/resources#data-highlights", label: "Test Data", note: "Review data in context" },
    { href: "/resources#installation-guides", label: "Installation Guides", note: "Coating system guidance" },
    { href: "/resources#selection-guide", label: "Product Selection Guide", note: "Choose by conditions" },
    { href: "/resources#faq", label: "FAQ", note: "Common buyer questions" },
  ],
};

export const productCategories = [
  "All",
  "Aerogel Raw Materials",
  "Blankets & Thermal Pads",
  "Battery Thermal Barriers",
  "Insulation Coatings",
  "Fire Protection Coatings",
  "Waterproofing",
  "Aerogel Paste",
];

export type Product = {
  name: string;
  code: string;
  slug: string;
  category: string;
  summary: string;
  metrics: string[];
  applications: string[];
  proof: string;
  image?: string;
  imageAlt?: string;
  seoTitle: string;
  seoDescription: string;
  detail: string[];
};

export const products: Product[] = [
  {
    name: "Hydrophobic Silica Aerogel Powder and Particles",
    code: "CW-AP",
    slug: "aerogel-powder-and-slurry",
    category: "Aerogel Raw Materials",
    summary:
      "Nanoporous SiO2 aerogel raw material for coatings, composite fillers and functional modification systems.",
    metrics: ["400-800 m²/g specific surface area", "90-95% porosity", "20-50 nm pore size", "Hydrophobic surface"],
    applications: ["Waterborne industrial coatings", "Thermal coating formulas", "Composite fillers"],
    proof: "Suitable for hydrophobic silica aerogel powder and waterborne formulation development.",
    seoTitle: "Hydrophobic Silica Aerogel Powder and Waterborne Aerogel Slurry",
    seoDescription:
      "CW-AP silica aerogel powder and CW-AP-W waterborne slurry for aerogel coating, composite filler and thermal insulation formulations.",
    detail: [
      "CW-AP provides a low-density nanoporous silica aerogel platform for formulators who need thermal resistance, hydrophobicity and lightweight filler performance.",
      "CW-AP-W is a waterborne pre-dispersed aerogel slurry with 20-25% solids and typical thermal conductivity information available on request.",
    ],
  },
  {
    name: "Aerogel Blanket for Industrial Insulation",
    code: "CW-AT-H / CW-AT-L",
    slug: "aerogel-blanket-and-thermal-pads",
    category: "Blankets & Thermal Pads",
    summary:
      "Flexible aerogel blankets for medium-high temperature insulation, cryogenic service, tanks, pipelines and constrained spaces.",
    metrics: ["0.020 W/(m•K) at 25 °C", "Up to 650 °C service for CW-AT-H", "-200 °C to 125 °C for CW-AT-L", "Hydrophobicity up to 99.9%"],
    applications: ["Steam pipelines", "Process equipment", "LNG logistics", "Cold chain"],
    proof: "Quality control can be aligned with project requirements for nanoporous aerogel insulation products.",
    seoTitle: "Aerogel Blanket and Thin Thermal Pads for Industrial and Battery Insulation",
    seoDescription:
      "Flexible aerogel blankets and thin aerogel pads for industrial insulation, LNG cold service, EV battery packs and limited-space thermal barriers.",
    detail: [
      "The blanket series targets projects where insulation thickness, water resistance and long-term thermal stability matter more than conventional mineral wool volume.",
      "Thin aerogel pads can be supplied in 0.3-5 mm thickness for battery, electronics and rail thermal-management assemblies.",
    ],
  },
  {
    name: "Battery Aerogel Thermal Barrier Pads",
    code: "CW-AT-G / CW-AT-Y / CW-AT-ST",
    slug: "battery-thermal-pads",
    category: "Battery Thermal Barriers",
    summary:
      "Lightweight aerogel-based thermal barrier materials designed for evaluation in EV battery and energy storage assemblies.",
    metrics: ["0.3-5 mm thickness range", "≤0.025 W/(m•K) at 25 °C", "Electrical insulation option", "Low moisture absorption option"],
    applications: ["Battery modules", "Energy storage systems", "Cell spacing", "Pack-level thermal barriers"],
    proof: "Designed for evaluation in thermal barrier and heat propagation control applications. Final use depends on module design and project testing.",
    seoTitle: "Battery Aerogel Thermal Barrier Pads for EV and ESS Applications",
    seoDescription:
      "Cowin Materials battery aerogel thermal barrier pads for EV batteries, energy storage systems and module-level thermal-management evaluation.",
    detail: [
      "Battery aerogel thermal barrier pads are designed for space-limited assemblies where thermal insulation, lightweight construction and dimensional control are important.",
      "Product selection depends on pack design, operating conditions, required thickness, electrical insulation needs and the applicable validation plan.",
    ],
  },
  {
    name: "Building Aerogel Thermal Insulation Coating",
    code: "CW-AC-01/02",
    slug: "aerogel-insulation-coating",
    category: "Insulation Coatings",
    summary:
      "Waterborne thin-layer aerogel insulation coating used with primer and topcoat for exterior walls, roofs, retrofits and industrial buildings.",
    metrics: ["0.040 W/(m•K) thermal conductivity", "0.26 m²•K/W added thermal resistance", "Low-VOC waterborne system", "Thin coating application"],
    applications: ["Exterior walls", "Roof retrofit", "Factory buildings", "Energy-saving renovation"],
    proof: "Supporting documents are available for thermal conductivity, added thermal resistance and VOC review.",
    seoTitle: "Waterborne Aerogel Insulation Coating for Building Energy Retrofit",
    seoDescription:
      "CW-AC aerogel insulation coating for building envelope retrofit, thin thermal insulation layers, exterior walls and roofs.",
    detail: [
      "The coating is designed as a system: substrate preparation, primer, two aerogel insulation coats and two topcoat layers.",
      "It is best positioned for retrofit projects where conventional insulation boards are difficult because of thickness, shape, weight or shutdown constraints.",
    ],
  },
  {
    name: "Industrial Aerogel Insulation Coating",
    code: "CW-AC-14/15/16",
    slug: "industrial-aerogel-insulation-coating",
    category: "Insulation Coatings",
    summary:
      "Sprayable or trowel-applied aerogel insulation coating for equipment, valves, elbows and complex industrial surfaces.",
    metrics: ["-40 °C to 180 °C service range", "≤0.04 W/(m•K) thermal conductivity", "Thin-build coating system", "Primer + insulation + topcoat"],
    applications: ["Hot equipment", "Pipe elbows", "Valves and flanges", "Burn protection"],
    proof: "Installation guidance defines primer, aerogel mid-coat, topcoat, dew-point control and curing windows.",
    seoTitle: "Industrial Aerogel Insulation Coating for Pipes and Complex Equipment",
    seoDescription:
      "CW-AC industrial aerogel coating system for pipes, valves, tanks, process equipment and complex thermal-insulation surfaces.",
    detail: [
      "The industrial coating route is useful for geometry that is difficult to wrap with rigid insulation, especially valves, flanges, elbows and maintenance areas.",
      "The system requires surface temperature above dew point +3C and relative humidity control during application.",
    ],
  },
  {
    name: "Aerogel Fireproof Coating for Steel Structures",
    code: "CW-FTHL",
    slug: "aerogel-fireproof-coating",
    category: "Fire Protection Coatings",
    summary:
      "Waterborne ultra-thin intumescent coating that forms an expanded char layer under fire while aerogel slows heat transfer to steel.",
    metrics: ["66±3% solids", "1.30 g/cm3 density", "2 h surface dry", "28-day full cure"],
    applications: ["Steel factories", "Petrochemical frames", "Power facilities", "Commercial steel"],
    proof: "Fire-resistance ratings are confirmed according to the project specification and applicable local standard.",
    image: "/images/fire-char-layer.jpg",
    imageAlt: "Coating sample after controlled thermal exposure in a laboratory test setup",
    seoTitle: "Waterborne Aerogel Intumescent Fireproof Coating for Steel Structures",
    seoDescription:
      "CW-FTHL ultra-thin waterborne intumescent aerogel fireproof coating for steel structures, industrial facilities and building fire protection.",
    detail: [
      "The intumescent layer expands under heat to create a protective char barrier, while aerogel contributes thermal resistance inside the coating matrix.",
      "For international projects, final fire-resistance ratings are confirmed through project specifications, applicable local standards and supporting test documentation.",
    ],
  },
  {
    name: "Non-Intumescent Fire Protection Coating",
    code: "Indoor / Outdoor Systems",
    slug: "non-intumescent-fire-protection-coating",
    category: "Fire Protection Coatings",
    summary:
      "Thick-film fire protection coating systems for steel structures requiring higher dry film thickness and defined fire-resistance duration.",
    metrics: ["Thick-film protection", "Indoor / outdoor systems", "Defined dry film build", "Project-specific rating"],
    applications: ["Steel fire protection", "Outdoor exposure", "Industrial structures"],
    proof: "Indoor and outdoor systems are selected according to exposure, target rating and coating thickness.",
    seoTitle: "Non-Intumescent Fire Protection Coating for Steel Structure Projects",
    seoDescription:
      "Indoor and outdoor non-intumescent fire protection coating systems for steel structures, industrial buildings and heavy-duty fireproofing projects.",
    detail: [
      "This line is positioned for projects where thick-film protection and defined durability are more important than ultra-thin architectural finish.",
      "Indoor and outdoor systems have different density, consumption and exposure requirements.",
    ],
  },
  {
    name: "Silicon-Based Penetrating Water Repellent",
    code: "CW-WP-01",
    slug: "silicon-penetrating-water-repellent",
    category: "Waterproofing",
    summary:
      "Low-viscosity penetrating water repellent that forms nanoscale hydrophobic interfaces inside porous concrete, masonry and stone substrates.",
    metrics: ["0.93 g/cm³ density", "pH 4-7", "8-14% solids", "250 ml/m² recommended dosage"],
    applications: ["Concrete structures", "Stone protection", "Mortar and gypsum", "Repair and retrofit"],
    proof: "Supporting documents are available for water absorption, permeability and appearance review.",
    image: "/images/waterproof-droplets.png",
    imageAlt: "Water-beading demonstration on a treated mineral sample",
    seoTitle: "Silicon Penetrating Water Repellent for Concrete, Stone and Masonry",
    seoDescription:
      "CW-WP-01 silicon-based penetrating water repellent for concrete, stone, mortar and masonry waterproofing while maintaining vapor permeability.",
    detail: [
      "CW-WP-01 is not a surface film. It penetrates capillary pores and microcracks, then creates a hydrophobic interface while keeping the substrate breathable.",
      "It is designed for concrete durability, masonry retrofit, stone protection and water-repellent treatment on porous mineral substrates.",
    ],
  },
  {
    name: "Aerogel Paste and Sealant Compound",
    code: "CW-AJ",
    slug: "aerogel-paste-compound",
    category: "Aerogel Paste",
    summary:
      "Flexible aerogel composite paste for thin-layer encapsulation, sealing, wear resistance and local thermal insulation.",
    metrics: ["0.041 W/(m•K) thermal conductivity", ">1 MPa adhesion", "Class B combustion behavior", "Trowel or roller applied"],
    applications: ["Aerogel felt surface treatment", "Substrate coating", "Encapsulation", "Vibration and heat isolation"],
    proof: "Drying and curing conditions are confirmed according to the substrate and target adhesion requirement.",
    image: "/images/waterproof-tank.png",
    imageAlt: "Laboratory water-exposure setup used for material evaluation",
    seoTitle: "Aerogel Paste Compound for Local Thermal Insulation and Sealing",
    seoDescription:
      "CW-AJ aerogel paste compound for flexible sealing, local thermal insulation, aerogel blanket surface treatment and thin protective coatings.",
    detail: [
      "The paste gives product engineers a processable aerogel compound for small areas, interfaces and shaped parts where blankets or coatings are not ideal.",
      "It can support sealing, damping, thermal isolation and surface finish improvement in composite systems.",
    ],
  },
];

export type ProductFamily = {
  slug: string;
  title: string;
  intent: string;
  description: string;
  productSlugs: string[];
};

export const productFamilies: ProductFamily[] = [
  {
    slug: "aerogel-powders-granules",
    title: "Aerogel Powders & Granules",
    intent: "For coatings, composites and formulation development",
    description: "Hydrophobic silica aerogel powder and waterborne slurry for coating, composite and functional-material formulation work.",
    productSlugs: ["aerogel-powder-and-slurry"],
  },
  {
    slug: "aerogel-blankets-felts-mats",
    title: "Aerogel Blankets, Felts & Mats",
    intent: "For constrained space, hot/cold service and battery thermal control",
    description: "Flexible blanket and thin-pad options for industrial, cryogenic, EV and energy-storage evaluations.",
    productSlugs: ["aerogel-blanket-and-thermal-pads", "battery-thermal-pads"],
  },
  {
    slug: "aerogel-slurries-coatings-paste",
    title: "Aerogel Slurries, Coatings & Paste",
    intent: "For walls, roofs, pipes, valves and formulation work",
    description: "Waterborne slurry, thin-build aerogel coatings and paste compounds for building, industrial and local treatment applications.",
    productSlugs: ["aerogel-insulation-coating", "industrial-aerogel-insulation-coating", "aerogel-paste-compound"],
  },
  {
    slug: "fireproof-waterproof-solutions",
    title: "Fireproof & Waterproof Solutions",
    intent: "For steel fire-protection evaluation and porous mineral substrates",
    description: "Fire protection coating routes for steel and penetrating water-repellent treatment for concrete, masonry and stone.",
    productSlugs: ["aerogel-fireproof-coating", "non-intumescent-fire-protection-coating", "silicon-penetrating-water-repellent"],
  },
];

export function getProductsForFamily(familySlug: string) {
  const family = productFamilies.find((item) => item.slug === familySlug);
  return family ? products.filter((product) => family.productSlugs.includes(product.slug)) : [];
}

export function getProductFamily(familySlug: string) {
  return productFamilies.find((family) => family.slug === familySlug);
}

export function getProductFamilyForProduct(productSlug: string) {
  return productFamilies.find((family) => family.productSlugs.includes(productSlug));
}

export function getProductPath(product: Pick<Product, "slug">) {
  const family = getProductFamilyForProduct(product.slug);
  return family ? `/products/${family.slug}/${product.slug}` : "/products";
}

export function getProductFamilyPath(family: Pick<ProductFamily, "slug">) {
  return `/products/${family.slug}`;
}

export type TechnicalFact = {
  label: string;
  value: string;
  scope: string;
};

export type ProductTechnicalProfile = {
  model: string;
  overview: string[];
  facts: TechnicalFact[];
  testScope: string;
  handling: string[];
  selectionLimits: string[];
  sourceDocuments: string[];
  relatedApplicationSlugs: string[];
  faq: [string, string][];
  lastReviewed: string;
};

const dataBoundary =
  "Values are drawn from the specified product grade or supplied test record. Confirm the complete method, sample configuration and operating conditions before project use.";

export const productTechnicalProfiles: Record<string, ProductTechnicalProfile> = {
  "aerogel-powder-and-slurry": {
    model: "CW-AP / CW-AP-W",
    overview: [
      "Hydrophobic silica aerogel powder is intended for formulators developing low-density coatings, composites and functional fillers. The waterborne slurry route is intended where a pre-dispersed aqueous input is preferable.",
      "Powder and slurry are different product forms. Their figures are presented separately and should not be transferred to a finished coating or composite without formulation-level verification.",
    ],
    facts: [
      { label: "Specific surface area", value: "400-800 m²/g", scope: "Supplied brochure table; powder grade; GB/T 19587 listed." },
      { label: "Bulk density", value: "60-100 kg/m³", scope: "Supplied brochure table; powder grade." },
      { label: "Pore diameter / porosity", value: "20-50 nm / 90-95%", scope: "Supplied product summary; powder grade." },
      { label: "Waterborne slurry", value: "20-25% solids; 15,000-40,000 cP; 0.020-0.025 W/(m·K) at 25 °C", scope: "Supplied brochure table; slurry only; final formulation performance is not implied." },
    ],
    testScope: dataBoundary,
    handling: ["Use dust-control and mixing procedures appropriate for fine powders.", "For slurry systems, establish shear, addition order and viscosity with a lab trial before scale-up."],
    selectionLimits: ["Not a finished insulation system or a substitute for formulation testing.", "Waterborne slurry data do not establish the performance of a customer's coating after adding binders, pigments or fillers."],
    sourceDocuments: ["Supplied English product brochure: silica aerogel powder and waterborne slurry tables."],
    relatedApplicationSlugs: ["building-energy-retrofit", "industrial-pipe-equipment-insulation"],
    faq: [
      ["Can powder be added directly to a waterborne coating?", "A formulation trial is required to confirm dispersion, viscosity, wetting and the final cured-coating performance."],
      ["Does the slurry figure apply to my final coating?", "No. It describes the supplied slurry only; the finished coating must be evaluated in its own formulation and film build."],
    ],
    lastReviewed: "09 August 2026",
  },
  "aerogel-blanket-and-thermal-pads": {
    model: "CW-AT-H / CW-AT-L",
    overview: [
      "Flexible aerogel blankets are evaluated where installation space, water exposure and geometry make conventional insulation difficult. High-temperature and cryogenic blanket grades serve different service windows.",
      "Blanket performance depends on the grade, thickness, jacket, compression, joints and the complete insulation-system design.",
    ],
    facts: [
      { label: "Industrial blanket thermal conductivity", value: "0.020 W/(m·K) at 25 °C; 0.036 W/(m·K) at 300 °C", scope: "Supplied RT-AT-H product table." },
      { label: "Industrial blanket service range", value: "Up to 650 °C; 160-240 kg/m³ density", scope: "Supplied RT-AT-H product table." },
      { label: "Cryogenic blanket", value: "-200 °C to 125 °C; 0.0125 W/(m·K) at -159 °C", scope: "Supplied RT-AT-L product table." },
      { label: "Cryogenic thickness / hydrophobicity", value: "6 mm / 10 mm; ≥98%", scope: "Supplied RT-AT-L product table." },
    ],
    testScope: dataBoundary,
    handling: ["Keep blanket edges, joints and penetrations coordinated with the system design.", "For cold service, review vapor-barrier and mechanical-protection requirements before installation."],
    selectionLimits: ["Do not use the high-temperature and cryogenic figures interchangeably.", "Service temperature does not establish a complete process, fire or corrosion-under-insulation design."],
    sourceDocuments: ["Supplied English product brochure: RT-AT-H and RT-AT-L aerogel blanket tables."],
    relatedApplicationSlugs: ["industrial-pipe-equipment-insulation", "lng-cryogenic-insulation"],
    faq: [
      ["Which blanket is suitable for low-temperature service?", "The cryogenic route must be selected against the operating temperature, vapor-barrier design and equipment geometry."],
      ["Can the blanket replace a full insulation specification?", "No. Thickness, jacketing, joints, supports and environmental exposure must be evaluated as a complete system."],
    ],
    lastReviewed: "09 August 2026",
  },
  "battery-thermal-pads": {
    model: "CW-AT-G / CW-AT-Y / CW-AT-ST",
    overview: [
      "Thin aerogel-based pads are intended for engineering evaluation in constrained battery, energy-storage and transport assemblies. Final performance depends on the cell, pack layout, clamping load and validation method.",
      "Material selection should be made against the specific thermal, electrical, mechanical and compliance requirements of the finished assembly.",
    ],
    facts: [
      { label: "Thermal conductivity", value: "≤0.025 W/(m·K) at 25 °C", scope: "Supplied thin-sheet product table." },
      { label: "Density", value: "180-300 kg/m³", scope: "Supplied thin-sheet product table." },
      { label: "Thickness", value: "0.3-5 mm", scope: "Supplied product summary; grade-dependent." },
      { label: "Maximum use temperature", value: "≤1000 °C", scope: "Supplied product summary; not a battery-pack qualification or fire rating." },
    ],
    testScope: dataBoundary,
    handling: ["Confirm cut pattern, compression, edge treatment and fixation with a representative assembly trial.", "Use the pack-level validation plan to assess electrical isolation, thermal propagation, ageing and mechanical durability."],
    selectionLimits: ["No UL 94, pack fire, thermal-runaway or vehicle compliance claim is made on this page without the applicable report and assembly conditions.", "Do not infer pack-level results from a material-only thermal conductivity value."],
    sourceDocuments: ["Supplied English product brochure: thin aerogel insulation sheet tables and product summary."],
    relatedApplicationSlugs: ["ev-ess-thermal-barriers"],
    faq: [
      ["Is this a validated battery thermal-runaway solution?", "It is a material for evaluation. Pack-level validation, including the selected test method and construction, remains the responsibility of the project team."],
      ["How is thickness selected?", "Select it against available space, target thermal path, compression condition and the project validation plan."],
    ],
    lastReviewed: "09 August 2026",
  },
  "aerogel-insulation-coating": {
    model: "CW-AC-01 / CW-AC-02",
    overview: [
      "This waterborne aerogel insulation coating is intended for thin-build building-envelope and retrofit evaluations where board insulation is difficult to install.",
      "The published evidence is for the identified test sample and system context. Surface preparation, primer, dry-film build and finish layer must be defined for each project.",
    ],
    facts: [
      { label: "Thermal conductivity", value: "0.040 W/(m·K)", scope: "Report XT226-250016; tested sample; GB/T 25261-2018 and DG/TJ 08-2200-2024 listed." },
      { label: "Added thermal resistance", value: "0.26 m²·K/W", scope: "Report XT226-250016; tested sample and report conditions." },
      { label: "VOC content", value: "35 g/L", scope: "Report XT226-250016; tested sample." },
      { label: "Dry density / pull-off adhesion", value: "179 kg/m³ / 0.63 MPa", scope: "Report XT226-250016; tested sample." },
    ],
    testScope: "Third-party report XT226-250016 recorded testing from 30 December 2024 to 19 February 2025. Data apply to the submitted sample and stated methods, not every substrate, film build or project configuration.",
    handling: ["Confirm a clean, dry, stable substrate and compatible primer before trial application.", "Build the insulation layer and protective finish to the approved system sequence and allow each layer to dry as specified."],
    selectionLimits: ["Not a substitute for a whole-building energy model, facade design or local code review.", "Thermal and adhesion results do not establish weathering, crack bridging or moisture performance for an untested substrate."],
    sourceDocuments: ["Report XT226-250016: building insulation coating test record.", "Supplied building aerogel insulation coating application workbook."],
    relatedApplicationSlugs: ["building-energy-retrofit"],
    faq: [
      ["Is 0.040 W/(m·K) a project guarantee?", "No. It is a reported value for the submitted sample under the report conditions; verify the full system for the intended project."],
      ["Can this replace conventional facade insulation everywhere?", "Selection depends on target thermal performance, permitted thickness, substrate, climate exposure and local building requirements."],
    ],
    lastReviewed: "09 August 2026",
  },
  "industrial-aerogel-insulation-coating": {
    model: "CW-AC-14 / CW-AC-15 / CW-AC-16",
    overview: [
      "Industrial aerogel insulation coating is intended for pipes, valves, flanges and complex equipment where conventional insulation is difficult to fit or maintain.",
      "It is evaluated as a coating system rather than a single wet product: substrate condition, primer, insulation layer, protective finish and curing environment all affect the result.",
    ],
    facts: [
      { label: "Indicated service range", value: "-40 °C to 180 °C", scope: "Supplied industrial application guide; product-system selection still required." },
      { label: "Thermal conductivity", value: "≤0.04 W/(m·K)", scope: "Supplied product summary; applicable grade and method must be confirmed." },
      { label: "Application environment", value: "Surface temperature ≥3 °C above dew point", scope: "Supplied industrial application guide." },
      { label: "System sequence", value: "Primer + insulation layer + protective topcoat", scope: "Supplied industrial application guide." },
    ],
    testScope: dataBoundary,
    handling: ["Confirm surface cleanliness, metal temperature and dew point before application.", "Plan coating build, drying interval and protective topcoat around the equipment operating and shutdown window."],
    selectionLimits: ["Not suitable for selection without operating temperature, geometry, surface condition and exposure data.", "Do not use this summary as a corrosion-under-insulation assessment or a substitute for process safety review."],
    sourceDocuments: ["Supplied industrial aerogel insulation coating installation guide."],
    relatedApplicationSlugs: ["industrial-pipe-equipment-insulation"],
    faq: [
      ["Can the coating be applied to hot equipment in service?", "Confirm the surface temperature, shutdown plan and compatible application window before specifying the system."],
      ["What information is needed for a trial?", "Provide operating temperature, equipment geometry, current insulation, ambient exposure and available dry-film thickness."],
    ],
    lastReviewed: "09 August 2026",
  },
  "aerogel-fireproof-coating": {
    model: "CW-FTHL",
    overview: [
      "This waterborne intumescent coating route is intended for structural-steel fire-protection evaluations. The coating forms an insulating char under heat; system selection remains tied to the applicable design and test basis.",
      "Cowin Materials does not publish a time rating for this product without the matching approved report, section factor, coating build, primer, topcoat and test standard.",
    ],
    facts: [
      { label: "Solids content", value: "66±3%", scope: "Supplied product summary; CW-FTHL." },
      { label: "Density", value: "1.30 g/cm³", scope: "Supplied product summary; CW-FTHL." },
      { label: "Surface dry / full cure", value: "2 h / 28 days", scope: "Supplied product summary; construction condition dependent." },
      { label: "Application temperature", value: "5-40 °C", scope: "Supplied intumescent coating work instruction." },
    ],
    testScope: dataBoundary,
    handling: ["Prepare steel, primer and compatible topcoat to the approved coating-system specification.", "Control wet-film application, dry-film measurement and curing conditions according to the project procedure."],
    selectionLimits: ["No 1-hour, 2-hour or other fire-resistance rating is stated without a corresponding approved test record.", "Do not transfer a rating between steel shapes, primers, topcoats or dry-film thicknesses."],
    sourceDocuments: ["Supplied indoor and outdoor intumescent fire-coating work instructions."],
    relatedApplicationSlugs: ["steel-fire-protection"],
    faq: [
      ["What fire rating can be claimed?", "Only the rating supported by the applicable approved report and the exact steel, system build and test standard should be used."],
      ["What needs to be specified before a quotation?", "Provide steel section, target rating, exposure class, primer/topcoat requirement, standard and expected dry-film thickness."],
    ],
    lastReviewed: "09 August 2026",
  },
  "non-intumescent-fire-protection-coating": {
    model: "Indoor / Outdoor Systems",
    overview: [
      "Non-intumescent thick-film systems are considered for structural-steel projects where the project design calls for a substantial protective coating build and defined exposure conditions.",
      "Indoor and outdoor systems need separate evaluation; a coating thickness or construction detail from one system cannot be carried to another without the appropriate supporting record.",
    ],
    facts: [
      { label: "System type", value: "Indoor and outdoor thick-film options", scope: "Supplied non-intumescent work instructions." },
      { label: "Substrate condition", value: "Steel preparation and compatible primer required", scope: "Supplied work instructions." },
      { label: "Coating build", value: "Project-specific dry-film thickness", scope: "Selected from the applicable design and supporting report." },
      { label: "Exposure selection", value: "Indoor versus outdoor system must be identified", scope: "Supplied work instructions." },
    ],
    testScope: dataBoundary,
    handling: ["Define the steel section, primer and target dry-film build before application planning.", "Check curing, topcoat and weather exposure requirements for the selected indoor or outdoor system."],
    selectionLimits: ["No fire-resistance duration is published here because the extracted work instructions alone are not a public rating certificate.", "Use only the test evidence specific to the selected system and steel configuration."],
    sourceDocuments: ["Supplied indoor and outdoor non-intumescent fire-coating work instructions."],
    relatedApplicationSlugs: ["steel-fire-protection"],
    faq: [
      ["How do indoor and outdoor systems differ?", "Exposure, durability, primer/topcoat selection, curing and the evidence package must be reviewed separately."],
      ["Can I select thickness from a previous project?", "No. Thickness must follow the applicable project design and supporting test or approval documentation."],
    ],
    lastReviewed: "09 August 2026",
  },
  "silicon-penetrating-water-repellent": {
    model: "CW-WP-01",
    overview: [
      "This low-viscosity silicon-based treatment is intended for porous mineral substrates where a penetrating hydrophobic treatment is being evaluated rather than a heavy surface film.",
      "Concrete, masonry, stone, mortar and repair substrates differ in porosity and moisture condition; a trial area is essential before broad application.",
    ],
    facts: [
      { label: "pH / solids", value: "pH 4-7; 8-14% solids", scope: "Supplied product summary; CW-WP-01." },
      { label: "Density", value: "0.93 g/cm³", scope: "Supplied product summary; CW-WP-01." },
      { label: "Indicative application rate", value: "250 ml/m²", scope: "Supplied product summary; actual uptake varies by substrate." },
      { label: "Submitted-sample test observations", value: "19% water absorption ratio; 0 mm penetration", scope: "2024 supplied test-report summary; conditions and sample only." },
    ],
    testScope: "The supplied 2024 report summary records the stated submitted-sample observations. A separate 2025 report includes a note that some measured items were not judged against the standard because the tested substrate differed; those values are not used as public performance claims.",
    handling: ["Clean the substrate and remove loose material, contamination and standing water before a trial.", "Apply evenly to saturation as appropriate for the substrate; confirm uptake and visual effect in a representative test area."],
    selectionLimits: ["Not a crack-bridging membrane, structural repair material or a substitute for drainage design.", "Performance can change with substrate porosity, moisture, contamination, cure and exposure; verify on the actual substrate."],
    sourceDocuments: ["Supplied penetrating water-repellent test-report extract (2024).", "Supplied silicon-based penetrating water-repellent product presentation."],
    relatedApplicationSlugs: ["concrete-masonry-waterproofing", "building-energy-retrofit"],
    faq: [
      ["Will it stop all water ingress?", "It is a penetrating water-repellent treatment for appropriate porous substrates, not a substitute for waterproofing design where hydrostatic pressure or active defects are present."],
      ["Why is a test patch needed?", "Mineral substrates vary greatly in porosity, moisture and contaminants, all of which affect absorption, appearance and performance."],
    ],
    lastReviewed: "09 August 2026",
  },
  "aerogel-paste-compound": {
    model: "CW-AJ",
    overview: [
      "Aerogel paste and compound are intended for local thermal isolation, surface treatment, sealing and shaped interfaces where a blanket or sprayable coating is not the preferred route.",
      "Final properties depend on the substrate, wet thickness, cure, surface preparation and any top-layer or encapsulation system.",
    ],
    facts: [
      { label: "Thermal conductivity", value: "0.041 W/(m·K)", scope: "Supplied product table; CW-AJ." },
      { label: "Adhesion", value: ">1 MPa", scope: "Supplied product table; confirm test method and substrate before project use." },
      { label: "Product form", value: "White paste", scope: "Supplied product summary." },
      { label: "Application route", value: "Trowel or roller trial", scope: "Supplied product summary; substrate-dependent." },
    ],
    testScope: dataBoundary,
    handling: ["Remove oil, rust and loose particles before an adhesion trial.", "Confirm drying and curing conditions for the actual substrate and target film thickness."],
    selectionLimits: ["Do not apply the listed adhesion result to a different substrate or untested surface condition.", "This product is not positioned as a structural adhesive or a substitute for a complete fire-protection system."],
    sourceDocuments: ["Supplied English product brochure: silica aerogel paste table."],
    relatedApplicationSlugs: ["industrial-pipe-equipment-insulation", "ev-ess-thermal-barriers"],
    faq: [
      ["Can it be used instead of a blanket?", "It is intended for local or shaped areas; compare the thermal, mechanical and process requirements before selecting either form."],
      ["How is adhesion verified?", "Run a representative adhesion and cure trial on the actual substrate using the intended surface preparation and film build."],
    ],
    lastReviewed: "09 August 2026",
  },
};

export type Application = {
  id: string;
  slug: string;
  title: string;
  icon: typeof Building2;
  image?: string;
  summary: string;
  fit: string[];
  metrics: string[];
};

export const applications: Application[] = [
  {
    id: "building",
    slug: "building-energy-retrofit",
    title: "Building Energy Retrofit",
    icon: Building2,
    summary:
      "Thin aerogel thermal coating and penetrating waterproofing for walls, roofs and renovation projects where board insulation is difficult.",
    fit: ["CW-AC-01/02 building aerogel insulation coating", "CW-WP-01 penetrating water repellent"],
    metrics: ["0.040 W/(m•K)", "0.26 m²•K/W added thermal resistance", "35 g/L VOC", "Formaldehyde and benzene series not detected"],
  },
  {
    id: "industrial",
    slug: "industrial-pipe-equipment-insulation",
    title: "Industrial Pipes and Complex Equipment",
    icon: Factory,
    summary:
      "Sprayable or trowel-applied aerogel coating systems for elbows, valves, flanges, tanks and surfaces that are hard to wrap.",
    fit: ["CW-AC-14/15/16 industrial aerogel insulation coating", "CW-AT-H aerogel blanket"],
    metrics: ["-40 °C to 180 °C coating range", "Complex geometry fit", "Dew point control", "Primer-coating-topcoat system"],
  },
  {
    id: "battery",
    slug: "ev-ess-thermal-barriers",
    title: "EV Battery Thermal Barriers",
    icon: BatteryCharging,
    summary:
      "Thin aerogel pads and compounds for cell spacing, module protection and local thermal barriers in battery packs and energy storage systems.",
    fit: ["CW-AT-G/Y/ST thin aerogel thermal pads", "CW-AJ aerogel paste compound"],
    metrics: ["0.3-5 mm thickness", "≤0.025 W/(m•K) at 25 °C", "Material-level evaluation", "Pack-level validation required"],
  },
  {
    id: "lng",
    slug: "lng-cryogenic-insulation",
    title: "LNG and Cold Chain",
    icon: Snowflake,
    summary:
      "Cryogenic aerogel blankets for low-temperature transport, cold-chain facilities and piping systems where thickness and CUI risk matter.",
    fit: ["CW-AT-L cryogenic aerogel blanket"],
    metrics: ["Low-temperature insulation", "-200 °C to 125 °C service option", "Hydrophobic blanket option", "6 mm / 10 mm thickness option"],
  },
  {
    id: "fire",
    slug: "steel-fire-protection",
    title: "Steel Fire Protection",
    icon: Flame,
    image: "/images/fire-char-layer.jpg",
    summary:
      "Intumescent and non-intumescent coating systems for steel structures, industrial plants and commercial buildings.",
    fit: ["CW-FTHL intumescent aerogel fireproof coating", "Indoor/outdoor non-intumescent systems"],
    metrics: ["Waterborne intumescent option", "Thick-film system option", "Defined curing process", "Project-specific fire rating"],
  },
  {
    id: "water",
    slug: "concrete-masonry-waterproofing",
    title: "Concrete and Masonry Waterproofing",
    icon: Waves,
    image: "/images/waterproof-droplets.png",
    summary:
      "Penetrating hydrophobic treatment for porous concrete, stone, mortar and gypsum-based substrates while maintaining breathability.",
    fit: ["CW-WP-01 silicon-based penetrating water repellent"],
    metrics: ["19% water absorption ratio", "0 mm permeability", "Undiluted application", "Breathable substrate protection"],
  },
];

export const proofItems = [
  {
    value: "0.040",
    unit: "W/(m•K)",
    label: "Thermal conductivity",
    note: "Building insulation coating performance highlight",
  },
  {
    value: "0.26",
    unit: "m²•K/W",
    label: "Added thermal resistance",
    note: "Thermal resistance improvement for thin coating systems",
  },
  {
    value: "35",
    unit: "g/L",
    label: "VOC content",
    note: "Formaldehyde, benzene series and heavy metals not detected",
  },
  {
    value: "19%",
    unit: "",
    label: "Water absorption ratio",
    note: "Penetrating water-repellent performance highlight",
  },
];

export const capabilityItems = [
  "Technical Data Support",
  "Sample Evaluation",
  "Application Guidance",
  "Export Documentation",
];

export const evaluationSteps = [
  {
    title: "Submit Project Conditions",
    text: "Tell us the substrate, operating temperature, target thickness, project area and required standard.",
  },
  {
    title: "Product or System Recommendation",
    text: "We identify a suitable product grade or coating system based on the available project information.",
  },
  {
    title: "Technical Document Review",
    text: "Review the applicable TDS, SDS, installation guidance and available test information.",
  },
  {
    title: "Sample Evaluation",
    text: "Request a sample for laboratory testing, trial application or internal qualification.",
  },
  {
    title: "Quotation and Supply",
    text: "Confirm packaging, quantity, lead time, export documents and commercial terms.",
  },
];

export type ApplicationPage = {
  slug: string;
  title: string;
  shortTitle: string;
  intro: string;
  image?: string;
  products: string[];
  challenges: string[];
  considerations: string[];
  requiredInfo: string[];
};

export const applicationPages: ApplicationPage[] = [
  {
    slug: "building-energy-retrofit",
    title: "Aerogel Insulation Solutions for Building Energy Retrofit",
    shortTitle: "Building Energy Retrofit",
    intro:
      "Aerogel-based coatings and insulation materials can be evaluated for walls, roofs, thermal bridges and space-limited retrofit areas. Product selection depends on the existing substrate, climate conditions, moisture exposure, target thermal performance and local building requirements.",
    products: ["Building Aerogel Thermal Insulation Coating", "Silicon-Based Penetrating Water Repellent", "Aerogel Blanket for Industrial Insulation"],
    challenges: ["Limited available thickness", "Thermal bridges", "Moisture exposure", "Existing substrate condition"],
    considerations: ["Substrate preparation", "Thermal and moisture requirements", "Coating build-up", "Local building requirements"],
    requiredInfo: ["Building area", "Existing substrate", "Climate exposure", "Target thermal performance", "Moisture or waterproofing concerns"],
  },
  {
    slug: "industrial-pipe-equipment-insulation",
    title: "Aerogel Insulation for Industrial Pipes and Complex Equipment",
    shortTitle: "Industrial Pipe & Equipment Insulation",
    intro:
      "Aerogel blankets and insulation coatings can be evaluated for pipes, valves, flanges, tanks and complex equipment where space, access, inspection or geometry limits the use of conventional insulation.",
    products: ["Industrial Aerogel Insulation Coating", "Aerogel Blanket for Industrial Insulation", "Aerogel Paste and Sealant Compound"],
    challenges: ["Complex geometry", "Inspection access", "Limited shutdown window", "Target surface temperature"],
    considerations: ["Operating temperature", "Pipe diameter", "Existing insulation", "Ambient conditions", "Corrosion considerations"],
    requiredInfo: ["Operating temperature", "Pipe diameter", "Existing insulation", "Ambient conditions", "Available thickness", "Target surface temperature"],
  },
  {
    slug: "ev-ess-thermal-barriers",
    title: "Aerogel Thermal Barrier Materials for EV Batteries and Energy Storage Systems",
    shortTitle: "EV & ESS Thermal Barriers",
    intro:
      "Lightweight aerogel-based thermal barrier materials can be evaluated for battery modules, battery packs and energy storage systems where heat transfer control and space efficiency are important.",
    products: ["Battery Aerogel Thermal Barrier Pads", "Aerogel Paste and Sealant Compound"],
    challenges: ["Limited pack space", "Heat propagation control", "Electrical insulation needs", "Module-level validation"],
    considerations: ["Cell format", "Pack design", "Required thickness", "Electrical insulation", "Validation plan"],
    requiredInfo: ["Cell or module format", "Available thickness", "Target test method", "Electrical insulation requirement", "Operating temperature"],
  },
  {
    slug: "lng-cryogenic-insulation",
    title: "Aerogel Insulation for LNG and Cryogenic Applications",
    shortTitle: "LNG & Cryogenic Insulation",
    intro:
      "Flexible aerogel insulation materials can be evaluated for cryogenic pipes, equipment and cold-service systems where low-temperature performance, condensation control and installation space are important.",
    products: ["Aerogel Blanket for Industrial Insulation"],
    challenges: ["Low-temperature service", "Condensation control", "Vapor barrier design", "Mechanical protection"],
    considerations: ["Service temperature", "Insulation thickness", "Vapor barrier", "Mechanical protection", "Applicable standards"],
    requiredInfo: ["Service temperature", "Pipe or equipment size", "Target insulation thickness", "Vapor barrier design", "Outdoor or indoor exposure"],
  },
  {
    slug: "steel-fire-protection",
    title: "Fire Protection Coating Systems for Structural Steel",
    shortTitle: "Steel Fire Protection",
    intro:
      "Cowin Materials supplies intumescent and non-intumescent coating products for evaluation in structural steel fire protection systems. Required dry film thickness and system selection depend on the steel section factor, fire resistance period, primer, topcoat and applicable test standard.",
    image: "/images/fire-char-layer.jpg",
    products: ["Aerogel Fireproof Coating for Steel Structures", "Non-Intumescent Fire Protection Coating"],
    challenges: ["Target fire resistance period", "Steel section factor", "Indoor or outdoor exposure", "Topcoat compatibility"],
    considerations: ["Primer selection", "Topcoat requirement", "Dry film thickness", "Applicable test standard"],
    requiredInfo: ["Steel section type", "Required fire rating", "Indoor or outdoor exposure", "Primer or topcoat system", "Applicable standard"],
  },
  {
    slug: "concrete-masonry-waterproofing",
    title: "Penetrating Water-Repellent Solutions for Concrete and Masonry",
    shortTitle: "Concrete & Masonry Waterproofing",
    intro:
      "Penetrating water-repellent materials can be evaluated for concrete, masonry and mineral substrates where reduced water absorption is required without forming a heavy surface film.",
    image: "/images/waterproof-droplets.png",
    products: ["Silicon-Based Penetrating Water Repellent"],
    challenges: ["Substrate porosity", "Water absorption", "Breathability", "Surface appearance"],
    considerations: ["Surface preparation", "Trial area", "Application rate", "Curing conditions", "Compatibility limitations"],
    requiredInfo: ["Substrate type", "Surface condition", "Project area", "Water exposure", "Appearance requirement"],
  },
];

export type ApplicationTechnicalProfile = {
  projectChallenge: string;
  recommendedProductSlugs: string[];
  evidence: TechnicalFact[];
  systemLimits: string[];
  validationSteps: string[];
  faq: [string, string][];
  lastReviewed: string;
};

export const applicationTechnicalProfiles: Record<string, ApplicationTechnicalProfile> = {
  "building-energy-retrofit": {
    projectChallenge: "Retrofit work often has limited available thickness, uncertain existing substrates and a need to coordinate thermal and moisture performance without disrupting the envelope.",
    recommendedProductSlugs: ["aerogel-insulation-coating", "silicon-penetrating-water-repellent", "aerogel-blanket-and-thermal-pads"],
    evidence: [
      { label: "Thermal conductivity", value: "0.040 W/(m·K)", scope: "Report XT226-250016; submitted sample under listed methods." },
      { label: "Added thermal resistance", value: "0.26 m²·K/W", scope: "Report XT226-250016; submitted sample and report conditions." },
      { label: "VOC content", value: "35 g/L", scope: "Report XT226-250016; submitted sample." },
    ],
    systemLimits: ["A coating result is not a whole-building thermal calculation.", "Facade, vapor and weather-exposure design must meet local requirements."],
    validationSteps: ["Survey the substrate, moisture condition, thermal bridges and permitted thickness.", "Prepare a representative trial area with the selected primer, coating build and finish.", "Review the applicable TDS, test method and local requirements before specification."],
    faq: [["Can a thin coating solve every retrofit requirement?", "No. It must be evaluated against the target U-value, wall build-up, climate and applicable construction requirements."]],
    lastReviewed: "09 August 2026",
  },
  "industrial-pipe-equipment-insulation": {
    projectChallenge: "Pipes, valves, flanges and complex equipment need insulation that can accommodate geometry, access and operating constraints.",
    recommendedProductSlugs: ["industrial-aerogel-insulation-coating", "aerogel-blanket-and-thermal-pads", "aerogel-paste-compound"],
    evidence: [
      { label: "Coating service window", value: "-40 °C to 180 °C", scope: "Supplied industrial application guide; grade and system must be confirmed." },
      { label: "Dew-point control", value: "Surface ≥3 °C above dew point", scope: "Supplied industrial application guide." },
      { label: "Industrial blanket", value: "0.020 W/(m·K) at 25 °C", scope: "Supplied RT-AT-H table; blanket grade only." },
    ],
    systemLimits: ["Do not select from thermal data alone; include surface temperature, CUI risk, access and mechanical protection.", "Existing coating condition and operational constraints can rule out some routes."],
    validationSteps: ["Collect operating temperature, geometry, current insulation and shutdown constraints.", "Check surface preparation, dew point and trial coating build.", "Evaluate the complete insulation and protective-topcoat system before scale-up."],
    faq: [["Can one system cover every pipe and valve?", "No. Geometry, surface temperature, access, exposure and maintenance requirements determine the suitable route."]],
    lastReviewed: "09 August 2026",
  },
  "ev-ess-thermal-barriers": {
    projectChallenge: "Battery and energy-storage assemblies need material options that fit constrained spaces and are evaluated within the actual electrical, mechanical and safety-validation plan.",
    recommendedProductSlugs: ["battery-thermal-pads", "aerogel-paste-compound"],
    evidence: [
      { label: "Thin-pad conductivity", value: "≤0.025 W/(m·K) at 25 °C", scope: "Supplied thin-sheet table; material level only." },
      { label: "Pad thickness", value: "0.3-5 mm", scope: "Supplied product summary; grade-dependent." },
      { label: "Pad density", value: "180-300 kg/m³", scope: "Supplied thin-sheet table." },
    ],
    systemLimits: ["No cell-to-cell, pack fire or vehicle-compliance conclusion can be made from a material summary.", "Performance must be evaluated with the intended cell format, stack pressure and construction."],
    validationSteps: ["Define the cell/module layout, available space and selected test method.", "Run representative compression, electrical and thermal tests in the intended assembly.", "Complete pack-level validation before release."],
    faq: [["Does a thin pad automatically qualify the battery pack?", "No. The pack must be validated as an assembly using the intended method and construction."]],
    lastReviewed: "09 August 2026",
  },
  "lng-cryogenic-insulation": {
    projectChallenge: "Cold-service systems need insulation selection that considers low temperature, condensation control, vapor-barrier continuity, joints and mechanical protection.",
    recommendedProductSlugs: ["aerogel-blanket-and-thermal-pads"],
    evidence: [
      { label: "Cryogenic blanket service range", value: "-200 °C to 125 °C", scope: "Supplied RT-AT-L table." },
      { label: "Cryogenic conductivity", value: "0.0125 W/(m·K) at -159 °C", scope: "Supplied RT-AT-L table." },
      { label: "Listed thicknesses", value: "6 mm / 10 mm", scope: "Supplied RT-AT-L table." },
    ],
    systemLimits: ["This summary is not a complete LNG-system insulation or vapor-barrier design.", "Water-vapor ingress, supports, joints and jacketing must be designed for the actual operating cycle."],
    validationSteps: ["Confirm service temperature, equipment dimensions, available thickness and exposure.", "Define vapor barrier, mechanical protection and termination details.", "Review the selected grade and complete system against project requirements."],
    faq: [["Does hydrophobicity remove the need for a vapor barrier?", "No. Vapor-barrier design should be made for the full cold-service system and its operating conditions."]],
    lastReviewed: "09 August 2026",
  },
  "steel-fire-protection": {
    projectChallenge: "Structural steel protection must be selected against the test standard, steel section factor, exposure, primer/topcoat and target dry-film thickness.",
    recommendedProductSlugs: ["aerogel-fireproof-coating", "non-intumescent-fire-protection-coating"],
    evidence: [
      { label: "Intumescent solids / density", value: "66±3% / 1.30 g/cm³", scope: "Supplied CW-FTHL product summary." },
      { label: "Application temperature", value: "5-40 °C", scope: "Supplied intumescent work instruction." },
      { label: "System options", value: "Intumescent and non-intumescent", scope: "Supplied application work instructions." },
    ],
    systemLimits: ["No time rating is published without a matching approved report and fully tested system configuration.", "Do not specify fire protection from density, solids content or generic thickness alone."],
    validationSteps: ["Collect steel section, target standard, exposure class and primer/topcoat proposal.", "Define dry-film build using relevant approved evidence.", "Measure dry-film thickness and curing against the project inspection plan."],
    faq: [["Can you quote a fire rating from the product name?", "No. The applicable report, steel configuration, coating build and standard must be confirmed first."]],
    lastReviewed: "09 August 2026",
  },
  "concrete-masonry-waterproofing": {
    projectChallenge: "Porous mineral substrates vary in porosity, moisture and contamination, so a penetrating treatment needs trial-area validation rather than a presumed universal dosage.",
    recommendedProductSlugs: ["silicon-penetrating-water-repellent"],
    evidence: [
      { label: "Water absorption ratio", value: "19%", scope: "2024 supplied test-report summary; submitted sample only." },
      { label: "Penetration observation", value: "0 mm; no water trace / discoloration", scope: "2024 supplied report summary; submitted sample and conditions only." },
      { label: "Indicative application rate", value: "250 ml/m²", scope: "Supplied product summary; actual uptake depends on substrate." },
    ],
    systemLimits: ["Not a crack-bridging membrane, structural repair material or substitute for drainage design.", "Do not apply test-substrate values to different concrete, stone or masonry without a test patch."],
    validationSteps: ["Identify substrate porosity, contamination, moisture and water-exposure mechanism.", "Prepare a representative patch and document uptake, drying, appearance and water response.", "Confirm repair or drainage measures required outside the treatment."],
    faq: [["Can a penetrating treatment bridge moving cracks?", "No. Crack repair and hydrostatic-pressure control require a suitable separate system."]],
    lastReviewed: "09 August 2026",
  },
};

export const resourceSections = [
  {
    id: "tds",
    title: "Technical Data Sheets",
    text: "Product-specific TDS files are available during product evaluation. Request the applicable grade before using values for project decisions.",
    action: "Request TDS",
  },
  {
    id: "sds",
    title: "Safety Data Sheets",
    text: "SDS availability may vary by product and destination. Request the applicable safety document for handling and logistics review.",
    action: "Request SDS",
  },
  {
    id: "test-data",
    title: "Test Data",
    text: "Technical values depend on product grade, test method, sample thickness and operating conditions.",
    action: "Request Test Information",
  },
  {
    id: "installation-guides",
    title: "Installation Guides",
    text: "Coating guidance can be provided for substrate preparation, primer, coating sequence, curing and topcoat selection.",
    action: "Request Installation Guide",
  },
  {
    id: "selection-guide",
    title: "Product Selection Guide",
    text: "Share substrate, temperature, target thickness, application method and required standard for product selection support.",
    action: "Ask an Engineer",
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    text: "Common questions about samples, documents, packaging, customization and quotations.",
    action: "View FAQ",
  },
];

export const publicDataHighlights: TechnicalFact[] = [
  {
    label: "Building aerogel insulation coating",
    value: "0.040 W/(m·K) thermal conductivity; 0.26 m²·K/W added thermal resistance",
    scope: "Report XT226-250016; submitted sample, reported methods and conditions.",
  },
  {
    label: "Cryogenic aerogel blanket",
    value: "0.0125 W/(m·K) at -159 °C",
    scope: "Supplied RT-AT-L product table; blanket grade only.",
  },
  {
    label: "Silicon penetrating water repellent",
    value: "19% water absorption ratio; 0 mm penetration observation",
    scope: "2024 supplied test-report summary; submitted sample and conditions only.",
  },
];

export const commonFaqs = [
  ["How do I select the correct product grade?", "Send the operating temperature, substrate, target thickness, application method and required standard so the team can recommend a product route."],
  ["Can I request a sample?", "Samples can be arranged for evaluation, subject to product type, destination and commercial terms."],
  ["What information is required for a quotation?", "Please provide product interest, quantity, destination, project schedule, packaging needs and any required technical standard."],
  ["Are technical documents available?", "Applicable TDS, SDS, installation guidance and available test information can be provided during product evaluation."],
  ["Can the product be customized?", "Customization can be discussed when the target application, performance requirement and validation method are clear."],
  ["What packaging options are available?", "Packaging is confirmed according to product form, quantity, shipping method and destination requirements."],
];

export const constructionSystems = [
  {
    title: "Building Aerogel Insulation Coating System",
    code: "CW-AC-01/02",
    steps: [
      "Confirm the wall or roof substrate is clean, dry and stable before coating.",
      "Use primer, aerogel insulation coating and weather-resistant topcoat as a complete system.",
      "Control coating thickness and drying interval according to project conditions.",
    ],
    parameters: ["Primer + aerogel coating + topcoat", "Thin insulation layer", "Exterior wall / roof retrofit", "Project dosage confirmed by substrate"],
  },
  {
    title: "Industrial Aerogel Coating System",
    code: "CW-AC-14/15/16",
    steps: [
      "Confirm operating temperature, shutdown window and surface condition before application.",
      "Use a heat-resistant primer, aerogel insulation layer and protective topcoat.",
      "Pay attention to dew point, humidity and coating thickness during construction.",
    ],
    parameters: ["Pipes, valves and tanks", "Spray or trowel application", "Complex geometry fit", "Protective topcoat available"],
  },
  {
    title: "Steel Fire Protection Coating System",
    code: "CW-FTHL / Non-intumescent",
    image: "/images/fire-char-layer.jpg",
    steps: [
      "Prepare the steel surface according to the project coating specification.",
      "Select intumescent or non-intumescent coating according to target fire rating.",
      "Apply protective topcoat when outdoor exposure or decorative finish is required.",
    ],
    parameters: ["Steel structure protection", "Indoor / outdoor options", "Topcoat compatible", "Rating confirmed by project"],
  },
  {
    title: "Penetrating Water Repellent System",
    code: "CW-WP-01",
    steps: [
      "Clean porous mineral substrates and remove dust, oil and loose particles.",
      "Apply by spray, roller or brush until the surface is evenly treated.",
      "Protect the treated area from rain during the initial curing period.",
    ],
    parameters: ["Concrete and masonry", "Breathable protection", "No surface film", "Dosage depends on porosity"],
  },
];

export const advantageCards = [
  {
    icon: FlaskConical,
    title: "From aerogel powder to engineered coating systems",
    text: "Cowin Materials can present a full SiO2 aerogel material platform rather than only one blanket or battery pad product.",
  },
  {
    icon: FileCheck2,
    title: "Test data supports early buyer qualification",
    text: "Key thermal, VOC and waterproofing highlights help buyers evaluate material fit efficiently.",
  },
  {
    icon: Gauge,
    title: "Installation parameters are already documented",
    text: "Substrate preparation, coating sequence, curing windows and project dosage can be clarified before sampling.",
  },
  {
    icon: Globe2,
    title: "Global project support beyond commodity supply",
    text: "The product portfolio supports building retrofit, industrial insulation, fire protection, waterproofing and thermal-management projects.",
  },
];

export const processHighlights = [
  { icon: ShieldCheck, title: "Qualification-aware documentation", text: "Performance statements are supported with test-report boundaries, project conditions and applicable standard references." },
  { icon: Layers3, title: "System selling", text: "Each product is explained as primer, coating, blanket, topcoat or treatment system, not as isolated raw material." },
  { icon: ThermometerSun, title: "Application-first navigation", text: "Engineers can enter through temperature, substrate, geometry, fire rating or waterproofing problem." },
];
