import { MongoFileProcessRepository } from 'src/files/infraestructure/database/mongodb/repositories/mongo-file-process.repository';
import { GetProcessStatusHandler } from './handlers/get-process-status.handler';

export const QueryProviders = [
  {
    provide: GetProcessStatusHandler,
    inject: [MongoFileProcessRepository],
    useFactory: (repository) => new GetProcessStatusHandler(repository),
  },
];
