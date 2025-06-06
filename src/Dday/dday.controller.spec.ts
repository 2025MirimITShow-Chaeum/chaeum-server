import { Test, TestingModule } from '@nestjs/testing';
import { DdayController } from './dday.controller';

describe('DdayController', () => {
  let controller: DdayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DdayController],
    }).compile();

    controller = module.get<DdayController>(DdayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
