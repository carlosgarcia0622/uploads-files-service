import * as mongoose from 'mongoose';
import { FileDto } from 'src/contexts/files/domain/dtos/file.dto';

export type File = Required<FileDto>;

export type FileDocument = File & mongoose.Document;

const schemaDefinition = {
  processId: { type: String, required: true, index: true },
  file: { type: [Object] },
};

export const FilesSchema = new mongoose.Schema(schemaDefinition, {
  timestamps: true,
});
