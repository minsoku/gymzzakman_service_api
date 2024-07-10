import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';
import { UtilModule } from 'src/util/util.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UtilModule, ConfigModule],
  controllers: [AwsController],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
