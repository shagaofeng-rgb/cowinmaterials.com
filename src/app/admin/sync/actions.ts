"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin-auth";
import { getPool } from "@/lib/database";
import { runSitemapMaintenance } from "@/lib/sitemap/maintenance";

export async function runSitemapMaintenanceAction() {
  const session = await requireAdminSession();

  try {
    // A manual run validates the public sitemap and refreshes its snapshot. It does not force a Google submission.
    const result = await runSitemapMaintenance({ trigger: "manual" });
    const pool = getPool();
    if (pool) {
      await pool.query(
        `insert into audit_logs (action, module, target_id, metadata)
         values ('run_sitemap_maintenance', 'sync', $1, $2::jsonb)`,
        [result.status, JSON.stringify({ actor: session.sub, ok: result.ok, trigger: result.trigger })],
      );
    }
    revalidatePath("/admin");
    revalidatePath("/admin/seo");
    revalidatePath("/admin/sync");
    redirect(`/admin/sync?run=${result.ok ? "success" : "warning"}`);
  } catch {
    redirect("/admin/sync?run=failed");
  }
}
