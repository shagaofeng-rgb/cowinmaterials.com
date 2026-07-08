import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { runNewsAutomation } from "@/lib/news/automation";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runNewsAutomation();
  return NextResponse.json(result, { status: result.ok ? 200 : 202 });
}
