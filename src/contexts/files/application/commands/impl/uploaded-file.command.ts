import { ICommand } from '@nestjs/cqrs';
import { FileProcessDto } from 'src/contexts/files/domain/dtos/file-process.dto';
export class UploadedFileEvent implements ICommand {
  constructor(public readonly fileProcess: FileProcessDto) {}
}
