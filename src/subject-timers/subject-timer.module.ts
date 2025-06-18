import { Module } from '@nestjs/common';
import { SubjectTimerService } from './subject-timer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../user/user.module';
import { GroupsModule } from '../groups/groups.module';
import { TimerLogModule } from '../timer-logs/timer-log.module';
import { SubjectTimer } from './entities/subject-timer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubjectTimer]),
    UsersModule,
    GroupsModule,
    TimerLogModule,
  ],
  providers: [SubjectTimerService],
  exports: [SubjectTimerService],
})
export class SubjectTimerModule {}
