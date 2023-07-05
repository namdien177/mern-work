import { Collection, Db, Document } from 'mongodb';

export const getCollection = async (db: Db, name: string) => {
  let collection: Collection<Document>;
  try {
    collection = await db.createCollection(name);
  } catch (e) {
    if ((e as Record<string, unknown>).code !== 48) {
      throw new Error('Something wrong with the collection');
    }
    collection = await db.collection(name);
  }

  return collection;
};
