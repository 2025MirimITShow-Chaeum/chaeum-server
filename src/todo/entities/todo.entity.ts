import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Groups } from '../../groups/entities/group.entity';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn({ name: 'id' })
  uid: number;

  // 실제 외래키 값
  @Column()
  @Index()
  user_id: string;

  // 연결된 User 객체
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  @Index()
  @ManyToOne(() => Groups, (group) => group.todos)
  @JoinColumn({ name: 'group_id' })
  group_id: string;

  @Column({ name: 'title', length: 50, nullable: false })
  title: string;

  @Column({ type: 'boolean', name: 'is_completed', default: false })
  is_completed: boolean;

  @Column({ name: 'user_color', nullable: true })
  user_color: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @Column({ name: 'finished_at', type: 'timestamp', nullable: true })
  finished_at: Date;
}
