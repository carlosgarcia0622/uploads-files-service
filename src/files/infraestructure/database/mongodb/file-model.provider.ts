import { FactoryProvider } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MongoDBConstants } from 'src/database/mongo.constants';
import { FileSchema } from './file.schema';
import { MongoFileRepository } from './mongo-file.repository';

export const FileModelProvider: Array<FactoryProvider> = [
  {
    provide: MongoDBConstants.FILE_MODEL,
    useFactory: (connection: Connection) => {
      return connection.model(MongoDBConstants.FILE_MODEL, FileSchema);
    },
    inject: [MongoDBConstants.MONGO_DATA_BASE_CONNECTION],
  },
  {
    provide: MongoFileRepository,
    inject: [MongoDBConstants.FILE_MODEL],
    useFactory: (model) => new MongoFileRepository(model),
  },
];
