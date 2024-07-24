import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterEmail } from './dto/registerEmail';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from 'src/users/users.service';
import {
  ENV_HASH_ROUNDS_KEY,
  ENV_JWT_SECRET_KEY,
} from 'src/common/const/env-keys.const';
import { Users } from 'src/users/dto/Users';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      });
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('verifyToken : Token expired or invalid');
    }
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      complete: true,
    });
    if (decoded?.payload?.type !== 'refresh') {
      throw new UnauthorizedException(
        'rotateToken : Token refresh is only possible with a Refresh token.',
      );
    }
    return this.signToken(
      {
        ...decoded,
      },
      isRefreshToken,
    );
  }

  extractTokenFromHeader(header: string, isBearer: boolean): string {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new Error('extractTokenFromHeader : Token is not valid');
    }
    return splitToken[1];
  }

  decodeBasicToken(base64Token: string) {
    const decodedToken = Buffer.from(base64Token, 'base64').toString('utf-8');
    const split = decodedToken.split(':');

    if (split.length !== 2) {
      throw new Error('decodeBasicToken : Invalid Token');
    }

    const [email, password] = decodedToken.split(':');
    return { email, password };
  }

  signToken(
    user: Pick<
      Users,
      'user_id' | 'email' | 'name' | 'nickname' | 'profileImage'
    >,
    isAccessToken: boolean,
  ) {
    const payload = {
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      sub: user.user_id,
      type: isAccessToken ? 'access' : 'refresh',
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get(ENV_JWT_SECRET_KEY),
      algorithm: 'HS256',
      expiresIn: isAccessToken ? '1h' : '6h',
    });
  }

  loginUser(
    user: Pick<
      Users,
      'user_id' | 'email' | 'name' | 'nickname' | 'profileImage'
    >,
  ) {
    return {
      accessToken: this.signToken(user, true),
      refreshToken: this.signToken(user, false),
      id: user.user_id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      profileImage: user.profileImage,
    };
  }

  async authenticateWithEmail(user: Pick<Users, 'email' | 'password'>) {
    const existingUser = await this.usersService.existEmail(user.email);
    if (!existingUser) {
      throw new NotFoundException('authenticateWithEmail : USER_NOT_FOUND');
    }
    const passOk = await bcrypt.compare(user.password, existingUser.password);
    if (!passOk) {
      throw new UnauthorizedException(
        'authenticateWithEmail : PASSWORD_NOT_MATCH',
      );
    } else {
      return existingUser;
    }
  }

  async loginWithEmail(user: Pick<Users, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmail(user);
    return this.loginUser(existingUser);
  }

  async registerEmail(user: RegisterEmail, file: Express.Multer.File) {
    const hash = await bcrypt.hash(
      user.password,
      parseInt(this.configService.get(ENV_HASH_ROUNDS_KEY)),
    );
    await this.usersService.createUser(
      {
        email: user.email,
        password: hash,
        name: user.name,
        phoneNumber: user.phoneNumber,
        nickname: user.nickname,
        profileImage: user.profileImage,
      },
      file,
    );
  }
}
