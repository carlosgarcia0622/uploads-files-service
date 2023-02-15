import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TransformFileCommand } from '../impl/transform-file.command';
import { TransformedFileEvent } from 'src/contexts/files/application/events/impl/transformed-file.event';
import { IFileReader } from 'src/contexts/files/domain/file-reader.interface';

@CommandHandler(TransformFileCommand)
export class TransformFileHandler
  implements ICommandHandler<TransformFileCommand>
{
  constructor(
    private readonly eventBus: EventBus,
    private readonly fileReader: IFileReader,
  ) {}
  private readonly logger = new Logger(TransformFileCommand.name);
  async execute(command: TransformFileCommand): Promise<void> {
    this.logger.log(`[${this.execute.name}] :: INIT`);
    const { processId, fileProcess, format, callbackUrl } = command;
    const transformedFile = await this.fileReader.fileToJson(
      fileProcess.path,
      format,
      processId,
    );
    this.eventBus.publish(
      new TransformedFileEvent(
        { ...fileProcess, processId },
        transformedFile,
        callbackUrl,
      ),
    );
  }
}
