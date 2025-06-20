import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateTodoDTO {
  // user 테이블에서 가져온 user_id
  // @IsString()
  // @IsNotEmpty()
  // user_id: string;

  // group 테이블에서 가져온 group_id
  @IsString()
  @IsNotEmpty()
  group_id: string;

  // 투두두 제목
  @IsString()
  @IsNotEmpty()
  title: string;

  // 투두 상태
  // @IsBoolean()
  // @IsNotEmpty()
  // is_completed: boolean;
}
