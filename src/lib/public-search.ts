import "server-only";
import { getPool } from "@/lib/database";

type EditorialMatch = { section: "Blog" | "News"; slug: string; title: string; excerpt: string };

export async function findPublicEditorial(query: string, offset: number, limit: number) {
  if (!query) return { total: 0, items: [] as EditorialMatch[] };
  const pool = getPool();
  if (!pool) throw new Error("Public editorial search is unavailable.");
  const pattern = `%${query.replace(/[\\%_]/g, "\\$&")}%`;
  const { rows: [result] } = await pool.query<{ total: number; items: EditorialMatch[] }>(
    `with matches as (
      select 'Blog' as section, slug, title_en as title, coalesce(excerpt_en, '') as excerpt, published_at
      from articles where class_id in ('blog', '31') and status = 'published' and deleted_at is null
        and published_at <= now() and concat_ws(' ', title_en, excerpt_en) ilike $1
      union all
      select 'News', slug, title, excerpt, published_at
      from news_articles where status = 'published' and deleted_at is null and published_at <= now()
        and cover_image_url <> '' and concat_ws(' ', title, excerpt) ilike $1
    )
    select (select count(*)::int from matches) as total,
      coalesce((select json_agg(m) from (
        select section, slug, title, excerpt from matches order by section, published_at desc, slug
        limit $2 offset $3
      ) m), '[]'::json) as items`,
    [pattern, limit, offset],
  );
  return result;
}
