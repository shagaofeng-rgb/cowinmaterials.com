"use client";

import { Send } from "lucide-react";
import { useState } from "react";

const scenarioOptions = [
  "Building insulation coating",
  "Industrial pipe insulation",
  "Steel fire protection",
  "EV battery thermal barrier",
  "Penetrating waterproofing",
  "Aerogel raw material supply",
  "Other technical request",
];

export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="inquiry-form"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="form-grid">
        <label>
          Name
          <input name="name" placeholder="Your name" required />
        </label>
        <label>
          Company Email
          <input name="email" type="email" placeholder="name@company.com" required />
        </label>
      </div>
      <div className="form-grid">
        <label>
          Country / Region
          <input name="country" placeholder="United States, Germany, UAE..." />
        </label>
        <label>
          Application
          <select name="scenario" defaultValue="Building insulation coating">
            {scenarioOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Project Requirements
        <textarea
          name="message"
          rows={6}
          placeholder="Tell us the substrate, temperature, target thickness, area, fire rating, test standard or delivery schedule."
        />
      </label>
      <button className="primary-button" type="submit">
        <Send size={18} />
        Submit Preview Inquiry
      </button>
      {submitted ? (
        <p className="form-success">
          Your inquiry has been captured in this local preview. For launch, this form can be connected to email, CRM, database or an anti-spam protected API.
        </p>
      ) : null}
    </form>
  );
}
