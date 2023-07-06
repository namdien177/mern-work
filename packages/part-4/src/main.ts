/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import csv from './routes/csv';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api/csv', csv);

const port = Number(process.env.PART_4_PORT ?? 3003);
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
