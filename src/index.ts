import { SignDbManager, SignManager } from './manager';

export const signManagerUtility = (
  connectionString: string
): Promise<SignDbManager> => {
  return SignManager(connectionString);
};
