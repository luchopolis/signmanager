import { PoolClient, QueryResult } from 'pg';
import { poolConnection } from './connector/db';

const initDb = async (connectionString: string) => {
  return await poolConnection(connectionString);
};

export class SignDbManager {
  private dbConnection: PoolClient | null = null;

  constructor(private dbManager: PoolClient) {
    this.dbConnection = dbManager;
  }

  async loadTables(params: {
    schema: string;
  }): Promise<QueryResult<{ table_name: string }[]>> {
    if (!this.dbConnection) {
      throw new Error('Error Connection Instance');
    }
    const { schema } = params;
    const data = await this.dbConnection.query<{ table_name: string }[]>(
      `SELECT * FROM ${schema}`
    );
    return data;
  }
}

export const SignManager = async (
  connectionString: string
): Promise<SignDbManager> => {
  const clientPool = await initDb(connectionString);

  const managerInstance = new SignDbManager(clientPool);
  return managerInstance;
};
