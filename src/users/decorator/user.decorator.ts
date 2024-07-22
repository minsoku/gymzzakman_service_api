import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Users } from '../dto/Users';

export const User = createParamDecorator(
  (data: keyof Users | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as Users;

    if (!user) {
      throw new InternalServerErrorException(
        'The User decorator should be used in conjunction with the AccessTokenGuard.',
      );
    }
    if (data) {
      return user[data];
    }
    return user;
  },
);
