import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export abstract class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.name;
    const message = HttpExceptionFilter.resolveException(exception);
    response.status(status).json({
      statusCode: status,
      message: message,
      error,
    });
  }

  public static resolveException(exception): string {
    if (typeof exception === 'object') {
      if (exception.response) {
        if (Array.isArray(exception.response.message)) {
          return exception.response.message[0];
        }
        return exception.response.message;
      }
      return exception.message;
    }
    if (typeof exception === 'string') {
      return exception;
    }
  }

  abstract resolveStatus(exception: HttpException): number;
}
