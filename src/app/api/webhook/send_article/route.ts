import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { publishBlogArticle } from "@/lib/blog/store";

export const runtime = "nodejs";

function response(code: 0 | 1, msg: string, status = 200) {
  return NextResponse.json({ code, msg }, { status });
}

function safeEqual(received: string, expected: string) {
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

async function readFields(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json() as Record<string, unknown>;
    return Object.fromEntries(Object.entries(body).map(([key, value]) => [key, String(value ?? "")]));
  }
  const body = await request.formData();
  return Object.fromEntries([...body.entries()].map(([key, value]) => [key, String(value)]));
}

export async function POST(request: Request) {
  try {
    const fields = await readFields(request);
    const expectedSign = process.env.WEBHOOK_ARTICLE_SIGN || "";

    if (!expectedSign || !safeEqual(fields.sign || "", expectedSign)) {
      return response(0, "秘钥错误");
    }

    const classId = (fields.class_id || "").trim();
    const title = (fields.title || "").trim();
    const content = (fields.content || "").trim();
    const authorId = (fields.author_id || "").trim();
    const imageUrl = (fields.image_url || "").trim();

    if (!classId) return response(0, "class_id 为必填参数");
    if (!["blog", "31"].includes(classId)) {
      return response(0, "栏目参数错误，请使用 blog 或 31");
    }
    if (!title || !content || (title.length <= 4 && content.length <= 20)) {
      return response(1, "验证成功");
    }
    if (!authorId) return response(0, "author_id 为必填参数");
    if (title.length > 180 || content.length > 200_000 || authorId.length > 120 || imageUrl.length > 2000) {
      return response(0, "参数长度超过限制");
    }
    if (imageUrl && !imageUrl.startsWith("https://")) {
      return response(0, "image_url 必须使用 HTTPS 地址");
    }

    const article = await publishBlogArticle({ classId, title, content, authorId, imageUrl });
    revalidatePath("/blog");
    revalidatePath(`/blog/${article.slug}`);
    revalidatePath("/sitemap.xml");

    console.info(JSON.stringify({
      event: "blog_webhook_publish",
      ok: true,
      slug: article.slug,
      classId,
      authorId,
      publishedAt: article.publishedAt,
    }));
    return response(1, "发布成功");
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown publishing error.";
    console.error(JSON.stringify({ event: "blog_webhook_publish", ok: false, error: msg }));
    return response(0, `发布失败：${msg}`);
  }
}
