import { IEvent } from '@nestjs/cqrs';
import { FileErrorDto } from 'src/files/domain/dtos/file.dto';
export class FileErrorFoundEvent implements IEvent {
  constructor(
    public readonly processId: string,
    public readonly error: FileErrorDto,
  ) {}
}
