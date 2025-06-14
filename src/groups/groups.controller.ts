import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GroupQueryService } from './services/group-query.service';
import { GroupAttendanceService } from './services/group-attendance.service';

@Controller('api/group')
export class GroupsController {
  constructor(
    private readonly groupService: GroupsService,
    private readonly groupQueryService: GroupQueryService,
    private readonly groupAttendanceService: GroupAttendanceService,
  ) {}

  @Get('/ranking')
  async getRanking() {
    return this.groupAttendanceService.getGroupRanking();
  }

  @Get('/ranking/user')
  async getUserGroupRanking(@Query('user_id') user_id: string) {
    return this.groupAttendanceService.getUserGroupRanking(user_id);
  }

  @Post()
  @ApiOperation({
    summary: '그룹 생성',
    description: '그룹 생성 합니다.',
  })
  @ApiResponse({ status: 200, description: '그룹 생성 성공' })
  @ApiResponse({ status: 404, description: '그룹 생성 없음' })
  @ApiResponse({ status: 500, description: '그룹 생성 실패' })
  async create(@Body() dto: CreateGroupDto) {
    return this.groupService.createGroup(dto);
  }

  @Get()
  @ApiOperation({
    summary: '그룹 정보 조회',
    description: '그룹의 정보를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '그룹 조회 성공' })
  @ApiResponse({ status: 404, description: '그룹 정보 없음' })
  @ApiResponse({ status: 500, description: '그룹 정보 조회 실패' })
  async get(@Query('user_id') user_id: string) {
    return this.groupService.get(user_id);
  }

  // 스터디 조인
  @Post('join')
  @ApiOperation({
    summary: '스터디 참가',
    description: '스터디 참가합니다.',
  })
  @ApiResponse({ status: 200, description: '그룹 참가 성공' })
  @ApiResponse({ status: 404, description: '그룹 참가 없음' })
  @ApiResponse({ status: 500, description: '그룹 참가 실패' })
  async join(@Body() dto: JoinGroupDto) {
    return this.groupService.joinGroup(dto);
  }

  // 단일 스터디 조회
  @Get('/:group_id')
  @ApiOperation({
    summary: '단일 그룹 조회',
    description: '사용자의 정보를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '단일 그룹 조회 성공' })
  @ApiResponse({ status: 404, description: '단일 그룹 정보 없음' })
  @ApiResponse({ status: 500, description: '단일 그룹 정보 조회 실패' })
  async getGroup(@Param('group_id') group_id: string) {
    return this.groupService.getGroup(group_id);
  }

  // 스터디 정보 수정
  @Patch('/:group_id')
  @ApiOperation({
    summary: '그룹 정보 수정',
    description: '그룹 정보 수정 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '그룹 정보 수정 성공' })
  @ApiResponse({ status: 404, description: '그룹 정보 수정 없음' })
  @ApiResponse({ status: 500, description: '그룹 정보 수정 실패' })
  async updateGroup(
    @Param('group_id') group_id: string,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.groupService.updateGroup(group_id, dto);
  }

  @Delete('/:group_id/leave')
  @ApiOperation({
    summary: '그룹 탈퇴',
    description: '사용자가 그룹에서 탈퇴합니다.',
  })
  @ApiResponse({ status: 200, description: '그룹 탈퇴 성공' })
  @ApiResponse({ status: 404, description: '그룹 정보 없음' })
  @ApiResponse({ status: 500, description: '그룹 탈퇴 실패' })
  async leaveGroup(
    @Param('group_id') group_id: string,
    @Query('user_id') user_id: string,
  ) {
    return this.groupService.leaveGroup(group_id, user_id);
  }

  @Get(':group_id/member/:user_id')
  async getGroupMemberDetail(
    @Param('group_id') groupId: string,
    @Param('user_id') userId: string,
  ) {
    return this.groupQueryService.getGroupMemberDetail(groupId, userId);
  }

  @Post(':group_id/attendance')
  async checkAttendance(@Param('group_id') group_id: string) {
    return this.groupAttendanceService.checkGroupAttendance(group_id);
  }
}
