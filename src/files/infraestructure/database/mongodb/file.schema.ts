import * as mongoose from 'mongoose';
import { fileStatusConstants } from '../../../domain/constants/file-status.constants';
import { fileDto } from '../../../domain/dtos/file.dto';

export type File = Required<fileDto>;

export type FileDocument = File & mongoose.Document;

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
        column: String,
        row: String,
      },
    },
  ],
};

export const FileSchema = new mongoose.Schema(schemaDefinition, {
  timestamps: true,
});
