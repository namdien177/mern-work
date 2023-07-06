/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { LogIpMiddleware } from './middleware/log-ip.middleware';
import user from './routes/user';

const app = express();

app.use(LogIpMiddleware);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to part-2!' });
});

app.use('/api/user', user);

const port = process.env['PART_2_PORT'] || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
