import { IEvent } from '@nestjs/cqrs';
import { fileDto } from 'src/files/dtos/file.dto';
export class TransformedFileEvent implements IEvent {
  constructor(
    public readonly fileDto: fileDto,
    public readonly transformedFile: Array<any>,
  ) {}
}
