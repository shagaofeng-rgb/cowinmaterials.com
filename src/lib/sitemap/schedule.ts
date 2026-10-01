export function weeklySubmissionAllowed(now: Date, lastSubmittedAt?: Date | null): boolean {
  const local = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  if (local.getUTCDay() !== 1) return false;
  const mondayStart = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - 8 * 60 * 60 * 1000;
  return !lastSubmittedAt || lastSubmittedAt.getTime() < mondayStart;
}
