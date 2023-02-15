export interface IFileRepository {
  create(processId: string, file: Array<any>): Promise<void>;
}
