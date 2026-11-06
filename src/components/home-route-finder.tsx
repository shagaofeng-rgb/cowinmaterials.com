import Link from "next/link";
import { ArrowRight, FileText, Layers3, MoveVertical, Thermometer } from "lucide-react";

const routeFields = [
  {
    key: "operatingTemperature",
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
    key: "requiredStandard",
    label: "Validation standard",
    placeholder: "Select a standard",
    Icon: FileText,
    options: ["Project specification", "ASTM", "EN", "ISO", "GB", "Other or to be confirmed"],
  },
] as const;

export function HomeRouteFinder() {
  return (
    <form className="home-route-finder" action="/request-quote" method="get" aria-labelledby="material-route-title" data-analytics-quote>
      <input type="hidden" name="request" value="Ask for Product Selection" />
      <input type="hidden" name="message" value="Submitted from the homepage material-route finder." />
      <div className="home-route-finder-heading">
        <h2 id="material-route-title">Project conditions</h2>
        <p>Share what you know for a material recommendation.</p>
      </div>

      <div className="home-route-fields">
        {routeFields.map(({ key, label, placeholder, Icon, options }) => (
          <label className="home-route-field" key={key}>
            <Icon size={20} aria-hidden="true" />
            <span>
              <strong>{label}</strong>
              <select name={key} defaultValue="" aria-label={label}>
                <option value="">{placeholder}</option>
                {options.map((option) => <option value={option} key={option}>{option}</option>)}
              </select>
            </span>
          </label>
        ))}
      </div>

      <div className="home-route-actions">
        <button className="home-route-primary" type="submit">
          Request material guidance <ArrowRight size={17} aria-hidden="true" />
        </button>
        <Link className="home-route-secondary" href="/products" prefetch={false}>Compare products</Link>
      </div>
    </form>
  );
}
