import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMembers } from './entities/group-members.entity';
import { Groups } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { v4 as uuidv4 } from 'uuid';
import { GroupRole } from './entities/group-members.entity';
import { JoinGroupDto } from './dto/join-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ColorService } from 'src/color/color.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Groups)
    private groupRepository: Repository<Groups>,

    @InjectRepository(GroupMembers)
    private groupMembersRepository: Repository<GroupMembers>,

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

      const newGroup = this.groupRepository.create({
        group_id,
        name: dto.name,
        subject: dto.subject,
        color: dto.color,
        secret_code,
        member_counts: 1,
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

      return {
        group_id: group_id,
        group_name: dto.name,
        subject: dto.subject,
        color: dto.color,
        joinCode: secret_code,
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '스터디 그룹 생성에 실패했습니다.',
      );
    }
  }

  // 스터디 그룹 조회 (유저 기준)
  async get(user_id: string): Promise<any> {
    try {
      const groups = await this.groupMembersRepository.find({
        where: { user_id },
        relations: ['group'],
      });

      if (!groups || groups.length === 0) {
        throw new NotFoundException('해당 유저가 참여 중인 그룹이 없습니다.');
      }

      const formatted = groups.map((member) => ({
        group_id: member.group.group_id,
        group_name: member.group.name,
        role: member.role,
        color: member.group.color,
        members: member.group.member_counts,
      }));

      return {
        status: HttpStatus.OK,
        message: '스터디 그룹 조회 성공',
        data: formatted,
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('스터디 그룹 조회 중 오류 발생');
    }
  }

  // 스터디 참가
  async joinGroup(dto: JoinGroupDto) {
    try {
      const group = await this.groupRepository.findOne({
        where: { secret_code: dto.joinCode },
      });

      if (!group) {
        throw new NotFoundException('유효하지 않은 코드입니다.');
      }

      const exists = await this.groupMembersRepository.findOne({
        where: { user_id: dto.user_id, group_id: group.group_id },
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
        user_id: dto.user_id,
        group_id: group.group_id,
        role: GroupRole.MEMBER,
        color: memberColor,
        created_at: new Date(),
      });

      await this.groupMembersRepository.save(newMember);

      // 멤버 수 증가
      group.member_counts += 1;
      await this.groupRepository.save(group);

      return {
        status: HttpStatus.CREATED,
        message: '스터디 그룹에 성공적으로 참가했습니다.',
        data: {
          group_id: group.group_id,
          group_name: group.name,
        },
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('스터디 참가 중 오류 발생');
    }
  }

  // 단일 그룹 조회
  async getGroup(group_id: string) {
    const group = await this.groupRepository.findOne({
      where: { group_id },
    });

    if (!group) {
      throw new NotFoundException('해당 그룹을 찾을 수 없습니다.');
    }

    const { create_at, ...filteredGroup } = group; // 생성일 제거

    return {
      status: HttpStatus.OK,
      message: '그룹 정보 조회 성공',
      data: filteredGroup,
    };
  }

  // 그룹 정보 수정
  async updateGroup(group_id: string, dto: UpdateGroupDto) {
    const group = await this.groupRepository.findOne({
      where: { group_id },
    });

    if (!group) {
      throw new NotFoundException('해당 그룹을 찾을 수 없습니다.');
    }

    Object.assign(group, dto);
    await this.groupRepository.save(group);

    return {
      status: HttpStatus.OK,
      message: '그룹 정보가 수정되었습니다.',
      data: group,
    };
  }
}
