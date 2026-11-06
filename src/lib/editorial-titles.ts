const specificTitles: Record<string, string> = {
  "evaluating-high-temperature-insulation-paints-for-industrial-application-a678b7cb42": "High-Temperature Insulation Paint: Application and Thermal Resistance",
  "evaluating-high-temperature-insulation-paints-for-industrial-application-e2e8bf15af": "High-Temperature Insulation Paint: Adhesion and Durability",
  "evaluating-high-temperature-resistant-insulation-coatings-for-industrial-677dfca62d": "High-Temperature Insulation Coatings: Substrate Compatibility",
  "evaluating-high-temperature-resistant-insulation-coatings-for-industrial-5f32458e3a": "Selecting High-Temperature Insulation Coatings by Operating Conditions",
};

export function blogDisplayTitle(slug: string, title: string) {
  return Object.hasOwn(specificTitles, slug) ? specificTitles[slug] : title;
}
