import { MongoFileProcessRepository } from 'src/contexts/files/infraestructure/database/mongodb/repositories/mongo-file-process.repository';
import { FileErrorFoundHandler } from './handlers/file-error-found.handler';
import { UploadedFileHandler } from '../commands/handlers/uploaded-file.handlers';
import { TransformedFileHandler } from './handlers/transformed-file.handler';
import { HttpClient } from 'src/shared/infraestructure/http/http-client.service';
import { HttpService } from '@nestjs/axios';
import { FsFileWriter } from 'src/contexts/files/infraestructure/fs-file-writer';
import { MongoFileRepository } from 'src/contexts/files/infraestructure/database/mongodb/repositories/mongo-file.repository';

export const EventProviders = [
  {
    provide: UploadedFileHandler,
    inject: [MongoFileProcessRepository],
    useFactory: (repository) => new UploadedFileHandler(repository),
  },
  {
    provide: FileErrorFoundHandler,
    inject: [MongoFileProcessRepository],
    useFactory: (repository) => new FileErrorFoundHandler(repository),
  },
  {
    provide: TransformedFileHandler,
    inject: [MongoFileProcessRepository, HttpService, MongoFileRepository],
    useFactory: (repository, httpService, fileRepository) =>
      new TransformedFileHandler(
        repository,
        new HttpClient(httpService),
        new FsFileWriter(repository),
        fileRepository,
      ),
  },
];
