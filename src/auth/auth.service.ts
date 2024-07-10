import { Injectable } from '@nestjs/common';
import { RegisterEmail } from './dto/registerEmail';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from 'src/users/users.service';
import { ENV_HASH_ROUNDS_KEY } from 'src/common/const/env-keys.const';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}
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
