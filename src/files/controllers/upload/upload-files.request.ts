import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFilesRequest {
  @IsString()
  @IsNotEmpty()
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
