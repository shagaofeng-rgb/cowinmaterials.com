import type { Pool } from "pg";

type LockState = { active: boolean };

const globalState = globalThis as typeof globalThis & { __cowinSitemapLock?: LockState };

export class SitemapLockError extends Error {
  constructor() {
    super("A sitemap maintenance task is already running.");
    this.name = "SitemapLockError";
  }
}

export async function withSitemapLock<T>(task: () => Promise<T>, pool: Pool | null = null): Promise<T> {
  if (pool) {
    const client = await pool.connect();
    try {
      const lock = await client.query<{ locked: boolean }>("select pg_try_advisory_lock(20260710) as locked");
      if (!lock.rows[0]?.locked) throw new SitemapLockError();
      try {
        return await task();
      } finally {
        await client.query("select pg_advisory_unlock(20260710)");
      }
    } finally {
      client.release();
    }
  }

  const state = globalState.__cowinSitemapLock || { active: false };
  globalState.__cowinSitemapLock = state;
  if (state.active) throw new SitemapLockError();
  state.active = true;
  try {
    return await task();
  } finally {
    state.active = false;
  }
}
