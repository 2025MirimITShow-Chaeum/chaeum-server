import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DdayController } from './dday.controller';
import { DdayService } from './dday.service';
import { Dday } from './entities/dday.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dday, User])],
  controllers: [DdayController],
  providers: [DdayService],
})
export class DdayModule {}
