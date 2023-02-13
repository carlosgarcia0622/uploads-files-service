import { ApiProperty } from '@nestjs/swagger';

export class UploadFilesResponse {
  @ApiProperty({
    type: 'number',
    default: 201,
  })
  statusCode: number;

  @ApiProperty({ format: 'binary', type: 'string' })
  processId: string;
}

export class ResponseError {
  @ApiProperty({ type: 'string' })
  message;
  @ApiProperty({ type: 'number' })
  statusCode;
  @ApiProperty({ type: 'string' })
  error;
}
