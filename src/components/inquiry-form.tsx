"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Paperclip, Send } from "lucide-react";
import { useRef, useState, useSyncExternalStore } from "react";
import { getAnalyticsIdentity, getAttributionUtm, trackAnalyticsEvent } from "@/components/analytics-events";
import { site } from "@/lib/data";

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

const requestTypeAliases: Record<string, string> = {
  "Request TDS": "Request TDS or SDS",
  "Request SDS": "Request TDS or SDS",
  "Request Technical Data": "Request TDS or SDS",
  "Request Test Information": "Technical Question",
  "Request Installation Guide": "Technical Question",
  "Ask an Engineer": "Ask for Product Selection",
  "View FAQ": "Technical Question",
};

function getRequestType(value: string | null) {
  if (!value) return "Request a Quote";
  if (requestTypes.includes(value)) return value;
  return requestTypeAliases[value] || "Request a Quote";
}

function subscribeToLocation(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  onStoreChange();
  return () => window.removeEventListener("popstate", onStoreChange);
}

function getLocationSearch() {
  return window.location.search;
}

function getServerLocationSearch() {
  return "";
}

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
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const submitting = useRef(false);
  const [fileName, setFileName] = useState("No file selected");
  const search = useSyncExternalStore(subscribeToLocation, getLocationSearch, getServerLocationSearch);
  const params = new URLSearchParams(search);
  const defaults = {
    request: getRequestType(params.get("request")),
    product: params.get("product") || "",
    application: params.get("application") || applications[0],
    substrate: params.get("substrate") || "",
    operatingTemperature: params.get("operatingTemperature") || "",
    requiredStandard: params.get("requiredStandard") || "",
    message: params.get("message") || "",
  };

  return (
    <form
      key={`${defaults.request}:${defaults.product}:${defaults.application}`}
      className="inquiry-form cw-inquiry"
      aria-busy={status === "sending"}
      action="/api/inquiry"
      method="post"
      encType="multipart/form-data"
      onSubmit={async (event) => {
        event.preventDefault();
        if (submitting.current) return;
        submitting.current = true;
        setStatus("sending");

        try {
          const formData = new FormData(event.currentTarget);
          formData.set("page", window.location.href);
          const identity = getAnalyticsIdentity();
          formData.set("visitor_id", identity.visitorKey);
          formData.set("session_id", identity.sessionKey);
          for (const [key, value] of Object.entries(getAttributionUtm())) {
            if (value) formData.set(key, value);
          }
          const response = await fetch("/api/inquiry", {
            method: "POST",
            body: formData,
          });
          if (response.ok) {
            trackAnalyticsEvent("form_submit", { request_type: String(formData.get("requestType") || "") });
            router.push("/thank-you");
            return;
          }
        } catch {
          // Keep the fields available for retry after network errors.
        }
        submitting.current = false;
        setStatus("error");
      }}
    >
      <input aria-hidden="true" className="honeypot" name="website" tabIndex={-1} type="text" />

      <div className="form-grid">
        <label>
          Request type
          <select name="requestType" defaultValue={defaults.request}>
            {requestTypes.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          Product of interest
          <textarea className="cw-product-field" name="product" rows={2} defaultValue={defaults.product} placeholder="Product name or model" />
        </label>
      </div>

      <fieldset>
        <legend>Contact details</legend>
        <div className="form-grid">
          <label>
            Full name *
            <input name="name" autoComplete="name" placeholder="Your full name" required />
          </label>
          <label>
            Company name *
            <input name="company" autoComplete="organization" placeholder="Company name" required />
          </label>
          <label>
            Business email *
            <input name="email" type="email" autoComplete="email" placeholder="name@company.com" required />
          </label>
          <label>
            Country / region *
            <input name="country" autoComplete="country-name" placeholder="Country or region" required />
          </label>
        </div>
        <details className="cw-inquiry-optional">
          <summary>Additional contact details <ChevronDown size={15} aria-hidden="true" /></summary>
          <div className="form-grid">
            <label>
              Phone or WhatsApp
              <input name="phone" type="tel" autoComplete="tel" placeholder="+1..." />
            </label>
            <label>
              Customer type
              <select name="customerType" defaultValue={customerTypes[0]}>
                {customerTypes.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
        </details>
      </fieldset>

      <fieldset>
        <legend>Project details</legend>
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
            <input name="substrate" defaultValue={defaults.substrate} placeholder="Steel, concrete, masonry, battery module..." />
          </label>
          <label>
            Operating temperature
            <input name="operatingTemperature" defaultValue={defaults.operatingTemperature} placeholder="e.g. 180 °C, -160 °C" />
          </label>
          <label>
            Target performance
            <input name="targetPerformance" placeholder="Thermal, fire, waterproofing or other target" />
          </label>
          <label>
            Project area or quantity
            <input name="quantity" placeholder="m², kg, rolls, sample quantity..." />
          </label>
          <label>
            Required standard
            <input name="requiredStandard" defaultValue={defaults.requiredStandard} placeholder="ASTM, EN, GB, project specification..." />
          </label>
          <label>
            Estimated purchase time
            <input name="purchaseTime" placeholder="Immediate, this quarter, trial stage..." />
          </label>
        </div>

        <label className="cw-inquiry-message">
          Message
          <textarea
            name="message"
            rows={4}
            defaultValue={defaults.message}
            placeholder="Add any required thickness, exposure conditions, timeline or test details."
          />
        </label>
      </fieldset>

      <label className="file-upload-field">
        File upload
        <span className="file-upload-control">
          <span className="file-upload-button"><Paperclip size={16} aria-hidden="true" />Choose file</span>
          <span className="file-upload-name">{fileName}</span>
        </span>
        <input
          className="file-upload-input"
          name="file"
          type="file"
          accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            setFileName(file?.name || "No file selected");
            event.currentTarget.setCustomValidity(file && file.size > 5 * 1024 * 1024 ? "Choose a file no larger than 5 MB." : "");
            event.currentTarget.reportValidity();
          }}
        />
        <small>PDF, DOCX, XLSX, JPG or PNG. Maximum 5 MB.</small>
      </label>

      <label className="checkbox-row">
        <input name="privacy" type="checkbox" required />
        <span>
          I agree that Cowin Materials may use this information to respond to my enquiry. See the{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>.
        </span>
      </label>

      <button className="cw-button cw-button--primary" disabled={status === "sending"} type="submit">
        {status === "sending" ? "Sending..." : "Send Enquiry"}
        <Send size={17} aria-hidden="true" />
      </button>
      {status === "error" ? (
        <p className="form-error" role="alert">
          The enquiry could not be sent. Try again or email <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      ) : null}
    </form>
  );
}
