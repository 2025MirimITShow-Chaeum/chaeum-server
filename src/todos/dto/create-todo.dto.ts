import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateTodoDTO {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'user 테이블에서 가져온 user_id' })
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'group 테이블에서 가져온 group_id' })
  group_id: string;

  // TODO: 어떻게 조인할지 상의
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'user_color' })
  user_color: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'title : 할 일 제목' })
  title: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: 'status : 할 일 상태' })
  status: boolean;
}
