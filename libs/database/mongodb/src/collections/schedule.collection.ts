import useMongo from '../index';
import { Collection, Document } from 'mongodb';
import { getCollection } from '../_core/_helper';

const { db } = useMongo();

let _collection: Collection<Document>;

/**
 * Retrieve the user collection in the database;
 */
const getScheduleCollection = async () => {
  if (!_collection) {
    _collection = await getCollection(db, 'schedules');
  }

  return _collection;
};

export default getScheduleCollection;
