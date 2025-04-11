import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

// TODO : 가드 추가
@ApiTags('Users API')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '사용자 추가', description: '사용자를 추가합니다.' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: '유저 생성 성공' })
  @ApiResponse({ status: 500, description: '유저 생성 실패' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: '사용자 정보 조회',
    description: '사용자의 정보를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '유저 조회 성공' })
  @ApiResponse({ status: 404, description: '유저 정보 없음' })
  @ApiResponse({ status: 500, description: '유저 정보 조회 실패' })
  async findUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }
}
