"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin-auth";
import { updateAdminBlogArticle, updateBlogArticleStatus } from "@/lib/blog/store";

export async function updateBlogStatusAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["draft", "published", "archived"].includes(status)) return;
  await updateBlogArticleStatus(id, status as "draft" | "published" | "archived", session.sub);
  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
}

export async function saveBlogArticleAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["draft", "published", "archived"].includes(status)) {
    redirect(`/admin/blog/${id}?error=invalid`);
  }

  try {
    const article = await updateAdminBlogArticle({
      id,
      title: String(formData.get("title") || ""),
      authorId: String(formData.get("authorId") || ""),
      content: String(formData.get("content") || ""),
      imageUrl: String(formData.get("imageUrl") || ""),
      status: status as "draft" | "published" | "archived",
      actor: session.sub,
    });
    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/${article.id}`);
    revalidatePath("/blog");
    revalidatePath(`/blog/${article.slug}`);
    revalidatePath("/sitemap.xml");
  } catch {
    redirect(`/admin/blog/${id}?error=save`);
  }

  redirect(`/admin/blog/${id}?saved=1`);
}
