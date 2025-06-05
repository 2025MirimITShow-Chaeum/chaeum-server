import { Module } from '@nestjs/common';
import { DdayController } from './dday.controller';
import { DdayService } from './dday.service';

@Module({
  controllers: [DdayController],
  providers: [DdayService],
})
export class DdayModule {}
