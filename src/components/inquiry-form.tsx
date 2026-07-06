"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import { useState } from "react";

const customerTypes = [
  "End User",
  "Engineering Company",
  "Distributor",
  "Contractor",
  "Research or Testing Organisation",
  "Other",
];

const requestTypes = [
  "Request a Quote",
  "Request a Sample",
  "Request TDS or SDS",
  "Ask for Product Selection",
  "Technical Question",
  "Distribution Enquiry",
];

const applications = [
  "Building Energy Retrofit",
  "Industrial Pipe & Equipment Insulation",
  "EV & ESS Thermal Barriers",
  "LNG & Cryogenic Insulation",
  "Steel Fire Protection",
  "Concrete & Masonry Waterproofing",
  "Other",
];

export function InquiryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [defaults] = useState(() => {
    if (typeof window === "undefined") {
      return { request: "Request a Quote", product: "", application: applications[0] };
    }
    const params = new URLSearchParams(window.location.search);
    return {
      request: params.get("request") || "Request a Quote",
      product: params.get("product") || "",
      application: params.get("application") || applications[0],
    };
  });

  return (
    <form
      className="inquiry-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("sending");

        const form = event.currentTarget;
        const formData = new FormData(form);
        formData.set("page", window.location.href);
        for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
          const value = new URLSearchParams(window.location.search).get(key);
          if (value) formData.set(key, value);
        }

        const response = await fetch("/api/inquiry", {
          method: "POST",
          body: formData,
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
          Full Name *
          <input name="name" placeholder="Your full name" required />
        </label>
        <label>
          Company Name *
          <input name="company" placeholder="Company name" required />
        </label>
      </div>

      <div className="form-grid">
        <label>
          Business Email *
          <input name="email" type="email" placeholder="name@company.com" required />
        </label>
        <label>
          Phone or WhatsApp
          <input name="phone" placeholder="+1..." />
        </label>
      </div>

      <div className="form-grid">
        <label>
          Country / Region *
          <input name="country" placeholder="United States, Germany, UAE..." required />
        </label>
        <label>
          Customer Type
          <select name="customerType" defaultValue={customerTypes[0]}>
            {customerTypes.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-grid">
        <label>
          Request Type
          <select name="requestType" defaultValue={defaults.request}>
            {requestTypes.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          Product of Interest
          <input name="product" defaultValue={defaults.product} placeholder="Product name or model" />
        </label>
      </div>

      <div className="form-grid">
        <label>
          Application
          <select name="application" defaultValue={defaults.application}>
            {applications.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          Substrate
          <input name="substrate" placeholder="Steel, concrete, masonry, battery module..." />
        </label>
      </div>

      <div className="form-grid">
        <label>
          Operating Temperature
          <input name="operatingTemperature" placeholder="e.g. 180 °C, -160 °C" />
        </label>
        <label>
          Target Performance
          <input name="targetPerformance" placeholder="Thermal, fire, waterproofing or other target" />
        </label>
      </div>

      <div className="form-grid">
        <label>
          Project Area or Quantity
          <input name="quantity" placeholder="m², kg, rolls, sample quantity..." />
        </label>
        <label>
          Required Standard
          <input name="requiredStandard" placeholder="ASTM, EN, GB, project specification..." />
        </label>
      </div>

      <label>
        Estimated Purchase Time
        <input name="purchaseTime" placeholder="Immediate, this quarter, trial stage..." />
      </label>

      <label>
        Message
        <textarea
          name="message"
          rows={6}
          placeholder="Tell us the operating conditions, substrate, target thickness, required standard and evaluation plan."
        />
      </label>

      <label>
        File Upload
        <input name="file" type="file" accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png" />
        <small>PDF, DOCX, XLSX, JPG or PNG. Maximum 5 MB.</small>
      </label>

      <label className="checkbox-row">
        <input name="privacy" type="checkbox" required />
        <span>
          I agree that Cowin Materials may use this information to respond to my enquiry. See the{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>.
        </span>
      </label>

      <button className="primary-button" disabled={status === "sending"} type="submit">
        <Send size={18} />
        {status === "sending" ? "Sending..." : "Send Enquiry"}
      </button>
      {status === "success" ? (
        <p className="form-success">
          Thank you for your enquiry. Your project information has been submitted.
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
