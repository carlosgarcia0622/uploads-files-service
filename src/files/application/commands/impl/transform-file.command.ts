import { ICommand } from '@nestjs/cqrs';
import { fileDto } from 'src/files/domain/dtos/file.dto';

export class TransformFileCommand implements ICommand {
  constructor(
    public readonly processId: string,
    public readonly file: fileDto,
    public readonly format: string,
    public readonly callbackUrl: string,
  ) {}
}
