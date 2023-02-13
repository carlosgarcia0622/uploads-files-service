import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TransformFileCommand } from '../impl/transform-file.command';
import { TransformedFileEvent } from 'src/files/application/events/impl/transformed-file.event';
import { FileErrorDto } from 'src/files/domain/dtos/file.dto';
import { FileErrorFoundEvent } from '../../events/impl/file-error-found.event';
import * as Excel from 'exceljs';
// import * as excel from 'xlsx-parse-stream';
// import * as request from 'superagent';
// import * as through from 'through2';

@CommandHandler(TransformFileCommand)
export class TransformFileHandler
  implements ICommandHandler<TransformFileCommand>
{
  constructor(private readonly eventBus: EventBus) {}
  private readonly logger = new Logger(TransformFileCommand.name);
  async execute(command: TransformFileCommand) {
    this.logger.log(`[${this.execute.name}] :: INIT`);
    const { processId, file, format } = command;
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(file.path);
    const worksheet = workbook.getWorksheet(1);
    const data = [];
    const headers = {};
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
              console.log('error');
              const error: FileErrorDto = {
                error: `Invalid format in ceil ${cell.address}, expected: ${header.type}`,
                cell: cell.address,
              };
              this.eventBus.publish(new FileErrorFoundEvent(processId, error));
            } else {
              rowData[header.name] = cell.value;
            }
          }
        });
        data.push(rowData);
      }
    });
    this.eventBus.publish(
      new TransformedFileEvent({ ...file, processId }, data),
    );
    return data;
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
