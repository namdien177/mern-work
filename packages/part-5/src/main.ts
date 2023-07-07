/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import scheduleApi from './routes/schedule';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: 'http://localhost:4200',
  })
);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/api/schedule', scheduleApi);

const port = process.env.PART_5_PORT || 3004;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
