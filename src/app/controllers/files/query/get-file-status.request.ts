import { ApiProperty } from '@nestjs/swagger';

export class GetFileStatusRequest {
  @ApiProperty({
    required: false,
    default: '1',
    description: 'Page for errors pagination',
  })
  page: string;

  @ApiProperty({
    required: false,
    default: '15',
    description: 'Limit for errors pagination',
  })
  limit: string;
}
