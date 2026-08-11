import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { logBlogWebhookEvent, publishBlogArticle } from "@/lib/blog/store";

export const runtime = "nodejs";

function response(code: 0 | 1, msg: string, status = 200) {
  return NextResponse.json({ code, msg }, { status });
}

function safeEqual(received: string, expected: string) {
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function requestFingerprint(fields: Record<string, string>) {
  return createHash("sha256")
    .update([fields.class_id || "", fields.title || "", fields.content || "", fields.author_id || "", fields.image_url || ""].join("\n"))
    .digest("hex");
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
    const fingerprint = requestFingerprint(fields);

    if (!expectedSign || !safeEqual(fields.sign || "", expectedSign)) {
      await logBlogWebhookEvent({ requestFingerprint: fingerprint, eventType: "rejected", outcome: "rejected", httpStatus: 200, message: "API key validation failed." });
      return response(0, "秘钥错误");
    }

    const classId = (fields.class_id || "").trim();
    const title = (fields.title || "").trim();
    const content = (fields.content || "").trim();
    const authorId = (fields.author_id || "").trim();
    const imageUrl = (fields.image_url || "").trim();

    if (!classId) {
      await logBlogWebhookEvent({ requestFingerprint: fingerprint, eventType: "rejected", outcome: "rejected", httpStatus: 200, message: "class_id is required." });
      return response(0, "class_id 为必填参数");
    }
    if (!["blog", "31"].includes(classId)) {
      await logBlogWebhookEvent({ requestFingerprint: fingerprint, eventType: "rejected", classId, outcome: "rejected", httpStatus: 200, message: "Unsupported class_id." });
      return response(0, "栏目参数错误，请使用 blog 或 31");
    }
    if (!title || !content || (title.length <= 4 && content.length <= 20)) {
      await logBlogWebhookEvent({ requestFingerprint: fingerprint, eventType: "verification", classId, outcome: "accepted", httpStatus: 200, message: "Plugin verification accepted without publishing." });
      return response(1, "验证成功");
    }
    if (!authorId) {
      await logBlogWebhookEvent({ requestFingerprint: fingerprint, eventType: "rejected", classId, outcome: "rejected", httpStatus: 200, message: "author_id is required." });
      return response(0, "author_id 为必填参数");
    }
    if (title.length > 180 || content.length > 200_000 || authorId.length > 120 || imageUrl.length > 2000) {
      await logBlogWebhookEvent({ requestFingerprint: fingerprint, eventType: "rejected", classId, authorId, outcome: "rejected", httpStatus: 200, message: "Payload exceeded a field limit." });
      return response(0, "参数长度超过限制");
    }
    if (imageUrl && !imageUrl.startsWith("https://")) {
      await logBlogWebhookEvent({ requestFingerprint: fingerprint, eventType: "rejected", classId, authorId, outcome: "rejected", httpStatus: 200, message: "Cover image URL was not HTTPS." });
      return response(0, "image_url 必须使用 HTTPS 地址");
    }

    const { article, idempotentReplay } = await publishBlogArticle({ classId, title, content, authorId, imageUrl });
    await logBlogWebhookEvent({ requestFingerprint: fingerprint, articleId: article.id, eventType: idempotentReplay ? "idempotent_replay" : "published", classId, authorId, outcome: "accepted", httpStatus: 200, message: idempotentReplay ? "Duplicate payload updated the existing article." : "Article published.", metadata: { slug: article.slug } });
    revalidatePath("/blog");
    revalidatePath(`/blog/${article.slug}`);
    revalidatePath("/sitemap.xml");

    console.info(JSON.stringify({
      event: "blog_webhook_publish",
      ok: true,
      idempotentReplay,
      slug: article.slug,
      classId,
      authorId,
      publishedAt: article.publishedAt,
    }));
    return response(1, "发布成功");
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown publishing error.";
    console.error(JSON.stringify({ event: "blog_webhook_publish", ok: false, error: msg }));
    const retryable = /database|connection|timeout|temporar/i.test(msg);
    await logBlogWebhookEvent({ eventType: retryable ? "retryable_failure" : "rejected", outcome: retryable ? "retryable_failure" : "rejected", httpStatus: retryable ? 503 : 200, message: msg });
    return response(0, `发布失败：${msg}`, retryable ? 503 : 200);
  }
}
