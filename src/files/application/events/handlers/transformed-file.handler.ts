import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransformedFileEvent } from '../impl/transformed-file.event';
import * as fs from 'fs';

@EventsHandler(TransformedFileEvent)
export class TransformedFileHandler
  implements IEventHandler<TransformedFileEvent>
{
  private readonly logger = new Logger(TransformedFileHandler.name);
  handle(event: TransformedFileEvent) {
    this.logger.log(`[${this.handle.name}] :: INIT`);
    const { file, transformedFile } = event;
    fs.writeFile(
      `${process.env.PWD}${process.env.FILES_PATH}/${file.originalname}`,
      JSON.stringify(transformedFile),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Archivo escrito con éxito');
      },
    );
  }
}
