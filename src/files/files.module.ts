import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MulterModule } from '@nestjs/platform-express';
import { MongoConnectionModule } from 'src/database/mongo-connection.module';
import { UploadFilesController } from './controllers/upload/upload-files.controller';
import { FileModelProvider } from './infraestructure/database/mongodb/file-model.provider';
import { UploadedFileHandler } from './application/commands/handlers/uploaded-file.handlers';
import { EventProviders } from './application/events/events.provider';
import { GetFileStatusController } from './controllers/query/get-file-status.controller';
import { QueryProviders } from './application/queries/query.provider';
import { HttpModule } from '@nestjs/axios';
import { CommandsProvider } from './application/commands/commands.provider';

const EventHandlers = [UploadedFileHandler];

@Module({
  imports: [
    CqrsModule,
    MulterModule.register({
      dest: process.env.PWD + '/uploads',
    }),
    MongoConnectionModule,
    HttpModule,
    //EventStoreModule.forFeature(),
  ],
  controllers: [UploadFilesController, GetFileStatusController],
  providers: [
    ...EventHandlers,
    ...FileModelProvider,
    ...EventProviders,
    ...QueryProviders,
    ...CommandsProvider,
  ],
})
export class FilesModule {}
