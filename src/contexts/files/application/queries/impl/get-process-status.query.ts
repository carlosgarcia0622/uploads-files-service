import { IQuery } from '@nestjs/cqrs';

export class GetProcessStatusQuery implements IQuery {
  constructor(
    public readonly processId: string,
    public readonly page: string,
    public readonly limit: string,
  ) {}
}
