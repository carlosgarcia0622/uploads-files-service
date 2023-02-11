import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MulterModule } from '@nestjs/platform-express';
import { MongoConnectionModule } from 'src/database/mongo-connection.module';
import { TransformFileHandler } from './application/commands/handlers/transform-file.handler';
import { UploadFilesController } from './controllers/upload/upload-files.controller';
import { TransformedFileHandler } from './application/events/handlers/transformed-file.handler';
import { FileModelProvider } from './infraestructure/database/mongodb/file-model.provider';
import { UploadedFileHandler } from './application/commands/handlers/uploaded-file.handlers';
import { EventProviders } from './application/events/events.provider';
import { GetFileStatusController } from './controllers/query/get-file-status.controller';
import { QueryProviders } from './application/queries/query.provider';

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
  controllers: [UploadFilesController, GetFileStatusController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ...FileModelProvider,
    ...EventProviders,
    ...QueryProviders,
  ],
})
export class FilesModule {}
