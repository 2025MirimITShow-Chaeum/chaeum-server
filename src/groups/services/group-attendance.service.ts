import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Groups } from '../entities/group.entity';
import { Todo } from 'src/todo/entities/todo.entity';
import { GroupMembers } from '../entities/group-members.entity';
import { GroupAttendanceLog } from '../entities/group_attendance_log.entity';
import dayjs from 'dayjs';

export class GroupAttendanceService {
  constructor(
    @InjectRepository(Groups)
    private groupRepository: Repository<Groups>,

    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,

    @InjectRepository(GroupMembers)
    private groupMembersRepository: Repository<GroupMembers>,

    @InjectRepository(GroupAttendanceLog)
    private attendanceLogRepository: Repository<GroupAttendanceLog>,
  ) {}

  async checkGroupAttendance(group_id: string): Promise<any> {
    const group = await this.groupRepository.findOne({ where: { group_id } });
    if (!group) {
      throw new Error('그룹을 찾을 수 없습니다.');
    }

    const today = dayjs().format('YYYY-MM-DD'); // YYYY-MM-DD 포맷 문자열

    // 오늘 이미 출석 로그가 있는지 체크
    const existingLog = await this.attendanceLogRepository.findOne({
      where: {
        group: { group_id },
        date: today,
      },
      relations: ['group'],
    });

    if (existingLog) {
      return {
        group_id,
        alreadyChecked: true,
        group_name: group.name,
        attendance_count: group.attendance_count,
        message: '이미 오늘 출석 체크가 완료되었습니다.',
      };
    }

    const startOfToday = dayjs().startOf('day').toDate();
    const endOfToday = dayjs().endOf('day').toDate();

    // 그룹 멤버 조회
    const members = await this.groupMembersRepository.find({
      where: { group_id },
    });

    // 멤버별로 오늘 완료한 투두가 있는지 확인
    const attendanceResult = await Promise.all(
      members.map(async (member) => {
        const todos = await this.todosRepository.find({
          where: {
            user_id: member.user_id,
            group_id: group_id,
            is_completed: true,
            finished_at: Between(startOfToday, endOfToday),
          },
        });

        return {
          user_id: member.user_id,
          attended: todos.length > 0, // 오늘 1개 이상의 투두를 완료했는지 확인
        };
      }),
    );

    // 모든 멤버가 출석했는지 여부
    const allAttended = attendanceResult.every((member) => member.attended);

    if (allAttended) {
      const log = this.attendanceLogRepository.create({
        group,
        date: today,
      });
      await this.attendanceLogRepository.save(log);

      group.attendance_count += 1;
      await this.groupRepository.save(group);
    } else {
      group.attendance_count = 0;
      await this.groupRepository.save(group);
    }

    return {
      group_id,
      allAttended,
      group_name: group.name,
      attendance_count: group.attendance_count,
      members: attendanceResult,
      message: allAttended
        ? '오늘 모든 멤버 출석 완료!'
        : '누락된 인원이 있어 출석 실패.',
    };
  }

  async getGroupRanking(): Promise<
    { group_id: string; group_name: string; attendance_count: number }[]
  > {
    const groups = await this.groupRepository.find({
      order: {
        attendance_count: 'DESC',
      },
    });

    return groups.map((g) => ({
      group_id: g.group_id,
      group_name: g.name,
      attendance_count: g.attendance_count,
    }));
  }
}
