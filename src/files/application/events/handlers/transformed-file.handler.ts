import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransformedFileEvent } from '../impl/transformed-file.event';
import * as fs from 'fs';
import { IFileRepository } from 'src/files/domain/file-repository.interface';
import { fileStatusConstants } from 'src/files/domain/constants/file-status.constants';
import { FileErrorDto } from 'src/files/domain/dtos/file.dto';

@EventsHandler(TransformedFileEvent)
export class TransformedFileHandler
  implements IEventHandler<TransformedFileEvent>
{
  private readonly logger = new Logger(TransformedFileHandler.name);
  constructor(private readonly repository: IFileRepository) {}
  handle(event: TransformedFileEvent) {
    this.logger.log(`[${this.handle.name}] :: INIT`);
    const {
      file: { originalname, processId },
      transformedFile,
    } = event;
    fs.writeFile(
      // eslint-disable-next-line prettier/prettier
      `${process.env.PWD}${process.env.FILES_PATH}/${originalname.replace(/\.[^.]*$/, '.json')}`,
      JSON.stringify(transformedFile),
      (err) => {
        if (err) {
          const error: FileErrorDto = {
            error: `Error writing file: ${err}`,
          };
          this.repository.addError(processId, error);
          return;
        }
        console.log('Archivo escrito con éxito');
      },
    );
    this.repository.updateStatus(processId, fileStatusConstants.DONE);
  }
}
