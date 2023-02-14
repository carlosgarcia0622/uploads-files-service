import { Logger } from '@nestjs/common';
import { writeFile } from 'fs';
import { FileErrorDto } from '../domain/dtos/file.dto';
import { IFileRepository } from '../domain/file-repository.interface';
import { IFileWriter } from '../domain/file-writer.interface';

export class FsFileWriter implements IFileWriter {
  constructor(private readonly repository: IFileRepository) {}
  private readonly logger = new Logger(FsFileWriter.name);
  async writeFile(path: string, file: any, processId: string): Promise<void> {
    writeFile(path, JSON.stringify(file), (err) => {
      if (err) {
        this.throwWritingError(err, processId);
        return;
      }
      this.logger.log(`[${this.writeFile.name}] :: FILE WRITED`);
    });
  }

  private throwWritingError(err: any, processId: string) {
    const error: FileErrorDto = {
      error: `Error writing file: ${err}`,
    };
    this.repository.addError(processId, error);
  }
}
