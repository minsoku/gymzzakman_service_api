import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MysqlModule } from './mysql/mysql.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { AwsModule } from './aws/aws.module';
import { UtilModule } from './util/util.module';
import { FitnessCentersModule } from './fitness_centers/fitness_centers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
      isGlobal: true,
    }),
    AuthModule,
    ConfigModule,
    MysqlModule,
    UsersModule,
    CommonModule,
    AwsModule,
    UtilModule,
    FitnessCentersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
