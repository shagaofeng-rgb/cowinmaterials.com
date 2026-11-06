export const maxNotificationAttempts = 3;
export type NotificationStatus = "pending" | "sending" | "retry" | "accepted" | "failed" | "uncertain";

export function classifyNotificationFailure(error: unknown, attempts: number): {
  status: "retry" | "failed" | "uncertain";
  code: string;
} {
  const reason = error && typeof error === "object" ? error as { code?: string; command?: string; responseCode?: number } : {};
  const response = reason.responseCode;
  const connectionFailure = reason.command === "CONN" || ["EDNS", "ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED"].includes(reason.code || "");
  if (reason.code === "EAUTH") return { status: "failed", code: "smtp_authentication" };
  if (typeof response === "number" && response >= 500 && response < 600) return { status: "failed", code: "smtp_rejected" };
  if (connectionFailure || (typeof response === "number" && response >= 400 && response < 500)) {
    return { status: attempts < maxNotificationAttempts ? "retry" : "failed", code: connectionFailure ? "smtp_connection" : "smtp_temporary" };
  }
  return { status: "uncertain", code: "smtp_outcome_unconfirmed" };
}
