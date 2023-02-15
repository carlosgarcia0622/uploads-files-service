import { IFileProcessRepository } from 'src/contexts/files/domain/file-process-repository.interface';
import { UploadedFileHandler } from '../uploaded-file.handlers';
import { UploadedFileEvent } from '../../impl/uploaded-file.command';
import { fileProcess } from './__mocks__/file-process.mock';

describe('UploadedFileHandler', () => {
  let handler: UploadedFileHandler;
  let repository: IFileProcessRepository;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      addError: jest.fn(),
      findByProcessId: jest.fn(),
      updateStatus: jest.fn(),
    };
    handler = new UploadedFileHandler(repository);
  });

  it('should call the create method of the file process repository', async () => {
    const event = new UploadedFileEvent(fileProcess);
    await handler.execute(event);

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith(event.fileProcess);
  });
});
