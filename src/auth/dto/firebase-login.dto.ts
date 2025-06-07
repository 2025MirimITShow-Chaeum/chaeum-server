import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FirebaseLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID Token', default: 'idToken: {...}' })
  idToken: string;
}
