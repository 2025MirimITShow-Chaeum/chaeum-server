import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
