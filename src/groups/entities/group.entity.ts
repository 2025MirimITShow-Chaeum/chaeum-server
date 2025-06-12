import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('groups')
export class Groups {
  @PrimaryColumn()
  group_id: string;

  @Column({ length: 100 })
  name: string;

  // @Column({ length: 500 })
  // subject: string;

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
}
