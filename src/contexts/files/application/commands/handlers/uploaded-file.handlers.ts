import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileProcessRepository } from 'src/contexts/files/domain/file-process-repository.interface';
import { UploadedFileEvent } from '../impl/uploaded-file.command';

@CommandHandler(UploadedFileEvent)
export class UploadedFileHandler implements ICommandHandler<UploadedFileEvent> {
  private readonly logger = new Logger(UploadedFileHandler.name);
  constructor(private readonly repository: IFileProcessRepository) {}
  async execute(event: UploadedFileEvent) {
    this.logger.log(`[${this.execute.name}] :: INIT`);
    const { fileProcess } = event;
    await this.repository.create(fileProcess);
  }
}
