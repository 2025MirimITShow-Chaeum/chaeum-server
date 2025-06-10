import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('api/group')
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @Post()
  async create(@Body() dto: CreateGroupDto) {
    return this.groupService.createGroup(dto);
  }

  @Get()
  async get(@Query('user_id') user_id: string) {
    return this.groupService.get(user_id);
  }

  // 스터디 조인
  @Post('join')
  async join(@Body() dto: JoinGroupDto) {
    return this.groupService.joinGroup(dto);
  }

  // 단일 스터디 조회
  @Get('/:group_id')
  async getGroup(@Param('group_id') group_id: string) {
    return this.groupService.getGroup(group_id);
  }

  // 스터디 정보 수정
  @Patch('/:group_id')
  async updateGroup(
    @Param('group_id') group_id: string,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.groupService.updateGroup(group_id, dto);
  }
}
