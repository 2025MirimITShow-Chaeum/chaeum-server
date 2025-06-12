// groups.service.ts
import { Injectable } from '@nestjs/common';
import { GroupCreateService } from './services/group-create.service';
import { GroupQueryService } from './services/group-query.service';
import { GroupJoinService } from './services/group-join.service';
import { GroupUpdateService } from './services/group-update.service';
import { GroupLeaveService } from './services/group-leave.service';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupCreateService: GroupCreateService,
    private readonly groupQueryService: GroupQueryService,
    private readonly groupJoinService: GroupJoinService,
    private readonly groupUpdateService: GroupUpdateService,
    private readonly groupLeaveService: GroupLeaveService,
  ) {}

  async createGroup(dto: any) {
    return await this.groupCreateService.createGroup(dto);
  }

  async get(user_id: string) {
    return await this.groupQueryService.getGroupsByUser(user_id);
  }

  async joinGroup(dto: any) {
    return await this.groupJoinService.joinGroup(dto);
  }

  async getGroup(group_id: string) {
    return await this.groupQueryService.getGroup(group_id);
  }

  async updateGroup(group_id: string, dto: any) {
    return await this.groupUpdateService.updateGroup(group_id, dto);
  }

  async leaveGroup(group_id: string, user_id: string) {
    return await this.groupLeaveService.leaveGroup(group_id, user_id);
  }
}
