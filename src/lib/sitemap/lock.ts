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
      // A transaction pins the lock to one PostgreSQL connection even through a pooler.
      await client.query("begin");
      const lock = await client.query<{ locked: boolean }>("select pg_try_advisory_xact_lock(20260710) as locked");
      if (!lock.rows[0]?.locked) throw new SitemapLockError();
      return await task();
    } finally {
      const rolledBack = await client.query("rollback").then(() => true, () => false);
      client.release(!rolledBack);
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
