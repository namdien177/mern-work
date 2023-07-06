import * as fs from 'fs';
import * as readline from 'readline';

export async function streamFile(
  safePath: string,
  perLineFn: (line: string) => unknown,
  options?: {
    readOptions?: BufferEncoding;
  }
) {
  const fileStream = fs.createReadStream(safePath, options?.readOptions);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    await perLineFn(line);
  }
}

export async function readFullFile(
  safePath: string,
  perLineFn: (line: string) => unknown,
  options?: {
    splitter?: (content: string) => string[];
  }
) {
  const file = fs.readFileSync(safePath, 'utf8');
  const splitter =
    options?.splitter ?? ((content: string) => content.split('\n'));
  const lines = splitter(file);
  for (const lineContent in lines) {
    await perLineFn(lineContent);
  }
}
