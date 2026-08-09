"use client";

import { useEffect } from "react";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: AnalyticsParams) => void;
  }
}

export function trackAnalyticsEvent(eventName: string, params: AnalyticsParams = {}) {
  window.dispatchEvent(new CustomEvent("cowin:analytics", { detail: { eventName, params } }));
  window.gtag?.("event", eventName, params);
}

function eventForLink(link: HTMLAnchorElement) {
  const href = link.getAttribute("href") || "";
  if (href.startsWith("mailto:")) return "email_click";
  if (href.startsWith("tel:")) return "phone_click";
  if (href.includes("Request%20TDS") || href.includes("Request%20a%20Data")) return "request_tds";
  if (href.includes("Request%20a%20Sample")) return "request_sample";
  if (href.includes("Request%20a%20Quote")) return "request_quote";
  return null;
}

export function AnalyticsEvents() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!(link instanceof HTMLAnchorElement)) return;
      const eventName = eventForLink(link);
      if (eventName) trackAnalyticsEvent(eventName, { link_url: link.href });
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
