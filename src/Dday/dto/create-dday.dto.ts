import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDdayDTO {
  // user 테이블에서 가져온 user_id
  @IsString()
  @IsNotEmpty()
  user_id: string;

  // D-day 제목
  @IsString()
  @IsNotEmpty()
  title: string;

  // 메인 D-day 설정
  @IsBoolean()
  @IsNotEmpty()
  is_main: boolean;

  // D-day 날짜
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  end_at: Date;
}
