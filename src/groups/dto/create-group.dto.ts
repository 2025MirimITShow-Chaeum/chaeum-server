import { IsNotEmpty, IsString, Matches, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'HEX 형식의 색상 코드여야 합니다.' })
  color: string;
}
