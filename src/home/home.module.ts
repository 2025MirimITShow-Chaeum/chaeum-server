import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { TodoModule } from 'src/todo/todo.module';
import { GroupsModule } from 'src/groups/groups.module';
import { SubjectTimerModule } from 'src/subject-timers/subject-timer.module';
import { HomeService } from './home.service';

@Module({
  imports: [TodoModule, GroupsModule, SubjectTimerModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
