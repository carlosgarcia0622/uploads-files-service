import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TransformFileCommand } from '../impl/transform-file.command';
import { TransformedFileEvent } from 'src/files/application/events/impl/transformed-file.event';
import { FileErrorDto } from 'src/files/domain/dtos/file.dto';
import { FileErrorFoundEvent } from '../../events/impl/file-error-found.event';
import * as Excel from 'exceljs';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { parse } from 'fast-csv';
import * as XLSX from 'xlsx';

@CommandHandler(TransformFileCommand)
export class TransformFileHandler
  implements ICommandHandler<TransformFileCommand>
{
  constructor(private readonly eventBus: EventBus) {}
  private readonly logger = new Logger(TransformFileCommand.name);
  async execute(command: TransformFileCommand) {
    this.logger.log(`[${this.execute.name}] :: INIT`);
    const { processId, file, format, callbackUrl } = command;

    // const data = [];
    // const headers = {};
    // const stream = createReadStream(file.path);
    // const workbook = new Excel.Workbook();
    // workbook.xlsx.read(stream).then((workbook) => {
    //   const worksheet = workbook.getWorksheet(1);
    //   worksheet.eachRow((row, rowNumber) => {
    //     if (rowNumber === 1) {
    //       row.eachCell((cell, colNumber) => {
    //         const column = this.columnToLetter(colNumber);
    //         if (format[column]) {
    //           headers[colNumber] = {
    //             name: format[column].name,
    //             type:
    //               format[column].type === 'date'
    //                 ? 'object'
    //                 : format[column].type,
    //             column,
    //           };
    //         }
    //       });
    //     } else {
    //       const rowData = {};
    //       row.eachCell((cell, colNumber) => {
    //         const header = headers[colNumber];
    //         if (header) {
    //           if (header.type !== typeof cell.value) {
    //             console.log('error');
    //             const error: FileErrorDto = {
    //               error: `Invalid format in ceil ${cell.address}, expected: ${header.type}`,
    //               cell: cell.address,
    //             };
    //             this.eventBus.publish(
    //               new FileErrorFoundEvent(processId, error),
    //             );
    //           } else {
    //             rowData[header.name] = cell.value;
    //           }
    //         }
    //       });
    //       data.push(rowData);
    //       if (rowNumber === worksheet.rowCount) {
    //         this.eventBus.publish(
    //           new TransformedFileEvent(
    //             { ...file, processId },
    //             data,
    //             callbackUrl,
    //           ),
    //         );
    //       }
    //     }
    //   });
    // });

    //winner

    // stream.on('data', async (chunk) => {
    //   const workbook = new Excel.Workbook();
    //   //await workbook.xlsx.load(chunk as Buffer);
    //   await workbook.xlsx.load(chunk as Buffer);
    //   const worksheet = workbook.getWorksheet(1);
    //   // const worksheet = workbook.getWorksheet(1);
    //   worksheet.eachRow((row, rowNumber) => {
    //     if (rowNumber === 1) {
    //       row.eachCell((cell, colNumber) => {
    //         const column = this.columnToLetter(colNumber);
    //         if (format[column]) {
    //           headers[colNumber] = {
    //             name: format[column].name,
    //             type:
    //               format[column].type === 'date'
    //                 ? 'object'
    //                 : format[column].type,
    //             column,
    //           };
    //         }
    //       });
    //     } else {
    //       const rowData = {};
    //       row.eachCell((cell, colNumber) => {
    //         const header = headers[colNumber];
    //         if (header) {
    //           if (header.type !== typeof cell.value) {
    //             console.log('error');
    //             const error: FileErrorDto = {
    //               error: `Invalid format in ceil ${cell.address}, expected: ${header.type}`,
    //               cell: cell.address,
    //             };
    //             this.eventBus.publish(
    //               new FileErrorFoundEvent(processId, error),
    //             );
    //           } else {
    //             rowData[header.name] = cell.value;
    //           }
    //         }
    //       });
    //       data.push(rowData);
    //       if (rowNumber === worksheet.rowCount) {
    //         this.eventBus.publish(
    //           new TransformedFileEvent(
    //             { ...file, processId },
    //             data,
    //             callbackUrl,
    //           ),
    //         );
    //       }
    //     }
    //   });
    // });

    // //SIN STREAM
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
      new TransformedFileEvent({ ...file, processId }, data, callbackUrl),
    );
    return data;
  }

  private process_RS(stream, cb) {
    const buffers = [];
    stream.on('data', function (data) {
      buffers.push(data);
    });
    stream.on('end', function () {
      const buffer = Buffer.concat(buffers);
      const workbook = XLSX.read(buffer);
      /* DO SOMETHING WITH workbook IN THE CALLBACK */
      cb(workbook);
    });
  }

  private async buffer_RS(stream) {
    /* collect data */
    const buffers = [];
    const reader = stream.getReader();
    for (;;) {
      const res = await reader.read();
      if (res.value) buffers.push(res.value);
      if (res.done) break;
    }

    /* concat */
    const out = new Uint8Array(buffers.reduce((acc, v) => acc + v.length, 0));

    let off = 0;
    for (const u8 of buffers) {
      out.set(u8, off);
      off += u8.length;
    }

    return out;
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
