import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'provider', length: 50, nullable: false })
  provider: string;

  @Column({ name: 'email', length: 100, nullable: false })
  email: string;

  @Column({ name: 'nickname', length: 50, unique: true })
  nickname?: string;

  @Column({ name: 'profile_image', nullable: false, default: './img' })
  profile_image: string;

  @Column({ name: 'slogan', length: 50, nullable: true })
  slogan?: string;

  @Column({ name: 'likes', nullable: true, default: 0 })
  likes: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
