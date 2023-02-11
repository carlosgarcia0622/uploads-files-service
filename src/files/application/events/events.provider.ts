import { MongoFileRepository } from 'src/files/infraestructure/database/mongodb/mongo-file.repository';
import { FileErrorFoundHandler } from './handlers/file-error-found.handler';
import { UploadedFileHandler } from '../commands/handlers/uploaded-file.handlers';

export const EventProviders = [
  {
    provide: UploadedFileHandler,
    inject: [MongoFileRepository],
    useFactory: (repository) => new UploadedFileHandler(repository),
  },
  {
    provide: FileErrorFoundHandler,
    inject: [MongoFileRepository],
    useFactory: (repository) => new FileErrorFoundHandler(repository),
  },
];
