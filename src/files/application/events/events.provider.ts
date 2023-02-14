import { MongoFileRepository } from 'src/files/infraestructure/database/mongodb/mongo-file.repository';
import { FileErrorFoundHandler } from './handlers/file-error-found.handler';
import { UploadedFileHandler } from '../commands/handlers/uploaded-file.handlers';
import { TransformedFileHandler } from './handlers/transformed-file.handler';
import { HttpClient } from 'src/shared/infraestructure/http/http-client.service';
import { HttpService } from '@nestjs/axios';

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
  {
    provide: TransformedFileHandler,
    inject: [MongoFileRepository, HttpService],
    useFactory: (repository, httpService) =>
      new TransformedFileHandler(repository, new HttpClient(httpService)),
  },
];
