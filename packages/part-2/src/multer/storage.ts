import multer from 'multer';
import { Request } from 'express';
import { fileExtension } from '../const/mime';
import { getUserStorage } from '../const/upload/user-file';

const directoryByObjectId = (request: Request) => {
  // normally, we will authorize the user and have the 'user' property
  // included in the Request. However, since implementing it will be complicated
  // and time-consuming, we will take the user_id directly from query (URL) instead.
  // This function is just the abstract way we can customize the directory path based
  // on the request.

  const searchQuery = request.query as Record<string, string>;
  // consider we already validate the params here.
  return getUserStorage(searchQuery['_id']);
};

const multerDiskStorage = (strategy?: {
  directory?: (request: Request, file: Express.Multer.File) => string;
  filePrefix?: (request: Request, file: Express.Multer.File) => string;
}) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const directoryFn = strategy?.directory ?? directoryByObjectId;
      const uniqueFolderPath = directoryFn(req, file);
      return cb(null, uniqueFolderPath);
    },
    filename: function (req, file, cb) {
      const prefixFn =
        strategy?.filePrefix ??
        (() => Date.now() + '-' + Math.round(Math.random() * 1e9));
      return cb(
        null,
        `${prefixFn(req, file)}-${file.fieldname}${fileExtension(
          file.mimetype,
          true
        )}`
      );
    },
  });
};

export default multerDiskStorage;
