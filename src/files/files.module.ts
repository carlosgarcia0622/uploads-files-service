import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MulterModule } from '@nestjs/platform-express';
import { TransformFileHandler } from './commands/handlers/transform-file.handler';
import { FilesController } from './controllers/files.controller';

const CommandHandlers = [TransformFileHandler];
const EventHandlers = [];

@Module({
  imports: [
    CqrsModule,
    MulterModule.register({
      dest: process.env.PWD + '/uploads',
    }),
    //EventStoreModule.forFeature(),
  ],
  controllers: [FilesController],
  providers: [...CommandHandlers, ...EventHandlers],
})
export class FilesModule {}
