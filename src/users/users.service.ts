import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
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
    const existNicknameQuery = 'SELECT * FROM USERS WHERE nickname = ?';
    const existNickname = (await this.mysqlService.query(existNicknameQuery, [
      nickname,
    ])) as Users[] | [];

    return existNickname[0]?.nickname;
  }

  async existPhoneNumber(phoneNumber: string) {
    const existPhoneNumberQuery = 'SELECT * FROM USERS WHERE phoneNumber = ?';
    const existPhoneNumber = (await this.mysqlService.query(
      existPhoneNumberQuery,
      [phoneNumber],
    )) as Users[] | [];

    return existPhoneNumber[0]?.phoneNumber;
  }

  async existEmail(email: string) {
    const existEmailQuery = 'SELECT * FROM USERS WHERE email = ?';
    const existEmail = (await this.mysqlService.query(existEmailQuery, [
      email,
    ])) as Users[] | [];
    return existEmail[0];
  }
  async createUser(user: RegisterEmail, file: Express.Multer.File) {
    const existEmail = await this.existEmail(user.email);
    const existNickname = await this.existNickname(user.nickname);
    const existPhoneNumber = await this.existPhoneNumber(user.phoneNumber);
    if (existEmail) {
      throw new HttpException('EMAIL_ALREADY_EXIST', HttpStatus.CONFLICT);
    }
    if (existNickname) {
      throw new HttpException('NICKMANE_ALREADY_EXIST', HttpStatus.CONFLICT);
    }
    if (existPhoneNumber) {
      throw new HttpException('PHONENUMBER_ALREADY_EXIST', HttpStatus.CONFLICT);
    }

    const profileImage = await this.awsService.saveImage(file, 'profile');

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
      return {
        statusCode: response.status,
        success: true,
        message: 'Registration successful',
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Axios 오류:', error);
        return new Error('내부 서버 오류가 발생했습니다');
      }
      throw error; // 예상치 못한 오류는 다시 throw
    }
  }
}
