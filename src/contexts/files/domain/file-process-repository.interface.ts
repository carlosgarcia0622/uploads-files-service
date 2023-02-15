import { FileProcess } from '../infraestructure/database/mongodb/schemas/file-processes.schema';
import { FileProcessDto, FileErrorDto } from './dtos/file-process.dto';

export interface IFileProcessRepository {
  create(fileProcess: FileProcessDto): Promise<FileProcess>;
  addError(processId, error: FileErrorDto): Promise<void>;
  findByProcessId(
    processId: string,
    page: number,
    limit: number,
  ): Promise<FileProcessDto>;
  updateStatus(processId: string, status: string): Promise<void>;
}
