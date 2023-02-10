import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TransformFileCommand } from '../impl/transform-file.command';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { readSheet } from 'src/files/utils/xlsx.utils';

@CommandHandler(TransformFileCommand)
export class TransformFileHandler
  implements ICommandHandler<TransformFileCommand>
{
  constructor(private readonly publisher: EventPublisher) {}
  private readonly logger = new Logger(TransformFileCommand.name);
  async execute(command: TransformFileCommand) {
    this.logger.log(`[${this.execute.name}] :: INIT`);
    const { processId, file, format } = command;
    console.log(typeof format);
    const formatJson = JSON.parse(format);
    const columns = Object.keys(formatJson);
    const workbook = readSheet(file.path);
    // const workbook = XLSX.readFile(file.path, { cellDates: true });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    for (let i = 0; i < columns.length; i++) {
      const cellAddress = `${columns[i]}${1}`;
      worksheet[cellAddress].w = formatJson[columns[i]].name;
    }
    const data = XLSX.utils.sheet_to_json(worksheet, {});
    const filterded = data.filter((row) => {
      let result = true;
      columns.forEach((c) => {
        if (typeof row[formatJson[c].name] !== formatJson[c].type) {
          result = false;
          //Create event error
        }
      });
      return result;
    });
    fs.writeFile(
      `${process.env.PWD}${process.env.FILES_PATH}/${file.originalname}`,
      JSON.stringify(filterded),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Archivo escrito con éxito');
      },
    );
    this.logger.log(`[${this.execute.name}] :: FINISH ::`);
    return filterded;
  }
}
