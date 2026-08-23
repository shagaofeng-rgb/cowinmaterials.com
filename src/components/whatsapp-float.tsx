"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { trackAnalyticsEvent } from "@/components/analytics-events";

const whatsappUrl = "https://wa.me/8613732512581";

function eventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `whatsapp-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function recordWhatsappClick() {
  const payload = JSON.stringify({
    event_id: eventId(),
    event_name: "whatsapp_click",
    page_path: window.location.pathname,
    placement: "floating_whatsapp",
  });

  trackAnalyticsEvent("whatsapp_click", {
    placement: "floating_whatsapp",
    page_path: window.location.pathname,
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

export function WhatsAppFloat() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      className="whatsapp-float"
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Cowin Materials on WhatsApp"
      onClick={recordWhatsappClick}
    >
      <MessageCircle size={27} strokeWidth={2.25} aria-hidden="true" />
      <span>WhatsApp</span>
    </a>
  );
}
