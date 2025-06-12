import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTodoDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_completed?: boolean;
}
