import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MysqlModule } from 'src/mysql/mysql.module';
import { HttpModule } from '@nestjs/axios';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [MysqlModule, HttpModule, AwsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
