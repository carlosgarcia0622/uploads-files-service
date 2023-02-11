import { MongoFileRepository } from 'src/files/infraestructure/database/mongodb/mongo-file.repository';
import { GetProcessStatusHandler } from './handlers/get-process-status.handler';

export const QueryProviders = [
  {
    provide: GetProcessStatusHandler,
    inject: [MongoFileRepository],
    useFactory: (repository) => new GetProcessStatusHandler(repository),
  },
];
