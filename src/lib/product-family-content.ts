export type ProductFamilyPreview = {
  highlights: { label: string; value: string }[];
  sourceNote: string;
  comparison?: {
    title: string;
    intro: string;
    rows: { label: string; highTemperature: string; cryogenic: string; scope: string }[];
  };
};

export const productFamilyPreviews: Record<string, ProductFamilyPreview> = {
  "aerogel-powders-granules": {
    highlights: [
      { label: "Specific surface area", value: "400-800 m²/g" },
      { label: "Porosity", value: "90-95%" },
    ],
    sourceNote: "CW-AP powder product profile. CW-AP-W slurry is listed separately at 20-25% solids.",
  },
  "aerogel-blankets-felts-mats": {
    highlights: [
      { label: "Blanket conductivity", value: "0.020 W/(m·K) at 25 °C" },
      { label: "Pad thickness", value: "0.3-5 mm" },
    ],
    sourceNote: "CW-AT blanket and battery-pad product profiles; values remain grade-specific.",
    comparison: {
      title: "CW-AT blanket route comparison",
      intro: "Compare the listed blanket grades against the actual operating window and complete insulation-system design.",
      rows: [
        { label: "Primary evaluation route", highTemperature: "CW-AT-H: medium- to high-temperature insulation", cryogenic: "CW-AT-L: low-temperature and cryogenic insulation", scope: "Listed product descriptions." },
        { label: "Listed service range", highTemperature: "Up to 650 °C", cryogenic: "-200 °C to 125 °C", scope: "CW-AT-H / CW-AT-L product profiles." },
        { label: "Thermal conductivity", highTemperature: "0.020 W/(m·K) at 25 °C", cryogenic: "0.0125 W/(m·K) at -159 °C", scope: "Values are reported for different stated grades and temperatures." },
        { label: "Project checks", highTemperature: "Surface temperature, geometry, mechanical protection", cryogenic: "Vapor barrier, joints, jacketing, operating cycle", scope: "Complete system review remains required." },
      ],
    },
  },
  "aerogel-slurries-coatings-paste": {
    highlights: [
      { label: "Building coating", value: "0.040 W/(m·K)" },
      { label: "Industrial coating window", value: "-40 °C to 180 °C" },
    ],
    sourceNote: "CW-AC-01/02 and CW-AC-14/15/16 product profiles; do not transfer figures to paste or slurry grades.",
  },
  "fireproof-waterproof-solutions": {
    highlights: [
      { label: "CW-FTHL solids", value: "66±3%" },
      { label: "CW-WP-01 density", value: "0.93 g/cm³" },
    ],
    sourceNote: "Separate CW-FTHL and CW-WP-01 product profiles. Fire rating and mineral-substrate performance need system-specific review.",
  },
};

export function getProductFamilyPreview(slug: string) {
  return productFamilyPreviews[slug];
}
