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
