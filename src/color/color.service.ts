import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color, ColorType } from './entities/color.entity';
import { GroupMembers } from 'src/groups/entities/group-members.entity';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private colorRepository: Repository<Color>,
  ) {}

  async seedColors(): Promise<void> {
    const colors = [
      { colorCode: '#F57353', type: ColorType.GROUP },
      { colorCode: '#F3B456', type: ColorType.GROUP },
      { colorCode: '#D2A16A', type: ColorType.GROUP },
      { colorCode: '#28AF37', type: ColorType.GROUP },
      { colorCode: '#CF60FF', type: ColorType.GROUP },
      { colorCode: '#484DB4', type: ColorType.GROUP },
      { colorCode: '#DD5A5A', type: ColorType.GROUP },
      { colorCode: '#FDEA5D', type: ColorType.GROUP },
      { colorCode: '#AFD041', type: ColorType.GROUP },
      { colorCode: '#65D4B5', type: ColorType.GROUP },
      { colorCode: '#F99EEF', type: ColorType.GROUP },
      { colorCode: '#6093E4', type: ColorType.GROUP },
      // {colorCode: '#F1F1F1', type: ColorType.MEMBER}, //기본 하얀색
      { colorCode: '#5399F5', type: ColorType.MEMBER },
      { colorCode: '#F57353', type: ColorType.MEMBER },
      { colorCode: '#CF60FF', type: ColorType.MEMBER },
      { colorCode: '#F3B456', type: ColorType.MEMBER },
      { colorCode: '#FDEA5D', type: ColorType.MEMBER },
    ];

    for (const color of colors) {
      const exists = await this.colorRepository.findOne({
        where: { colorCode: color.colorCode, type: color.type },
      });
      if (!exists) {
        await this.colorRepository.save(this.colorRepository.create(color));
      }
    }
  }

  async getMemberColorByIndex(index: number): Promise<string> {
    const colors = await this.colorRepository.find({
      where: { type: ColorType.MEMBER },
      order: { id: 'ASC' }, // 색상 순서를 고정
    });

    return colors[index % colors.length].colorCode; // 모자라면 순환
  }

  async getAvailableMemberColor(
    group_id: string,
    groupMembersRepo: Repository<GroupMembers>,
  ): Promise<string> {
    const allColors = await this.colorRepository.find({
      where: { type: ColorType.MEMBER },
      order: { id: 'ASC' },
    });

    const allColorCodes = allColors.map((c) => c.colorCode);
    console.log('전체 멤버용 색상 목록:', allColorCodes);

    // 현재 스터디 그룹의 멤버들이 사용 중인 색상
    const usedMembers = await groupMembersRepo.find({
      where: { group_id },
      select: ['color'],
    });

    const usedColorCodes = usedMembers.map((m) => m.color);
    console.log('현재 사용 중인 색상들:', usedColorCodes);

    // 안 쓰인 색상 찾기
    const availableColors = allColorCodes.filter(
      (color) => !usedColorCodes.includes(color),
    );

    if (availableColors.length === 0) {
      throw new Error('사용 가능한 색상이 없습니다.');
    }

    return availableColors[0]; // 가장 앞의 색상 사용
  }
}
