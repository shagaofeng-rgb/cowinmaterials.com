"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import { updateBlogArticleStatus } from "@/lib/blog/store";

export async function updateBlogStatusAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["draft", "published", "archived"].includes(status)) return;
  await updateBlogArticleStatus(id, status as "draft" | "published" | "archived");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
}

