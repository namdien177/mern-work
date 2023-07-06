import { z } from 'zod';
import { isEmptyObject } from '@mw/fn';
import { USER_STATUS } from '@mw/data-model';
import { objectIdSchema } from './core';

export const searchQueryUserSchema = z
  .object({
    query: z.string().trim().min(1).optional(),
    // better use ORM with mapping keys for better typing
    find_by: z.enum(['age', '_id', 'status', 'email', 'name']).optional(),
    // can move to enum and use z.nativeEnum.
    find_option: z.enum(['eq', 'lt', 'lte', 'gt', 'gte', 'like']).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.find_by === 'age' && value.query?.trim()) {
      const validQuery = z.coerce
        .number()
        .min(0)
        .max(200)
        .safeParse(value.query.trim());
      if (!validQuery.success) {
        validQuery.error.issues.forEach((is) =>
          ctx.addIssue({
            ...is,
            message: 'Query is invalid when finding by age',
          })
        );
      }
    }

    const numericComparison = ['lt', 'lte', 'gt', 'gte'];
    const isNumericCompare = numericComparison.includes(
      value.find_option ?? 'eq'
    );
    if (value.find_by !== 'age' && isNumericCompare) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'findBy must be age when using numeric comparison',
      });
    }

    if (
      value.find_by === '_id' &&
      value.find_option &&
      !['eq', 'like'].includes(value.find_option)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Comparison with _id must use either `eq` or `like`',
      });
    }

    if (
      value.query &&
      (value.find_by === undefined || value.find_by === '_id')
    ) {
      const validQuery = objectIdSchema.safeParse(value.query);
      if (!validQuery.success) {
        validQuery.error.issues.forEach((is) => ctx.addIssue(is));
      }
    }
  });

export const objectWithIdSchema = z.object({ _id: objectIdSchema });

export const userStatusSchema = z.object({
  status: z.nativeEnum(USER_STATUS),
});

export const userPatchPayloadSchema = z
  .object({
    email: z.string().email().optional(),
    first_name: z.string().min(1).max(64).optional(),
    last_name: z.string().min(1).max(64).optional(),
    age: z.coerce.number().min(1).max(150).optional(),
  })
  .superRefine((value, ctx) => {
    if (isEmptyObject(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'There must be at least 1 patch property',
      });
    }
  });
