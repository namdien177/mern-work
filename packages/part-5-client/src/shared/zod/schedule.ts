import {
  refineScheduleDate,
  scheduleBaseSchema,
} from '@mw/zod-validator/schema/schedule.validation';
import { z } from 'zod';

export const clientScheduleBaseSchema = scheduleBaseSchema.extend({
  from_date: z
    .string()
    .min(1)
    .refine((value) => {
      const toDate = new Date(value);
      return toDate instanceof Date && !isNaN(toDate.valueOf());
    }, 'invalid date'),
  to_date: z
    .string()
    .min(0)
    .refine((value) => {
      if (!value) return true;
      const toDate = new Date(value);
      return toDate instanceof Date && !isNaN(toDate.valueOf());
    }, 'invalid date'),
});

export const clientRefineScheduleDate = (
  {
    to_date,
    from_date,
  }: Omit<z.infer<typeof clientScheduleBaseSchema>, 'name'>,
  ctx: z.RefinementCtx
) => {
  refineScheduleDate(
    {
      from_date: new Date(from_date),
      to_date: to_date ? new Date(to_date) : undefined,
    },
    ctx
  );
};
