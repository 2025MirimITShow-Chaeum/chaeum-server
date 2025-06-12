import { NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Groups } from '../entities/group.entity';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { Injectable } from '@nestjs/common';
import { GroupMembers } from '../entities/group-members.entity';

@Injectable()
export class GroupUpdateService {
  constructor(
    @InjectRepository(Groups)
    private groupRepository: Repository<Groups>,

    @InjectRepository(GroupMembers)
    private groupMembersRepository: Repository<GroupMembers>,
  ) {}

  // 그룹 정보 수정
  async updateGroup(group_id: string, dto: UpdateGroupDto) {
    const group = await this.groupRepository.findOne({
      where: { group_id },
    });

    if (!group) {
      throw new NotFoundException('해당 그룹을 찾을 수 없습니다.');
    }

    if (dto.name !== undefined && dto.name.trim() !== '') {
      group.name = dto.name;
    }
    if (dto.color !== undefined && dto.color.trim() !== '') {
      group.color = dto.color;
    }

    await this.groupRepository.save(group);

    const members = await this.groupMembersRepository.find({
      where: { group_id },
      relations: ['user'],
    });

    return {
      status: HttpStatus.OK,
      message: '그룹 정보가 수정되었습니다.',
      data: {
        group_id: group.group_id,
        name: group.name ?? '이름 없음',
        color: group.color,
        attendance_count: group.attendance_count,
        member_count: group.member_counts,
        secret_code: group.secret_code,
        create_at: group.create_at,
      },
    };
  }
}
