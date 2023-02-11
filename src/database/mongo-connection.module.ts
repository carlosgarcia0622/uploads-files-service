import { Module } from '@nestjs/common';
import { mongoConnectionProviders } from './mongo-connection.provider';

@Module({
  providers: [...mongoConnectionProviders],
  exports: [...mongoConnectionProviders],
})
export class MongoConnectionModule {}
