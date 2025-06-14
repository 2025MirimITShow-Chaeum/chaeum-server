import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GroupMembers } from '../entities/group-members.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Groups } from '../entities/group.entity';
import { Injectable } from '@nestjs/common';
import { GroupMemberDetailDto } from '../dto/group-member-detail.dto';
import { AttendanceRecords } from '../entities/attendance_records.entity';

@Injectable()
export class GroupQueryService {
  constructor(
    @InjectRepository(GroupMembers)
    private groupMembersRepository: Repository<GroupMembers>,

    @InjectRepository(Groups)
    private groupRepository?: Repository<Groups>,

    @InjectRepository(AttendanceRecords)
    private attendanceRepository?: Repository<AttendanceRecords>,
  ) {}

  // 사용자 ID로 속한 그룹 목록 조회
  async getGroupsByUser(user_id: string) {
    const groups = await this.groupMembersRepository.find({
      where: { user_id },
      relations: ['group'],
    });

    return groups.map((member) => ({
      group_id: member.group.group_id,
      name: member.group.name,
      color: member.group.color,
      role: member.role,
    }));
  }

  // 그룹 ID로 그룹 정보 조회
  async getGroup(group_id: string) {
    if (!this.groupRepository) {
      throw new Error('groupRepository not provided');
    }

    const group = await this.groupRepository.findOne({
      where: { group_id },
    });

    if (!group) throw new NotFoundException('그룹을 찾을 수 없습니다.');

    const members = await this.groupMembersRepository.find({
      where: { group_id },
      relations: ['user'], // 'user' 엔티티를 가져오기 위해 필요
    });

    // 멤버 정보 가공
    const memberList = members.map((member) => ({
      uid: member.user.uid,
      nickname: member.user.nickname ?? '이름 없음',
      profileImage: member.user.profile_image ?? '',
      color: member.color,
      role: member.role,
    }));

    return {
      group_id: group.group_id,
      name: group.name,
      color: group.color,
      subject: group.subject,
      member_count: members.length,
      members: memberList,
      secret_code: group.secret_code,
    };
  }

  async getGroupMemberDetail(
    group_id: string,
    user_id: string,
  ): Promise<GroupMemberDetailDto> {
    const member = await this.groupMembersRepository.findOne({
      where: { group_id, user_id },
      relations: ['user'],
    });

    if (!member) throw new NotFoundException('스터디원을 찾을 수 없습니다.');

    // 출석일 수 계산
    const attendedCount = await this.attendanceRepository.count({
      where: {
        group_id,
        user_id,
        attended: true,
      },
    });

    return {
      uid: member.user.uid,
      nickname: member.user.nickname ?? '이름 없음',
      profileImage: member.user.profile_image ?? '',
      slogan: member.user.slogan ?? '',
      color: member.color ?? '',
      attendedCount,
    };
  }
}
