import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IFileRepository } from 'src/files/domain/file-repository.interface';
import { FileErrorFoundEvent } from '../impl/file-error-found.event';

@EventsHandler(FileErrorFoundEvent)
export class FileErrorFoundHandler
  implements IEventHandler<FileErrorFoundEvent>
{
  logger = new Logger(FileErrorFoundHandler.name);
  constructor(private readonly repository: IFileRepository) {}

  handle(event: FileErrorFoundEvent) {
    this.logger.log(`[${this.handle.name}] :: INIT`);
    const { processId, error } = event;
    this.repository.addError(processId, error);
  }
}
