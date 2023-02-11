import { File } from '../infraestructure/database/mongodb/file.schema';
import { fileDto, FileErrorDto } from './dtos/file.dto';

export interface IFileRepository {
  create(file: fileDto): Promise<File>;
  addError(processId, error: FileErrorDto): Promise<void>;
}
