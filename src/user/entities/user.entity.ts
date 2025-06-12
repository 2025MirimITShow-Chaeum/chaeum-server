import { SubjectTimer } from 'src/subject-timers/entities/subject-timer.entity';
import { TimerLog } from 'src/timer-logs/entities/timer-log.entity';
import { Dday } from 'src/Dday/entities/dday.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn({ name: 'uid', unique: true, nullable: false })
  uid: string;

  @Column({ name: 'provider', length: 50, nullable: false })
  provider: string;

  @Column({ name: 'email', length: 100, nullable: false })
  email: string;

  @Column({ name: 'nickname', length: 50, unique: true, nullable: true })
  nickname?: string;

  @Column({ name: 'profile_image', nullable: true, default: './img' })
  profile_image?: string;

  @Column({ name: 'slogan', length: 50, nullable: true })
  slogan?: string;

  @Column({ name: 'likes', nullable: true, default: 0 })
  likes?: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @OneToMany(() => SubjectTimer, (subjectTimer) => subjectTimer.user)
  subject_timers: SubjectTimer[];

  @OneToMany(() => TimerLog, (timer_log) => timer_log.user)
  timer_logs: TimerLog[];

  @OneToMany(() => Dday, (dday) => dday.user)
  ddays: Dday[];
}
