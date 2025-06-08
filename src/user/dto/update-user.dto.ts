import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserInfoDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Nickname', default: 'julie' })
  nickname?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'profile_image', default: '(사진 링크)' })
  profile_image?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'slogan', default: '일취월장.' })
  slogan?: string;
}
