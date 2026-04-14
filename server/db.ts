import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    // Standardize to use either MYSQL_DATABASE_URL (for backwards compat) or DATABASE_URL
    const databaseUrl = process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString: databaseUrl,
      max: 10,
    });
  }

  return pool;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const pool = getDbPool();
  const result = await pool.query(sql, params);
  return result.rows as T[];
}
