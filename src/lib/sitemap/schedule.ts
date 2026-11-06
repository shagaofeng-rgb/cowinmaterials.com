export function weeklySubmissionAllowed(now: Date, lastSubmittedAt?: Date | null): boolean {
  const local = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  if (local.getUTCDay() !== 1) return false;
  const mondayStart = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - 8 * 60 * 60 * 1000;
  return !lastSubmittedAt || lastSubmittedAt.getTime() < mondayStart;
}

export function submissionSkipReason(input: {
  now: Date;
  trigger: string;
  dryRun: boolean;
  enabled: boolean;
  valid: boolean;
  durable: boolean;
  lastAttempt?: Date | null;
}): "skipped_validation" | "disabled" | "skipped_schedule" | "configuration_error" | "skipped_duplicate" | null {
  if (!input.valid) return "skipped_validation";
  if (!input.enabled) return "disabled";
  if (input.dryRun || input.trigger !== "cron" || !weeklySubmissionAllowed(input.now)) return "skipped_schedule";
  if (!input.durable) return "configuration_error";
  if (!weeklySubmissionAllowed(input.now, input.lastAttempt)) return "skipped_duplicate";
  return null;
}

export function isSitemapSubmissionFailure(status?: string | null) {
  return ["configuration_error", "authentication_error", "permission_error", "network_error", "api_error", "submission_pending"].includes(status || "");
}
