import { z } from 'zod';
import * as path from 'path';
import { readFile } from '../../service/file-reading';
import { parseAsCSV } from '../../service/csv-reader';
import { UserModel } from '@mw/data-model';
import { userModelSchema } from '@mw/zod-validator/schema/user.validation';
import getUserCollection from '@mw/mongodb/collection/user.collection';
import fs from 'fs';
import http from 'http';
import { useSearchParam } from '../../helper/searchParams';
import { RouteType } from '../../helper/route';

/**
 * Mocking position
 */
const PATH_READING = path.join(process.cwd(), '.sample');

if (!fs.existsSync(PATH_READING)) {
  fs.mkdirSync(PATH_READING, { recursive: true });
}

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

const readCsvRoute = async ({
  file_name,
  read_mode,
  batch = 500,
}: z.infer<typeof fileNameQuerySchema>) => {
  const fullPath = path.join(PATH_READING, file_name);

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
        if (fieldName && value !== '') {
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

  if (batchingUsers.length > 0) {
    await bulkInsert(batchingUsers);
  }

  return {
    message: 'read complete',
    data: {
      rows: parsedRows,
      failed: invalidRecord,
    },
  };
};

const route: RouteType = {
  csv: {
    get: async (req: http.IncomingMessage, res: http.ServerResponse) => {
      const queryParams = useSearchParam(req);
      const parsing = fileNameQuerySchema.safeParse(queryParams);
      if (!parsing.success) {
        res.statusCode = 400;
        return res.end(
          JSON.stringify({
            message: 'invalid parameters',
            meta: parsing.error.issues,
          })
        );
      }

      try {
        const result = await readCsvRoute(parsing.data);
        res.statusCode = 200;
        return res.end(JSON.stringify(result, null, 2));
      } catch (e) {
        res.statusCode = 500;
        console.log(e);
        res.end(JSON.stringify({ meta: e }, null, 2));
      }
    },
  },
};

export default route;
