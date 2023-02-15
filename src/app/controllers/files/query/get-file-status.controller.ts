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
import { GetProcessStatusQuery } from 'src/contexts/files/application/queries/impl/get-process-status.query';
import { ApiKeyGuard } from 'src/shared/infraestructure/auth/api-key.guard';
import { ResponseError } from 'src/shared/infraestructure/http/http-error.response';
import { GetFileStatusRequest } from './get-file-status.request';
import { GetFileStatusResponse } from './get-file-status.response';

@Controller('files')
@ApiTags('Files')
export class GetFileStatusController {
  private readonly logger = new Logger(GetFileStatusController.name);
  constructor(private readonly queryBus: QueryBus) {}

  @ApiResponse({
    status: 200,
    description: 'Upload process status',
    type: GetFileStatusResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ResponseError,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ResponseError,
  })
  @ApiHeaders([{ name: 'x-app-key', description: 'APP KEY' }])
  @UseGuards(ApiKeyGuard)
  @Get('/:processId')
  async getProcessStatus(
    @Param('processId') processId: string,
    @Query() query: GetFileStatusRequest,
  ) {
    this.logger.log(`[${this.getProcessStatus.name}] INIT :: }`);
    const result = await this.queryBus.execute(
      new GetProcessStatusQuery(processId, query.page, query.limit),
    );
    const response: GetFileStatusResponse = {
      ...result,
      statusCode: 200,
    };
    return response;
  }
}
