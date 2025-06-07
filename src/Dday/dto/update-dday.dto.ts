import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDdayDTO {
  // D-day 제목
  @IsString()
  @IsNotEmpty()
  title?: string;

  // 메인 D-day 설정
  @IsBoolean()
  @IsNotEmpty()
  is_main?: boolean;

  // D-day 날짜
  @IsDate()
  @IsNotEmpty()
  end_at?: Date;
}
