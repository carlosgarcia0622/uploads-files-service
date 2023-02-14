import { IFileReader } from '../domain/file-reader.interface';
import * as Excel from 'exceljs';
import { FileErrorDto } from '../domain/dtos/file.dto';
import { EventBus } from '@nestjs/cqrs';
import { FileErrorFoundEvent } from '../application/events/impl/file-error-found.event';

export class ExcelJsReader implements IFileReader {
  constructor(private readonly eventBus: EventBus) {}
  async fileToJson(
    path: string,
    format: any,
    processId: string,
  ): Promise<Array<any>> {
    const data = [];
    const headers = {};
    const worksheet = await this.getWorksheet(path);
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell, colNumber) => {
          const column = this.columnToLetter(colNumber);
          if (format[column]) {
            headers[colNumber] = {
              name: format[column].name,
              type:
                format[column].type === 'date' ? 'object' : format[column].type,
              column,
            };
          }
        });
      } else {
        const rowData = {};
        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber];
          if (header) {
            if (header.type !== typeof cell.value) {
              this.sendErrorEvent({
                cellAddress: cell.address,
                headerType: header.type,
                processId,
              });
            } else {
              rowData[header.name] = cell.value;
            }
          }
        });
        data.push(rowData);
      }
    });
    return null;
  }

  private async getWorksheet(path: string, worksheetNumber = 1): Promise<any> {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(path);
    return workbook.getWorksheet(worksheetNumber);
  }

  private columnToLetter(column) {
    let temp,
      letter = '';
    while (column > 0) {
      temp = (column - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      column = (column - temp - 1) / 26;
    }
    return letter;
  }

  private sendErrorEvent({ cellAddress, headerType, processId }) {
    const error: FileErrorDto = {
      error: `Invalid format in ceil ${cellAddress}, expected: ${headerType}`,
      cell: cellAddress,
    };
    this.eventBus.publish(new FileErrorFoundEvent(processId, error));
  }
}
