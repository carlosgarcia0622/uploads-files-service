export interface IHttpClient {
  post(url: string, body: any, options?: any): Promise<any>;
}
