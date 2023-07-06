import http from 'http';

export type REQUEST_METHOD = 'GET' | 'POST' | 'DELETE';

export type RouteHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => unknown;

export type RouteType = {
  [paths: string]: {
    [method in Lowercase<REQUEST_METHOD>]?: RouteHandler;
  };
};
