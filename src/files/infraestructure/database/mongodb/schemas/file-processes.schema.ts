import * as mongoose from 'mongoose';
import { fileStatusConstants } from '../../../../domain/constants/file-status.constants';
import { FileProcessDto } from '../../../../domain/dtos/file-process.dto';

export type FileProcess = Required<FileProcessDto>;

export type FileProcessesDocument = FileProcess & mongoose.Document;

const schemaDefinition = {
  processId: { type: String, required: true, index: true },
  status: {
    type: String,
    required: true,
    default: fileStatusConstants.PENDING,
    enum: Object.values(fileStatusConstants),
  },
  encoding: { type: String },
  filename: { type: String, required: true },
  mimetype: { type: String },
  originalname: { type: String, required: true },
  path: { type: String, required: true },
  destination: { type: String, required: true },
  size: { type: Number },
  errors: [
    {
      type: {
        error: String,
        cell: String,
      },
    },
  ],
};

export const FilesProcessesSchema = new mongoose.Schema(schemaDefinition, {
  timestamps: true,
});
