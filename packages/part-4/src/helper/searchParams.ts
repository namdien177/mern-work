import http from 'http';
import url from 'url';

export const useSearchParam = (request: http.IncomingMessage) => {
  if (!request.url) return {};
  const parsedUrl = url.parse(request.url, true);
  return parsedUrl.query;
};
