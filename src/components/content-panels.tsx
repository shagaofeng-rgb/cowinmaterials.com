"use client";

import { Children, cloneElement, isValidElement, useId, useState, type KeyboardEvent, type ReactElement, type ReactNode } from "react";

export type ContentPanelProps = {
  id: string;
  label: string;
  children: ReactNode;
  active?: boolean;
  tabId?: string;
  panelId?: string;
};

export function ContentPanel({ children, active = false, tabId, panelId }: ContentPanelProps) {
  return (
    <section className="content-panel" role="tabpanel" id={panelId} aria-labelledby={tabId} hidden={!active} tabIndex={0}>
      {children}
    </section>
  );
}

type ContentPanelsProps = {
  label: string;
  children: ReactNode;
};

export function ContentPanels({ label, children }: ContentPanelsProps) {
  const panelElements = Children.toArray(children).filter(isValidElement) as ReactElement<ContentPanelProps>[];
  const [activeId, setActiveId] = useState(panelElements[0]?.props.id || "");
  const uid = useId().replace(/:/g, "");
  const activeIndex = Math.max(0, panelElements.findIndex((panel) => panel.props.id === activeId));

  const selectPanel = (id: string) => setActiveId(id);
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? panelElements.length - 1 : (
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? (index + 1) % panelElements.length
        : (index - 1 + panelElements.length) % panelElements.length
    );
    const next = panelElements[nextIndex];
    selectPanel(next.props.id);
    document.getElementById(`${uid}-tab-${next.props.id}`)?.focus();
  };

  if (!panelElements.length) return null;

  return (
    <div className="content-panels" data-panel-count={panelElements.length}>
      <div className="content-panel-mobile-control">
        <label htmlFor={`${uid}-select`}>Choose a section</label>
        <select id={`${uid}-select`} value={activeId} onChange={(event) => selectPanel(event.target.value)}>
          {panelElements.map((panel) => <option key={panel.props.id} value={panel.props.id}>{panel.props.label}</option>)}
        </select>
      </div>
      <div className="content-panel-tabs" role="tablist" aria-label={label}>
        {panelElements.map((panel, index) => {
          const isActive = panel.props.id === activeId;
          const tabId = `${uid}-tab-${panel.props.id}`;
          const panelId = `${uid}-panel-${panel.props.id}`;
          return <button key={panel.props.id} id={tabId} type="button" role="tab" aria-selected={isActive} aria-controls={panelId} tabIndex={isActive ? 0 : -1} onClick={() => selectPanel(panel.props.id)} onKeyDown={(event) => onTabKeyDown(event, index)}>{panel.props.label}</button>;
        })}
      </div>
      <div className="content-panel-stage">
        {panelElements.map((panel) => cloneElement(panel, {
          active: panel.props.id === activeId,
          tabId: `${uid}-tab-${panel.props.id}`,
          panelId: `${uid}-panel-${panel.props.id}`,
        }))}
      </div>
      <p className="content-panel-progress" aria-live="polite">Section {activeIndex + 1} of {panelElements.length}</p>
    </div>
  );
}
