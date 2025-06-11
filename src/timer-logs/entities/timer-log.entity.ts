import { Groups } from 'src/groups/entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

@Entity({ name: 'timer_logs' })
@Unique(['user_id', 'subject', 'date', 'action', 'timestamp'])
export class TimerLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.timer_logs, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  user_id: string;

  @ManyToOne(() => Groups, (group) => group.timer_logs)
  group: Groups;

  @Column()
  subject: string;

  @Column({ length: 10 })
  date: string;

  @Column({ type: 'enum', enum: ['start', 'stop'] })
  action: 'start' | 'stop';

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
