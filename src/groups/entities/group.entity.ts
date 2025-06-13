import { SubjectTimer } from 'src/subject-timers/entities/subject-timer.entity';
import { TimerLog } from 'src/timer-logs/entities/timer-log.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('groups')
export class Groups {
  @PrimaryColumn()
  group_id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 500, nullable: true })
  subject: string;

  @Column()
  color: string;

  @Column({ default: 0 })
  attendance_count: number;

  @Column({ default: 0 })
  member_counts: number;

  @Column('text', { array: true, default: [], nullable: true })
  join_members: string[];

  @Column({ length: 10, nullable: true }) // nullable은 지우기(test용)
  secret_code: string;

  @CreateDateColumn({ name: 'create_at' })
  create_at: Date;

  @OneToMany(() => SubjectTimer, (subjectTimer) => subjectTimer.group)
  subject_timers: SubjectTimer[];

  @OneToMany(() => TimerLog, (timer_log) => timer_log.group)
  timer_logs: TimerLog[];
}
