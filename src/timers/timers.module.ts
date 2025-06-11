import { Module } from '@nestjs/common';
import { TimersController } from './timers.controller';
import { SubjectTimerModule } from 'src/subject-timers/subject-timer.module';
import { TimerLogModule } from 'src/timer-logs/timer-log.module';

@Module({
  imports: [SubjectTimerModule, TimerLogModule],
  controllers: [TimersController],
})
export class TimersModule {}
