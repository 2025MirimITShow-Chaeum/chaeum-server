import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'provider', default: 'test@test.com' })
  provider: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'email', default: 'test@test.com' })
  email: string;
}
