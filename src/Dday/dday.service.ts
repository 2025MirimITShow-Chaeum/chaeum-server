import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
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
  async create(createDdayDTO: CreateDdayDTO, user_id) {
    const user = await this.userRepository.findOne({ where: { uid: user_id } });
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    try {
      const dday = this.ddayRepository.create({ ...createDdayDTO, user_id });
      await this.ddayRepository.save(dday);

      return {
        status: HttpStatus.CREATED,
        message: 'D-Day를 성공적으로 생성하였습니다.',
        data: dday,
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('D-Day 생성 실패');
    }
  }

  // 유저의 전체 D-Day 조회
  async getAllByUser(user_id: string) {
    const ddayList = await this.ddayRepository.find({
      where: { user_id },
      order: { end_at: 'ASC' },
    });

    return {
      status: HttpStatus.OK,
      message: '해당 유저의 D-Day 전체 조회 성공',
      data: ddayList,
    };
  }

  // D-Day 수정
  async update(Dday_id: number, updateDdayDTO: UpdateDdayDTO, user_id: string) {
    const dday = await this.ddayRepository.findOne({ where: { uid: Dday_id } });
    if (!dday) {
      throw new NotFoundException('해당 D-Day를 찾을 수 없습니다.');
    }

    if (dday.user_id !== user_id) {
      throw new ForbiddenException('본인의 D-Day만 수정할 수 있습니다.');
    }

    if (updateDdayDTO.is_main) {
      await this.ddayRepository.update(
        { user_id: dday.user_id, is_main: true },
        { is_main: false },
      );
    }

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
      message: 'D-Day 수정 성공',
      data: dday,
    };
  }

  // D-Day 삭제
  async delete(Dday_id: number, user_id: string) {
    const dday = await this.ddayRepository.findOne({ where: { uid: Dday_id } });
    if (!dday) {
      throw new NotFoundException('삭제할 D-Day가 존재하지 않습니다.');
    }

    if (dday.user_id !== user_id) {
      throw new ForbiddenException('본인의 D-Day만 삭제할 수 있습니다.');
    }

    await this.ddayRepository.delete(Dday_id);

    return {
      status: HttpStatus.OK,
      message: 'D-Day 삭제 성공',
      data: { Dday_id },
    };
  }
}
