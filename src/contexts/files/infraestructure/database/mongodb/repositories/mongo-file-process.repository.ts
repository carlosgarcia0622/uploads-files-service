import { Inject, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { MongoDBConstants } from 'src/database/mongo.constants';
import { fileStatusConstants } from 'src/contexts/files/domain/constants/file-status.constants';
import {
  FileProcessDto,
  FileErrorDto,
} from 'src/contexts/files/domain/dtos/file-process.dto';
import { IFileProcessRepository } from 'src/contexts/files/domain/file-process-repository.interface';
import {
  FileProcess,
  FileProcessesDocument,
} from '../schemas/file-processes.schema';

export class MongoFileProcessRepository implements IFileProcessRepository {
  private logger = new Logger(MongoFileProcessRepository.name);
  constructor(
    @Inject(MongoDBConstants.FILE_PROCESS_MODEL)
    private fileModel: Model<FileProcessesDocument>,
  ) {}

  async create(fileProcess: FileProcessDto): Promise<FileProcess> {
    this.logger.log(`[${this.create.name}] :: INIT`);
    const createdFile = await this.fileModel.create(fileProcess);
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
    const file = await this.fileModel.aggregate([match, project]);
    if (file && file.length) return file[0];
    return {};
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
