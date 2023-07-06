export const parseAsCSV = (
  perCell?: (value: string, index: number) => void
) => {
  return (raw: string) => {
    const parsedCells: string[] = [];
    const cells = raw.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    for (let i = 0; i < cells.length; i++) {
      let cell = cells[i];
      if (cell.startsWith('"') && cell.endsWith('"')) {
        cell = cell.slice(1, -1);
      }
      perCell && perCell(cell, i);
      parsedCells.push(cell);
    }
    return parsedCells;
  };
};
