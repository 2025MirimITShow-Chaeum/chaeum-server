import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Groups } from '../entities/group.entity';
import { Repository } from 'typeorm';
import { GroupMembers } from '../entities/group-members.entity';

@Injectable()
export class GroupDeleteService {
  constructor(
    @InjectRepository(Groups)
    private groupRepository: Repository<Groups>,

    @InjectRepository(GroupMembers)
    private groupMembersRepository: Repository<GroupMembers>,
  ) {}

  async deleteGroup(group_id: string, user_id: string) {
    const group = await this.groupRepository.findOne({ where: { group_id } });

    if (!group) throw new NotFoundException('그룹을 찾을 수 없습니다.');

    const leader = await this.groupMembersRepository.findOne({
      where: { group_id, user_id },
    });

    if (!leader || leader.role !== 'leader') {
      throw new ForbiddenException('그룹 삭제 권한이 없습니다.');
    }

    // 우선 멤버부터 삭제
    await this.groupMembersRepository.delete({ group_id });

    // 그룹 삭제
    await this.groupRepository.delete({ group_id });

    return {
      message: '그룹이 성공적으로 삭제되었습니다.',
      group_id,
    };
  }
}
