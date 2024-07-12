import { Test, TestingModule } from '@nestjs/testing';
import { FitnessCentersService } from './fitness_centers.service';

describe('FitnessCentersService', () => {
  let service: FitnessCentersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FitnessCentersService],
    }).compile();

    service = module.get<FitnessCentersService>(FitnessCentersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
