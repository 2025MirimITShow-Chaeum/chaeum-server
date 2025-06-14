import { User } from 'src/user/entities/user.entity';
import { Groups } from '../../groups/entities/group.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['user_id', 'group', 'date']) // 같은 유저 - 과목 - 날짜 중복 방지
export class SubjectTimer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.subject_timers, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  user_id: string;

  @ManyToOne(() => Groups, (group) => group.subject_timers)
  group: Groups;

  @Column()
  group_id: string;

  @Column({ nullable: true })
  subject: string; // group의 subject

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD 형식으로 저장

  @Column({ type: 'timestamp', nullable: true })
  started_at?: Date | null;

  @Column({ type: 'boolean', default: true })
  is_running: boolean;

  @Column({ type: 'int', default: 0 })
  accumulated_sec: number; // 타이머 누적 시간(초)

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
