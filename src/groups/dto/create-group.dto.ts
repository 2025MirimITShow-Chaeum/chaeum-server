import { IsNotEmpty, IsString, Matches, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'HEX 형식의 색상 코드여야 합니다.' })
  color: string;

  @IsUUID()
  user_id: string;
}
