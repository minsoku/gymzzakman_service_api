import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BearerTokenGuard } from './bearer-token.guard';

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();
    if (req.tokenType !== 'access') {
      throw new UnauthorizedException('AccessTokenGuard : Not access token');
    }
    return true;
  }
}
