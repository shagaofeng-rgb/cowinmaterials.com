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
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  return (
    <form
      className="inquiry-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("sending");

        const form = event.currentTarget;
        const formData = new FormData(form);

        const response = await fetch("/api/inquiry", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
            country: formData.get("country"),
            scenario: formData.get("scenario"),
            message: formData.get("message"),
            website: formData.get("website"),
            page: window.location.href,
          }),
        });

        if (response.ok) {
          form.reset();
          setStatus("success");
        } else {
          setStatus("error");
        }
      }}
    >
      <input aria-hidden="true" className="honeypot" name="website" tabIndex={-1} type="text" />
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
      <button className="primary-button" disabled={status === "sending"} type="submit">
        <Send size={18} />
        {status === "sending" ? "Sending..." : "Send Inquiry"}
      </button>
      {status === "success" ? (
        <p className="form-success">
          Thank you. Your inquiry has been sent to the Cowin Materials team.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="form-error">
          The message could not be sent right now. Please email davidsha@cowinmaterials.com directly.
        </p>
      ) : null}
    </form>
  );
}
