import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { typeORMConfig } from './ormconfig';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { DdayModule } from './dday/dday.module';
import { GroupsModule } from './groups/groups.module';
import { ColorModule } from './color/color.module';
import { ColorService } from './color/color.service';
import { ColorController } from './color/color.controller';

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
  ],
  controllers: [AppController, ColorController],
  providers: [AppService],
})
export class AppModule {}
