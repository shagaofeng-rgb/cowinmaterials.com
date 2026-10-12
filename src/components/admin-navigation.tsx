"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BarChart3, BookOpenText, Boxes, ChartNoAxesCombined, ClipboardList, FileStack, FolderOpen, ImageIcon, Newspaper, RefreshCw, ScrollText, SearchCheck, Settings, ShieldCheck, UsersRound, Menu, X } from "lucide-react";

const icons = [BarChart3, ClipboardList, ChartNoAxesCombined, Boxes, FolderOpen, BookOpenText, Newspaper, FileStack, ImageIcon, SearchCheck, RefreshCw, ScrollText, UsersRound, Settings];
type Group = { label: string; items: { href: string; label: string }[] };

export function AdminNavigation({ groups }: { groups: Group[] }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [expanded]);
  const close = () => { dialog.current?.close(); setExpanded(false); trigger.current?.focus(); };
  const nav = () => {
    let index = 0;
    return <nav aria-label="后台主导航" className="admin-nav-groups">{groups.map((group) => <section key={group.label}>
      <p>{group.label}</p>{group.items.map((item) => {
        const Icon = icons[index++] || ShieldCheck;
        const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href) || (item.href === "/admin/analytics" && pathname.startsWith("/admin/visitors/"));
        return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} onClick={() => { if (dialog.current?.open) close(); }}><Icon size={19} strokeWidth={1.8} /><span>{item.label}</span></Link>;
      })}
    </section>)}</nav>;
  };
  return <>
    <div className="admin-desktop-navigation">{nav()}</div>
    <button ref={trigger} className="admin-menu-trigger" aria-label="打开后台导航" aria-haspopup="dialog" aria-expanded={expanded} aria-controls="admin-menu" onClick={() => { dialog.current?.showModal(); setExpanded(true); }}><Menu size={22} /></button>
    <dialog id="admin-menu" ref={dialog} className="admin-menu-dialog" aria-label="后台导航" onCancel={(e) => { e.preventDefault(); close(); }} onClick={(e) => { if (e.target === dialog.current) close(); }}>
      <div className="admin-drawer-content"><div className="admin-drawer-heading"><strong>Cowin Materials</strong><button onClick={close} aria-label="关闭后台导航"><X size={22} /></button></div>{nav()}</div>
    </dialog>
  </>;
}
