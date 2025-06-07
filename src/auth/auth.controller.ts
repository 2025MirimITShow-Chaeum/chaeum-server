import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FirebaseLoginDto } from './dto/firebase-login.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
