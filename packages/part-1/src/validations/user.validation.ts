import { z } from 'zod';

export const searchQueryUserSchema = z
  .object({
    query: z.string().trim().min(1).optional(),
    // better use ORM with mapping keys for better typing
    findBy: z.enum(['age', '_id', 'status', 'email', 'name']).optional(),
    // can move to enum and use z.nativeEnum.
    findOption: z.enum(['eq', 'lt', 'lte', 'gt', 'gte', 'like']).optional(),
  })
  .refine((value) => {
    if (value.findBy === 'age' && value.query?.trim()) {
      const validQuery = z.coerce
        .number()
        .min(0)
        .max(200)
        .safeParse(value.query.trim());
      return validQuery.success;
    }
    return true;
  }, 'query must be number when findBy is [age]');
