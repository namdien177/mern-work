import useMongo from '../index';
import { Collection, Document } from 'mongodb';
import { getCollection } from '../_core/_helper';

const { db } = useMongo();

let _collection: Collection<Document>;

/**
 * Retrieve the blog collection in the database;
 */
const getBlogCollection = async () => {
  if (!_collection) {
    _collection = await getCollection(db, 'blogs');
  }

  return _collection;
};

export default getBlogCollection;
