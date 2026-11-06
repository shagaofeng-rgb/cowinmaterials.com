# Release and Recovery

## Before deployment

1. Record the current Git commit, Vercel production deployment, and Neon production branch. Take a production snapshot before a schema change.
2. Run the new migrations on an isolated Neon branch first. For the reliability release, apply `20261106-add-admin-login-limits.sql` and `20261106-add-inquiry-notifications.sql` in one transaction over the direct, TLS-verified connection. They are additive and do not rewrite inquiries, articles, or existing audit rows.
3. Check that the production environment has the independently configured `ADMIN_SESSION_SECRET`, a password hash, `CRON_SECRET`, PostgreSQL, and SMTP settings. Do not copy secrets into diagnostics or client code. `DATABASE_SSL=false` is for local development only.
4. Run lint, type checking, all self-tests, a production build, and browser/API/database regression checks. Use an isolated database and SMTP sink for failure, retry, duplicate, and upload tests.
5. Apply the tested migrations before releasing code that depends on the two tables. Verify the final custom-domain deployment and preserve the previous Ready deployment.

## Inquiry delivery

- A successful form response means the inquiry and its pending notification were committed to PostgreSQL. The customer does not wait for the mail server.
- The attachment limit is 4,000,000 bytes; the app rejects payloads above 4,400,000 bytes before parsing when the request length is known. The attachment is available only to server-side notification processing. The temporary bytes are cleared when SMTP accepts delivery to the configured recipients.
- The first attempt starts immediately after the response. The protected `/api/cron/inquiry-notifications` job checks due work daily at 00:15 UTC. The inquiry detail shows attempts, acceptance, and actionable failures. A known failure can be retried by an authenticated administrator until the three-attempt limit.
- Each inquiry has one durable notification row and a stable SMTP Message-ID. A timed-out or partially accepted delivery is not retried automatically. Check the mailbox and runtime log before further action. SMTP acceptance is not inbox delivery.
- Keep historic `notification_sent` / `notification_failed` records intact. Do not backfill or resend historical inquiries as part of deployment.
- Vercel logs record safe operational events. Check the dashboard's notification attention filter and the inquiry's status; no inquiry body, attachment, or credential is included in those event logs.

## Publication and search

- News automation is stopped. The existing Blog plugin, signature, request contract, and publication logic are unchanged.
- Google submission stays at Monday 02:30 UTC (10:30 Beijing time). The maintenance job validates live XML and URLs before reserving the week's submission. The protected manual action validates only; it never submits. See [SITEMAP.md](SITEMAP.md).
- In Search Console, verify sitemap read status separately from acceptance and URL indexing. A legacy deleted article without a relevant replacement can remain a real 404; never redirect it to the homepage.

## Rollback

If a release regresses, restore the previous Vercel production deployment first. Leave the new additive tables in place so newly submitted inquiries and pending notification evidence are preserved. Do not restore a database snapshot over live writes. Restore into an isolated branch first for investigation or targeted recovery. After rollback, check the inquiry queue and resolve pending messages before re-releasing.
