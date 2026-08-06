# Blog Webhook Integration

## Plugin configuration

| Plugin field | Value |
|---|---|
| Website framework | Custom development framework / Webhook |
| Domain or request URL | `https://www.cowinmaterials.com/api/webhook/send_article` |
| API_KEY | Use the value in the protected local key file listed below |
| Backend login account | `admin` |
| Note | `Cowin Materials Blog publishing` |
| Verification class ID | `blog` |

The generated API key is stored locally at:

`/Users/apple/Documents/材料/site-audit-backups/2026-08-06-pre-blog-webhook/BLOG_WEBHOOK_SIGN.txt`

The file is permission-restricted and the same value is stored as the encrypted Vercel environment variable `BLOG_WEBHOOK_SIGN`. Do not send it by email, commit it to Git, or include it in screenshots.

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

The server filters unsafe HTML, scripts, event handlers and unsupported URL schemes before publication. Repeating an identical request is idempotent and updates the same Blob object instead of creating duplicates.

## Response

The plugin-compatible response always contains `code` and `msg`:

```json
{"code":1,"msg":"发布成功"}
```

```json
{"code":0,"msg":"发布失败：具体原因"}
```

Published articles appear at `/blog` and `/blog/{slug}` and are added to the Blog sitemap. Publishing logs use the structured event name `blog_webhook_publish` in Vercel runtime logs.
