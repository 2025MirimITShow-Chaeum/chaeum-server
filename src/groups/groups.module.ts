import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groups } from './entities/group.entity';
import { GroupMembers } from './entities/group-members.entity';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { User } from 'src/user/entities/user.entity';
import { ColorModule } from 'src/color/color.module';
import { GroupCreateService } from './services/group-create.service';
import { GroupQueryService } from './services/group-query.service';
import { GroupJoinService } from './services/group-join.service';
import { GroupUpdateService } from './services/group-update.service';
import { ColorService } from 'src/color/color.service';
import { GroupLeaveService } from './services/group-leave.service';
import { AttendanceRecords } from './entities/attendance_records.entity';
import { GroupAttendanceService } from './services/group-attendance.service';
import { Todo } from 'src/todo/entities/todo.entity';
import { GroupAttendanceLog } from './entities/group_attendance_log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Groups,
      GroupMembers,
      User,
      AttendanceRecords,
      Todo,
      GroupAttendanceLog,
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
  ],
  controllers: [GroupsController],
  exports: [GroupsService],
})
export class GroupsModule {}
