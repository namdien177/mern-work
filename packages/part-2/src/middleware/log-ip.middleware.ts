import { NextFunction, Request, Response } from 'express';

export const LogIpMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const ip = request.ip;
  const timestamp = new Date();
  const endpoint = request.url;
  const method = request.method;
  console.log(
    `[ACCESS LOG] URL: (${method}) ${endpoint} | IP: ${ip} - TS: ${timestamp}`
  );
  return next();
};
