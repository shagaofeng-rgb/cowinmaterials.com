"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { applications } from "@/lib/data";

export function ApplicationSwitcher() {
  const [activeId, setActiveId] = useState(applications[0].id);
  const active = applications.find((item) => item.id === activeId) ?? applications[0];
  const Icon = active.icon;

  return (
    <div className="application-layout">
      <div className="application-tabs" role="tablist" aria-label="Application selector">
        {applications.map((item) => {
          const TabIcon = item.icon;
          return (
            <button
              id={item.id}
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === activeId}
              className={item.id === activeId ? "selected" : ""}
              onClick={() => setActiveId(item.id)}
            >
              <TabIcon size={18} />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      <article className="application-panel">
        <div className="application-copy">
          <span className="panel-icon">
            <Icon size={20} />
          </span>
          <h2>{active.title}</h2>
          <p>{active.summary}</p>
          <div className="two-column-list">
            <div>
              <h3>Recommended Products</h3>
              <ul>
                {active.fit.map((item) => (
                  <li key={item}>
                    <ArrowRight size={15} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Qualification Metrics</h3>
              <ul>
                {active.metrics.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={15} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="application-image">
          <Image src={active.image} alt={active.title} width={1000} height={640} priority />
        </div>
      </article>
    </div>
  );
}
