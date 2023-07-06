import * as fs from 'fs';

function readCSV(filePath: string) {
  const result = [];
  const csvData = fs.readFileSync(filePath, 'utf8');
  const lines = csvData.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const row = [];
    const cells = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    for (let j = 0; j < cells.length; j++) {
      let cell = cells[j];
      if (cell.startsWith('"') && cell.endsWith('"')) {
        cell = cell.slice(1, -1);
      }
      row.push(cell);
    }
    result.push(row);
  }
  return result;
}
