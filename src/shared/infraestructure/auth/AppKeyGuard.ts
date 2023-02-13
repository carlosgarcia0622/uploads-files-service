import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AppKeyGuard implements CanActivate {
  private readonly logger: Logger = new Logger(AppKeyGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const response = true;
    const request = context.switchToHttp().getRequest();
    const appKey = request.headers['x-app-key'];
    if (appKey !== process.env.APP_KEY) {
      this.logger.error(`[${this.canActivate.name}] ERROR :: INVALID APP KEY`);
      throw new UnauthorizedException();
    }
    return response;
  }
}
