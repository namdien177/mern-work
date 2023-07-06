import { z } from 'zod';
import { USER_STATUS } from '@mw/data-model';

export const userModelSchema = z.object({
  first_name: z.string().min(1).max(64).optional(),
  last_name: z.string().min(1).max(64).optional(),
  age: z.coerce.number().min(1).max(150).optional(),
  avatar: z.string().min(5).optional(),
  email: z.string().email(),
  status: z.nativeEnum(USER_STATUS),
});
