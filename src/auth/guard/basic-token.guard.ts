import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException('BasicTokenGuard : Token not found');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const { email, password } = this.authService.decodeBasicToken(token);
    const user = this.authService.authenticateWithEmail({ email, password });

    req.user = user;
    return true;
  }
}
