export type TechnicalEvidenceSeed = {
  id: string;
  productSlug: string;
  claimLabel: string;
  valueText: string;
  testConditions?: string;
  standardReference?: string;
  sourceDocument: string;
  sourceLocator: string;
  reportNumber?: string;
  evidenceLevel: "public_exact" | "public_scoped" | "context_only";
  restrictionNote?: string;
};

export type TechnicalNewsTopicSeed = {
  id: string;
  title: string;
  excerpt: string;
  primaryProductSlug: string;
  evidenceIds: string[];
  tags: string[];
  sortOrder: number;
};

// These records are transcribed from supplied source documents. They are not
// inferred values and their conditions stay attached to every public use.
export const technicalEvidenceSeed: TechnicalEvidenceSeed[] = [
  {
    id: "cw-at-h-conductivity",
    productSlug: "aerogel-blanket-and-thermal-pads",
    claimLabel: "Thermal conductivity",
    valueText: "0.020 W/(m.K) at 25 C; 0.036 W/(m.K) at 300 C",
    testConditions: "Values are listed for the RT-AT-H product grade in the supplied product catalogue.",
    sourceDocument: "English aerogel product catalogue",
    sourceLocator: "p. 18",
    evidenceLevel: "public_scoped",
    restrictionNote: "Use for material screening only; confirm the full test method, sample configuration and project conditions before design use.",
  },
  {
    id: "cw-at-h-service-temperature",
    productSlug: "aerogel-blanket-and-thermal-pads",
    claimLabel: "Maximum service temperature",
    valueText: "<=650 C",
    testConditions: "Source-listed maximum service temperature for the RT-AT-H product grade.",
    sourceDocument: "English aerogel product catalogue",
    sourceLocator: "p. 18",
    evidenceLevel: "public_scoped",
    restrictionNote: "This is not a project fire-resistance rating or a substitute for system qualification.",
  },
  {
    id: "cw-at-l-service-range",
    productSlug: "aerogel-blanket-and-thermal-pads",
    claimLabel: "Listed operating range",
    valueText: "-200 C to 125 C",
    testConditions: "Source-listed range for the RT-AT-L low-temperature blanket grade.",
    sourceDocument: "English aerogel product catalogue",
    sourceLocator: "p. 19",
    evidenceLevel: "public_scoped",
    restrictionNote: "Assess moisture ingress, joints, mechanical protection and the full operating envelope for each cryogenic system.",
  },
  {
    id: "cw-at-l-conductivity-map",
    productSlug: "aerogel-blanket-and-thermal-pads",
    claimLabel: "Thermal conductivity map",
    valueText: "0.0125 W/(m.K) at -159 C; 0.0146 W/(m.K) at 0 C; 0.015 W/(m.K) at 10 C",
    testConditions: "Source-listed temperature points for the RT-AT-L product grade.",
    sourceDocument: "English aerogel product catalogue",
    sourceLocator: "p. 19",
    evidenceLevel: "public_scoped",
    restrictionNote: "Do not interpolate a project design value without reviewing the relevant material grade and test method.",
  },
  {
    id: "cw-building-coating-conductivity",
    productSlug: "aerogel-insulation-coating",
    claimLabel: "Thermal conductivity",
    valueText: "0.036 W/(m.K)",
    testConditions: "Value presented in the supplied building aerogel insulation coating technical file; the file cites a Shanghai Jianke test but does not include an original report number.",
    sourceDocument: "Silica aerogel thermal insulation coating technical file",
    sourceLocator: "p. 15",
    evidenceLevel: "public_scoped",
    restrictionNote: "Present as source-file technical data, not as an independently hosted certificate. Coating thickness and system build-up remain project variables.",
  },
  {
    id: "cw-building-coating-adhesion",
    productSlug: "aerogel-insulation-coating",
    claimLabel: "Adhesion",
    valueText: ">=0.8 MPa",
    testConditions: "Source-listed result for the building coating system.",
    standardReference: "JG/T 24-2018",
    sourceDocument: "Silica aerogel thermal insulation coating technical file",
    sourceLocator: "p. 17",
    evidenceLevel: "public_scoped",
    restrictionNote: "Substrate preparation, primer selection and construction conditions affect field adhesion.",
  },
  {
    id: "cw-water-repellent-2024-basic",
    productSlug: "silicon-penetrating-water-repellent",
    claimLabel: "Measured basic properties",
    valueText: "pH 4.6; solid content 11%; water-absorption ratio 19%",
    testConditions: "S-type sample in the supplied laboratory report. The report notes P.O 42.5 cement was used instead of the specified discontinued P.O 32.5 cement.",
    standardReference: "JC/T 902-2002 (2017)",
    sourceDocument: "Penetrating water repellent test report",
    sourceLocator: "pp. 2-3",
    reportNumber: "2024W06363",
    evidenceLevel: "public_exact",
    restrictionNote: "The report does not make a conformity determination for water absorption ratio or penetration because of the cement-substrate deviation.",
  },
  {
    id: "cw-water-repellent-2024-penetration",
    productSlug: "silicon-penetrating-water-repellent",
    claimLabel: "Reported penetration observation",
    valueText: "0 mm; no watermarks or appearance change after the listed conditioning treatments",
    testConditions: "S-type sample, using the report's specified standard, heat, low-temperature, ultraviolet, acid and alkali treatment sequence.",
    standardReference: "JC/T 902-2002 (2017)",
    sourceDocument: "Penetrating water repellent test report",
    sourceLocator: "p. 3",
    reportNumber: "2024W06363",
    evidenceLevel: "public_exact",
    restrictionNote: "Read together with the report's cement-substrate deviation note; this is not a universal substrate performance guarantee.",
  },
  {
    id: "cw-water-repellent-2025-basic",
    productSlug: "silicon-penetrating-water-repellent",
    claimLabel: "Measured basic properties",
    valueText: "pH 3.7; solid content 7.2%; water-absorption ratio 8.8%",
    testConditions: "S-type sample in the supplied laboratory report. The report notes P.O 42.5 cement was used instead of the specified discontinued P.O 32.5 cement.",
    standardReference: "JC/T 902-2002 (2017)",
    sourceDocument: "Water-based water repellent inspection report",
    sourceLocator: "pp. 3-4",
    reportNumber: "2025W10212",
    evidenceLevel: "public_exact",
    restrictionNote: "The report does not make a conformity determination for water absorption ratio or penetration because of the cement-substrate deviation.",
  },
  {
    id: "cw-water-repellent-2025-penetration",
    productSlug: "silicon-penetrating-water-repellent",
    claimLabel: "Reported penetration observation",
    valueText: "0 mm; no watermarks or discoloration after the listed conditioning treatments",
    testConditions: "S-type sample, using the report's specified standard, heat, low-temperature, ultraviolet, acid and alkali treatment sequence.",
    standardReference: "JC/T 902-2002 (2017)",
    sourceDocument: "Water-based water repellent inspection report",
    sourceLocator: "p. 4",
    reportNumber: "2025W10212",
    evidenceLevel: "public_exact",
    restrictionNote: "Read together with the report's cement-substrate deviation note; this is not a universal substrate performance guarantee.",
  },
  {
    id: "cw-fire-coating-scope",
    productSlug: "aerogel-fireproof-coating",
    claimLabel: "Product-system description",
    valueText: "Water-based ultra-thin intumescent coating; source lists a 1-3 mm coating range and 20-30x expansion in fire",
    testConditions: "Source-listed product information for RT-FTHL. No original fire test report was supplied with this source set.",
    standardReference: "GB 14907-2018",
    sourceDocument: "English aerogel product catalogue",
    sourceLocator: "p. 27",
    evidenceLevel: "public_scoped",
    restrictionNote: "Do not present this as a fire-resistance time rating. System approval depends on steel section, thickness, preparation and the governing test method.",
  },
];

export const technicalNewsTopicSeed: TechnicalNewsTopicSeed[] = [
  { id: "blanket-temperature-data", title: "How to read temperature-dependent aerogel blanket data", excerpt: "A source-recorded comparison of listed RT-AT-H and RT-AT-L blanket values, with the evaluation limits that matter before a thermal project is specified.", primaryProductSlug: "aerogel-blanket-and-thermal-pads", evidenceIds: ["cw-at-h-conductivity", "cw-at-h-service-temperature", "cw-at-l-service-range", "cw-at-l-conductivity-map"], tags: ["aerogel blanket", "thermal insulation", "cryogenic insulation"], sortOrder: 10 },
  { id: "building-coating-data-scope", title: "Building aerogel insulation coating: reading material data with its system limits", excerpt: "A technical note on the source-recorded conductivity and adhesion data for building coating evaluation, including the conditions that must remain visible.", primaryProductSlug: "aerogel-insulation-coating", evidenceIds: ["cw-building-coating-conductivity", "cw-building-coating-adhesion"], tags: ["aerogel coating", "building insulation", "thermal coating"], sortOrder: 20 },
  { id: "water-repellent-report-2024", title: "How to read a 2024 penetrating water repellent test record", excerpt: "A report-specific interpretation of measured pH, solids, absorption and conditioning observations, including the stated cement-substrate limitation.", primaryProductSlug: "silicon-penetrating-water-repellent", evidenceIds: ["cw-water-repellent-2024-basic", "cw-water-repellent-2024-penetration"], tags: ["penetrating water repellent", "concrete waterproofing", "test report"], sortOrder: 30 },
  { id: "water-repellent-report-2025", title: "How to read a 2025 water-based repellent inspection record", excerpt: "A report-specific interpretation of the supplied 2025 S-type inspection record, written with the test conditions and stated limitation intact.", primaryProductSlug: "silicon-penetrating-water-repellent", evidenceIds: ["cw-water-repellent-2025-basic", "cw-water-repellent-2025-penetration"], tags: ["water-based repellent", "masonry waterproofing", "test report"], sortOrder: 40 },
  { id: "fire-coating-scope", title: "Waterborne intumescent coating: what source-listed data can and cannot establish", excerpt: "A careful explanation of the supplied product-system description, its referenced standard and why a project fire rating cannot be inferred from a product catalogue.", primaryProductSlug: "aerogel-fireproof-coating", evidenceIds: ["cw-fire-coating-scope"], tags: ["intumescent coating", "steel fire protection", "system evaluation"], sortOrder: 50 },
];
