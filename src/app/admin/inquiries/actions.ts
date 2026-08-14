"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin-auth";
import { updateAdminInquiryStatus } from "@/lib/database";

export async function updateInquiryStatusAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["new", "in_progress", "closed", "spam"].includes(status)) {
    redirect(`/admin/inquiries/${id}?error=invalid`);
  }
  try {
    await updateAdminInquiryStatus(id, status as "new" | "in_progress" | "closed" | "spam", session.sub);
    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    revalidatePath(`/admin/inquiries/${id}`);
  } catch {
    redirect(`/admin/inquiries/${id}?error=save`);
  }
  redirect(`/admin/inquiries/${id}?saved=1`);
}
