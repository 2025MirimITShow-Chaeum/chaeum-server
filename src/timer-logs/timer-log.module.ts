import { Module } from '@nestjs/common';
import { TimerLogService } from './timer-log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimerLog } from './entities/timer-log.entity';
import { UsersModule } from 'src/user/user.module';
import { GroupsModule } from 'src/groups/groups.module';
import { SubjectTimer } from 'src/subject-timers/entities/subject-timer.entity';
import { TimerLogController } from './timer-logs.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimerLog, SubjectTimer]),
    UsersModule,
    GroupsModule,
  ],
  providers: [TimerLogService],
  controllers: [TimerLogController],
  exports: [TimerLogService],
})
export class TimerLogModule {}
