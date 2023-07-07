import { Request, Response, Router } from 'express';
import getScheduleCollection from '@mw/mongodb/collection/schedule.collection';
import Zodify from '@mw/zod-validator/schema/express/zodify';
import { z } from 'zod';
import { ObjectId } from 'mongodb';
import {
  refineScheduleDate,
  scheduleBaseSchema,
} from '@mw/zod-validator/schema/schedule.validation';
import { objectWithIdSchema } from '@mw/zod-node';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const scheduleCollection = await getScheduleCollection();

  // TODO pagination
  const data = await scheduleCollection.find().toArray();

  return res.json({
    data,
  });
});

router.post(
  '',
  Zodify({
    schema: scheduleBaseSchema.superRefine(refineScheduleDate),
    mapper: (r) => r.body,
  }),
  async (req: Request, res: Response) => {
    const body = req.body as z.infer<typeof scheduleBaseSchema>;

    const collection = await getScheduleCollection();
    const data = await collection.insertOne(body);
    const afterInsert = collection.findOne({
      _id: data.insertedId,
    });

    return res.json({ data: afterInsert });
  }
);

router.get(
  '/:_id',
  Zodify({
    schema: objectWithIdSchema,
    mapper: (r) => r.params,
  }),
  async (req: Request, res: Response) => {
    const { _id } = req.params as z.infer<typeof objectWithIdSchema>;
    const collection = await getScheduleCollection();
    const data = await collection.findOne({
      _id: new ObjectId(_id),
    });

    if (!data) {
      return res.status(404).json({ message: 'not found' });
    }

    return res.json({ data });
  }
);

router.patch(
  '/:_id',
  Zodify({
    schema: objectWithIdSchema,
    mapper: (r) => r.params,
  }),
  Zodify({
    schema: scheduleBaseSchema.superRefine(refineScheduleDate),
    mapper: (r) => r.body,
  }),
  async (req: Request, res: Response) => {
    const { _id } = req.params as z.infer<typeof objectWithIdSchema>;
    const body = req.body as z.infer<typeof scheduleBaseSchema>;
    console.log(body);
    const collection = await getScheduleCollection();
    const data = await collection.updateOne(
      {
        _id: new ObjectId(_id),
      },
      {
        $set: body,
      }
    );

    if (!data || data.modifiedCount === 0) {
      return res.status(404).json({ message: 'not found' });
    }

    return res.json({ data });
  }
);

router.delete(
  '/:_id',
  Zodify({
    schema: objectWithIdSchema,
    mapper: (r) => r.params,
  }),
  async (req: Request, res: Response) => {
    const { _id } = req.params as z.infer<typeof objectWithIdSchema>;
    const collection = await getScheduleCollection();
    const data = await collection.deleteOne({
      _id: new ObjectId(_id),
    });

    if (data.deletedCount === 0) {
      return res.status(404).json({ message: 'not found' });
    }

    return res.json({ data: true, meta: data });
  }
);

export default router;
