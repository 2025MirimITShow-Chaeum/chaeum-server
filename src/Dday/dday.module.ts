import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DdayController } from './dday.controller';
import { DdayService } from './dday.service';
import { Dday } from './entities/dday.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dday])],
  controllers: [DdayController],
  providers: [DdayService],
})
export class DdayModule {}
