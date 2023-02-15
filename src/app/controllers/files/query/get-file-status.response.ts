import { ApiProperty } from '@nestjs/swagger';
import { FileErrorDto } from 'src/contexts/files/domain/dtos/file-process.dto';

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
