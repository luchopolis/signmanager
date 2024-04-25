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
  const tabletT = tables.map(e => `'${e}'`).join(',');
  const multiQuery = `DO $$
  DECLARE
    table_name TEXT;
    table_names TEXT[] := ARRAY[
      ${tabletT}
    ];
  BEGIN
    FOREACH table_name IN ARRAY table_names
    LOOP
        EXECUTE format('TRUNCATE TABLE %I CASCADE', table_name);
        EXECUTE format('SELECT setval(pg_get_serial_sequence(%L, ''id''), COALESCE((SELECT MAX(id) FROM %I) + 1, 1), false)', table_name, table_name);
    END LOOP;
  END $$`;

  queryToExecute = multiQuery;

  return queryToExecute;
};
