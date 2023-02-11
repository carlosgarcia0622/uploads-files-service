import { IEvent } from '@nestjs/cqrs';
import { fileDto } from 'src/files/domain/dtos/file.dto';
export class TransformedFileEvent implements IEvent {
  constructor(
    public readonly file: fileDto,
    public readonly transformedFile: Array<any>,
  ) {}
}
