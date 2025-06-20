import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GroupQueryService } from './services/group-query.service';
import { GroupAttendanceService } from './services/group-attendance.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from '../auth/decorators/user-info.decorator';
import { Groups } from './entities/group.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('api/group')
export class GroupsController {
  constructor(
    private readonly groupService: GroupsService,
    private readonly groupQueryService: GroupQueryService,
    private readonly groupAttendanceService: GroupAttendanceService,

    @InjectRepository(Groups)
    private readonly groupRepository: Repository<Groups>,
  ) {}

  @Get('/ranking')
  async getRanking() {
    return this.groupAttendanceService.getGroupRanking();
  }

  @Get('/ranking/user')
  async getUserGroupRanking(@UserInfo('uid') uid: string) {
    return this.groupAttendanceService.getUserGroupRanking(uid);
  }

  @Post()
  @ApiOperation({
    summary: '그룹 생성',
    description: '그룹 생성 합니다.',
  })
  @ApiResponse({ status: 200, description: '그룹 생성 성공' })
  @ApiResponse({ status: 404, description: '그룹 생성 없음' })
  @ApiResponse({ status: 500, description: '그룹 생성 실패' })
  async create(@UserInfo('uid') uid: string, @Body() dto: CreateGroupDto) {
    return this.groupService.createGroup(uid, dto);
  }

  @Get()
  @ApiOperation({
    summary: '그룹 정보 조회',
    description: '그룹의 정보를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '그룹 조회 성공' })
  @ApiResponse({ status: 404, description: '그룹 정보 없음' })
  @ApiResponse({ status: 500, description: '그룹 정보 조회 실패' })
  async get(@UserInfo('uid') uid: string) {
    return this.groupService.get(uid);
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
  async join(@UserInfo('uid') uid: string, @Body() dto: JoinGroupDto) {
    return this.groupService.joinGroup(uid, dto);
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
    @UserInfo('uid') uid: string,
  ) {
    return this.groupService.leaveGroup(group_id, uid);
  }

  @Get(':group_id/member')
  async getGroupMemberDetail(
    @Param('group_id') group_id: string,
    @UserInfo('uid') uid: string,
  ) {
    return this.groupQueryService.getGroupMemberDetail(group_id, uid);
  }

  @Post(':group_id/attendance')
  async checkAttendance(@Param('group_id') group_id: string) {
    return this.groupAttendanceService.checkGroupAttendance(group_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:group_id')
  @ApiOperation({ summary: '그룹 삭제', description: '그룹을 삭제합니다.' })
  @ApiResponse({ status: 200, description: '그룹 삭제 성공' })
  @ApiResponse({ status: 404, description: '그룹 없음' })
  @ApiResponse({ status: 500, description: '삭제 실패' })
  async deleteGroup(
    @Param('group_id') group_id: string,
    @UserInfo('uid') uid: string,
  ) {
    return this.groupService.deleteGroup(group_id, uid);
  }

  // 출석일 수정
  @Patch(':group_id/attendance-count')
  async updateAttendanceCount(
    @Param('group_id') group_id: string,
    @Body('attendance_count') attendanceCount: number,
  ) {
    const group = await this.groupRepository.findOne({ where: { group_id } });
    if (!group) throw new NotFoundException('Group not found');

    group.attendance_count = attendanceCount;
    await this.groupRepository.save(group);

    return {
      message: `출석 카운트가 ${attendanceCount}로 업데이트되었습니다.`,
      group_id,
      attendance_count: group.attendance_count,
    };
  }
}
