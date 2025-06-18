import {
  Controller,
  Body,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DdayService } from './dday.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDdayDTO } from './dto/create-dday.dto';
import { UpdateDdayDTO } from './dto/update-dday.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/auth/decorators/user-info.decorator';

@Controller('api/dday')
export class DdayController {
  constructor(private ddayService: DdayService) {}

  // D-Day 생성
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'D-Day 생성', description: 'D-Day를 생성합니다.' })
  @ApiBody({ type: CreateDdayDTO })
  @ApiResponse({ status: 201, description: 'D-Day 생성 성공' })
  @ApiResponse({ status: 500, description: 'D-Day 생성 실패' })
  async create(@UserInfo('uid') uid: string, @Body() dto: CreateDdayDTO) {
    return this.ddayService.create(dto, uid);
  }

  // D-Day 전체 조회
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: '유저별 D-Day 전체 조회' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  async getAll(@UserInfo('uid') uid: string) {
    return this.ddayService.getAllByUser(uid);
  }

  // D-Day 수정
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'D-Day 수정', description: 'D-Day를 수정합니다.' })
  @ApiBody({ type: UpdateDdayDTO })
  @ApiResponse({ status: 200, description: 'D-Day 수정 성공' })
  @ApiResponse({ status: 404, description: 'D-Day 찾을 수 없음' })
  async update(
    @UserInfo('uid') uid: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDdayDTO: UpdateDdayDTO,
  ) {
    return this.ddayService.update(id, updateDdayDTO, uid);
  }

  // D-Day 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'D-Day 삭제', description: 'D-Day를 삭제합니다.' })
  @ApiResponse({ status: 200, description: 'D-Day 삭제 성공' })
  @ApiResponse({ status: 404, description: 'D-Day가 존재하지 않습니다.' })
  async delete(
    @UserInfo('uid') uid: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ddayService.delete(id, uid);
  }
}
