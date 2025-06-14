import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/config/jwt.config';
import { HomeService } from './home.service';
import { UserInfo } from 'src/auth/decorators/user-info.decorator';

@UseGuards(JwtAuthGuard)
@ApiTags('Home API')
@ApiBearerAuth()
@Controller('api/home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @ApiOperation({
    summary: '사용자 홈 api',
    description: '사용자의 그룹, 투두, 그룹별 타이머를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '조회 성공' })
  @ApiResponse({ status: 500, description: '정보 조회 실패' })
  async findAllGroupTodoTime(@UserInfo('id') id: string) {
    return this.homeService.findAllGroupTodoTime(id);
  }
}
