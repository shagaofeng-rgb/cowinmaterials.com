"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { recordStoredAnalyticsEvent, trackAnalyticsEvent } from "@/components/analytics-events";

const whatsappUrl = "https://wa.me/8613732512581";

function recordWhatsappClick() {
  trackAnalyticsEvent("whatsapp_click", {
    placement: "floating_whatsapp",
    page_path: window.location.pathname,
  });
  recordStoredAnalyticsEvent({
    eventName: "whatsapp_click",
    pagePath: window.location.pathname,
    placement: "floating_whatsapp",
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
