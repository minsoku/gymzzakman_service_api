import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers['authorization'];
    if (!rawToken) {
      throw new UnauthorizedException('BearerTokenGuard : Token not found');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const result = await this.authService.verifyToken(token);

    const user = await this.usersService.existEmail(result.email);
    req.user = user;
    req.token = token;
    req.tokenType = result.type;

    return true;
  }
}
