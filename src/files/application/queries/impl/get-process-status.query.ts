import { IQuery } from '@nestjs/cqrs';

export class GetProcessStatusQuery implements IQuery {
  constructor(public readonly processId: string) {}
}
