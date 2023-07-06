import useMongo from '../index';
import { Collection, Document } from 'mongodb';
import { getCollection } from '../_core/_helper';

const { db } = useMongo();

let _userCollection: Collection<Document>;

/**
 * Retrieve the user collection in the database;
 */
const getUserCollection = async () => {
  if (!_userCollection) {
    _userCollection = await getCollection(db, 'users');
  }

  return _userCollection;
};

export default getUserCollection;
