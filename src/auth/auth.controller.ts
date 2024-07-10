import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterEmail } from './dto/registerEmail';
import { FileInterceptor } from '@nestjs/platform-express';

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
}
