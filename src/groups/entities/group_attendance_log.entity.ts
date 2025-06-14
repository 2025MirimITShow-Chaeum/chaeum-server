import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Groups } from './group.entity';

@Entity()
export class GroupAttendanceLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Groups, (group) => group.attendanceLogs)
  group: Groups;

  @Column({ type: 'date' })
  date: string;
}

// group_id와 date (YYYY-MM-DD)로 출석을 한 번만 기록
