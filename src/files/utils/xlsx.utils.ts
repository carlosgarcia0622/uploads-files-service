import * as XLSX from 'xlsx';

export const readSheet = (path) => {
  return XLSX.readFile(path, { cellDates: true });
};
