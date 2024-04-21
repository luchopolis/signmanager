import { SignManager } from './manager';

export const signManagerUtility = SignManager;

const clientSign = new signManagerUtility(
  'postgresql://root:root1@localhost:5432/ForwolDev?sslmode=no-verify'
);

async function test(): Promise<void> {
  const data = await clientSign.loadTables({ schema: 'public' });
  console.log(data);
}

void test();
