import { ICommand } from '@nestjs/cqrs';
import { FileProcessDto } from 'src/contexts/files/domain/dtos/file-process.dto';

export class TransformFileCommand implements ICommand {
  constructor(
    public readonly processId: string,
    public readonly fileProcess: FileProcessDto,
    public readonly format: string,
    public readonly callbackUrl: string,
  ) {}
}
