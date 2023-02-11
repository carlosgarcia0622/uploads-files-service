import { ApiProperty } from '@nestjs/swagger';

export class UploadFilesRequest {
  @ApiProperty({
    type: 'string',
    description: 'JSON with the format',
    example: {
      A: { name: 'name', type: 'string' },
      B: { name: 'age', type: 'number' },
    },
  })
  format: string;

  @ApiProperty({ format: 'binary', type: 'string' })
  file: string;
}
