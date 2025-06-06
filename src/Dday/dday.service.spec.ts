import { Test, TestingModule } from '@nestjs/testing';
import { DdayService } from './dday.service';

describe('DdayService', () => {
  let service: DdayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DdayService],
    }).compile();

    service = module.get<DdayService>(DdayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
