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
  address: "Room 110, 1st Floor, Building 2, Qushidai Future Building, Kecheng District, Quzhou City, Zhejiang Province, China",
  domain: "cowinmaterials.com",
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/applications", label: "Applications" },
  { href: "/technical-resources", label: "Technical Resources" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/news", label: "News & Insights" },
  { href: "/about", label: "About" },
  { href: "/search", label: "Search" },
  { href: "/contact", label: "Contact" },
];

export const megaMenus = {
  Products: [
    { href: "/products/aerogel-powder-and-slurry", label: "Aerogel powder & slurry", note: "SiO2 aerogel raw materials" },
    { href: "/products/aerogel-blanket-and-thermal-pads", label: "Aerogel blankets", note: "Industrial and cryogenic insulation" },
    { href: "/products/battery-thermal-pads", label: "Battery thermal pads", note: "EV and ESS thermal barriers" },
    { href: "/products/aerogel-insulation-coating", label: "Building insulation coating", note: "Retrofit and thin thermal layers" },
    { href: "/products/industrial-aerogel-insulation-coating", label: "Industrial insulation coating", note: "Pipes, tanks and complex equipment" },
    { href: "/products/aerogel-fireproof-coating", label: "Intumescent fireproof coating", note: "Steel fire protection" },
    { href: "/products/non-intumescent-fire-protection-coating", label: "Non-intumescent fireproof coating", note: "Thick-film steel protection" },
    { href: "/products/silicon-penetrating-water-repellent", label: "Penetrating water repellent", note: "Concrete and masonry protection" },
    { href: "/products/aerogel-paste-compound", label: "Aerogel paste & compounds", note: "Specialty sealing and local insulation" },
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
    { href: "/technical-resources#tds", label: "Technical Data Sheets", note: "Request product-specific TDS" },
    { href: "/technical-resources#sds", label: "Safety Data Sheets", note: "Request applicable SDS" },
    { href: "/technical-resources#test-data", label: "Test Data", note: "Review data in context" },
    { href: "/technical-resources#installation-guides", label: "Installation Guides", note: "Coating system guidance" },
    { href: "/technical-resources#selection-guide", label: "Product Selection Guide", note: "Choose by conditions" },
    { href: "/technical-resources#faq", label: "FAQ", note: "Common buyer questions" },
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
  image: string;
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
    image: "/images/waterproof-section-test.png",
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
    image: "/images/industrial-coating-system.jpeg",
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
    metrics: ["0.3-5 mm thickness range", "UL94-V0 option", "Electrical insulation option", "Low moisture absorption option"],
    applications: ["Battery modules", "Energy storage systems", "Cell spacing", "Pack-level thermal barriers"],
    proof: "Designed for evaluation in thermal barrier and heat propagation control applications. Final use depends on module design and project testing.",
    image: "/images/ev-thermal-sheet.jpg",
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
    image: "/images/fire-test-lab.jpg",
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
    image: "/images/fire-test-lab.jpg",
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
    image: "/images/fire-test-lab.jpg",
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
    seoTitle: "Aerogel Paste Compound for Local Thermal Insulation and Sealing",
    seoDescription:
      "CW-AJ aerogel paste compound for flexible sealing, local thermal insulation, aerogel blanket surface treatment and thin protective coatings.",
    detail: [
      "The paste gives product engineers a processable aerogel compound for small areas, interfaces and shaped parts where blankets or coatings are not ideal.",
      "It can support sealing, damping, thermal isolation and surface finish improvement in composite systems.",
    ],
  },
];

export const applications = [
  {
    id: "building",
    slug: "building-energy-retrofit",
    title: "Building Energy Retrofit",
    icon: Building2,
    image: "/images/fire-waterproof-deck.jpg",
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
    image: "/images/industrial-coating-system.jpeg",
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
    image: "/images/ev-thermal-sheet.jpg",
    summary:
      "Thin aerogel pads and compounds for cell spacing, module protection and local thermal barriers in battery packs and energy storage systems.",
    fit: ["CW-AT-G/Y/ST thin aerogel thermal pads", "CW-AJ aerogel paste compound"],
    metrics: ["0.3-5 mm thickness", "UL94-V0", "≥500 MΩ insulation", "0.1% volume moisture absorption"],
  },
  {
    id: "lng",
    slug: "lng-cryogenic-insulation",
    title: "LNG and Cold Chain",
    icon: Snowflake,
    image: "/images/fire-test-lab.jpg",
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

export const productGroups = [
  {
    title: "Aerogel Raw Materials",
    description: "Hydrophobic aerogel powder and waterborne aerogel slurry for coatings, compounds and insulation product development.",
    href: "/products/aerogel-powder-and-slurry",
    cta: "Explore Raw Materials",
  },
  {
    title: "Aerogel Insulation",
    description: "Aerogel blankets, insulation pads and flexible thermal barriers for high-temperature, cryogenic and space-limited applications.",
    href: "/products/aerogel-blanket-and-thermal-pads",
    cta: "Explore Aerogel Insulation",
  },
  {
    title: "Aerogel Coatings",
    description: "Thin-build insulation coatings designed for buildings, industrial equipment, pipes, valves and complex surfaces.",
    href: "/products/industrial-aerogel-insulation-coating",
    cta: "Explore Aerogel Coatings",
  },
  {
    title: "Battery Thermal Barriers",
    description: "Lightweight thermal barrier materials for battery modules, energy storage systems and heat propagation control evaluation.",
    href: "/products/battery-thermal-pads",
    cta: "Explore Battery Materials",
  },
  {
    title: "Fire Protection Coatings",
    description: "Intumescent and non-intumescent coating systems for structural steel and fire protection applications.",
    href: "/products/aerogel-fireproof-coating",
    cta: "Explore Fire Protection",
  },
  {
    title: "Waterproofing Materials",
    description: "Penetrating water-repellent systems for concrete, masonry and mineral substrates.",
    href: "/products/silicon-penetrating-water-repellent",
    cta: "Explore Waterproofing",
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

export const applicationPages = [
  {
    slug: "building-energy-retrofit",
    title: "Aerogel Insulation Solutions for Building Energy Retrofit",
    shortTitle: "Building Energy Retrofit",
    intro:
      "Aerogel-based coatings and insulation materials can be evaluated for walls, roofs, thermal bridges and space-limited retrofit areas. Product selection depends on the existing substrate, climate conditions, moisture exposure, target thermal performance and local building requirements.",
    image: "/images/fire-waterproof-deck.jpg",
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
    image: "/images/industrial-coating-system.jpeg",
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
    image: "/images/ev-thermal-sheet.jpg",
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
    image: "/images/fire-test-lab.jpg",
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
    image: "/images/building-coating-system.jpeg",
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
    image: "/images/industrial-coating-system.jpeg",
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
    image: "/images/silicon-waterproof-deck.jpg",
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
