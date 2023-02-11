import { Inject, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { MongoDBConstants } from 'src/database/mongo.constants';
import { fileDto, FileErrorDto } from 'src/files/domain/dtos/file.dto';
import { IFileRepository } from 'src/files/domain/file-repository.interface';
import { File, FileDocument } from './file.schema';

export class MongoFileRepository implements IFileRepository {
  private logger = new Logger(MongoFileRepository.name);
  constructor(
    @Inject(MongoDBConstants.FILE_MODEL) private fileModel: Model<FileDocument>,
  ) {}

  async create(file: fileDto): Promise<File> {
    this.logger.log(`[${this.create.name}] :: INIT`);
    const createdFile = await this.fileModel.create(file);
    return createdFile;
  }

  async addError(processId: string, error: FileErrorDto): Promise<void> {
    const file = await this.fileModel.findOne({ processId });
    if (file) {
      file.errors.push(error);
      file.save();
    }
  }
}
