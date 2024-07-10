import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterEmail } from './dto/registerEmail';
import { FileInterceptor } from '@nestjs/platform-express';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/email')
  @UseInterceptors(FileInterceptor('file'))
  postRegisterEmail(
    @Body() body: RegisterEmail,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('NO_PROFILE_IMAGE');
    }
    return this.authService.registerEmail(body, file);
  }
  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postLoginEmail(@Body() body: any) {
    return this.authService.loginWithEmail(body);
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token, true);
    return {
      refreshToken: newToken,
    };
  }

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken,
    };
  }
}
