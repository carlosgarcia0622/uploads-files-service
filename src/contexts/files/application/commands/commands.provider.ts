import { EventBus } from '@nestjs/cqrs';
import { ExcelJsReader } from 'src/contexts/files/infraestructure/exceljs-file-reader';
import { TransformFileHandler } from './handlers/transform-file.handler';

export const CommandsProvider = [
  {
    provide: TransformFileHandler,
    inject: [EventBus],
    useFactory: (eventBus) =>
      new TransformFileHandler(eventBus, new ExcelJsReader(eventBus)),
  },
];
