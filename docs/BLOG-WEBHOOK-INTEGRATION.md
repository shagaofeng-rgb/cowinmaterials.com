# Blog Webhook Integration

## Plugin configuration

| Plugin field | Value |
|---|---|
| Website framework | Custom development framework / Webhook |
| Domain | `https://www.cowinmaterials.com` |
| API_KEY | Use the value in the protected local key file listed below |
| Backend login account | `admin` |
| Note | `Cowin Materials Blog publishing` |
| Verification class ID | `blog` |

The generated API key is stored locally at:

`/Users/apple/Documents/材料/site-audit-backups/2026-08-06-pre-blog-webhook/WEBHOOK_ARTICLE_SIGN.txt`

The file is permission-restricted and the same value is stored as the encrypted Vercel environment variable `WEBHOOK_ARTICLE_SIGN`. Do not send it by email, commit it to Git, or include it in screenshots.

For the **Custom Development Framework Webhook**, enter only `https://www.cowinmaterials.com`; its validation request is sent to `POST /` and internally rewritten to the publishing API. For a **Universal Webhook**, use the complete endpoint `https://www.cowinmaterials.com/api/webhook/send_article`.

## Request

- Method: `POST`
- Content type: `application/x-www-form-urlencoded` (recommended) or `application/json`
- Endpoint: `https://www.cowinmaterials.com/api/webhook/send_article`

| Parameter | Required | Description |
|---|---|---|
| `sign` | Yes | API key |
| `class_id` | Yes | Use `blog` (legacy value `31` is also accepted) |
| `title` | Yes | Article title, maximum 180 characters |
| `content` | Yes | HTML article body, maximum 200,000 characters |
| `author_id` | Yes | Displayed author or publisher name, maximum 120 characters |
| `image_url` | No | Public HTTPS cover image URL |

The server filters unsafe HTML, scripts, event handlers and unsupported URL schemes before publication. Repeating an identical request is idempotent and updates the same PostgreSQL article record instead of creating duplicates.

## Response

The plugin-compatible response always contains `code` and `msg`:

```json
{"code":1,"msg":"发布成功"}
```

```json
{"code":0,"msg":"发布失败：具体原因"}
```

Published articles are stored in PostgreSQL `articles`, linked to `article_categories`, appear at `/blog` and `/blog/{slug}`, and are added to the Blog sitemap. The authenticated management list is available at `/admin/blog`. Each verification, publication, replay and failure is also persisted in `blog_webhook_events` without storing a secret or article body. Retryable database/network failures return HTTP 503 with the plugin-compatible JSON response so a compliant plugin can retry; duplicate payloads remain safe.

An authenticated request containing only `sign` and `class_id`, or short placeholder title/content fields, returns `{"code":1,"msg":"验证成功"}` without creating a database row.

## Verification sequence

1. Custom framework validation: send `sign` and `class_id=blog` to `POST https://www.cowinmaterials.com`.
2. Confirm the response is `{"code":1,"msg":"验证成功"}` and the article count is unchanged.
3. Send a complete article payload to the same root URL or the direct API URL.
4. Confirm `{"code":1,"msg":"发布成功"}`, then compare `/admin/blog`, the PostgreSQL row and `/blog/{slug}`.
5. Retry the identical payload and confirm the database count does not increase.
