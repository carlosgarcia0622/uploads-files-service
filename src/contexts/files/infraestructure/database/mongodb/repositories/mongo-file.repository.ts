import { Inject, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { MongoDBConstants } from 'src/database/mongo.constants';
import { IFileRepository } from 'src/contexts/files/domain/file-repository.interface';
import { FileDocument } from '../schemas/file.schema';
import { MongoFileProcessRepository } from './mongo-file-process.repository';

export class MongoFileRepository implements IFileRepository {
  private logger = new Logger(MongoFileProcessRepository.name);
  constructor(
    @Inject(MongoDBConstants.FILE_PROCESS_MODEL)
    private fileModel: Model<FileDocument>,
  ) {}

  async create(processId: string, file: Array<any>): Promise<void> {
    this.logger.log(`[${this.create.name}] :: INIT`);
    this.fileModel.create({ processId, file });
  }
}
