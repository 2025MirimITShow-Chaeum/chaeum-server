import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Groups } from './group.entity';
import { User } from '../../user/entities/user.entity';

@Entity('attendance_records')
export class AttendanceRecords {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  group_id: string;

  @Column()
  user_id: string;

  @Column({ default: false })
  attended: boolean;

  @Column({ type: 'timestamp' })
  attended_at: Date;

  // 관계 설정
  @ManyToOne(() => Groups)
  @JoinColumn({ name: 'group_id' })
  group: Groups;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
