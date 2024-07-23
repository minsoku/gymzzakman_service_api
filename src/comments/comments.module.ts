import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MysqlModule } from 'src/mysql/mysql.module';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MysqlModule, HttpModule, UsersModule, AuthModule, ConfigModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
