"use client";

import { Children, cloneElement, isValidElement, useId, useSyncExternalStore, type KeyboardEvent, type ReactElement, type ReactNode } from "react";

export type ContentPanelProps = {
  id: string;
  label: string;
  children: ReactNode;
  active?: boolean;
  enhanced?: boolean;
  tabId?: string;
};

export function ContentPanel({ id, children, active = false, enhanced = false, tabId }: ContentPanelProps) {
  return (
    <section className="cw-panel" role={enhanced ? "tabpanel" : undefined} id={id} data-current={active ? "true" : undefined} aria-labelledby={enhanced ? tabId : undefined} hidden={enhanced && !active} tabIndex={enhanced ? 0 : undefined}>
      {children}
    </section>
  );
}

type ContentPanelsProps = {
  label: string;
  initialId?: string;
  children: ReactNode;
};

const panelChange = "cw-panel-change";
const subscribe = (callback: () => void) => {
  for (const event of ["hashchange", "popstate", panelChange]) window.addEventListener(event, callback);
  return () => {
    for (const event of ["hashchange", "popstate", panelChange]) window.removeEventListener(event, callback);
  };
};
const currentHash = () => window.location.hash.slice(1);
const serverHash = () => "";
const clientReady = () => true;
const serverReady = () => false;
const subscribeReady = () => () => {};

export function ContentPanels({ label, initialId, children }: ContentPanelsProps) {
  const panelElements = Children.toArray(children).filter(isValidElement) as ReactElement<ContentPanelProps>[];
  const enhanced = useSyncExternalStore(subscribeReady, clientReady, serverReady);
  const hash = useSyncExternalStore(subscribe, currentHash, serverHash);
  const uid = useId().replace(/:/g, "");
  const fallbackId = panelElements.find((panel) => panel.props.id === initialId)?.props.id ?? panelElements[0]?.props.id;
  const activeId = panelElements.find((panel) => panel.props.id === hash)?.props.id ?? fallbackId;

  const selectPanel = (id: string, replace = false) => {
    if (activeId === id) return;
    window.history[replace ? "replaceState" : "pushState"](null, "", `#${id}`);
    window.dispatchEvent(new Event(panelChange));
  };
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? panelElements.length - 1 : (
      event.key === "ArrowRight"
        ? (index + 1) % panelElements.length
        : (index - 1 + panelElements.length) % panelElements.length
    );
    const next = panelElements[nextIndex];
    selectPanel(next.props.id, true);
    document.getElementById(`${uid}-tab-${next.props.id}`)?.focus();
  };

  if (!panelElements.length) return null;

  return (
    <div className="cw-panels" data-ready={enhanced}>
      {enhanced ? <>
        <div className="cw-panel-select">
          <label htmlFor={`${uid}-select`}>{label}</label>
          <select id={`${uid}-select`} value={activeId} onChange={(event) => selectPanel(event.target.value)}>
            {panelElements.map((panel) => <option key={panel.props.id} value={panel.props.id}>{panel.props.label}</option>)}
          </select>
        </div>
        <div className="cw-tabs" role="tablist" aria-label={label}>
          {panelElements.map((panel, index) => {
            const isActive = panel.props.id === activeId;
            return <button key={panel.props.id} id={`${uid}-tab-${panel.props.id}`} type="button" role="tab" aria-selected={isActive} aria-controls={panel.props.id} tabIndex={isActive ? 0 : -1} onClick={() => selectPanel(panel.props.id)} onKeyDown={(event) => onTabKeyDown(event, index)}>{panel.props.label}</button>;
          })}
        </div>
      </> : <nav className="cw-panel-links" aria-label={label}>
        {panelElements.map((panel) => <a key={panel.props.id} href={`#${panel.props.id}`}>{panel.props.label}</a>)}
      </nav>}
      <div className="cw-panel-stage">
        {panelElements.map((panel) => cloneElement(panel, {
          active: panel.props.id === activeId,
          enhanced,
          tabId: `${uid}-tab-${panel.props.id}`,
        }))}
      </div>
    </div>
  );
}
