import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { typeORMConfig } from './ormconfig';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { DdayModule } from './Dday/dday.module';
import { GroupsModule } from './groups/groups.module';
import { ColorModule } from './color/color.module';
import { ColorController } from './color/color.controller';
import { SubjectTimerModule } from './subject-timers/subject-timer.module';
import { TimerLogModule } from './timer-logs/timer-log.module';
import { TimersModule } from './timers/timers.module';
import { TodoModule } from './todo/todo.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeORMConfig),
    FirebaseModule,
    AuthModule,
    DdayModule,
    GroupsModule,
    ColorModule,
    TimersModule,
    SubjectTimerModule,
    TimerLogModule,
    TodoModule,
    HomeModule,
  ],
  controllers: [AppController, ColorController],
  providers: [AppService],
})
export class AppModule {}
