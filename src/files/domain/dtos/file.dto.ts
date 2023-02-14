import { ApiProperty } from '@nestjs/swagger';

export class FileErrorDto {
  @ApiProperty()
  error: string;
  @ApiProperty()
  cell?: string;
}
export class fileDto {
  readonly processId: string;
  readonly status: string;
  readonly destination: string;
  readonly encoding: string;
  readonly fieldname: string;
  readonly filename: string;
  readonly mimetype: string;
  readonly originalname: string;
  readonly path: string;
  readonly size: number;
  readonly errors: Array<FileErrorDto>;
}
