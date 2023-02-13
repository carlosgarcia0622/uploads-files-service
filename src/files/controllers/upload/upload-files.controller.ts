import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  ParseFilePipeBuilder,
  HttpStatus,
  Logger,
  UsePipes,
} from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransformFileCommand } from '../../application/commands/impl/transform-file.command';
import { UploadFilesRequest } from './upload-files.request';
import { v4 as uuidv4 } from 'uuid';
import { fileDto } from '../../domain/dtos/file.dto';
import { UploadedFileEvent } from '../../application/commands/impl/uploaded-file.command';
import { UploadFilesValidator } from './upload-files-validator.pipe';
import { ResponseError, UploadFilesResponse } from './upload-files.response';
@Controller('files')
@ApiTags('Files')
export class UploadFilesController {
  private readonly logger = new Logger(UploadFilesController.name);
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  @UsePipes(new UploadFilesValidator())
  @ApiResponse({
    status: 201,
    description: 'Upload process started',
    type: UploadFilesResponse,
  })
  @ApiResponse({
    status: 422,
    description: 'Invalid file type',
    type: ResponseError,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ResponseError,
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @Post('/upload')
  async upload(
    @Body() body: UploadFilesRequest,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'sheet' })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: fileDto,
  ) {
    this.logger.log(`[${this.upload.name}] INIT :: }`);
    const processId = uuidv4();
    const response = new UploadFilesResponse();
    await this.commandBus.execute(
      new UploadedFileEvent({ ...file, processId }),
    );
    this.commandBus.execute(
      new TransformFileCommand(processId, file, body.format),
    );
    this.logger.log(`[${this.upload.name}] FINISH ::`);
    response.processId = processId;
    response.statusCode = 201;
    return response;
  }
}
