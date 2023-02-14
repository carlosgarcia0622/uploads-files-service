import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransformedFileEvent } from '../impl/transformed-file.event';
import * as fs from 'fs';
import { IFileRepository } from 'src/files/domain/file-repository.interface';
import { fileStatusConstants } from 'src/files/domain/constants/file-status.constants';
import { FileErrorDto } from 'src/files/domain/dtos/file.dto';
import { IHttpClient } from 'src/shared/domain/http-client.interface';

@EventsHandler(TransformedFileEvent)
export class TransformedFileHandler
  implements IEventHandler<TransformedFileEvent>
{
  private readonly logger = new Logger(TransformedFileHandler.name);
  constructor(
    private readonly repository: IFileRepository,
    private readonly httpService: IHttpClient,
  ) {}
  handle(event: TransformedFileEvent) {
    this.logger.log(`[${this.handle.name}] :: INIT`);
    const {
      file: { originalname, processId },
      transformedFile,
      callbackUrl,
    } = event;
    const fileName = originalname.replace(/\.[^.]*$/, '.json');
    const path = `${process.env.PWD}${process.env.FILES_PATH}/${fileName}`;
    fs.writeFile(path, JSON.stringify(transformedFile), (err) => {
      if (err) {
        const error: FileErrorDto = {
          error: `Error writing file: ${err}`,
        };
        this.repository.addError(processId, error);
        return;
      }
      this.logger.log(`[${this.handle.name}] :: FILE WRITED`);
    });
    this.repository.updateStatus(processId, fileStatusConstants.DONE);
    const body = { processId, status: fileStatusConstants.DONE };
    this.httpService.post(callbackUrl, body);
  }
}
