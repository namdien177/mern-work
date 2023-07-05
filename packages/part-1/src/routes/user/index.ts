import { Request, Response, Router } from 'express';
import { z } from 'zod';
import getUserCollection from '../../database/collections/user.collection';
import { ObjectId } from 'mongodb';
import { searchQueryUserSchema } from '../../validations/user.validation';
import Zodify from '../../middleware/zodify';

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
    const { query, findBy, findOption } = req.query as z.infer<
      typeof searchQueryUserSchema
    >;

    let findCondition: Record<string, unknown> = {};
    if (query?.trim()) {
      const fieldFind = findBy ?? '_id';
      const findType = findOption ?? 'eq';
      const numericComparison = ['lt', 'lte', 'gt', 'gte'];
      const isNumericCompare = numericComparison.includes(findType);
      const searchValue = parserValue(query.trim(), fieldFind);

      // Can extract this logic to separate fn for better clarity.
      findCondition = {
        [fieldFind]: isNumericCompare
          ? {
              [`$${findType}`]: searchValue,
            }
          : findType === 'eq'
          ? searchValue
          : {
              $regex: new RegExp(String(searchValue), 'g'),
            },
      };
    }
    const userCollection = await getUserCollection();
    const result = await userCollection.find(findCondition).toArray();

    return res.json({
      data: result,
    });
  }
);

const parserValue = (
  defaultValue: string,
  findBy: z.infer<typeof searchQueryUserSchema>['findBy']
) => {
  switch (findBy) {
    case '_id':
      return new ObjectId(defaultValue);
    case 'age':
      return Number(defaultValue);
  }

  return defaultValue;
};

export default router;
