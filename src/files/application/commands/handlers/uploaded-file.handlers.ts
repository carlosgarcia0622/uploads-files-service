import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileRepository } from 'src/files/domain/file-repository.interface';
import { UploadedFileEvent } from '../impl/uploaded-file.command';

@CommandHandler(UploadedFileEvent)
export class UploadedFileHandler implements ICommandHandler<UploadedFileEvent> {
  private readonly logger = new Logger(UploadedFileHandler.name);
  constructor(private readonly repository: IFileRepository) {}
  async execute(event: UploadedFileEvent) {
    this.logger.log(`[${this.execute.name}] :: INIT`);
    const { file } = event;
    await this.repository.create(file);
  }
}
