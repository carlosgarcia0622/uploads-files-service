import { ICommand, IEvent } from '@nestjs/cqrs';
import { fileDto } from 'src/files/domain/dtos/file.dto';
export class UploadedFileEvent implements ICommand {
  constructor(public readonly file: fileDto) {}
}
