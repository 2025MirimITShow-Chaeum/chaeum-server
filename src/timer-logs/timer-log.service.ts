import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimerLog } from './entities/timer-log.entity';
import { Repository } from 'typeorm';
import { GroupsService } from 'src/groups/groups.service';
import { UserService } from 'src/user/user.service';
import { SubjectTimer } from 'src/subject-timers/entities/subject-timer.entity';

@Injectable()
export class TimerLogService {
  constructor(
    @InjectRepository(TimerLog)
    private readonly timerLogRepo: Repository<TimerLog>,

    private readonly groupServie: GroupsService,
    private readonly userService: UserService,
  ) {}

  async addTimerLog(
    user_id: string,
    group_id: string,
    dto: { action: 'start' | 'stop'; timestamp: Date },
  ) {
    const user = await this.userService.findUserByUid(user_id);
    const group = await this.groupServie.getGroup(group_id);
    const subject = group.subject;

    const log = this.timerLogRepo.create({
      user,
      user_id,
      group: group,
      group_id: group.group_id,
      subject,
      date: dto.timestamp.toISOString().slice(0, 10),
      action: dto.action,
      timestamp: dto.timestamp,
    });

    return this.timerLogRepo.save(log);
  }

  async getTimerLogs(
    user_id: string,
    group_id: string,
    date: string,
  ): Promise<TimerLog[]> {
    // const cleanedSubject = subject.replace(/[\x00-\x1F\x7F]/g, '').trim();
    return this.timerLogRepo.find({
      where: { user_id, group_id, date },
      order: { timestamp: 'ASC' },
    });
  }
}
