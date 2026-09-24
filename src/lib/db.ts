import { Pool, QueryResult, QueryResultRow } from 'pg';

/**
 * PostgreSQL Connection Pool for CAG Database
 * Target: 15.252.41.241:5432 / cag_new
 * Schema: cag_revamp, public
 */

const DB_HOST = process.env.DB_HOST || '15.252.41.241';
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
const DB_NAME = process.env.DB_NAME || 'cag_new';
const DB_USER = process.env.DB_USER || 'kreethi';
const DB_PASSWORD = process.env.DB_PASSWORD || 'kreethi@123';
const DB_SCHEMA = process.env.DB_SCHEMA || 'cag_revamp';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000,
    });

    pool.on('error', (err) => {
      console.error('[PostgreSQL Pool Error]', err.message);
    });
  }
  return pool;
}

/**
 * Helper to execute a query with schema search_path set
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const p = getDbPool();
  const client = await p.connect();
  try {
    await client.query(`SET search_path TO "${DB_SCHEMA}", public;`);
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
}

/**
 * Test DB connectivity
 */
export async function checkDbHealth(): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await query('SELECT 1 AS alive;');
    return { ok: Boolean(res.rows[0]?.alive) };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}
