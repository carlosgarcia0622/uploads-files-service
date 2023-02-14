import { ApiProperty } from '@nestjs/swagger';

export class ResponseError {
  @ApiProperty({ type: 'string' })
  message;
  @ApiProperty({ type: 'number' })
  statusCode;
  @ApiProperty({ type: 'string' })
  error;
}
