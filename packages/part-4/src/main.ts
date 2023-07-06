import http from 'http';
import csv from './routes/csv';
import { REQUEST_METHOD, RouteType } from './helper/route';
import user from './routes/user';
import util from './routes/util';

/**
 * For simplicity, we only use 1 level route...
 * Actual work should use at lease expressjs for less custom-made thing...
 */
const server = http.createServer(async (req, res) => {
  const csvPaths = Object.keys(csv);
  const userPaths = Object.keys(user);
  const utilPaths = Object.keys(util);
  if (!req.url || !req.method) {
    return;
  }
  const urlPaths = req.url.split('/').slice(1);

  let entryPath = urlPaths.at(0) as string;
  if (entryPath.includes('?')) {
    entryPath = entryPath.slice(0, entryPath.indexOf('?'));
  }
  let route: RouteType | undefined;
  if (csvPaths.includes(entryPath)) {
    route = csv;
  } else if (userPaths.includes(entryPath)) {
    route = user;
  } else if (utilPaths.includes(entryPath)) {
    route = util;
  }

  if (route) {
    const method =
      route[entryPath][req.method.toLowerCase() as Lowercase<REQUEST_METHOD>];
    if (method) {
      await method(req, res);
    }
  } else {
    res.statusCode = 404;
    res.end();
  }
});

const port = Number(process.env.PART_4_PORT ?? 3003);
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
