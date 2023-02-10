import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  ParseFilePipeBuilder,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransformFileCommand } from '../commands/impl/transform-file.command';
import { UploadFilesRequest } from './files.request';
import { v4 as uuidv4 } from 'uuid';
import { fileDto } from '../dtos/file.dto';
@Controller('files')
@ApiTags('Files')
export class FilesController {
  private readonly logger = new Logger(FilesController.name);
  constructor(private readonly commandBus: CommandBus) {}

  @ApiResponse({ status: 200, description: 'Process id' })
  @ApiResponse({ status: 422, description: 'Invalid file type' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @Post('/upload')
  async upload(
    @Body() body: UploadFilesRequest,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'sheet' }) //TODO Improve file validation
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: fileDto,
  ) {
    this.logger.log(`[${this.upload.name}] INIT :: }`);
    console.log(file);
    console.log(body.format);
    const processId = uuidv4();
    //Created file event
    this.commandBus.execute(
      new TransformFileCommand(processId, file, body.format),
    );
    this.logger.log(`[${this.upload.name}] FINISH :: }`);
    return processId;
  }
}
