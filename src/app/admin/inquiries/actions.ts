"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin-auth";
import { addAdminInquiryNote, updateAdminInquiryStatus, updateAdminInquiryWorkflow } from "@/lib/database";
import { deliverInquiryNotification } from "@/lib/inquiry-notifications";

const inquiryIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function retryInquiryNotificationAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = String(formData.get("id") || "");
  if (!inquiryIdPattern.test(id)) redirect("/admin/inquiries");
  let result = "unavailable";
  try {
    result = await deliverInquiryNotification(id, session.sub) || "unchanged";
    revalidatePath("/admin");
    revalidatePath(`/admin/inquiries/${id}`);
  } catch {
    // The delivery may have started; do not retry automatically without its durable status.
  }
  redirect(`/admin/inquiries/${id}?mail=${result}`);
}

export async function updateInquiryStatusAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = String(formData.get("id") || "");
  if (!inquiryIdPattern.test(id)) redirect("/admin/inquiries");
  const status = String(formData.get("status") || "");
  if (!["new", "in_progress", "closed", "spam"].includes(status)) {
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

export async function updateInquiryWorkflowAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = String(formData.get("id") || "");
  if (!inquiryIdPattern.test(id)) redirect("/admin/inquiries");
  const status = String(formData.get("status") || "");
  const priority = String(formData.get("priority") || "");
  const leadStage = String(formData.get("leadStage") || "");
  const nextFollowUpAt = String(formData.get("nextFollowUpAt") || "");
  const internalSummary = String(formData.get("internalSummary") || "").trim();
  const validStatus = ["new", "in_progress", "closed", "spam"].includes(status);
  const validPriority = ["low", "normal", "high", "urgent"].includes(priority);
  const validStage = ["new", "qualified", "technical_review", "quotation", "sample", "follow_up", "won", "lost"].includes(leadStage);
  const parsedDate = new Date(`${nextFollowUpAt}T00:00:00Z`);
  const validDate = !nextFollowUpAt || (/^\d{4}-\d{2}-\d{2}$/.test(nextFollowUpAt) && Number.isFinite(+parsedDate) && parsedDate.toISOString().slice(0, 10) === nextFollowUpAt);
  if (!validStatus || !validPriority || !validStage || !validDate || internalSummary.length > 3000) {
    redirect(`/admin/inquiries/${id}?error=invalid`);
  }
  try {
    await updateAdminInquiryWorkflow({
      id,
      status: status as "new" | "in_progress" | "closed" | "spam",
      priority: priority as "low" | "normal" | "high" | "urgent",
      leadStage: leadStage as "new" | "qualified" | "technical_review" | "quotation" | "sample" | "follow_up" | "won" | "lost",
      nextFollowUpAt: nextFollowUpAt ? `${nextFollowUpAt}T09:00:00+08:00` : null,
      internalSummary: internalSummary || null,
      actor: session.sub,
    });
    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    revalidatePath(`/admin/inquiries/${id}`);
  } catch {
    redirect(`/admin/inquiries/${id}?error=save`);
  }
  redirect(`/admin/inquiries/${id}?saved=1`);
}

export async function addInquiryNoteAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = String(formData.get("id") || "");
  if (!inquiryIdPattern.test(id)) redirect("/admin/inquiries");
  const note = String(formData.get("note") || "").trim();
  if (!note || note.length > 3000) {
    redirect(`/admin/inquiries/${id}?error=note`);
  }
  try {
    await addAdminInquiryNote({ inquiryId: id, note, actor: session.sub });
    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    revalidatePath(`/admin/inquiries/${id}`);
  } catch {
    redirect(`/admin/inquiries/${id}?error=note`);
  }
  redirect(`/admin/inquiries/${id}?noted=1`);
}
