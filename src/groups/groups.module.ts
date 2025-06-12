import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groups } from './entities/group.entity';
import { GroupMembers } from './entities/group-members.entity';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { User } from 'src/user/entities/user.entity';
import { ColorModule } from 'src/color/color.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Groups, GroupMembers, User]),
    ColorModule,
  ],
  providers: [GroupsService],
  controllers: [GroupsController],
  exports: [GroupsService],
})
export class GroupsModule {}
