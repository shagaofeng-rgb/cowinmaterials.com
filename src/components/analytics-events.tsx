"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;
type StoredAnalyticsEvent =
  | { eventName: "page_view"; pagePath: string }
  | { eventName: "whatsapp_click"; pagePath: string; placement: "floating_whatsapp" };

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: AnalyticsParams) => void;
  }
}

export function trackAnalyticsEvent(eventName: string, params: AnalyticsParams = {}) {
  window.dispatchEvent(new CustomEvent("cowin:analytics", { detail: { eventName, params } }));
  window.gtag?.("event", eventName, params);
}

function eventId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function recordStoredAnalyticsEvent(event: StoredAnalyticsEvent) {
  const payload = JSON.stringify({
    event_id: eventId(event.eventName),
    event_name: event.eventName,
    page_path: event.pagePath,
    ...(event.eventName === "whatsapp_click" ? { placement: event.placement } : {}),
  });

  const body = new Blob([payload], { type: "application/json" });
  if (navigator.sendBeacon?.("/api/analytics/event", body)) return;

  void fetch("/api/analytics/event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
  });
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
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    recordStoredAnalyticsEvent({ eventName: "page_view", pagePath: pathname });
  }, [pathname]);

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
