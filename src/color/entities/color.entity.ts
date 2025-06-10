import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export enum ColorType {
  GROUP = 'group',
  MEMBER = 'member',
}

@Entity()
@Unique(['colorCode', 'type'])
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  colorCode: string;

  @Column({
    type: 'enum',
    enum: ColorType,
  })
  type: ColorType;
}
