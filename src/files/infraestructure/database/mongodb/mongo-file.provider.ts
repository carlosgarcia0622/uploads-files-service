import { FactoryProvider } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MongoDBConstants } from 'src/database/mongo.constants';
import { FilesProcessesSchema } from './schemas/file-processes.schema';
import { FilesSchema } from './schemas/file.schema';
import { MongoFileProcessRepository } from './repositories/mongo-file-process.repository';
import { MongoFileRepository } from './repositories/mongo-file.repository';

export const FileModelProvider: Array<FactoryProvider> = [
  {
    provide: MongoDBConstants.FILE_PROCESS_MODEL,
    useFactory: (connection: Connection) => {
      return connection.model(
        MongoDBConstants.FILE_PROCESS_MODEL,
        FilesProcessesSchema,
      );
    },
    inject: [MongoDBConstants.MONGO_DATA_BASE_CONNECTION],
  },
  {
    provide: MongoDBConstants.FILE_MODEL,
    useFactory: (connection: Connection) => {
      return connection.model(MongoDBConstants.FILE_MODEL, FilesSchema);
    },
    inject: [MongoDBConstants.MONGO_DATA_BASE_CONNECTION],
  },
  {
    provide: MongoFileProcessRepository,
    inject: [MongoDBConstants.FILE_PROCESS_MODEL],
    useFactory: (model) => new MongoFileProcessRepository(model),
  },
  {
    provide: MongoFileRepository,
    inject: [MongoDBConstants.FILE_MODEL],
    useFactory: (model) => new MongoFileRepository(model),
  },
];
