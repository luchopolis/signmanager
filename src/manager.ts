import { PoolClient, QueryResult } from 'pg';
import { poolConnection } from './connector/db';
import { IGroupTablesNode } from './interfaces/main';
import {
  findElement,
  keysFromTablesObject,
  makeQueryBuilder,
} from './utils/table';

const initDb = async (connectionString: string) => {
  return await poolConnection(connectionString);
};

export class SignDbManager {
  private dbConnection: PoolClient | null = null;

  constructor(dbManager: PoolClient) {
    this.dbConnection = dbManager;
  }

  async loadTables(params: {
    schema: string;
    fields: string[];
  }): Promise<QueryResult<{ table_name: string }[]>> {
    if (!this.dbConnection) {
      throw new Error('Error Connection Instance');
    }
    const { schema } = params;
    const fieldsToInclude = params.fields.join(',');
    const data = await this.dbConnection.query<{ table_name: string }[]>(
      `SELECT ${fieldsToInclude} FROM information_schema.tables WHERE table_schema = '${schema}'`
    );
    return data;
  }

  groupTables(tables: { table_name: string }[]): IGroupTablesNode[] {
    const mainObject: Record<string, string[]> = {};
    const dataGroup: IGroupTablesNode[] = [];

    const tableMapped = tables.map(element => element.table_name);

    for (const table of tableMapped) {
      findElement(table, tableMapped);
      const checkParent = keysFromTablesObject(table, mainObject);

      if (!checkParent) {
        mainObject[`${table}`] = [];
      }

      if (checkParent) {
        mainObject[`${checkParent}`].push(table);
      }
    }

    for (const mainData of Object.keys(mainObject)) {
      const elementDataGroup: IGroupTablesNode = {
        table_name: mainData,
        child: mainObject[mainData],
      };
      dataGroup.push(elementDataGroup);
    }
    return dataGroup;
  }

  async resetIncrementQuery(tables: string[]): Promise<void> {
    try {
      await this.dbConnection?.query('BEGIN');
      const queryTableReset = makeQueryBuilder(tables);
      await this.dbConnection?.query(queryTableReset);
      await this.dbConnection?.query('COMMIT');
      console.log('Reset Increment ID Completed');
    } catch (error: any) {
      await this.dbConnection?.query('ROLLBACK');
      console.error('ERROR: ResetIncrementQuery ->', error);
    }
  }
}

export const SignManager = async (
  connectionString: string
): Promise<SignDbManager> => {
  const clientPool = await initDb(connectionString);

  const managerInstance = new SignDbManager(clientPool);
  return managerInstance;
};
