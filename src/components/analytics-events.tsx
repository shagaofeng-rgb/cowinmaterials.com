"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;
type StoredAnalyticsEventName = "page_view" | "whatsapp_click" | "form_submit" | "email_click" | "phone_click" | "request_tds" | "request_sample" | "request_quote";
type StoredAnalyticsEvent = {
  eventName: StoredAnalyticsEventName;
  pagePath: string;
  placement?: "floating_whatsapp";
  requestType?: string;
};

const storedEventNames = new Set<StoredAnalyticsEventName>([
  "page_view", "whatsapp_click", "form_submit", "email_click", "phone_click", "request_tds", "request_sample", "request_quote",
]);

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: AnalyticsParams) => void;
  }
}

export function trackAnalyticsEvent(eventName: string, params: AnalyticsParams = {}) {
  window.dispatchEvent(new CustomEvent("cowin:analytics", { detail: { eventName, params } }));
  window.gtag?.("event", eventName, params);
  if (storedEventNames.has(eventName as StoredAnalyticsEventName)) {
    recordStoredAnalyticsEvent({
      eventName: eventName as StoredAnalyticsEventName,
      pagePath: window.location.pathname,
      placement: eventName === "whatsapp_click" && params.placement === "floating_whatsapp" ? "floating_whatsapp" : undefined,
      requestType: eventName === "form_submit" && typeof params.request_type === "string" ? params.request_type : undefined,
    });
  }
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
    ...(event.placement ? { placement: event.placement } : {}),
    ...(event.requestType ? { request_type: event.requestType } : {}),
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
  const url = new URL(link.href, window.location.origin);
  const requestType = (url.searchParams.get("request") || "").toLowerCase();
  if (/tds|sds|technical data/.test(requestType)) return "request_tds";
  if (requestType.includes("sample")) return "request_sample";
  if (requestType.includes("quote") || url.pathname === "/request-quote") return "request_quote";
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
      if (eventName) trackAnalyticsEvent(eventName);
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
