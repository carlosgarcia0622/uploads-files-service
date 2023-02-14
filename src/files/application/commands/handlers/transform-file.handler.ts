import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TransformFileCommand } from '../impl/transform-file.command';
import { TransformedFileEvent } from 'src/files/application/events/impl/transformed-file.event';
import { FileErrorDto } from 'src/files/domain/dtos/file.dto';
import { FileErrorFoundEvent } from '../../events/impl/file-error-found.event';
import * as Excel from 'exceljs';
import * as XLSX from 'xlsx';

@CommandHandler(TransformFileCommand)
export class TransformFileHandler
  implements ICommandHandler<TransformFileCommand>
{
  constructor(private readonly eventBus: EventBus) {}
  private readonly logger = new Logger(TransformFileCommand.name);
  async execute(command: TransformFileCommand): Promise<void> {
    this.logger.log(`[${this.execute.name}] :: INIT`);
    const { processId, file, format, callbackUrl } = command;
    const data = [];
    const headers = {};
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(file.path);
    const worksheet = workbook.getWorksheet(1);
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
    this.eventBus.publish(
      new TransformedFileEvent({ ...file, processId }, data, callbackUrl),
    );
  }

  private sendErrorEvent({ cellAddress, headerType, processId }) {
    const error: FileErrorDto = {
      error: `Invalid format in ceil ${cellAddress}, expected: ${headerType}`,
      cell: cellAddress,
    };
    this.eventBus.publish(new FileErrorFoundEvent(processId, error));
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
}
