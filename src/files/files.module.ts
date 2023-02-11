import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MulterModule } from '@nestjs/platform-express';
import { MongoConnectionModule } from 'src/database/mongo-connection.module';
import { TransformFileHandler } from './application/commands/handlers/transform-file.handler';
import { FilesController } from './controllers/files.controller';
import { TransformedFileHandler } from './application/events/handlers/transformed-file.handler';
import { FileModelProvider } from './infraestructure/database/mongodb/file-model.provider';
import { UploadedFileHandler } from './application/commands/handlers/uploaded-file.handlers';
import { EventProviders } from './application/events/events.provider';

const CommandHandlers = [TransformFileHandler];
const EventHandlers = [TransformedFileHandler, UploadedFileHandler];

@Module({
  imports: [
    CqrsModule,
    MulterModule.register({
      dest: process.env.PWD + '/uploads',
    }),
    MongoConnectionModule,
    //EventStoreModule.forFeature(),
  ],
  controllers: [FilesController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ...FileModelProvider,
    ...EventProviders,
  ],
})
export class FilesModule {}
