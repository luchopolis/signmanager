import { PoolClient, QueryResult } from 'pg';
import { poolConnection } from './connector/db';

export class SignManager {
  private dbConnection: PoolClient | null = null;

  constructor(dbConnectionString: string) {
    void this._initDb(dbConnectionString);
  }

  async _initDb(connectionString: string): Promise<void> {
    this.dbConnection = await poolConnection(connectionString);
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
