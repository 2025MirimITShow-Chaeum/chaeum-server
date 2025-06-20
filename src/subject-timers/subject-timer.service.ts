import { BadRequestException, Injectable } from '@nestjs/common';
import { SubjectTimer } from './entities/subject-timer.entity';
import { getAdjustedDate } from '../util/date-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupsService } from '../groups/groups.service';
import { UserService } from '../user/user.service';
import { TimerLogService } from '../timer-logs/timer-log.service';

@Injectable()
export class SubjectTimerService {
  constructor(
    @InjectRepository(SubjectTimer)
    private readonly subjectTimerRepo: Repository<SubjectTimer>,
    private readonly groupService: GroupsService,
    private readonly userService: UserService,
    private readonly timerLogService: TimerLogService,
  ) {}

  async getTimerStatus(
    user_id: string,
    group_id: string,
    date: string,
  ): Promise<SubjectTimer | null> {
    return this.subjectTimerRepo.findOne({
      where: { user_id, group_id, date },
    });
  }

  async getTimerAccumulatedTime(
    user_id: string,
    group_id: string,
  ): Promise<number> {
    const group = await this.groupService.getGroup(group_id);
    const date = getAdjustedDate(new Date());

    const timer = await this.subjectTimerRepo.findOne({
      where: { user_id, group_id, date },
    });

    return timer?.accumulated_sec ?? 0;
  }

  async getTimersByGroupAndUser(
    user_id: string,
    group_id: string,
  ): Promise<SubjectTimer[]> {
    return await this.subjectTimerRepo.find({
      where: { user_id, group_id },
      order: { date: 'DESC' },
    });
  }

  async getAllTimers(user_id: string): Promise<SubjectTimer[]> {
    return await this.subjectTimerRepo.find({ where: { user_id } });
  }

  async startTimer(user_id: string, group_id: string): Promise<SubjectTimer> {
    const now = new Date();
    const date = getAdjustedDate(now);

    const user = await this.userService.findUserByUid(user_id);
    const group = await this.groupService.getGroup(group_id);
    const subject = group.subject;

    let existing = await this.subjectTimerRepo.findOne({
      where: { user_id, group_id, date },
    });

    if (existing) {
      if (existing.is_running) {
        throw new BadRequestException('이미 타이머가 실행 중입니다.');
      }

      await this.subjectTimerRepo.save(existing);

      // timer_log 기록
      await this.timerLogService.addTimerLog(user_id, group_id, {
        action: 'start',
        timestamp: now,
      });

      existing.is_running = true;
      existing.started_at = now;
      return this.subjectTimerRepo.save(existing);
    }

    const newRecord = this.subjectTimerRepo.create({
      user,
      user_id,
      group: group, // grou.data에서 바꿈
      group_id: group.group_id,
      subject,
      date,
      started_at: now,
    });

    return this.subjectTimerRepo.save(newRecord);
  }

  async stopTimer(user_id: string, group_id: string): Promise<SubjectTimer> {
    const now = new Date();
    const date = getAdjustedDate(now);

    const group = await this.groupService.getGroup(group_id);
    const subject = group.subject;

    const existing = await this.subjectTimerRepo.findOne({
      where: { user_id, group_id, date },
    });

    if (!existing || !existing.is_running || !existing.started_at) {
      throw new BadRequestException('진행 중인 타이머가 없습니다.');
    }

    const diffInSeconds = Math.floor(
      (now.getTime() - new Date(existing.started_at).getTime()) / 1000,
    );

    existing.accumulated_sec += diffInSeconds;
    existing.is_running = false;
    existing.started_at = null;

    await this.subjectTimerRepo.save(existing);

    // 로그 기록
    await this.timerLogService.addTimerLog(user_id, group_id, {
      action: 'stop',
      timestamp: now,
    });

    return existing;
  }

  async getSumTime(user_id: string, date: string): Promise<number> {
    const result = await this.subjectTimerRepo
      .createQueryBuilder('timer')
      .select('SUM(timer.accumulated_sec)', 'total')
      .where('timer.user_id = :user_id', { user_id })
      .andWhere('timer.date = :date', { date })
      .getRawOne();

    // total이 null일 수도 있으니 기본 0 처리
    return Number(result.total) || 0;
  }
}
