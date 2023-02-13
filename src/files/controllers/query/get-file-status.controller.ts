import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiHeaders, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetProcessStatusQuery } from 'src/files/application/queries/impl/get-process-status.query';
import { AppKeyGuard } from 'src/shared/infraestructure/auth/AppKeyGuard';
import { GetFileStatusRequest } from './get-file-status.request';

@Controller('files')
@ApiTags('Files')
export class GetFileStatusController {
  private readonly logger = new Logger(GetFileStatusController.name);
  constructor(private readonly queryBus: QueryBus) {}

  @ApiResponse({ status: 200, description: 'Upload process status' })
  @ApiHeaders([{ name: 'x-app-key', description: 'APP KEY' }])
  @UseGuards(AppKeyGuard)
  @Get('/:processId')
  async getProcessStatus(
    @Param('processId') processId: string,
    @Query() query: GetFileStatusRequest,
  ) {
    this.logger.log(`[${this.getProcessStatus.name}] INIT :: }`);
    return await this.queryBus.execute(
      new GetProcessStatusQuery(processId, query.page, query.limit),
    );
  }
}
