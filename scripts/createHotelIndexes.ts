import { getDb } from '../src/services/db';

async function createIndexes() {
  const db = await getDb();
  await db.collection('hotels').createIndex({ city: 1 });
  await db.collection('hotels').createIndex({ star: 1 });
  console.log('Indexes on city and star created');
}

createIndexes().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
