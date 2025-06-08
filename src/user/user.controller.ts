import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserInfo } from '../auth/decorators/user-info.decorator';
import { JwtAuthGuard } from 'src/config/jwt.config';
import { UpdateUserInfoDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Users API')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: '사용자 정보 조회',
    description: '사용자의 정보를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '유저 조회 성공' })
  @ApiResponse({ status: 404, description: '유저 정보 없음' })
  @ApiResponse({ status: 500, description: '유저 정보 조회 실패' })
  async findUserById(@UserInfo('uid') uid: string) {
    return this.userService.findUserByUid(uid);
  }

  @Patch()
  @ApiOperation({
    summary: '회원 정보 수정',
    description: '회원 정보를 수정합니다',
  })
  @ApiBody({ type: UpdateUserInfoDto })
  @ApiResponse({ status: 200, description: '수정 성공' })
  @ApiResponse({ status: 500, description: '수정 실패' })
  async register(@UserInfo('uid') uid: string, @Body() dto: UpdateUserInfoDto) {
    return this.userService.update(uid, dto);
  }
}
