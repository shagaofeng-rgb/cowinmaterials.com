"use client";

import Link from "next/link";
import { ArrowRight, FileText, Layers3, Mail, MoveVertical, Thermometer } from "lucide-react";
import { useMemo, useState } from "react";

type RouteConditions = {
  temperature: string;
  substrate: string;
  thickness: string;
  standard: string;
};

const initialConditions: RouteConditions = {
  temperature: "",
  substrate: "",
  thickness: "",
  standard: "",
};

const routeFields = [
  {
    key: "temperature",
    label: "Operating temperature",
    placeholder: "Select temperature range",
    Icon: Thermometer,
    options: ["Below -40 C", "-40 C to 125 C", "125 C to 180 C", "Above 180 C"],
  },
  {
    key: "substrate",
    label: "Substrate",
    placeholder: "Select substrate",
    Icon: Layers3,
    options: ["Steel structure or equipment", "Pipe, valve or complex geometry", "Concrete, masonry or mineral substrate", "Battery module or energy storage assembly", "Building envelope"],
  },
  {
    key: "thickness",
    label: "Target thickness",
    placeholder: "Select thickness range",
    Icon: MoveVertical,
    options: ["Thin build or constrained space", "Up to 20 mm", "More than 20 mm", "To be evaluated"],
  },
  {
    key: "standard",
    label: "Validation standard",
    placeholder: "Select standard (e.g. ASTM, EN, ISO)",
    Icon: FileText,
    options: ["Project specification", "ASTM", "EN", "GB", "Other or to be confirmed"],
  },
] as const;

function conditionHref(conditions: RouteConditions) {
  const params = new URLSearchParams({ request: "Ask for Product Selection" });
  if (conditions.temperature) params.set("operatingTemperature", conditions.temperature);
  if (conditions.substrate) params.set("substrate", conditions.substrate);
  if (conditions.standard) params.set("requiredStandard", conditions.standard);

  const notes = [
    conditions.thickness ? `Available thickness: ${conditions.thickness}` : "",
    "Submitted from the homepage material-route finder.",
  ].filter(Boolean);
  if (notes.length) params.set("message", notes.join(" "));

  return `/request-quote?${params.toString()}`;
}

export function HomeRouteFinder() {
  const [conditions, setConditions] = useState<RouteConditions>(initialConditions);
  const href = useMemo(() => conditionHref(conditions), [conditions]);

  const updateCondition = (key: keyof RouteConditions, value: string) => {
    setConditions((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="home-route-finder" aria-labelledby="material-route-title">
      <div className="home-route-finder-heading">
        <h2 id="material-route-title">Find your material route</h2>
        <p>Tell us your project conditions and we&apos;ll guide you to the right material family and next steps.</p>
      </div>

      <div className="home-route-fields">
        {routeFields.map(({ key, label, placeholder, Icon, options }) => (
          <label className="home-route-field" key={key}>
            <Icon size={20} aria-hidden="true" />
            <span>
              <strong>{label}</strong>
              <select value={conditions[key]} onChange={(event) => updateCondition(key, event.target.value)} aria-label={label}>
                <option value="">{placeholder}</option>
                {options.map((option) => <option value={option} key={option}>{option}</option>)}
              </select>
            </span>
          </label>
        ))}
      </div>

      <div className="home-route-actions">
        <Link className="home-route-primary" href={href}>
          Find a material route <ArrowRight size={17} aria-hidden="true" />
        </Link>
        <Link className="home-route-secondary" href={href}><Mail size={17} aria-hidden="true" /> Send project conditions</Link>
      </div>
      <p className="home-route-note">Provide the available project conditions for a first review.</p>
    </section>
  );
}
