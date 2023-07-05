import useMongo from '../index';
import { Collection, Document } from 'mongodb';
import { getCollection } from '../_helper';

const { db } = useMongo();

let _userCollection: Collection<Document>;

const getUserCollection = async () => {
  if (!_userCollection) {
    _userCollection = await getCollection(db, 'users');
  }

  return _userCollection;
};

export default getUserCollection;
