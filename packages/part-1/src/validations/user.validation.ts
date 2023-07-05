import { z } from 'zod';

export const searchQueryUserSchema = z
  .object({
    query: z.string().trim().min(1).optional(),
    // better use ORM with mapping keys for better typing
    findBy: z.enum(['age', '_id', 'status', 'email', 'name']).optional(),
    // can move to enum and use z.nativeEnum.
    findOption: z.enum(['eq', 'lt', 'lte', 'gt', 'gte', 'like']).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.findBy === 'age' && value.query?.trim()) {
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
      value.findOption ?? 'eq'
    );
    if (value.findBy !== 'age' && isNumericCompare) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'findBy must be age when using numeric comparison',
      });
    }
  });
