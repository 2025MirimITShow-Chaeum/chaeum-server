import {
  InternalServerErrorException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMembers, GroupRole } from '../entities/group-members.entity';
import { Groups } from '../entities/group.entity';
import { JoinGroupDto } from '../dto/join-group.dto';
import { ColorService } from '../../color/color.service';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupJoinService {
  constructor(
    @InjectRepository(Groups)
    private groupRepository: Repository<Groups>,

    @InjectRepository(GroupMembers)
    private groupMembersRepository: Repository<GroupMembers>,

    // @InjectRepository(User)
    // private userRepository: Repository<User>,

    private readonly colorService: ColorService,
  ) {}

  // 스터디 참가
  async joinGroup(
    user_id: string,
    dto: { joinCode: string; join_members?: string[] },
  ) {
    try {
      const group = await this.groupRepository.findOne({
        where: { secret_code: dto.joinCode },
      });

      if (!group) {
        throw new NotFoundException('유효하지 않은 코드입니다.');
      }

      const exists = await this.groupMembersRepository.findOne({
        where: { user_id: user_id, group_id: group.group_id },
      });

      if (exists) {
        return {
          status: HttpStatus.CONFLICT,
          message: '이미 가입된 그룹입니다.',
        };
      }

      // 최대 5명 제한
      if (group.member_counts >= 5) {
        return {
          status: HttpStatus.FORBIDDEN,
          message: '이 스터디 그룹은 최대 인원(5명)을 초과할 수 없습니다.',
        };
      }

      // 중복되지 않은 색상 자동 배정
      const memberColor = await this.colorService.getAvailableMemberColor(
        group.group_id,
        this.groupMembersRepository,
      );

      const newMember = this.groupMembersRepository.create({
        member_id: uuidv4(),
        user_id: user_id,
        group_id: group.group_id,
        role: GroupRole.MEMBER,
        color: memberColor,
        created_at: new Date(),
      });

      await this.groupMembersRepository.save(newMember);

      // 멤버 수 증가
      group.member_counts += 1;
      await this.groupRepository.save(group);

      // 그룹 멤버들과 유저 정보 함께 가져오기
      const members = await this.groupMembersRepository.find({
        where: { group_id: group.group_id },
        relations: ['user'],
      });

      const memberList = members.map((member) => ({
        uid: member.user.uid,
        nickname: member.user.nickname ?? '이름 없음',
        profileImage: member.user.profile_image ?? '',
        color: member.color,
        role: member.role,
      }));

      return {
        status: HttpStatus.CREATED,
        message: '스터디 그룹에 성공적으로 참가했습니다.',
        data: {
          group_id: group.group_id,
          group_name: group.name,
          color: group.color,
          members: memberList,
        },
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('스터디 참가 중 오류 발생');
    }
  }
}
