import { IEvent } from '@nestjs/cqrs';
import { FileProcessDto } from 'src/files/domain/dtos/file-process.dto';
export class TransformedFileEvent implements IEvent {
  constructor(
    public readonly fileProcess: FileProcessDto,
    public readonly transformedFile: Array<any>,
    public readonly callbackUrl: string,
  ) {}
}
