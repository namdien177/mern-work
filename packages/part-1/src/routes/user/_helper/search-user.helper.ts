import { z } from 'zod';
import { Filter, ObjectId } from 'mongodb';
import { searchQueryUserSchema } from '@mw/zod-validator/schema/user-api.validation';

export const parserValue = (
  defaultValue: string,
  findBy: z.infer<typeof searchQueryUserSchema>['find_by'] = '_id'
) => {
  switch (findBy) {
    case '_id':
      return new ObjectId(defaultValue);
    case 'age':
      return Number(defaultValue);
  }

  return defaultValue;
};

export const getFilterCondition = (
  searchValue: string | number | ObjectId,
  findBy: z.infer<typeof searchQueryUserSchema>['find_by'] = '_id',
  findOption: z.infer<typeof searchQueryUserSchema>['find_option'] = 'eq'
) => {
  let filterObj: Filter<Document>;
  let fieldCompute: string | Filter<Document>;

  switch (findBy) {
    case 'name':
      fieldCompute = { $concat: ['$first_name', ' ', '$last_name'] };
      break;
    default:
      fieldCompute = `$${findBy}`;
  }

  switch (findOption) {
    case 'like':
      filterObj = {
        $expr: {
          $regexMatch: {
            input: fieldCompute,
            regex: searchValue,
            options: 'g',
          },
        },
      };
      break;
    case 'eq':
      filterObj = {
        $expr: { $eq: [fieldCompute, searchValue] },
      };
      break;
    default:
      filterObj = {
        $expr: { [`$${findOption}}`]: [fieldCompute, searchValue] },
      };
  }

  return filterObj;
};
