import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    const databaseUrl = process.env.MYSQL_DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('MYSQL_DATABASE_URL environment variable is not set');
    }

    pool = mysql.createPool({
      uri: databaseUrl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }

  return pool;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const pool = getDbPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}
