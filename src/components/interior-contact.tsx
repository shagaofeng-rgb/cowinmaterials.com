import { Mail, MapPin, MessageCircle } from "lucide-react";
import { site } from "@/lib/data";

export function ContactDetails({ title = "Contact details", placement = "contact_phone" }: {
  title?: string;
  placement?: string;
}) {
  return (
    <section className="cw-contact-details">
      <h2>{title}</h2>
      <ul>
        <li>
          <Mail size={20} aria-hidden="true" />
          <div><strong>Email</strong><a href={`mailto:${site.email}`}>{site.email}</a></div>
        </li>
        <li>
          <MessageCircle size={20} aria-hidden="true" />
          <div><strong>WhatsApp</strong><a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" data-analytics-whatsapp-placement={placement}>{site.phone}</a></div>
        </li>
        <li>
          <MapPin size={20} aria-hidden="true" />
          <div><strong>Quzhou office</strong><a href={site.officeMapUrl} target="_blank" rel="noopener noreferrer">{site.officeAddress}</a></div>
        </li>
      </ul>
    </section>
  );
}
