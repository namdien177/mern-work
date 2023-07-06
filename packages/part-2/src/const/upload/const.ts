import path from 'path';
import fs from 'fs';

/**
 * Or we can use ENV file here
 */
export const DEFAULT_STORAGE_SPACES = path.join(
  process.cwd(),
  '/packages/part-2/src',
  '/.storage'
);

if (!fs.existsSync(DEFAULT_STORAGE_SPACES)) {
  console.warn(`Creating Directory [${DEFAULT_STORAGE_SPACES}]`);
  fs.mkdirSync(DEFAULT_STORAGE_SPACES);
}
