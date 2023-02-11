import { Controller, Get, Logger, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetProcessStatusQuery } from 'src/files/application/queries/impl/get-process-status.query';

@Controller('files')
@ApiTags('Files')
export class GetFileStatusController {
  private readonly logger = new Logger(GetFileStatusController.name);
  constructor(private readonly queryBus: QueryBus) {}

  @ApiResponse({ status: 200, description: 'Upload process status' })
  @Get('/:processId')
  async getProcessStatus(@Param('processId') processId: string) {
    this.logger.log(`[${this.getProcessStatus.name}] INIT :: }`);
    return await this.queryBus.execute(new GetProcessStatusQuery(processId));
  }
}
