import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getDatabaseHealth } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getDatabaseHealth());
}
