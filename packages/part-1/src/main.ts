/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import mocking from './routes/mock';
import user from './routes/user';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to part-1!' });
});

app.use('/api/mock', mocking);
app.use('/api/user', user);

const port = process.env['PART_1_PORT'] || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
