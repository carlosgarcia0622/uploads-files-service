import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IFileProcessRepository } from 'src/files/domain/file-process-repository.interface';
import { FileErrorFoundEvent } from '../impl/file-error-found.event';

@EventsHandler(FileErrorFoundEvent)
export class FileErrorFoundHandler
  implements IEventHandler<FileErrorFoundEvent>
{
  logger = new Logger(FileErrorFoundHandler.name);
  constructor(private readonly repository: IFileProcessRepository) {}

  handle(event: FileErrorFoundEvent) {
    this.logger.log(`[${this.handle.name}] :: INIT`);
    const { processId, error } = event;
    this.repository.addError(processId, error);
  }
}
