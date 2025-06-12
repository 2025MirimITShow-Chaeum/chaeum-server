import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dday } from './entities/dday.entity';
import { CreateDdayDTO } from './dto/create-dday.dto';
import { UpdateDdayDTO } from './dto/update-dday.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class DdayService {
  constructor(
    @InjectRepository(Dday)
    private ddayRepository: Repository<Dday>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // D-Day 생성
  async create(createDdayDTO: CreateDdayDTO) {
    const { user_id, is_main } = createDdayDTO;

    // 유저 존재 여부 체크
    const user = await this.userRepository.findOne({ where: { uid: user_id } });
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    // 새로 생성할 D-Day가 메인인 경우 기존 메인 D-Day 초기화
    if (is_main) {
      await this.ddayRepository.update(
        { user_id, is_main: true },
        { is_main: false },
      );
    }

    try {
      const dday = this.ddayRepository.create(createDdayDTO);
      await this.ddayRepository.save(dday);

      return {
        status: HttpStatus.CREATED,
        message: 'D-Day를 성공적으로 생성하였습니다.',
        data: dday,
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'D-Day를 생성하는데 실패하였습니다.',
      );
    }
  }

  // D-Day 조회
  async get(user_id: string) {
    const ddayList = await this.ddayRepository.find({
      where: { user_id },
      order: { end_at: 'ASC' },
    });

    return {
      status: HttpStatus.OK,
      message: '해당 유저의 D-Day를 성공적으로 조회했습니다.',
      data: ddayList,
    };
  }

  // D-Day 수정
  async update(Dday_id: number, updateDdayDTO: UpdateDdayDTO) {
    const dday = await this.ddayRepository.findOne({ where: { uid: Dday_id } });
    if (!dday) {
      throw new NotFoundException('해당 D-Day를 찾을 수 없습니다.');
    }

    // 업데이트 요청이 메인으로 변경될 경우 기존 메인 D-Day 초기화
    if (updateDdayDTO.is_main) {
      await this.ddayRepository.update(
        { user_id: dday.user_id, is_main: true },
        { is_main: false },
      );
    }

    // 변경할 필드 적용
    if (updateDdayDTO.title !== undefined) {
      dday.title = updateDdayDTO.title;
    }
    if (updateDdayDTO.is_main !== undefined) {
      dday.is_main = updateDdayDTO.is_main;
    }
    if (updateDdayDTO.end_at !== undefined) {
      dday.end_at = updateDdayDTO.end_at;
    }

    await this.ddayRepository.save(dday);

    return {
      status: HttpStatus.OK,
      message: '해당 유저의 D-Day를 성공적으로 수정했습니다.',
      data: dday,
    };
  }

  // D-Day 삭제
  async delete(Dday_id: number) {
    const dday = await this.ddayRepository.findOne({ where: { uid: Dday_id } });
    if (!dday) {
      throw new NotFoundException('삭제할 D-Day가 존재하지 않습니다.');
    }

    await this.ddayRepository.delete(Dday_id);

    return {
      status: HttpStatus.OK,
      message: 'D-Day가 성공적으로 삭제되었습니다.',
      data: { Dday_id },
    };
  }
}
