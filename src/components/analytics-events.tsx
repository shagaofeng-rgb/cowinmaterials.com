"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getAnalyticsReferrer, type AnalyticsReferrer } from "@/lib/analytics-referrer";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;
type StoredAnalyticsEventName = "page_view" | "whatsapp_click" | "form_submit" | "email_click" | "phone_click" | "request_tds" | "request_sample" | "request_quote";
type WhatsAppPlacement = "floating_whatsapp" | "footer_phone" | "contact_phone" | "location_phone" | "about_phone";

type StoredAnalyticsEvent = {
  eventName: StoredAnalyticsEventName;
  pagePath: string;
  placement?: WhatsAppPlacement;
  requestType?: string;
};

export type AnalyticsIdentity = {
  visitorKey: string;
  sessionKey: string;
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
  if (!allowsMeasurement()) return;
  window.dispatchEvent(new CustomEvent("cowin:analytics", { detail: { eventName, params } }));
  window.gtag?.("event", eventName, params);
  if (storedEventNames.has(eventName as StoredAnalyticsEventName)) {
    recordStoredAnalyticsEvent({
      eventName: eventName as StoredAnalyticsEventName,
      pagePath: window.location.pathname,
      placement: eventName === "whatsapp_click" && typeof params.placement === "string" && ["floating_whatsapp", "footer_phone", "contact_phone", "location_phone", "about_phone"].includes(params.placement) ? params.placement as WhatsAppPlacement : undefined,
      requestType: eventName === "form_submit" && typeof params.request_type === "string" ? params.request_type : undefined,
    });
  }
}

function eventId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function allowsMeasurement() {
  const privacy = navigator as Navigator & { globalPrivacyControl?: boolean };
  return privacy.globalPrivacyControl !== true && privacy.doNotTrack !== "1";
}

function storage(name: "localStorage" | "sessionStorage") {
  try { return window[name]; } catch { return undefined; }
}

const visitorStorageKey = "cowin.analytics.visitor";
const sessionStorageKey = "cowin.analytics.session";
const attributionStorageKey = "cowin.analytics.utm";
const sessionIdleMs = 30 * 60 * 1000;
let fallbackVisitorKey = "";
let fallbackSessionKey = "";
let lastPublicPath = "";
let pageReferrer: AnalyticsReferrer | undefined;

function readStoredId(storage: Storage | undefined, key: string) {
  try {
    const value = storage?.getItem(key) || "";
    return /^[0-9a-f-]{36}$/i.test(value) ? value : "";
  } catch {
    return "";
  }
}

function storeId(storage: Storage | undefined, key: string, value: string) {
  try {
    storage?.setItem(key, value);
  } catch {
    // Analytics remains optional when browser storage is unavailable.
  }
}

function readStoredNumber(storage: Storage | undefined, key: string) {
  try {
    const value = Number(storage?.getItem(key) || "0");
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

export function getAnalyticsIdentity(): AnalyticsIdentity {
  if (!allowsMeasurement()) return { visitorKey: "", sessionKey: "" };
  const local = storage("localStorage");
  const session = storage("sessionStorage");
  const visitorStored = readStoredId(local, visitorStorageKey);
  const visitorKey = visitorStored || fallbackVisitorKey || eventId("visitor");
  fallbackVisitorKey = visitorKey;
  if (!visitorStored) storeId(local, visitorStorageKey, visitorKey);

  const sessionStored = readStoredId(session, sessionStorageKey);
  const lastSeen = readStoredNumber(session, `${sessionStorageKey}.seen`);
  const sessionKey = sessionStored && Date.now() - lastSeen < sessionIdleMs ? sessionStored : eventId("session");
  fallbackSessionKey = sessionKey || fallbackSessionKey || eventId("session");
  storeId(session, sessionStorageKey, fallbackSessionKey);
  storeId(session, `${sessionStorageKey}.seen`, String(Date.now()));
  if (sessionStored && sessionStored !== fallbackSessionKey) {
    try { session?.removeItem(attributionStorageKey); } catch { /* Measurement is optional. */ }
  }

  return { visitorKey, sessionKey: fallbackSessionKey };
}

export function getAttributionUtm(): Record<string, string> {
  if (!allowsMeasurement()) return {};
  const params = new URLSearchParams(window.location.search);
  const current = Object.fromEntries(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
    .map((key) => [key, (params.get(key) || "").slice(0, 120)])
    .filter(([, value]) => value));
  try {
    if (Object.keys(current).length) {
      window.sessionStorage.setItem(attributionStorageKey, JSON.stringify(current));
      return current;
    }
    const stored = JSON.parse(window.sessionStorage.getItem(attributionStorageKey) || "{}");
    return stored && typeof stored === "object" && !Array.isArray(stored) ? stored as Record<string, string> : {};
  } catch {
    return current;
  }
}

function getDevice() {
  const width = window.innerWidth;
  return width < 768 ? "mobile" : width < 1180 ? "tablet" : "desktop";
}

export function recordStoredAnalyticsEvent(event: StoredAnalyticsEvent) {
  if (!allowsMeasurement()) return;
  const identity = getAnalyticsIdentity();
  const payload = JSON.stringify({
    event_id: eventId(event.eventName),
    event_name: event.eventName,
    page_path: event.pagePath,
    ...(event.placement ? { placement: event.placement } : {}),
    ...(event.requestType ? { request_type: event.requestType } : {}),
    visitor_id: identity.visitorKey,
    session_id: identity.sessionKey,
    ...(pageReferrer ?? getAnalyticsReferrer(document.referrer, window.location.origin)),
    utm: getAttributionUtm(),
    device: getDevice(),
  });

  const body = new Blob([payload], { type: "application/json" });
  try {
    if (navigator.sendBeacon?.("/api/analytics/event", body)) return;
  } catch {
    // The keepalive request below is best effort.
  }

  void fetch("/api/analytics/event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

function eventForLink(link: HTMLAnchorElement) {
  const href = link.getAttribute("href") || "";
  const whatsappPlacement = link.dataset.analyticsWhatsappPlacement;
  if (href.startsWith("https://wa.me/") && whatsappPlacement) return { eventName: "whatsapp_click", params: { placement: whatsappPlacement } };
  if (href.startsWith("mailto:")) return { eventName: "email_click", params: {} };
  if (href.startsWith("tel:")) return { eventName: "phone_click", params: {} };
  const url = new URL(link.href, window.location.origin);
  const requestType = (url.searchParams.get("request") || "").toLowerCase();
  if (/tds|sds|technical data/.test(requestType)) return { eventName: "request_tds", params: {} };
  if (requestType.includes("sample")) return { eventName: "request_sample", params: {} };
  if (requestType.includes("quote") || url.pathname === "/request-quote") return { eventName: "request_quote", params: {} };
  return null;
}

export function AnalyticsEvents() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    if (pathname === lastPublicPath) return;
    pageReferrer = getAnalyticsReferrer(document.referrer, window.location.origin, lastPublicPath);
    lastPublicPath = pathname;
    recordStoredAnalyticsEvent({ eventName: "page_view", pagePath: pathname });
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!(link instanceof HTMLAnchorElement)) return;
      const eventData = eventForLink(link);
      if (eventData) trackAnalyticsEvent(eventData.eventName, eventData.params);
    };
    const handleSubmit = (event: SubmitEvent) => {
      if (event.target instanceof HTMLFormElement && event.target.hasAttribute("data-analytics-quote")) {
        trackAnalyticsEvent("request_quote");
      }
    };
    document.addEventListener("click", handleClick, true);
    document.addEventListener("submit", handleSubmit, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("submit", handleSubmit, true);
    };
  }, []);

  return null;
}
