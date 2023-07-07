import { Request, Response, Router } from 'express';
import { z } from 'zod';
import Zodify from '@mw/zod-validator/schema/express/zodify';
import getBlogCollection from '@mw/mongodb/collection/blog.collection';
import { BlogModel } from '@mw/data-model';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

const router = Router();

const refreshQuerySchema = z.object({
  amount: z.coerce.number().min(1).max(100),
});

router.get(
  '/refresh',
  Zodify({
    schema: refreshQuerySchema,
    mapper: (r) => r.query,
  }),
  async (req: Request, res: Response) => {
    const { amount } = req.query as unknown as z.infer<
      typeof refreshQuerySchema
    >;
    const blogCollection = await getBlogCollection();
    await blogCollection.drop();
    const value: (Omit<BlogModel, '_id' | 'created_at'> & {
      created_at: Date;
    })[] = [];
    for (let i = 0; i < amount; i++) {
      value.push({
        title: faker.word.words({ count: 15 }),
        content: faker.lorem.words(50),
        created_at: faker.date.recent(),
      });
    }
    const result = await blogCollection.insertMany(value);
    return res.json({ data: result });
  }
);

const searchParamSchema = z.object({
  query: z.string().trim().min(2).max(100).optional(),
  size: z.coerce.number().min(1).max(50).optional(),
  after: z
    .string()
    .trim()
    .optional()
    .refine((value) => {
      if (!value) {
        return true;
      }

      return dayjs(value).isValid();
    }, 'Invalid format date, should be ISO date'),
});

router.get(
  '',
  Zodify({
    schema: searchParamSchema,
    mapper: (r) => r.query,
  }),
  async (req: Request, res: Response) => {
    const {
      query,
      after,
      size = 10,
    } = req.query as unknown as z.infer<typeof searchParamSchema>;

    const blogCollection = await getBlogCollection();
    const find: Record<string, unknown> = {};
    if (query) {
      find.title = {
        $regex: new RegExp(query, 'g'),
      };
    }
    if (after) {
      find.created_at = {
        $gt: dayjs(after).toDate(),
      };
    }
    const result = await blogCollection
      .find(find ?? {})
      .limit(size)
      .sort('created_at', 'desc')
      .toArray();

    return res.json({
      data: result,
    });
  }
);

export default router;
