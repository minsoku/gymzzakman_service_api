import { Controller, Get, Query } from '@nestjs/common';
import { FitnessCentersService } from './fitness_centers.service';

@Controller('fitness-centers')
export class FitnessCentersController {
  constructor(private readonly fitnessCentersService: FitnessCentersService) {}

  @Get()
  getAllFitnessCenter() {
    // 임시 테스트
    const data = {
      lat: 37.4077929,
      lng: 126.6571579,
    };
    return this.fitnessCentersService.getFitnessCenter(data);
  }

  @Get('/filter')
  getFilterFitnessCenter(@Query() filter: any) {
    console.log(filter);
    return this.fitnessCentersService.getFitnessPriceByFilter(filter);
  }
}
