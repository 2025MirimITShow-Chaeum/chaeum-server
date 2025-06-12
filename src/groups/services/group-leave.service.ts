import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Groups } from '../entities/group.entity';
import { GroupMembers } from '../entities/group-members.entity';

@Injectable()
export class GroupLeaveService {
  constructor(
    @InjectRepository(GroupMembers)
    private groupMembersRepository: Repository<GroupMembers>,

    @InjectRepository(Groups)
    private groupRepository: Repository<Groups>,
  ) {}

  async leaveGroup(group_id: string, user_id: string) {
    const membership = await this.groupMembersRepository.findOne({
      where: { group_id, user_id },
    });

    if (!membership) {
      throw new NotFoundException('그룹 멤버 정보를 찾을 수 없습니다.');
    }

    // 탈퇴
    await this.groupMembersRepository.remove(membership);

    // 인원수 감소
    const group = await this.groupRepository.findOne({ where: { group_id } });
    if (group) {
      group.member_counts = Math.max(0, group.member_counts - 1);
      await this.groupRepository.save(group);
    }

    return {
      status: 200,
      message: '그룹에서 성공적으로 탈퇴되었습니다.',
    };
  }
}
