import multer from 'multer';
import { Request } from 'express';
import { MIME_JPEG, MIME_PNG } from '../../const/mime';

export const multerAvatarFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  const isValidMime = [MIME_PNG, MIME_JPEG].includes(file.mimetype);
  if (isValidMime) {
    return callback(null, true);
  }

  return callback(
    new Error(
      `Incorrect file format, received \`${file.mimetype}\`, accepted \`${[
        MIME_PNG,
        MIME_JPEG,
      ].toString()}\``
    )
  );
};
