import fs from 'fs';
import { readFullFile, streamFile } from '@mw/fn-node';

export async function readFile(
  filePath: string,
  options: {
    perLineFn: (row: string) => unknown;
    readType?: 'stream' | 'normal';
  }
) {
  const fileReadType = options.readType ?? 'normal';
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error('Invalid file path');
  }

  const fn = fileReadType === 'normal' ? readFullFile : streamFile;

  await fn(filePath, options.perLineFn);
}
