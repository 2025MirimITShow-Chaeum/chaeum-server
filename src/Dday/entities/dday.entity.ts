import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('Dday')
export class Dday {
  @PrimaryGeneratedColumn({ name: 'id' })
  uid: number;

  // 실제 외래키 값
  @Column()
  user_id: string;

  // 연결된 User 객체
  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'is_main', nullable: false, default: false })
  is_main: boolean;

  @Column({ name: 'end_at', type: 'timestamp' })
  end_at: Date;
}
