import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { fileDto } from 'src/files/domain/dtos/file.dto';
import { IFileRepository } from 'src/files/domain/file-repository.interface';
import { GetProcessStatusQuery } from '../impl/get-process-status.query';

@QueryHandler(GetProcessStatusQuery)
export class GetProcessStatusHandler
  implements IQueryHandler<GetProcessStatusQuery>
{
  constructor(private readonly repository: IFileRepository) {}

  execute(query: GetProcessStatusQuery): Promise<fileDto> {
    const { processId, page, limit } = query;
    return this.repository.findByProcessId(
      processId,
      Number(page),
      Number(limit),
    );
  }
}
