import { Module } from '@nestjs/common';
import { FitnessCentersService } from './fitness_centers.service';
import { FitnessCentersController } from './fitness_centers.controller';
import { MysqlModule } from 'src/mysql/mysql.module';

@Module({
  imports: [MysqlModule],
  controllers: [FitnessCentersController],
  providers: [FitnessCentersService],
})
export class FitnessCentersModule {}
