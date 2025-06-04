import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('todos')
export class Todos {
  @PrimaryGeneratedColumn({ name: 'id' })
  uid: number;

  // 실제 외래키 값
  @Column()
  user_id: string;

  // 연결된 User 객체
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // TODO: FK - group_id
  @Column({ name: 'group_id', length: 50, nullable: false })
  group_id: string;

  @Column({ name: 'title', length: 50, nullable: false })
  title: string;

  @Column({ name: 'is_completed', default: false })
  status: boolean;

  @Column({ name: 'user_color', nullable: true })
  user_color: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @Column({ name: 'end_at', type: 'timestamp' })
  end_at: Date;
}
