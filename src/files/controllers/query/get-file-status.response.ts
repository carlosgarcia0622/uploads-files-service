import { ApiProperty } from '@nestjs/swagger';
import { FileErrorDto } from 'src/files/domain/dtos/file.dto';

export class GetFileStatusResponse {
  @ApiProperty({
    type: 'number',
    default: 200,
  })
  statusCode: number;

  @ApiProperty({ type: 'string' })
  processId: string;

  @ApiProperty({ type: 'string' })
  status: string;

  @ApiProperty({ type: [FileErrorDto] })
  errors: Array<FileErrorDto>;
}