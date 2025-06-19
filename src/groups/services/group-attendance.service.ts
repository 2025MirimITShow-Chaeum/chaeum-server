import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Groups } from '../entities/group.entity';
import { Todo } from '../../todo/entities/todo.entity';
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
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

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

    // *
    const yesterdayLog = await this.attendanceLogRepository.findOne({
      where: {
        group: { group_id },
        date: yesterday,
      },
    });

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
      if (yesterdayLog) {
        group.attendance_count = 0;
        await this.groupRepository.save(group);
      }
    }

    return {
      group_id,
      allAttended,
      group_name: group.name,
      attendance_count: group.attendance_count,
      members: attendanceResult,
      message: allAttended
        ? '오늘 모든 멤버 출석 완료!'
        : yesterdayLog
          ? '출석 실패! 출석일 0으로 초기화됨'
          : '출석 실패 (첫 출석 or 이미 실패 중)',
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

  async getUserGroupRanking(user_id: string) {
    // 유저가 속한 그룹들 가져오기
    const membership = await this.groupMembersRepository.find({
      where: { user_id },
      relations: ['group'],
    });

    const userGroups = membership.map((m) => m.group);

    if (userGroups.length === 0) {
      return [];
    }

    const allGroups = await this.groupRepository.find({
      select: ['group_id', 'name', 'attendance_count'],
    });

    // 1. attendance_count 내림차순 정렬
    const sorted = allGroups.sort(
      (a, b) => b.attendance_count - a.attendance_count,
    );

    // 2. 각 그룹에 rank 부여
    const ranked = sorted.map((group, index) => ({
      group_id: group.group_id,
      group_name: group.name,
      attendance_count: group.attendance_count,
      rank: index + 1,
    }));

    // 3. 유저가 속한 그룹만 필터링
    const userGroupIds = (
      await this.groupMembersRepository.find({
        where: { user_id },
      })
    ).map((gm) => gm.group_id);

    // return userGroupRanks;
    return ranked.filter((group) => userGroupIds.includes(group.group_id));
  }
}
