import { Request, Response, Router } from 'express';
import { z } from 'zod';
import Zodify from '@mw/zod-validator/schema/express/zodify';
import * as path from 'path';
import { readFile } from '../../service/file-reading';
import { parseAsCSV } from '../../service/csv-reader';
import { UserModel } from '@mw/data-model';
import { userModelSchema } from '@mw/zod-validator/schema/user.validation';
import getUserCollection from '@mw/mongodb/collection/user.collection';

const route = Router();

const fileNameQuerySchema = z.object({
  read_mode: z.enum(['stream', 'normal']).optional(),
  batch: z.coerce.number().min(1).max(1000).optional(),
  file_name: z
    .string()
    .min(1)
    .refine((value) => {
      const fileParts = value.split('.');
      return !(fileParts.length === 1 || fileParts.at(-1) !== 'csv');
    }, 'filename must include .csv extension'),
});

/**
 * Mocking position
 */
const PATH_READING = path.join(process.cwd(), '.sample');

route.get(
  '/read',
  Zodify({
    schema: fileNameQuerySchema,
    mapper: (r) => r.query,
  }),
  async (req: Request, res: Response) => {
    const {
      file_name,
      read_mode,
      batch = 500,
    } = req.query as unknown as z.infer<typeof fileNameQuerySchema>;
    const fullPath = path.join(PATH_READING, file_name);

    try {
      const agreedOrdering: Array<Exclude<keyof UserModel, '_id'>> = [
        'first_name',
        'last_name',
        'email',
        'status',
        'age',
        'avatar',
      ];
      let batchingUsers: Array<Omit<UserModel, '_id'>> = [];
      let invalidRecord = 0;
      let parsedRows = 0;
      const userCollection = await getUserCollection();
      const bulkInsert = (records: Array<Omit<UserModel, '_id'>>) => {
        return userCollection.insertMany(records);
      };

      await readFile(fullPath, {
        perLineFn: async (row) => {
          parsedRows++;
          const user: Record<string, unknown> = {};
          parseAsCSV((value, index) => {
            const fieldName = agreedOrdering.at(index);
            if (fieldName) {
              user[fieldName] = value;
            }
          })(row);

          const validate = userModelSchema.safeParse(user);
          if (!validate.success) {
            invalidRecord++;
            // we can do more here.
            return;
          }
          batchingUsers.push(validate.data);

          if (batchingUsers.length >= batch) {
            await bulkInsert(batchingUsers);
            // release batch
            batchingUsers = [];
          }
        },
        readType: read_mode,
      });

      return res.json({
        message: 'read complete',
        data: {
          rows: parsedRows,
          failed: invalidRecord,
        },
      });
    } catch (e) {
      return res.status(500).json({
        message: 'unable to read',
        meta: e,
      });
    }
  }
);

export default route;
