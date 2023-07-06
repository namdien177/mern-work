import { sampleUsers } from '../../mock/users';
import { Request, Response, Router } from 'express';
import getUserCollection from '@mw/mongodb/collection/user.collection';

const router = Router();

router.get('/user', async (req: Request, res: Response) => {
  try {
    const userCollection = await getUserCollection();
    // reset the collection
    await userCollection.drop();
    // re-insert
    const result = await userCollection.insertMany([...sampleUsers]);

    return res.send({
      message: 'reset collection user',
      data: result.insertedIds,
    });
  } catch (e) {
    return res.status(500).json({
      message: 'database error',
      meta: e,
    });
  }
});

export default router;
