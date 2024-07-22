import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CommonModule } from 'src/common/common.module';
import { AwsModule } from 'src/aws/aws.module';
import { MysqlModule } from 'src/mysql/mysql.module';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    CommonModule,
    AwsModule,
    MysqlModule,
    HttpModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
