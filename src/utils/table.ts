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
