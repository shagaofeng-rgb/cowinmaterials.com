import type { MaterialVisual } from "@/components/interior";
import type { MaterialIconName } from "@/components/material-icons";

type FactChoice = { index: number; label?: string; note?: string; value?: string };
type DetailCheck = { label: string; detail: string };
type ProductPresentation = {
  form: string;
  formPrefix?: string;
  cue: string;
  intro?: string;
  introNote?: string;
  visual: MaterialVisual;
  quickFacts: FactChoice[];
  groups?: { title: string; facts: number[] }[];
  handlingFacts?: number[];
  checks: DetailCheck[];
  boundary?: string;
};

function illustration(file: string, alt: string, caption: string): MaterialVisual {
  return { src: `/images/interior/${file}.webp`, alt, caption: `Illustration: ${caption}` };
}

const steelSample: MaterialVisual = {
  src: "/images/fire-char-layer.jpg",
  alt: "A coating sample after heat exposure beside an unexposed sample",
  caption: "Lab sample after heat exposure. Photo does not establish a fire rating.",
};

const treatedMineral: MaterialVisual = {
  src: "/images/waterproof-droplets.png",
  alt: "Water droplets beading on a treated mineral sample",
  caption: "Water-beading demonstration on a treated mineral sample. Not a waterproofing system test.",
};

const coatingSystem = [
  { label: "Primer", detail: "Confirm a compatible primer for the prepared substrate." },
  { label: "Aerogel insulation layer", detail: "Define the build and drying intervals for the selected coating." },
  { label: "Protective finish", detail: "Select the finish for the intended exposure and curing conditions." },
];

export const productPresentations: Record<string, ProductPresentation> = {
  "aerogel-powder-and-slurry": {
    form: "Formulation materials",
    cue: "Formulation input",
    visual: illustration("powder-and-slurry", "Dry silica powder and white waterborne slurry in separate sample vessels", "dry powder and pre-dispersed aqueous slurry are different material forms."),
    quickFacts: [{ index: 0, note: "CW-AP powder" }, { index: 1, note: "CW-AP powder" }, { index: 3, label: "Slurry solids", value: "20-25%", note: "CW-AP-W only" }],
    groups: [{ title: "CW-AP powder", facts: [0, 1, 2] }, { title: "CW-AP-W waterborne slurry", facts: [3] }],
    checks: [
      { label: "Dry powder", detail: "Select for dispersion trials in the intended coating or composite formulation." },
      { label: "Waterborne slurry", detail: "Use the pre-dispersed aqueous form where addition order, shear and viscosity can be verified in a lab trial." },
    ],
  },
  "aerogel-blanket-and-thermal-pads": {
    form: "Flexible insulation blankets",
    cue: "Hot / cold service",
    visual: illustration("flexible-blanket", "Flexible insulation blanket roll with an exposed fibrous edge", "flexible blanket form. Thickness and finish vary by grade."),
    quickFacts: [{ index: 1, label: "CW-AT-H service", value: "Up to 650 °C" }, { index: 2, label: "CW-AT-L service", value: "-200 °C to 125 °C" }, { index: 3, label: "CW-AT-L thickness", value: "6 mm / 10 mm" }],
    groups: [{ title: "CW-AT-H high-temperature blanket", facts: [0, 1] }, { title: "CW-AT-L cryogenic blanket", facts: [2, 3] }],
    checks: [
      { label: "High-temperature service", detail: "Check geometry, surface temperature and mechanical protection for CW-AT-H." },
      { label: "Cryogenic service", detail: "Review vapor-barrier continuity, joints, jacketing and the operating cycle for CW-AT-L." },
    ],
  },
  "battery-thermal-pads": {
    form: "Battery thermal barrier pads",
    cue: "EV and ESS evaluation",
    visual: illustration("battery-barrier-pads", "Thin barrier pad shown between simplified prismatic battery cells", "pad placement concept, not a tested battery assembly."),
    quickFacts: [{ index: 2, note: "Grade-dependent" }, { index: 0, label: "Material conductivity" }, { index: 1 }],
    checks: [
      { label: "Fit and compression", detail: "Confirm cell format, available gap, cut pattern, fixation and compression in the intended assembly." },
      { label: "Electrical and thermal validation", detail: "Check electrical isolation, heat propagation, aging and mechanical durability in the pack-level test plan." },
    ],
    boundary: "Material values do not establish pack-level fire, thermal-runaway or vehicle compliance.",
  },
  "aerogel-insulation-coating": {
    form: "Building insulation coating",
    cue: "Walls and roof retrofits",
    visual: illustration("building-coating-layers", "Simplified mineral wall section with separate coating layers", "primer, aerogel insulation and finish on a substrate. Not to scale."),
    quickFacts: [{ index: 0, note: "Submitted sample" }, { index: 1, note: "Submitted sample" }, { index: 2, note: "Submitted sample" }],
    groups: [{ title: "Submitted sample | report XT226-250016", facts: [0, 1, 2, 3] }],
    checks: coatingSystem,
    boundary: "These results describe the submitted sample and report methods, not the thermal performance of a complete wall or roof.",
  },
  "industrial-aerogel-insulation-coating": {
    form: "Industrial insulation coating",
    cue: "Pipes, valves and equipment",
    visual: illustration("industrial-pipe-coating", "Pipe elbow with a cutaway showing coating layers on the outer surface", "coating build on an industrial pipe elbow. Not to scale."),
    quickFacts: [{ index: 0, label: "Indicated service range" }, { index: 1, note: "Confirm grade and method" }, { index: 2, label: "Application surface", value: "≥3 °C above dew point" }],
    groups: [{ title: "Service data", facts: [0, 1] }, { title: "Application and system build", facts: [2, 3] }],
    checks: coatingSystem,
  },
  "aerogel-paste-compound": {
    form: "Aerogel paste compound",
    cue: "Local treatment and sealing",
    visual: illustration("aerogel-paste-interface", "Small shaped interface with a local paste application", "local paste application along a shaped interface. Not a test sample."),
    quickFacts: [{ index: 2 }, { index: 0 }, { index: 1, note: "Verify method and substrate" }],
    checks: [
      { label: "Localized application", detail: "Evaluate at shaped interfaces and small areas where a blanket or sprayable coating is not the preferred route." },
      { label: "Trial on the actual substrate", detail: "Confirm surface preparation, film thickness, adhesion and cure in a representative trial." },
    ],
  },
  "aerogel-fireproof-coating": {
    form: "Intumescent coating",
    formPrefix: "Waterborne",
    cue: "Structural steel evaluation",
    intro: "For structural-steel fire-protection evaluation.",
    introNote: "Confirm the steel section, coating system and required test standard before selection.",
    visual: steelSample,
    quickFacts: [{ index: 0 }, { index: 1 }, { index: 3, label: "Application temp." }],
    groups: [{ title: "", facts: [0, 1, 3] }],
    handlingFacts: [2],
    checks: [
      { label: "Steel section", detail: "Identify the member geometry and applicable section factor." },
      { label: "Dry-film build", detail: "Match coating thickness, primer and topcoat to the approved specification." },
      { label: "Test standard", detail: "Confirm the target standard and rating against evidence for that configuration." },
    ],
    boundary: "Fire resistance depends on the tested steel section, dry-film build and complete coating system.",
  },
  "non-intumescent-fire-protection-coating": {
    form: "Non-intumescent thick-film systems",
    cue: "Indoor / outdoor steel",
    visual: illustration("thick-film-steel-coating", "Steel section with a simplified thick protective coating cutaway", "thick-film coating concept on structural steel. Not a tested fire assembly."),
    quickFacts: [{ index: 0, label: "System options", value: "Indoor / outdoor" }, { index: 1, label: "Substrate" }, { index: 2, label: "Film build" }],
    checks: [
      { label: "Indoor system", detail: "Define the steel section, approved primer, dry-film build, curing and interior exposure." },
      { label: "Outdoor system", detail: "In addition to the steel and film build, verify the outdoor exposure, durability and compatible protective finish." },
    ],
    boundary: "The appropriate system and dry-film thickness must follow the supporting project evidence. No fire-resistance duration is inferred.",
  },
  "silicon-penetrating-water-repellent": {
    form: "Penetrating mineral treatment",
    cue: "Porous mineral substrates",
    visual: treatedMineral,
    quickFacts: [{ index: 1 }, { index: 0 }, { index: 2, note: "Verify actual uptake on the substrate" }],
    groups: [{ title: "Product and application data", facts: [0, 1, 2] }, { title: "2024 submitted-sample observations", facts: [3] }],
    checks: [
      { label: "Concrete, masonry or stone", detail: "Identify porosity, surface condition, moisture and any existing treatments." },
      { label: "Trial area", detail: "Record uptake, drying, appearance and water response on a representative area." },
    ],
    boundary: "A penetrating treatment is not a crack-bridging membrane or a substitute for drainage design.",
  },
};

export const categoryPresentations: Record<string, { icon: MaterialIconName; description: string }> = {
  "aerogel-powders-granules": { icon: "powder", description: "Powder and waterborne slurry for formulation development." },
  "aerogel-blankets-felts-mats": { icon: "blanket", description: "Flexible blankets and thin pads for industrial or battery use." },
  "aerogel-slurries-coatings-paste": { icon: "coating", description: "Building and industrial coatings for surfaces and local treatment." },
  "fireproof-waterproof-solutions": { icon: "protection", description: "Steel fire protection and mineral-substrate water repellents." },
};

function applicationIllustration(file: string, alt: string): MaterialVisual {
  return { src: `/images/home/${file}-editorial.jpg`, alt, caption: "Application illustration. Not a customer installation.", fit: "cover" };
}

export const applicationVisuals: Record<string, MaterialVisual> = {
  "building-energy-retrofit": applicationIllustration("building-retrofit", "Illustration of a building-envelope retrofit"),
  "industrial-pipe-equipment-insulation": applicationIllustration("industrial-insulation", "Illustration of industrial pipework and insulation"),
  "ev-ess-thermal-barriers": applicationIllustration("ev-ess-thermal-barrier", "Illustration of a battery module with thermal barrier material"),
  "lng-cryogenic-insulation": applicationIllustration("lng-cryogenic", "Illustration of cryogenic process pipework"),
  "steel-fire-protection": steelSample,
  "concrete-masonry-waterproofing": treatedMineral,
};

export const applicationDetailVisuals: Record<string, MaterialVisual> = {
  ...applicationVisuals,
  "building-energy-retrofit": productPresentations["aerogel-insulation-coating"].visual,
  "industrial-pipe-equipment-insulation": productPresentations["industrial-aerogel-insulation-coating"].visual,
  "ev-ess-thermal-barriers": productPresentations["battery-thermal-pads"].visual,
};

export function quoteHref(request?: string, context: { product?: string; application?: string } = {}) {
  const params = new URLSearchParams();
  if (request) params.set("request", request);
  if (context.product) params.set("product", context.product);
  if (context.application) params.set("application", context.application);
  return params.size ? `/request-quote?${params.toString()}` : "/request-quote";
}
