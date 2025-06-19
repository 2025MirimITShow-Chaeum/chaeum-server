import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { TodoModule } from '../todo/todo.module';
import { GroupsModule } from '../groups/groups.module';
import { SubjectTimerModule } from '../subject-timers/subject-timer.module';
import { HomeService } from './home.service';

@Module({
  imports: [TodoModule, GroupsModule, SubjectTimerModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
