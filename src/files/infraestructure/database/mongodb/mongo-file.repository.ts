import { Inject, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { MongoDBConstants } from 'src/database/mongo.constants';
import { fileStatusConstants } from 'src/files/domain/constants/file-status.constants';
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

  async findByProcessId(processId: string, page = 1, limit = 15): Promise<any> {
    const data: any = new Array<any>();
    const match: any = { $match: { processId } };
    const project: any = {
      $project: {
        processId: 1,
        status: 1,
        path: 1,
        errors: {
          $slice: ['$errors', (page - 1) * limit, limit],
        },
        metadata: {
          page: { $sum: page },
          limit: { $sum: limit },
          totalPages: { $ceil: { $divide: [{ $size: '$errors' }, limit] } },
        },
      },
    };
    data.push(match);
    //return this.fileModel.findOne({ processId });
    return this.fileModel.aggregate([match, project]);
  }

  async updateStatus(processId: string, status: string): Promise<void> {
    if (Object.values(fileStatusConstants).includes(status)) {
      const updated = await this.fileModel.findOneAndUpdate(
        { processId },
        { status },
      );
      console.log(updated);
    }
  }
}
