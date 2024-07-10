import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom, throwError } from 'rxjs';
import { AxiosError } from 'axios';

import { MysqlService } from 'src/mysql/mysql.service';
import { Users } from './dto/Users';
import { RegisterEmail } from 'src/auth/dto/registerEmail';
import { HttpService } from '@nestjs/axios';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly mysqlService: MysqlService,
    private readonly httpService: HttpService,
    private readonly awsService: AwsService,
  ) {}

  async existNickname(nickname: string) {
    const existNicknameQuery = `SELECT * FROM USERS WHERE nickname = '${nickname}'`;
    const existNickname = (await this.mysqlService.query(
      existNicknameQuery,
    )) as Users[] | [];

    if (existNickname.length > 0) {
      console.error('EXIST_NICKNAME');
      throw new BadRequestException('EXIST_NICKNAME');
    }
    return true;
  }

  async existPhoneNumber(phoneNumber: string) {
    const existPhoneNumberQuery = `SELECT * FROM USERS WHERE phoneNumber = '${phoneNumber}'`;
    const existPhoneNumber = (await this.mysqlService.query(
      existPhoneNumberQuery,
    )) as Users[] | [];

    if (existPhoneNumber.length > 0) {
      console.error('EXIST_PHONE');
      throw new BadRequestException('EXIST_PHONE');
    }
    return true;
  }

  async existEmail(email: string) {
    const existEmailQuery = `SELECT * FROM USERS WHERE email = '${email}'`;
    const existEmail = (await this.mysqlService.query(existEmailQuery)) as
      | Users[]
      | [];

    if (existEmail.length > 0) {
      console.error('EXIST_EMAIL');
      throw new BadRequestException('EXIST_EMAIL');
    }
    return true;
  }
  async createUser(user: RegisterEmail, file: Express.Multer.File) {
    const existEmail = await this.existEmail(user.email);
    const existNickname = await this.existNickname(user.nickname);
    const existPhoneNumber = await this.existPhoneNumber(user.phoneNumber);
    const profileImage = await this.awsService.saveImage(file, 'profile');

    if (existEmail && existNickname && existPhoneNumber) {
      const url = 'http://localhost:4000/auth/register/email';
      const data: RegisterEmail = {
        email: user.email,
        password: user.password,
        name: user.name,
        phoneNumber: user.phoneNumber,
        nickname: user.nickname,
        profileImage,
      };

      try {
        // firstValueFrom으로 Observable을 Promise 객체로 변환
        const response = await firstValueFrom(this.httpService.post(url, data));
        return { statusCode: response.status, success: true };
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Axios 오류:', error);
          return throwError(() => new Error('내부 서버 오류가 발생했습니다'));
        }
        throw error; // 예상치 못한 오류는 다시 throw
      }
    }
  }
}
