import { Request, Response, Router } from 'express';
import Zodify from '@mw/zod-validator/schema/express/zodify';
import { searchQueryUserSchema } from '@mw/zod-validator/schema/user-api.validation';
import { z } from 'zod';
import {
  getFilterCondition,
  parserValue,
} from '@mw/mongodb/helpers/search-user.helper';
import getUserCollection from '@mw/mongodb/collection/user.collection';

const router = Router();

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

export default router;
