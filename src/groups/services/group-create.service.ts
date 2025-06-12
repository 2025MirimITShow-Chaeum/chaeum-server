import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Groups } from '../entities/group.entity';
import { GroupMembers, GroupRole } from '../entities/group-members.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ColorService } from 'src/color/color.service';
import { User } from 'src/user/entities/user.entity';
import { CreateGroupDto } from '../dto/create-group.dto';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupCreateService {
  constructor(
    @InjectRepository(Groups)
    private groupRepository: Repository<Groups>,

    @InjectRepository(GroupMembers)
    private groupMembersRepository: Repository<GroupMembers>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
    private colorService: ColorService,
  ) {}

  // 스터디 그룹 생성
  async createGroup(dto: CreateGroupDto): Promise<any> {
    try {
      let group_id: string;
      while (true) {
        group_id = Math.random().toString(36).substring(2, 8);
        const existing = await this.groupRepository.findOne({
          where: { group_id },
        });
        if (!existing) break;
      }

      const secret_code = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      const user = await this.userRepository.findOne({
        where: { uid: dto.user_id },
      });
      if (!user) throw new NotFoundException('사용자 없음');

      const newGroup = this.groupRepository.create({
        group_id,
        name: dto.name,
        color: dto.color,
        secret_code,
        member_counts: 1,
        join_members: [`${user.uid}:${user.nickname ?? '무명'}`],
      });

      await this.groupRepository.save(newGroup);

      // 리더 멤버 색상은 멤버용 색상 중에서 선택
      const leaderColor = await this.colorService.getAvailableMemberColor(
        group_id,
        this.groupMembersRepository,
      );

      const newMember = this.groupMembersRepository.create({
        member_id: uuidv4(),
        user_id: dto.user_id,
        group_id,
        role: GroupRole.LEADER,
        color: leaderColor,
        created_at: new Date(),
      });

      await this.groupMembersRepository.save(newMember);

      // 그룹 멤버들과 유저 정보 함께 가져오기
      const members = await this.groupMembersRepository.find({
        where: { group_id },
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
        group_id: group_id,
        group_name: dto.name,
        color: dto.color,
        joinCode: secret_code,
        members: memberList,
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '스터디 그룹 생성에 실패했습니다.',
      );
    }
  }
}
