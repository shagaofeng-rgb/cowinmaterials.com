"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
        <span className="eyebrow">Project selector</span>
        <h2 id="material-route-title">Find your material route</h2>
        <p>Share the conditions that shape a responsible first review.</p>
      </div>

      <div className="home-route-fields">
        <label>
          <span>Operating temperature</span>
          <select value={conditions.temperature} onChange={(event) => updateCondition("temperature", event.target.value)}>
            <option value="">Select a service range</option>
            <option value="Below -40 C">Below -40 C</option>
            <option value="-40 C to 125 C">-40 C to 125 C</option>
            <option value="125 C to 180 C">125 C to 180 C</option>
            <option value="Above 180 C">Above 180 C</option>
          </select>
        </label>
        <label>
          <span>Substrate or assembly</span>
          <select value={conditions.substrate} onChange={(event) => updateCondition("substrate", event.target.value)}>
            <option value="">Select the project context</option>
            <option value="Steel structure or equipment">Steel structure or equipment</option>
            <option value="Pipe, valve or complex geometry">Pipe, valve or complex geometry</option>
            <option value="Concrete, masonry or mineral substrate">Concrete, masonry or mineral substrate</option>
            <option value="Battery module or energy storage assembly">Battery module or energy storage assembly</option>
            <option value="Building envelope">Building envelope</option>
          </select>
        </label>
        <label>
          <span>Available thickness</span>
          <select value={conditions.thickness} onChange={(event) => updateCondition("thickness", event.target.value)}>
            <option value="">Select an available space</option>
            <option value="Thin build or constrained space">Thin build or constrained space</option>
            <option value="Up to 20 mm">Up to 20 mm</option>
            <option value="More than 20 mm">More than 20 mm</option>
            <option value="To be evaluated">To be evaluated</option>
          </select>
        </label>
        <label>
          <span>Validation standard</span>
          <select value={conditions.standard} onChange={(event) => updateCondition("standard", event.target.value)}>
            <option value="">Select or state a requirement</option>
            <option value="Project specification">Project specification</option>
            <option value="ASTM">ASTM</option>
            <option value="EN">EN</option>
            <option value="GB">GB</option>
            <option value="Other or to be confirmed">Other or to be confirmed</option>
          </select>
        </label>
      </div>

      <div className="home-route-actions">
        <Link className="home-route-primary" href={href}>
          Request selection support <ArrowRight size={17} aria-hidden="true" />
        </Link>
        <Link className="home-route-secondary" href="/products">Explore product families</Link>
      </div>
    </section>
  );
}
