import { Module } from '@nestjs/common';
import { MysqlService } from './mysql.service';
import { MysqlController } from './mysql.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [MysqlController],
  providers: [MysqlService],
  exports: [MysqlService],
})
export class MysqlModule {}
