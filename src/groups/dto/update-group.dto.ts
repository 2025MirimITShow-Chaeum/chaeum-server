import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  color?: string;
}
