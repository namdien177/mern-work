import { z } from 'zod';
import { NextFunction, Request, Response } from 'express';

/**
 * Custom middleware to verify the data.
 * Depending on which library to validate the data, we can update the logic here
 * to facade its operation from the actual consuming API logic.
 *
 * @param opts
 * @constructor
 */
const Zodify = <T extends z.ZodRawShape>(opts: {
  schema: z.ZodObject<T> | z.ZodEffects<z.ZodObject<T>>;
  mapper: (request: Request) => Request[keyof Request];
  onError?: (
    error: z.SafeParseError<z.ZodObject<T>>['error'],
    response: Response,
    next: NextFunction
  ) => unknown;
}) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const toValidate = opts.mapper(request);
    const validateResult = opts.schema.safeParse(toValidate);

    if (validateResult.success) {
      return next();
    }

    if (opts.onError) {
      return opts.onError(validateResult.error, response, next);
    }

    return response.status(400).json({
      message: 'Data is invalid',
    });
  };
};

export default Zodify;
