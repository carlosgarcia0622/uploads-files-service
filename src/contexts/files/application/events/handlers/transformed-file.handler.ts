import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransformedFileEvent } from '../impl/transformed-file.event';
import { IFileProcessRepository } from 'src/contexts/files/domain/file-process-repository.interface';
import { fileStatusConstants } from 'src/contexts/files/domain/constants/file-status.constants';
import { IHttpClient } from 'src/shared/domain/http-client.interface';
import { IFileWriter } from 'src/contexts/files/domain/file-writer.interface';
import { IFileRepository } from 'src/contexts/files/domain/file-repository.interface';

@EventsHandler(TransformedFileEvent)
export class TransformedFileHandler
  implements IEventHandler<TransformedFileEvent>
{
  private readonly logger = new Logger(TransformedFileHandler.name);
  constructor(
    private readonly repository: IFileProcessRepository,
    private readonly httpService: IHttpClient,
    private readonly fileSystem?: IFileWriter,
    private readonly fileRepository?: IFileRepository,
  ) {}
  handle(event: TransformedFileEvent) {
    this.logger.log(`[${this.handle.name}] :: INIT`);
    const {
      fileProcess: { originalname, processId },
      transformedFile,
      callbackUrl,
    } = event;
    const fileName = originalname.replace(/\.[^.]*$/, '.json');
    const path = `${process.env.PWD}${process.env.FILES_PATH}/${fileName}`;
    process.env.STOR_FILES_IN === 'DB'
      ? this.fileRepository.create(processId, transformedFile)
      : this.fileSystem.writeFile(path, transformedFile, processId);
    this.repository.updateStatus(processId, fileStatusConstants.DONE);
    const body = { processId, status: fileStatusConstants.DONE };
    this.httpService.post(callbackUrl, body);
  }
}
