"use client";

import { useState } from "react";
import type { AdminDateRange, AdminRangeKey } from "@/lib/admin-listing";

const options: { value: AdminRangeKey; label: string }[] = [
  { value: "today", label: "今天" }, { value: "week", label: "本周" },
  { value: "month", label: "本月" }, { value: "90days", label: "90天" }, { value: "custom", label: "自定义" },
];

export function AdminDateFields({ range }: { range: AdminDateRange }) {
  const [selected, setSelected] = useState(range.key);
  return <div className="admin-date-fields">
    <fieldset className="admin-date-segments"><legend>时间范围</legend>{options.map((option) => <label key={option.value}>
      <input type="radio" name="range" value={option.value} checked={selected === option.value} onChange={() => setSelected(option.value)} />
      <span>{option.label}</span>
    </label>)}</fieldset>
    {selected === "custom" ? <div className="admin-custom-dates">
      <label>开始日期<input name="from" type="date" defaultValue={range.from} required /></label>
      <label>结束日期<input name="to" type="date" defaultValue={range.to} required /></label>
    </div> : <small className="admin-range-caption">{selected === range.key ? `${range.from} 至 ${range.to}` : "点击查询应用所选时间"} · 北京时间</small>}
    {range.error ? <p role="alert" className="admin-error">{range.error}</p> : null}
  </div>;
}
