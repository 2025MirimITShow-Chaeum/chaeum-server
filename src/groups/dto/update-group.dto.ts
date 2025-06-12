import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  subject?: string;

  @IsOptional()
  @IsString()
  color?: string;
}
