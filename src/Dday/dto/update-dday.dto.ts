import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDdayDTO {
  // D-day 제목
  @IsOptional()
  @IsString()
  title?: string;

  // 메인 D-day 설정
  @IsOptional()
  @IsBoolean()
  is_main?: boolean;

  // D-day 날짜
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  end_at?: Date;
}
