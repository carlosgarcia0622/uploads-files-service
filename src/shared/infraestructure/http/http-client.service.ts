import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { IHttpClient } from 'src/shared/domain/http-client.interface';

export class HttpClient implements IHttpClient {
  private readonly logger = new Logger(HttpClient.name);
  constructor(private httpService: HttpService) {}

  async post(url: string, body: any, options?: any): Promise<any> {
    this.logger.log(`HTTP POST :: INIT ${url}`);
    this.logger.log(`[ BODY ] :: ${JSON.stringify(body)}`);
    const { data } = await firstValueFrom(
      this.httpService.post(url, body, options).pipe(
        catchError(async (error) => {
          this.logger.error(`HTTP POST :: ERROR: `);
          throw new BadGatewayException({
            message: `Bad gateway error: ${error}`,
            error,
          });
        }),
      ),
    );
    return data;
  }
}
