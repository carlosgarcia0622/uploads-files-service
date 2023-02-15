import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadFilesController } from '../upload-files.controller';
import { UploadFilesRequest } from '../upload-files.request';
import { UploadFilesResponse } from '../upload-files.response';

describe('UploadFilesController', () => {
  let uploadFilesController: UploadFilesController;
  let request: UploadFilesRequest;
  let commandBus: CommandBus;
  let response: UploadFilesResponse;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UploadFilesController],
      providers: [],
      imports: [CqrsModule],
    }).compile();

    uploadFilesController = app.get<UploadFilesController>(
      UploadFilesController,
    );
    commandBus = app.get<CommandBus>(CommandBus);
    request = {
      format:
        "{A: { name: 'name', type: 'string' }, B: { name: 'age', type: 'number' }}",
      file: 'file-example.xlsx',
      callbackUrl: 'http://test.com',
    };
    response = {
      processId: '123',
      statusCode: 201,
    };
    jest
      .spyOn(commandBus, 'execute')
      .mockImplementation(async () => Promise.resolve(''));
    jest.mock('uuid', () => {
      v4: () => '123';
    });
  });

  describe('upload', () => {
    it('should return processId', async () => {
      const result = await uploadFilesController.upload(request, null);
      expect(result).toEqual(response);
    });
  });
});
