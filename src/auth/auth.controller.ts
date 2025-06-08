import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FirebaseLoginDto } from './dto/firebase-login.dto';
import { AuthService } from './auth.service';
import { UserInfo } from '../auth/decorators/user-info.decorator';
import { RegisterDto } from './dto/register.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Patch('register')
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입에 필요한 정보 입력 (이름 또는 프로필사진)',
  })
  @ApiBody({ type: FirebaseLoginDto })
  @ApiResponse({ status: 200, description: 'update 성공' })
  @ApiResponse({ status: 500, description: 'update 실패' })
  async register(@UserInfo('uid') uid: string, @Body() dto: RegisterDto) {
    return this.authService.register(uid, dto);
  }

  @Post('login')
  @ApiOperation({
    summary: '소셜 로그인',
    description: '사용자를 추가 또는 리턴.',
  })
  @ApiBody({ type: FirebaseLoginDto })
  @ApiResponse({ status: 201, description: '유저 생성 성공' })
  @ApiResponse({ status: 500, description: '유저 생성 실패' })
  async firebaseLogin(@Body() dto: FirebaseLoginDto) {
    return this.authService.loginWithFirebase(dto.idToken);
  }
}
