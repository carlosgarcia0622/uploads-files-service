import { FileProcessDto } from 'src/contexts/files/domain/dtos/file-process.dto';

export const fileProcess: FileProcessDto = {
  processId: '34ef7d22-14ae-411b-93a0-eb8ab4019861',
  status: 'done',
  encoding: '7bit',
  filename: '1ef505247a4e1efcba927f0a28d1098c',
  mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  originalname: 'test-errors.xlsx',
  path: '/Users/carlos.garcia02/projects/study/koibanxs/upload-files-service/uploads/1ef505247a4e1efcba927f0a28d1098c',
  destination:
    '/Users/carlos.garcia02/projects/study/koibanxs/upload-files-service/uploads',
  size: 5392,
  fieldname: 'fieldname',
  errors: [
    {
      error: 'Invalid format in ceil A9, expected: string',
      cell: 'A9',
    },
    {
      error: 'Invalid format in ceil B29, expected: number',
      cell: 'B29',
    },
  ],
};
