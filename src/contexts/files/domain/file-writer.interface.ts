export interface IFileWriter {
  writeFile(path: string, file: any, processId: string): Promise<void>;
}
