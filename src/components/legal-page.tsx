import type { ReactNode } from "react";
import { InteriorHeading, InteriorLink, InteriorPage } from "@/components/interior";
import { ContentsNavigation } from "@/components/interior-editorial";

type LegalSection = { id: string; label: string; body: ReactNode };

const notices = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Cookie Notice", href: "/cookie-notice" },
];

export function LegalPage({ title, description, sections }: { title: string; description: string; sections: LegalSection[] }) {
  return (
    <InteriorPage>
      <InteriorHeading title={title} description={description} />
      <div className="cw-shell cw-reading-layout cw-legal">
        <ContentsNavigation entries={sections} />
        <div className="cw-prose">
          {sections.map(({ id, label, body }) => <section key={id} id={id}><h2>{label}</h2>{body}</section>)}
          <nav className="cw-inline-links" aria-label="Related website policies">
            {notices.filter(({ label }) => label !== title).map(({ label, href }) => <InteriorLink href={href} key={href}>{label}</InteriorLink>)}
          </nav>
        </div>
      </div>
    </InteriorPage>
  );
}
