import { z } from 'zod';
import { ObjectId } from 'mongodb';

export const objectIdSchema = z.string().refine((val) => {
  try {
    return !!new ObjectId(val);
  } catch (e) {
    return false;
  }
}, 'Value is not ObjectId type');
