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
  name: "Ruitai Jiuhe",
  legalName: "Shanghai Ruitai Jiuhe High-tech Materials Co., Ltd.",
  tagline: "Silica Aerogel Material Systems",
  phone: "+86 150 0060 8886",
  phoneHref: "+8615000608886",
  email: "Market@rt-joy.com",
  address: "No. 777 Xinwei Road, Fusheng Industrial Park, Chongming District, Shanghai, China",
  domain: "cowinmaterials.com",
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/applications", label: "Applications" },
  { href: "/technology", label: "Testing & Data" },
  { href: "/construction", label: "Installation" },
  { href: "/comparison", label: "Benchmark" },
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
    { href: "/technology", label: "Test reports and data", note: "Thermal, VOC, water-repellent and FTO notes" },
    { href: "/construction", label: "Installation systems", note: "Primer, coating, topcoat and curing windows" },
    { href: "/comparison", label: "Cabot, Aspen, JIOS benchmark", note: "How Ruitai Jiuhe should position overseas" },
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
    code: "RT-AP",
    slug: "aerogel-powder-and-slurry",
    category: "Aerogel Raw Materials",
    summary:
      "Nanoporous SiO2 aerogel raw material for coatings, composite fillers and functional modification systems.",
    metrics: ["400-800 m2/g specific surface area", "90-95% porosity", "20-50 nm pore size", "Hydrophobic surface"],
    applications: ["Waterborne industrial coatings", "Thermal coating formulas", "Composite fillers"],
    proof: "Designed against JC/T 2518-2019 requirements for hydrophobic silica aerogel powder.",
    image: "/images/waterproof-section-test.png",
    seoTitle: "Hydrophobic Silica Aerogel Powder and Waterborne Aerogel Slurry",
    seoDescription:
      "RT-AP silica aerogel powder and RT-AP-W waterborne slurry for aerogel coating, composite filler and thermal insulation formulations.",
    detail: [
      "RT-AP provides a low-density nanoporous silica aerogel platform for formulators who need thermal resistance, hydrophobicity and lightweight filler performance.",
      "RT-AP-W is a waterborne pre-dispersed aerogel slurry with 20-25% solids and 0.020-0.025 W/(m·K) thermal conductivity after drying.",
    ],
  },
  {
    name: "Aerogel Blanket for Industrial Insulation",
    code: "RT-AT-H / RT-AT-L",
    slug: "aerogel-blanket-and-thermal-pads",
    category: "Blankets & Thermal Pads",
    summary:
      "Flexible aerogel blankets for medium-high temperature insulation, cryogenic service, tanks, pipelines and constrained spaces.",
    metrics: ["0.020 W/(m·K) at 25C", "Up to 650C service for RT-AT-H", "-200C to 125C for RT-AT-L", "Hydrophobicity up to 99.9%"],
    applications: ["Steam pipelines", "Process equipment", "LNG logistics", "Cold chain"],
    proof: "Product quality aligned with GB/T 34336-2017 nanoporous aerogel composite insulation products.",
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
    code: "RT-AC-01/02",
    slug: "aerogel-insulation-coating",
    category: "Insulation Coatings",
    summary:
      "Waterborne thin-layer aerogel insulation coating used with primer and topcoat for exterior walls, roofs, retrofits and industrial buildings.",
    metrics: ["0.040 W/(m·K) tested thermal conductivity", "0.26 m2·K/W added thermal resistance", "35 g/L VOC", "0.5 g/mL density"],
    applications: ["Exterior walls", "Roof retrofit", "Factory buildings", "Energy-saving renovation"],
    proof: "Shanghai Jianke XT226-250016 report: compliant with GB/T 25261-2018 and DG/TJ08-2200-2024.",
    image: "/images/fire-test-lab.jpg",
    seoTitle: "Waterborne Aerogel Insulation Coating for Building Energy Retrofit",
    seoDescription:
      "RT-AC aerogel insulation coating for building envelope retrofit, thin thermal insulation layers, exterior walls and roofs with tested 0.040 W/(m·K) conductivity.",
    detail: [
      "The coating is designed as a system: substrate preparation, primer, two aerogel insulation coats and two topcoat layers.",
      "It is best positioned for retrofit projects where conventional insulation boards are difficult because of thickness, shape, weight or shutdown constraints.",
    ],
  },
  {
    name: "Industrial Aerogel Insulation Coating",
    code: "RT-AC-14/15/16",
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
      "RT-AC industrial aerogel coating system for pipes, valves, tanks, process equipment and complex thermal-insulation surfaces up to 180C.",
    detail: [
      "The industrial coating route is useful for geometry that is difficult to wrap with rigid insulation, especially valves, flanges, elbows and maintenance areas.",
      "The system requires surface temperature above dew point +3C and relative humidity control during application.",
    ],
  },
  {
    name: "Aerogel Fireproof Coating for Steel Structures",
    code: "RT-FTHL",
    slug: "aerogel-fireproof-coating",
    category: "Fire Protection Coatings",
    summary:
      "Waterborne ultra-thin intumescent coating that forms an expanded char layer under fire while aerogel slows heat transfer to steel.",
    metrics: ["66±3% solids", "1.30 g/cm3 density", "2 h surface dry", "28-day full cure"],
    applications: ["Steel factories", "Petrochemical frames", "Power facilities", "Commercial steel"],
    proof: "Designed for GB14907-2018 fireproof coating requirements. Fire-resistance ratings must be matched to project test reports.",
    image: "/images/fire-char-layer.jpg",
    seoTitle: "Waterborne Aerogel Intumescent Fireproof Coating for Steel Structures",
    seoDescription:
      "RT-FTHL ultra-thin waterborne intumescent aerogel fireproof coating for steel structures, industrial facilities and building fire protection.",
    detail: [
      "The intumescent layer expands under heat to create a protective char barrier, while aerogel contributes thermal resistance inside the coating matrix.",
      "For overseas use, the website should present the product as a technical coating system and confirm local fire testing before project claims.",
    ],
  },
  {
    name: "Non-Intumescent Fire Protection Coating",
    code: "Indoor / Outdoor Systems",
    slug: "non-intumescent-fire-protection-coating",
    category: "Fire Protection Coatings",
    summary:
      "Thick-film fire protection coating systems for steel structures requiring higher dry film thickness and defined fire-resistance duration.",
    metrics: ["24 mm / 2.5 h reference system", "100% solids", "4 h surface dry", "28-day full cure"],
    applications: ["Steel fire protection", "Outdoor exposure", "Industrial structures"],
    proof: "Indoor dry density ≤500 kg/m3. Outdoor dry density ≤650 kg/m3.",
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
    code: "RT-WP-01",
    slug: "silicon-penetrating-water-repellent",
    category: "Waterproofing",
    summary:
      "Low-viscosity penetrating water repellent that forms nanoscale hydrophobic interfaces inside porous concrete, masonry and stone substrates.",
    metrics: ["0.93 g/cm3 density", "pH 4-7", "8-14% solids", "250 ml/m2 recommended dosage"],
    applications: ["Concrete structures", "Stone protection", "Mortar and gypsum", "Repair and retrofit"],
    proof: "2024W06363 report: 19% water absorption ratio, 0 mm permeability and no staining under multiple aging conditions.",
    image: "/images/waterproof-droplets.png",
    seoTitle: "Silicon Penetrating Water Repellent for Concrete, Stone and Masonry",
    seoDescription:
      "RT-WP-01 silicon-based penetrating water repellent for concrete, stone, mortar and masonry waterproofing while maintaining vapor permeability.",
    detail: [
      "RT-WP-01 is not a surface film. It penetrates capillary pores and microcracks, then creates a hydrophobic interface while keeping the substrate breathable.",
      "It is designed for concrete durability, masonry retrofit, stone protection and water-repellent treatment on porous mineral substrates.",
    ],
  },
  {
    name: "Aerogel Paste and Sealant Compound",
    code: "RT-AJ",
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
      "RT-AJ aerogel paste compound for flexible sealing, local thermal insulation, aerogel blanket surface treatment and thin protective coatings.",
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
    fit: ["RT-AC-01/02 building aerogel insulation coating", "RT-WP-01 penetrating water repellent"],
    metrics: ["0.040 W/(m·K)", "0.26 added thermal resistance", "35 g/L VOC", "Formaldehyde and benzene series not detected"],
  },
  {
    id: "industrial",
    title: "Industrial Pipes and Complex Equipment",
    icon: Factory,
    image: "/images/industrial-coating-system.jpeg",
    summary:
      "Sprayable or trowel-applied aerogel coating systems for elbows, valves, flanges, tanks and surfaces that are hard to wrap.",
    fit: ["RT-AC-14/15/16 industrial aerogel insulation coating", "RT-AT-H aerogel blanket"],
    metrics: ["-40C to 180C coating range", "≤1.5 mm single wet film", "Dew point +3C application rule", "Primer-coating-topcoat system"],
  },
  {
    id: "battery",
    title: "EV Battery Thermal Barriers",
    icon: BatteryCharging,
    image: "/images/ev-thermal-sheet.jpg",
    summary:
      "Thin aerogel pads and compounds for cell spacing, module protection and local thermal barriers in battery packs and energy storage systems.",
    fit: ["RT-AT-G/Y/ST thin aerogel thermal pads", "RT-AJ aerogel paste compound"],
    metrics: ["0.3-5 mm thickness", "UL94-V0", "≥500 MΩ insulation", "0.1% volume moisture absorption"],
  },
  {
    id: "lng",
    title: "LNG and Cold Chain",
    icon: Snowflake,
    image: "/images/fire-test-lab.jpg",
    summary:
      "Cryogenic aerogel blankets for low-temperature transport, cold-chain facilities and piping systems where thickness and CUI risk matter.",
    fit: ["RT-AT-L cryogenic aerogel blanket"],
    metrics: ["0.0125 W/(m·K) at -159C", "-200C to 125C service", "≥98% hydrophobicity", "6 mm / 10 mm thickness"],
  },
  {
    id: "fire",
    title: "Steel Fire Protection",
    icon: Flame,
    image: "/images/fire-char-layer.jpg",
    summary:
      "Intumescent and non-intumescent coating systems for steel structures, industrial plants and commercial buildings.",
    fit: ["RT-FTHL intumescent aerogel fireproof coating", "Indoor/outdoor non-intumescent systems"],
    metrics: ["66±3% solids for intumescent coating", "24 mm / 2.5 h reference thick system", "28-day full cure", "GB14907-2018 basis"],
  },
  {
    id: "water",
    title: "Concrete and Masonry Waterproofing",
    icon: Waves,
    image: "/images/waterproof-droplets.png",
    summary:
      "Penetrating hydrophobic treatment for porous concrete, stone, mortar and gypsum-based substrates while maintaining breathability.",
    fit: ["RT-WP-01 silicon-based penetrating water repellent"],
    metrics: ["19% water absorption ratio", "0 mm permeability", "Undiluted application", "Breathable substrate protection"],
  },
];

export const proofItems = [
  {
    value: "0.040",
    unit: "W/(m·K)",
    label: "Thermal conductivity",
    note: "Building insulation coating test report XT226-250016",
  },
  {
    value: "0.26",
    unit: "m2·K/W",
    label: "Added thermal resistance",
    note: "Class II under DG/TJ08-2200-2024 evaluation",
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
    note: "RT-WP-01 report 2024W06363",
  },
];

export const constructionSystems = [
  {
    title: "Building Aerogel Insulation Coating System",
    code: "RT-AC-01/02",
    image: "/images/building-coating-system.jpeg",
    steps: [
      "Substrate check: moisture ≤8%, pH <10 and flatness ≤4 mm / 2 m.",
      "Apply putty, one primer coat, two aerogel insulation coats and two topcoat layers.",
      "Target wet films: 1.2 mm + 1.3 mm, approximately 2 mm dry film after curing.",
      "Allow 24 h interval in summer or 48 h in winter before next coating operation.",
    ],
    parameters: ["Primer 0.14 kg/m2", "Aerogel coating 1.8 kg/m2", "Topcoat 0.25 kg/m2", "7-day final cure at 25C"],
  },
  {
    title: "Industrial Aerogel Coating System",
    code: "RT-AC-14/15/16",
    image: "/images/industrial-coating-system.jpeg",
    steps: [
      "Stop equipment and cool the surface before coating work.",
      "Keep substrate temperature at least 3C above dew point and relative humidity ≤85%.",
      "Use heat-resistant primer, aerogel mid-coat and protective topcoat.",
      "Control single wet film below 1.5 mm and allow enough drying between coats.",
    ],
    parameters: ["-40C to 180C service", "≤0.04 W/(m·K)", "Two-coat 2 mm dry film", "7-day final cure"],
  },
  {
    title: "Steel Fire Protection Coating System",
    code: "RT-FTHL / Non-intumescent",
    image: "/images/fire-char-layer.jpg",
    steps: [
      "Prepare steel to St3 or Sa2.5 depending on project specification.",
      "For intumescent coating, apply the first 300-400 μm dry film, then approximately 800 μm per coat.",
      "Keep water dilution below 5% and allow 24 h between coats.",
      "Apply topcoat only after the fireproof coating is dry enough to prevent blistering.",
    ],
    parameters: ["Surface dry 2-4 h", "Full cure 28 days", "GB14907-2018 basis", "Project-specific fire test required"],
  },
  {
    title: "Penetrating Water Repellent System",
    code: "RT-WP-01",
    image: "/images/silicon-waterproof-deck.jpg",
    steps: [
      "Clean porous mineral substrate and remove dust, oil, loose particles and laitance.",
      "Apply undiluted material by spray, roller or brush until surface is evenly saturated.",
      "Target dosage is approximately 250 ml/m2 depending on substrate porosity.",
      "Keep the surface dry for more than 12 h and avoid rain during curing.",
    ],
    parameters: ["pH 4-7", "8-14% solids", "5C to 35C application", "0 mm permeability in test report"],
  },
];

export const competitors = [
  {
    name: "Cabot Corporation",
    position: "Specialty chemical group",
    strengths: ["ENOVA aerogel particles", "Powder-scale manufacturing", "Global chemical customer base", "Carbon black and fumed silica synergies"],
    focus: "Aerogel particles, industrial insulation, daylighting and specialty formulations.",
    link: "https://www.cabotcorp.com/solutions/products-plus/aerogel/particles",
  },
  {
    name: "Aspen Aerogels",
    position: "Aerogel pure-play leader",
    strengths: ["PyroThin battery barriers", "Cryogel and Pyrogel product families", "EV customer references", "Mature technical resource system"],
    focus: "EV battery thermal barriers, LNG, oil and gas and high-performance insulation blankets.",
    link: "https://www.aerogel.com/product/pyrothin/",
  },
  {
    name: "JIOS Aerogel",
    position: "Korean aerogel manufacturer",
    strengths: ["EV and ESS thermal management", "East Asian supply chain", "Aerogel particles and composites", "Application breadth"],
    focus: "Battery thermal protection, industrial insulation and application-specific aerogel components.",
    link: "https://www.jiosaerogel.com/",
  },
];

export const advantageCards = [
  {
    icon: FlaskConical,
    title: "From aerogel powder to engineered coating systems",
    text: "Ruitai Jiuhe can present a full SiO2 aerogel material platform rather than only one blanket or battery pad product.",
  },
  {
    icon: FileCheck2,
    title: "Test data supports early buyer qualification",
    text: "Thermal conductivity, VOC, added thermal resistance, water-repellent and FTO materials help overseas buyers screen risk quickly.",
  },
  {
    icon: Gauge,
    title: "Installation parameters are already documented",
    text: "Film thickness, substrate preparation, dew-point control, curing windows and consumption ranges can be turned into project guidance.",
  },
  {
    icon: Globe2,
    title: "Better overseas positioning than a commodity supplier",
    text: "The strongest story is a practical Chinese aerogel system supplier for building retrofit, industrial insulation, fire protection and waterproofing.",
  },
];

export const seoTopics = [
  "silica aerogel insulation coating",
  "aerogel fireproof coating",
  "waterborne intumescent fire protection coating",
  "penetrating water repellent for concrete",
  "aerogel blanket for industrial insulation",
  "EV battery aerogel thermal barrier",
  "industrial aerogel coating for pipes",
];

export const processHighlights = [
  { icon: ShieldCheck, title: "Risk-aware claims", text: "Fire-resistance and market-entry statements are written with test-report boundaries and FTO notes in mind." },
  { icon: Layers3, title: "System selling", text: "Each product is explained as primer, coating, blanket, topcoat or treatment system, not as isolated raw material." },
  { icon: ThermometerSun, title: "Application-first navigation", text: "Foreign engineers can enter through temperature, substrate, geometry, fire rating or waterproofing problem." },
];
