"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from "react";
import { applicationPages, companyMenuItems, getProductFamilyPath, megaMenus, navItems, productFamilies, site } from "@/lib/data";

type PanelName = "Products" | "Applications" | "Company" | null;

function focusableElements(container: HTMLElement) {
  return [...container.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.hasAttribute("hidden"));
}

export function Header() {
  const [activePanel, setActivePanel] = useState<PanelName>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerId = useId();
  const drawerRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const panelCloseTimerRef = useRef<number | null>(null);
  const wasDrawerOpenRef = useRef(false);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    if (drawerOpen) {
      if (!drawer.open) drawer.showModal();
      document.body.classList.add("drawer-open");
      wasDrawerOpenRef.current = true;
      requestAnimationFrame(() => focusableElements(drawer)[0]?.focus());
      return;
    }

    document.body.classList.remove("drawer-open");
    if (drawer.open) drawer.close();
    if (wasDrawerOpenRef.current) triggerRef.current?.focus();
    wasDrawerOpenRef.current = false;
  }, [drawerOpen]);

  useEffect(() => () => {
    document.body.classList.remove("drawer-open");
    if (panelCloseTimerRef.current !== null) window.clearTimeout(panelCloseTimerRef.current);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [drawerOpen]);

  const clearPanelCloseTimer = () => {
    if (panelCloseTimerRef.current !== null) window.clearTimeout(panelCloseTimerRef.current);
    panelCloseTimerRef.current = null;
  };

  const closePanel = () => {
    clearPanelCloseTimer();
    setActivePanel(null);
  };

  const schedulePanelClose = () => {
    clearPanelCloseTimer();
    panelCloseTimerRef.current = window.setTimeout(() => setActivePanel(null), 140);
  };

  const openPanel = (panel: Exclude<PanelName, null>) => {
    clearPanelCloseTimer();
    setActivePanel(panel);
  };

  const closeDrawer = () => setDrawerOpen(false);
  const togglePanel = (panel: Exclude<PanelName, null>) => {
    clearPanelCloseTimer();
    setActivePanel((current) => current === panel ? null : panel);
  };

  const handlePanelPointerEnter = (event: PointerEvent<HTMLDivElement>, panel: Exclude<PanelName, null>) => {
    if (event.pointerType === "mouse") openPanel(panel);
  };

  const handlePanelBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) schedulePanelClose();
  };

  const handleDrawerKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const focusable = focusableElements(drawer);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  useEffect(() => {
    if (!activePanel) return;
    const handleDocumentPointerDown = (event: globalThis.PointerEvent) => {
      if (navRef.current?.contains(event.target as Node)) return;
      if (panelCloseTimerRef.current !== null) {
        window.clearTimeout(panelCloseTimerRef.current);
        panelCloseTimerRef.current = null;
      }
      setActivePanel(null);
    };
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        if (panelCloseTimerRef.current !== null) {
          window.clearTimeout(panelCloseTimerRef.current);
          panelCloseTimerRef.current = null;
        }
        setActivePanel(null);
      }
    };
    document.addEventListener("pointerdown", handleDocumentPointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleDocumentPointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activePanel]);

  return (
    <>
      <header className="site-header">
        <div className="nav-shell">
          <Link className="brand" href="/" aria-label="Cowin Materials home">
            <Image className="brand-logo" src="/brand/cowin-cy-logo.png" alt="Cowin Materials" width={48} height={48} priority />
            <span><strong>{site.name}</strong><em>{site.tagline}</em></span>
          </Link>

          <nav ref={navRef} className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => {
              const panel = item.label === "Products" || item.label === "Applications" || item.label === "Company" ? item.label : null;
              const isOpen = activePanel === panel;
              return (
                <div
                  className="nav-cluster"
                  key={item.href}
                  onPointerEnter={panel ? (event) => handlePanelPointerEnter(event, panel) : undefined}
                  onPointerLeave={panel ? schedulePanelClose : undefined}
                  onFocusCapture={panel ? () => openPanel(panel) : undefined}
                  onBlurCapture={panel ? handlePanelBlur : undefined}
                >
                  <Link className="nav-link" href={item.href} onClick={closePanel}>{item.label}</Link>
                  {panel ? (
                    <button className="nav-panel-toggle" type="button" aria-label={`Toggle ${panel} menu`} aria-expanded={isOpen} aria-controls={`${panel.toLowerCase()}-mega-panel`} onClick={() => togglePanel(panel)}>
                      <ChevronDown size={15} aria-hidden="true" />
                    </button>
                  ) : null}
                  {panel && isOpen ? (
                    <div className="mega-panel" id={`${panel.toLowerCase()}-mega-panel`}>
                      <span className="mega-kicker">Explore {panel}</span>
                      <div className="mega-panel-grid">
                        {panel === "Products" ? productFamilies.map((family) => (
                          <Link href={getProductFamilyPath(family)} key={family.slug} onClick={closePanel}>
                            <strong>{family.title}</strong><span>{family.intent}</span>
                          </Link>
                        )) : panel === "Applications" ? applicationPages.map((application) => (
                          <Link href={`/applications/${application.slug}`} key={application.slug} onClick={closePanel}>
                            <strong>{application.shortTitle}</strong><span>{application.challenges.slice(0, 2).join(" · ")}</span>
                          </Link>
                        )) : companyMenuItems.map((entry) => (
                          <Link href={entry.href} key={entry.href} onClick={closePanel}>
                            <strong>{entry.label}</strong><span>{entry.note}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="header-actions">
            <Link className="header-search" href="/search" aria-label="Search Cowin Materials"><Search size={21} aria-hidden="true" /></Link>
            <Link className="header-cta" href="/request-quote">Request a Quote <ArrowRight size={17} aria-hidden="true" /></Link>
            <button ref={triggerRef} className="menu-button" type="button" aria-label="Open site menu" aria-controls={drawerId} aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}>
              <Menu size={20} aria-hidden="true" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      <noscript>
        <nav className="fallback-nav" aria-label="Site navigation">
          {navItems.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
          {companyMenuItems.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
        </nav>
      </noscript>

      <dialog
        ref={drawerRef}
        id={drawerId}
        className="site-drawer"
        aria-label="Site menu"
        onCancel={(event) => { event.preventDefault(); closeDrawer(); }}
        onClick={(event) => { if (event.target === event.currentTarget) closeDrawer(); }}
        onKeyDown={handleDrawerKeyDown}
      >
        <div className="drawer-surface">
          <div className="drawer-header">
            <span className="drawer-title">Menu</span>
            <button className="drawer-close" type="button" aria-label="Close site menu" onClick={closeDrawer}><X size={20} aria-hidden="true" /></button>
          </div>
          <div className="drawer-scroll">
            <section className="drawer-group"><h2>Explore Products</h2>{productFamilies.map((family) => <Link href={getProductFamilyPath(family)} key={family.slug} onClick={closeDrawer}><strong>{family.title}</strong><span>{family.intent}</span></Link>)}</section>
            <section className="drawer-group"><h2>Explore Applications</h2>{applicationPages.map((application) => <Link href={`/applications/${application.slug}`} key={application.slug} onClick={closeDrawer}><strong>{application.shortTitle}</strong><span>{application.challenges.slice(0, 2).join(" · ")}</span></Link>)}</section>
            <section className="drawer-group"><h2>Resources</h2>{megaMenus.Resources.map((resource) => <Link href={resource.href} key={resource.href} onClick={closeDrawer}><strong>{resource.label}</strong><span>{resource.note}</span></Link>)}<Link href="/resources" onClick={closeDrawer}><strong>Technical resources</strong><span>Reviewed documentation and application guidance</span></Link></section>
            <section className="drawer-group drawer-company"><h2>Company</h2>{companyMenuItems.map((entry) => <Link href={entry.href} key={entry.href} onClick={closeDrawer}><strong>{entry.label}</strong><span>{entry.note}</span></Link>)}<Link href="/search" onClick={closeDrawer}><Search size={16} aria-hidden="true" /> Search the site</Link></section>
          </div>
          <div className="drawer-footer"><Link className="primary-button" href="/request-quote" onClick={closeDrawer}>Request a Quote <ArrowRight size={18} aria-hidden="true" /></Link><a href={`mailto:${site.email}`}>{site.email}</a></div>
        </div>
      </dialog>
    </>
  );
}
