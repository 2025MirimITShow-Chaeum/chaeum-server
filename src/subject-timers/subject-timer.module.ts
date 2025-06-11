import { Module } from '@nestjs/common';
import { SubjectTimerService } from './subject-timer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectTimer } from './entities/subject-timer.entity';
import { UsersModule } from 'src/user/user.module';
import { GroupsModule } from 'src/groups/groups.module';
import { TimerLogModule } from 'src/timer-logs/timer-log.module';

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
