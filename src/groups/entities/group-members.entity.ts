import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Groups } from './group.entity';

export enum GroupRole {
  MEMBER = 'member',
  LEADER = 'leader',
}

@Entity('group_members')
export class GroupMembers {
  @PrimaryColumn()
  member_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @ManyToOne(() => Groups)
  @JoinColumn({ name: 'group_id' })
  group: Groups;

  @Column()
  group_id: string;

  @Column({
    type: 'enum',
    enum: GroupRole,
    default: GroupRole.MEMBER,
  })
  role: GroupRole;

  @Column({ nullable: true })
  color: string;

  @Column()
  created_at: Date;
}
