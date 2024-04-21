import pg, { Pool, PoolClient } from 'pg';

export async function poolConnection(
  connectionString: string
): Promise<PoolClient> {
  const pool: pg.Pool = new Pool({
    connectionString,
  });

  const client = await pool.connect();

  client.on('error', (err: Error) => {
    console.log('Error database connection - SIGN Db Manager');
    console.error(err);
  });

  return client;
}
