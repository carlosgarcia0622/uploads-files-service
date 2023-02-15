import { TransformedFileEvent } from '../../../events/impl/transformed-file.event';
import { TransformFileCommand } from '../../impl/transform-file.command';
import { TransformFileHandler } from '../transform-file.handler';
import { fileProcess } from './__mocks__/file-process.mock';
describe('TransformFileHandler', () => {
  let transformFileHandler: TransformFileHandler;
  const mockEventBus = {
    publish: jest.fn(),
  };
  const mockFileReader = {
    fileToJson: jest.fn().mockReturnValue([{}]),
  };

  beforeEach(() => {
    transformFileHandler = new TransformFileHandler(
      mockEventBus as any,
      mockFileReader as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call fileReader.fileToJson and eventBus.publish with the correct arguments', async () => {
    const mockCommand: TransformFileCommand = {
      processId: 'process-id',
      fileProcess,
      format: 'format',
      callbackUrl: 'url',
    };

    await transformFileHandler.execute(mockCommand);

    expect(mockFileReader.fileToJson).toHaveBeenCalledTimes(1);
    expect(mockFileReader.fileToJson).toHaveBeenCalledWith(
      mockCommand.fileProcess.path,
      mockCommand.format,
      mockCommand.processId,
    );
    expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      new TransformedFileEvent(
        { ...mockCommand.fileProcess, processId: mockCommand.processId },
        [{}],
        mockCommand.callbackUrl,
      ),
    );
  });
});
