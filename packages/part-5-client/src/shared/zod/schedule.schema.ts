import { z } from 'zod';

export const ScheduleBaseSchema = z
  .object({
    name: z.string().min(2).max(100),
    from_date: z.date().min(new Date()),
    to_date: z.date().min(new Date()).optional(),
  })
  .superRefine(({ to_date, from_date }, ctx) => {
    if (to_date) {
      if (to_date.getTime() - from_date.getTime() <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          path: ['to_date'],
          message: 'The finishing date cannot before the start date',
        });
      }
    }
  });
