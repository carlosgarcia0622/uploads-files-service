import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { GetFileStatusController } from 'src/app/controllers/files/query/get-file-status.controller';
import { GetFileStatusRequest } from 'src/app/controllers/files/query/get-file-status.request';
import { GetFileStatusResponse } from 'src/app/controllers/files/query/get-file-status.response';

describe('GetFileStatusController', () => {
  let getFileStatusController: GetFileStatusController;
  let request: GetFileStatusRequest;
  let queryBus: QueryBus;
  let getFileStatusResponse: GetFileStatusResponse;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GetFileStatusController],
      providers: [],
      imports: [CqrsModule],
    }).compile();

    getFileStatusController = app.get<GetFileStatusController>(
      GetFileStatusController,
    );
    queryBus = app.get<QueryBus>(QueryBus);
    request = {
      page: '1',
      limit: '10',
    };
    getFileStatusResponse = {
      processId: '123',
      statusCode: 200,
      status: 'done',
      errors: [],
    };
    jest
      .spyOn(queryBus, 'execute')
      .mockImplementation(async () => getFileStatusResponse);
  });

  describe('getProcessStatus', () => {
    it('should return process', async () => {
      const response = await getFileStatusController.getProcessStatus(
        'processId',
        request,
      );
      expect(response).toEqual(getFileStatusResponse);
    });
  });
});
