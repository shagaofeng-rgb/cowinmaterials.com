import Link from "next/link";

type SyncStatusProps = {
  status?: "Up to date" | "Pending" | "Syncing" | "Failed" | "Not connected";
  lastSyncedAt?: string | null;
  websiteHref?: string;
  label?: string;
};

const labels = {
  "Up to date": "已同步",
  Pending: "待同步",
  Syncing: "同步中",
  Failed: "同步失败",
  "Not connected": "未连接",
} as const;

export function AdminSyncStatus({ status = "Not connected", lastSyncedAt, websiteHref, label = "官网同步" }: SyncStatusProps) {
  const time = lastSyncedAt
    ? new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Shanghai" }).format(new Date(lastSyncedAt))
    : "暂无同步时间";

  return (
    <div className="admin-sync-status" data-status={status.toLowerCase().replaceAll(" ", "-")}>
      <div>
        <span>{label}</span>
        <strong>{labels[status]}</strong>
        <small>{time}</small>
      </div>
      {websiteHref ? <Link href={websiteHref} target="_blank">查看官网</Link> : null}
    </div>
  );
}
