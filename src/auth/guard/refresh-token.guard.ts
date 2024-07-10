import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BearerTokenGuard } from './bearer-token.guard';

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const req = context.switchToHttp().getRequest();
    if (req.tokenType !== 'refresh') {
      throw new UnauthorizedException('RefreshTokenGuard : Not Refresh Token');
    }
    return true;
  }
}
