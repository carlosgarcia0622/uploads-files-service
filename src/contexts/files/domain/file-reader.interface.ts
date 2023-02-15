export interface IFileReader {
  fileToJson(path: string, format: any, processId: string): Promise<Array<any>>;
}
