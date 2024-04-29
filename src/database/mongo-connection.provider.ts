import { ConfigModule } from '@nestjs/config';
import * as mongoose from 'mongoose';
import { MongoDBConstants } from './mongo.constants';

const { MONGO_DATA_BASE_CONNECTION } = MongoDBConstants;

export const mongoConnectionProviders = [
  {
    provide: MONGO_DATA_BASE_CONNECTION,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb://mongodb:27017/files'),
    imports: [ConfigModule],
  },
];
