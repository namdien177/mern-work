import { ObjectId } from 'mongodb';
import path from 'path';
import { DEFAULT_STORAGE_SPACES } from './const';
import fs from 'fs';

export const getUserStorage = (id: string | ObjectId) => {
  const _id = id.toString();
  const folder = path.join(DEFAULT_STORAGE_SPACES, `user-${_id}`);

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  return folder;
};
