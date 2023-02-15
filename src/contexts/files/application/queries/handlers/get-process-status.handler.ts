import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FileProcessDto } from 'src/contexts/files/domain/dtos/file-process.dto';
import { IFileProcessRepository } from 'src/contexts/files/domain/file-process-repository.interface';
import { GetProcessStatusQuery } from '../impl/get-process-status.query';

@QueryHandler(GetProcessStatusQuery)
export class GetProcessStatusHandler
  implements IQueryHandler<GetProcessStatusQuery>
{
  constructor(private readonly repository: IFileProcessRepository) {}

  execute(query: GetProcessStatusQuery): Promise<FileProcessDto> {
    const { processId, page, limit } = query;
    return this.repository.findByProcessId(
      processId,
      Number(page),
      Number(limit),
    );
  }
}
