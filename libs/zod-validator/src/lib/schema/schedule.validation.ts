import { z } from 'zod';
import dayjs from 'dayjs';

export const scheduleBaseSchema = z.object({
  name: z.string().min(2).max(100),
  from_date: z.coerce.date(),
  to_date: z.coerce.date().optional(),
});

export const refineScheduleDate = (
  { to_date, from_date }: Omit<z.infer<typeof scheduleBaseSchema>, 'name'>,
  ctx: z.RefinementCtx
) => {
  const localeDate = dayjs(from_date);
  console.log(localeDate);
  if (localeDate.isBefore(dayjs().startOf('day'))) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      exact: false,
      inclusive: true,
      minimum: dayjs().startOf('day').unix(),
      type: 'date',
      path: ['from_date'],
      message: 'From date must be after now.',
    });
  }

  if (to_date) {
    const parseToDate = dayjs(to_date);
    if (parseToDate.isBefore(dayjs(from_date))) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        path: ['to_date'],
        message: 'The finishing date cannot before the start date',
      });
    }
  }
};
