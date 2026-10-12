"use client";
import { Children, useId, useState, type ReactNode } from "react";

export function AdminSectionTabs({ labels, children }: { labels: string[]; children: ReactNode }) {
  const [active, setActive] = useState(0);
  const id = useId();
  return <div className="admin-section-tabs">
    <div role="tablist" aria-label="详情分类">{labels.map((label, index) => <button key={label} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(e) => {
      let next = index;
      if (e.key === "ArrowRight") next = (index + 1) % labels.length;
      else if (e.key === "ArrowLeft") next = (index + labels.length - 1) % labels.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = labels.length - 1;
      else return;
      e.preventDefault(); setActive(next); document.getElementById(`${id}-tab-${next}`)?.focus();
    }}>{label}</button>)}</div>
    {Children.toArray(children).map((child, index) => <div key={index} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={active !== index} tabIndex={0} onInvalidCapture={() => setActive(index)}>{child}</div>)}
  </div>;
}
