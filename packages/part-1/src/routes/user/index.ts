import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { getFilterCondition, parserValue } from './_helper/search-user.helper';
import { ObjectId } from 'mongodb';
import {
  objectIdSchema,
  searchQueryUserSchema,
  userPatchPayloadSchema,
  userStatusSchema,
} from '@mw/zod-validator/schema/user-api.validation';
import getUserCollection from '@mw/mongodb/collection/user.collection';
import Zodify from '@mw/zod-validator/schema/express/zodify';

const router = Router();

/**
 * TODO: do the pagination using timestamp.
 * - recordAfter: datetime -> created_at of the record
 * - size: amount of record.
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

router.patch(
  '/:_id',
  Zodify({
    schema: objectIdSchema,
    mapper: (r) => r.params,
  }),
  Zodify({
    schema: userPatchPayloadSchema,
    mapper: (r) => r.body,
  }),
  async (req: Request, res: Response) => {
    const body = req.body as z.infer<typeof userPatchPayloadSchema>;
    const { _id } = req.query as z.infer<typeof objectIdSchema>;
    const filterIdCondition = {
      _id: new ObjectId(_id),
    };

    const userCollection = await getUserCollection();
    // we can choose to skip checking 404
    const user = userCollection.findOne(filterIdCondition);
    if (!user) {
      return res.status(404).json({
        message: 'user not exist',
      });
    }

    const updateResult = await userCollection.updateOne(
      filterIdCondition,
      body
    );
    const newData = await userCollection.findOne(filterIdCondition);

    return res.json({
      message: 'Success',
      data: newData,
      meta: updateResult,
    });
  }
);

router.delete(
  '/delete-by-status',
  Zodify({
    schema: userStatusSchema,
    mapper: (r) => r.query,
  }),
  async (req: Request, res: Response) => {
    const { status } = req.query as z.infer<typeof userStatusSchema>;
    const userCollection = await getUserCollection();
    const statusFilter = {
      status,
    };
    const result = await userCollection.deleteMany(statusFilter);
    return res.json({
      message: 'Delete success',
      meta: result,
    });
  }
);

export default router;
