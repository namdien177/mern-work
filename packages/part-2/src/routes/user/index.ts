import { Request, Response, Router } from 'express';
import Zodify from '@mw/zod-validator/schema/express/zodify';
import { searchQueryUserSchema } from '@mw/zod-validator/schema/user-api.validation';
import { z } from 'zod';
import {
  getFilterCondition,
  parserValue,
} from '@mw/mongodb/helpers/search-user.helper';
import getUserCollection from '@mw/mongodb/collection/user.collection';
import multer from 'multer';
import multerDiskStorage from '../../multer/storage';
import { multerAvatarLimit } from '../../multer/limit';
import { multerAvatarFilter } from '../../multer/filter';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { getUserStorage } from '../../const/upload/user-file';
import { objectWithIdSchema } from '@mw/zod-node';

const router = Router();
const avatarUpload = multer({
  storage: multerDiskStorage(),
  limits: multerAvatarLimit,
  fileFilter: multerAvatarFilter,
});

/**
 * Basically it's the implementation from the
 * part-1 code. That part-1 code has all the required implementations.
 */
router.get(
  '',
  Zodify({
    schema: searchQueryUserSchema,
    mapper: (r) => r.query,
    onError: (error, res) =>
      res.status(400).json({
        message: 'invalid search condition',
        meta: error.errors,
      }),
  }),
  async (req: Request, res: Response) => {
    const { query, find_by, find_option } = req.query as z.infer<
      typeof searchQueryUserSchema
    >;

    let findCondition: Record<string, unknown> = {};
    if (query?.trim()) {
      // pre-process the search value
      const searchValue = parserValue(query.trim(), find_by);
      // Can extract this logic to separate fn for better clarity.
      findCondition = getFilterCondition(searchValue, find_by, find_option);
    }
    const userCollection = await getUserCollection();
    console.log(JSON.stringify(findCondition, null, 2));
    const result = await userCollection.find(findCondition).toArray();

    return res.json({
      data: result,
    });
  }
);

/**
 * In reality, we must authenticate the user with auth-guard
 * If that's the case, we can consider the provided _id always exist in the system.
 */
router.post(
  '/update/avatar',
  Zodify({
    schema: objectWithIdSchema,
    mapper: (r) => r.query,
  }),
  (req: Request, res: Response) => {
    avatarUpload.single('avatar')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      const fileName = req.file!.filename;
      const { _id } = req.query as z.infer<typeof objectWithIdSchema>;
      const userCollection = await getUserCollection();
      const updateResult = await userCollection.findOneAndUpdate(
        {
          _id: new ObjectId(_id),
        },
        {
          $set: {
            avatar: fileName,
          },
        }
      );

      if (updateResult.value?.avatar) {
        // remove the old image
        fs.rmSync(path.join(getUserStorage(_id), updateResult.value.avatar));
      }

      console.log('Storing file:', req.file!.filename);

      res.json({
        data: {
          ...(updateResult.value ?? {}),
          avatar: fileName,
        },
      });
    });
  }
);

router.get(
  '/:_id/avatar',
  Zodify({
    schema: z.object({ f: z.string().min(5).max(50) }),
    mapper: (r) => r.query,
  }),
  Zodify({
    schema: objectWithIdSchema,
    mapper: (r) => r.params,
  }),
  async (req: Request, res: Response) => {
    const { f: avatar } = req.query as { f: string };
    const { _id } = req.params as z.infer<typeof objectWithIdSchema>;
    // ideally we can cache the user info, or set the caching policy of the API
    const avatarPath = path.join(getUserStorage(_id), avatar);
    if (!fs.existsSync(avatarPath)) {
      return res.status(404).json({ message: 'No resource found' });
    }
    res.set('Cache-Control', 'private, max-age=900');
    return res.sendfile(avatarPath);
  }
);

export default router;
