import { z } from 'zod';
import { userModelSchema } from '@mw/zod-validator/schema/user.validation';
import getUserCollection from '@mw/mongodb/collection/user.collection';
import { objectWithIdSchema } from '@mw/zod-validator/schema/user-api.validation';
import { ObjectId } from 'mongodb';
import { RouteType } from '../../helper/route';
import { useSearchParam } from '../../helper/searchParams';

const createUserHandler = async (body: z.infer<typeof userModelSchema>) => {
  const userCollection = await getUserCollection();
  const duplicateEmail = await userCollection.findOne({
    email: body.email,
  });
  if (duplicateEmail) {
    return {
      status: 400,
      message: 'Email already exist',
      data: {
        duplicate: {
          email: body.email,
        },
      },
    };
  }

  const result = await userCollection.insertOne(body);
  return { message: 'success', data: result, status: 200 };
};

const deleteUserHandler = async (_id: string) => {
  const userCollection = await getUserCollection();
  const result = await userCollection.deleteOne({ _id: new ObjectId(_id) });
  return {
    message: 'delete success',
    data: result,
  };
};

const rou: RouteType = {
  user: {
    post: async (req, res) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body);
          const validate = userModelSchema.safeParse(parsed);

          if (!validate.success) {
            res.statusCode = 400;
            return res.end(
              JSON.stringify(
                {
                  message: 'invalid payload',
                  meta: validate.error.issues,
                },
                null,
                2
              )
            );
          }
          const { status, ...data } = await createUserHandler(validate.data);
          res.statusCode = status;
          return res.end(JSON.stringify(data, null, 2));
        } catch (e) {
          res.statusCode = 500;
          return res.end(JSON.stringify(e, null, 2));
        }
      });
    },
    delete: async (req, res) => {
      const rawSearchParam = useSearchParam(req);
      const validate = objectWithIdSchema.safeParse(rawSearchParam);

      if (!validate.success) {
        res.statusCode = 400;
        return res.end(
          JSON.stringify({
            message: 'invalid params',
            meta: validate.error.issues,
          })
        );
      }

      const result = await deleteUserHandler(validate.data._id);
      res.statusCode = 200;
      return res.end(JSON.stringify(result));
    },
  },
};

export default rou;
