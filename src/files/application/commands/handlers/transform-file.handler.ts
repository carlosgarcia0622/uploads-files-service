import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TransformFileCommand } from '../impl/transform-file.command';
import * as XLSX from 'xlsx';
import { readSheet } from 'src/files/utils/xlsx.utils';
import { TransformedFileEvent } from 'src/files/application/events/impl/transformed-file.event';
import { FileErrorDto } from 'src/files/domain/dtos/file.dto';
import { FileErrorFoundEvent } from '../../events/impl/file-error-found.event';

@CommandHandler(TransformFileCommand)
export class TransformFileHandler
  implements ICommandHandler<TransformFileCommand>
{
  constructor(private readonly eventBus: EventBus) {}
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
    const filtered = data.filter((row: any) => {
      let result = true;
      columns.forEach((c) => {
        if (typeof row[formatJson[c].name] !== formatJson[c].type) {
          result = false;
          const error: FileErrorDto = {
            error: `Invalid format in ceil ${c}${
              row.__rowNum__ + 1
            }, expected: ${formatJson[c].type}`,
            column: c,
            row: row.__rowNum__ + 1,
          };
          this.eventBus.publish(new FileErrorFoundEvent(processId, error));
          this.logger.error(`[execute] :: ERROR: ${error.error}`);
        }
      });
      return result;
    });
    this.logger.log(`[${this.execute.name}] :: FINISH ::`);
    this.eventBus.publish(
      new TransformedFileEvent({ ...file, processId }, filtered),
    );
    return filtered;
  }
}
