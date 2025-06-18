import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groups } from './entities/group.entity';
import { GroupMembers } from './entities/group-members.entity';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { User } from '../user/entities/user.entity';
import { ColorModule } from '../color/color.module';
import { GroupCreateService } from './services/group-create.service';
import { GroupQueryService } from './services/group-query.service';
import { GroupJoinService } from './services/group-join.service';
import { GroupUpdateService } from './services/group-update.service';
import { ColorService } from '../color/color.service';
import { GroupLeaveService } from './services/group-leave.service';
import { AttendanceRecords } from './entities/attendance_records.entity';
import { GroupAttendanceService } from './services/group-attendance.service';
import { Todo } from '../todo/entities/todo.entity';
import { GroupAttendanceLog } from './entities/group_attendance_log.entity';
import { AuthModule } from '../auth/auth.module';
import { GroupDeleteService } from './services/group-delete.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Groups,
      GroupMembers,
      User,
      AttendanceRecords,
      Todo,
      GroupAttendanceLog,
      AuthModule,
    ]),
    ColorModule,
  ],
  providers: [
    GroupsService,
    GroupCreateService,
    GroupJoinService,
    GroupUpdateService,
    GroupQueryService,
    GroupLeaveService,
    GroupQueryService,
    GroupAttendanceService,
    ColorService,
    GroupDeleteService,
  ],
  controllers: [GroupsController],
  exports: [GroupsService],
})
export class GroupsModule {}
