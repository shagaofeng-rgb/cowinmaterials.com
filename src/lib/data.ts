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
  { href: "/technology", label: "Testing & Data" },
  { href: "/construction", label: "Installation" },
  { href: "/comparison", label: "Why Cowin" },
  { href: "/contact", label: "Contact" },
];

export const megaMenus = {
  Products: [
    { href: "/products/aerogel-powder-and-slurry", label: "Aerogel powder & slurry", note: "SiO2 aerogel raw materials" },
    { href: "/products/aerogel-blanket-and-thermal-pads", label: "Blankets & thermal pads", note: "Industrial and EV insulation" },
    { href: "/products/aerogel-insulation-coating", label: "Aerogel insulation coating", note: "Building and industrial systems" },
    { href: "/products/aerogel-fireproof-coating", label: "Fire protection coating", note: "Intumescent and non-intumescent" },
    { href: "/products/silicon-penetrating-water-repellent", label: "Penetrating water repellent", note: "Concrete and masonry protection" },
  ],
  Applications: [
    { href: "/applications#building", label: "Building energy retrofit", note: "Thin thermal coating and waterproofing" },
    { href: "/applications#industrial", label: "Industrial equipment", note: "Pipes, valves, tanks and hot surfaces" },
    { href: "/applications#battery", label: "EV battery thermal barrier", note: "Thin pads for pack-level protection" },
    { href: "/applications#lng", label: "LNG and cold chain", note: "Cryogenic insulation blankets" },
    { href: "/applications#fire", label: "Steel fire protection", note: "Coating systems for steel structures" },
  ],
  Resources: [
    { href: "/technology", label: "Performance data", note: "Thermal, VOC and waterproofing highlights" },
    { href: "/construction", label: "Application systems", note: "Primer, coating, topcoat and curing guidance" },
    { href: "/comparison", label: "Why Cowin Materials", note: "Supplier strengths for global B2B projects" },
  ],
};

export const productCategories = [
  "All",
  "Aerogel Raw Materials",
  "Blankets & Thermal Pads",
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
    metrics: ["400-800 m2/g specific surface area", "90-95% porosity", "20-50 nm pore size", "Hydrophobic surface"],
    applications: ["Waterborne industrial coatings", "Thermal coating formulas", "Composite fillers"],
    proof: "Suitable for hydrophobic silica aerogel powder and waterborne formulation development.",
    image: "/images/waterproof-section-test.png",
    seoTitle: "Hydrophobic Silica Aerogel Powder and Waterborne Aerogel Slurry",
    seoDescription:
      "CW-AP silica aerogel powder and CW-AP-W waterborne slurry for aerogel coating, composite filler and thermal insulation formulations.",
    detail: [
      "CW-AP provides a low-density nanoporous silica aerogel platform for formulators who need thermal resistance, hydrophobicity and lightweight filler performance.",
      "CW-AP-W is a waterborne pre-dispersed aerogel slurry with 20-25% solids and 0.020-0.025 W/(m·K) thermal conductivity after drying.",
    ],
  },
  {
    name: "Aerogel Blanket for Industrial Insulation",
    code: "CW-AT-H / CW-AT-L",
    slug: "aerogel-blanket-and-thermal-pads",
    category: "Blankets & Thermal Pads",
    summary:
      "Flexible aerogel blankets for medium-high temperature insulation, cryogenic service, tanks, pipelines and constrained spaces.",
    metrics: ["0.020 W/(m·K) at 25C", "Up to 650C service for CW-AT-H", "-200C to 125C for CW-AT-L", "Hydrophobicity up to 99.9%"],
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
    name: "Building Aerogel Thermal Insulation Coating",
    code: "CW-AC-01/02",
    slug: "aerogel-insulation-coating",
    category: "Insulation Coatings",
    summary:
      "Waterborne thin-layer aerogel insulation coating used with primer and topcoat for exterior walls, roofs, retrofits and industrial buildings.",
    metrics: ["0.040 W/(m·K) thermal conductivity", "0.26 m2·K/W added thermal resistance", "Low-VOC waterborne system", "Thin coating application"],
    applications: ["Exterior walls", "Roof retrofit", "Factory buildings", "Energy-saving renovation"],
    proof: "Supporting documents are available for thermal conductivity, added thermal resistance and VOC review.",
    image: "/images/fire-test-lab.jpg",
    seoTitle: "Waterborne Aerogel Insulation Coating for Building Energy Retrofit",
    seoDescription:
      "CW-AC aerogel insulation coating for building envelope retrofit, thin thermal insulation layers, exterior walls and roofs with tested 0.040 W/(m·K) conductivity.",
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
      "Sprayable or trowel-applied aerogel insulation coating for equipment, valves, elbows and complex industrial surfaces up to 180C.",
    metrics: ["-40C to 180C service range", "≤0.04 W/(m·K) thermal conductivity", "≤1.5 mm single wet film", "Three-layer protection system"],
    applications: ["Hot equipment", "Pipe elbows", "Valves and flanges", "Burn protection"],
    proof: "Installation guidance defines primer, aerogel mid-coat, topcoat, dew-point control and curing windows.",
    image: "/images/fire-test-lab.jpg",
    seoTitle: "Industrial Aerogel Insulation Coating for Pipes and Complex Equipment",
    seoDescription:
      "CW-AC industrial aerogel coating system for pipes, valves, tanks, process equipment and complex thermal-insulation surfaces up to 180C.",
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
    metrics: ["0.93 g/cm3 density", "pH 4-7", "8-14% solids", "250 ml/m2 recommended dosage"],
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
    metrics: ["0.041 W/(m·K) thermal conductivity", ">1 MPa adhesion", "Class B combustion behavior", "Trowel or roller applied"],
    applications: ["Aerogel felt surface treatment", "Substrate coating", "Encapsulation", "Vibration and heat isolation"],
    proof: "90C drying for 24 hours is recommended when higher adhesion is required.",
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
    title: "Building Energy Retrofit",
    icon: Building2,
    image: "/images/fire-waterproof-deck.jpg",
    summary:
      "Thin aerogel thermal coating and penetrating waterproofing for walls, roofs and renovation projects where board insulation is difficult.",
    fit: ["CW-AC-01/02 building aerogel insulation coating", "CW-WP-01 penetrating water repellent"],
    metrics: ["0.040 W/(m·K)", "0.26 added thermal resistance", "35 g/L VOC", "Formaldehyde and benzene series not detected"],
  },
  {
    id: "industrial",
    title: "Industrial Pipes and Complex Equipment",
    icon: Factory,
    image: "/images/industrial-coating-system.jpeg",
    summary:
      "Sprayable or trowel-applied aerogel coating systems for elbows, valves, flanges, tanks and surfaces that are hard to wrap.",
    fit: ["CW-AC-14/15/16 industrial aerogel insulation coating", "CW-AT-H aerogel blanket"],
    metrics: ["-40C to 180C coating range", "≤1.5 mm single wet film", "Dew point +3C application rule", "Primer-coating-topcoat system"],
  },
  {
    id: "battery",
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
    title: "LNG and Cold Chain",
    icon: Snowflake,
    image: "/images/fire-test-lab.jpg",
    summary:
      "Cryogenic aerogel blankets for low-temperature transport, cold-chain facilities and piping systems where thickness and CUI risk matter.",
    fit: ["CW-AT-L cryogenic aerogel blanket"],
    metrics: ["0.0125 W/(m·K) at -159C", "-200C to 125C service", "≥98% hydrophobicity", "6 mm / 10 mm thickness"],
  },
  {
    id: "fire",
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
    unit: "W/(m·K)",
    label: "Thermal conductivity",
    note: "Building insulation coating performance highlight",
  },
  {
    value: "0.26",
    unit: "m2·K/W",
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
