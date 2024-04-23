export const findElement = (text: string, data: string[]): number => {
  return data.findIndex(element => element.includes(text));
};

export const keysFromTablesObject = (
  keyToSearch: string,
  mainObject: Record<string, string[]>
): string | undefined => {
  return Object.keys(mainObject).find(
    key => key === keyToSearch || keyToSearch.includes(`${key}__`)
  );
};

export const makeQueryBuilder = (tables: string[]): string => {
  let queryToExecute = '';
  for (const table of tables) {
    const query = `
      truncate table ${table} CASCADE;
      SELECT setval(pg_get_serial_sequence('${table}', 'id')
                , COALESCE(max(id) + 1, 1)
                  , false)
      FROM   ${table};
    `;
    queryToExecute += query;
  }

  return queryToExecute;
};
