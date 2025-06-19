import { Module } from '@nestjs/common';
import { TimersController } from './timers.controller';
import { SubjectTimerModule } from '../subject-timers/subject-timer.module';
import { TimerLogModule } from '../timer-logs/timer-log.module';

@Module({
  imports: [SubjectTimerModule, TimerLogModule],
  controllers: [TimersController],
})
export class TimersModule {}
