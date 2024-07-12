import { Test, TestingModule } from '@nestjs/testing';
import { FitnessCentersController } from './fitness_centers.controller';
import { FitnessCentersService } from './fitness_centers.service';

describe('FitnessCentersController', () => {
  let controller: FitnessCentersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FitnessCentersController],
      providers: [FitnessCentersService],
    }).compile();

    controller = module.get<FitnessCentersController>(FitnessCentersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
