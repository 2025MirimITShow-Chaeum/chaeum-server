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

@Injectable()
export class DdayService {
  constructor(
    @InjectRepository(Dday)
    private DdayRepository: Repository<Dday>,
  ) {}

  // D-Day 생성
  async create(createDdayDTO: CreateDdayDTO) {
    try {
      const Dday = {
        ...createDdayDTO,
      };

      await this.DdayRepository.save(Dday);

      return {
        status: HttpStatus.CREATED,
        message: 'D-Day를 성공적으로 생성하였습니다.',
        data: Dday,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'D-Day를 생성하는데 실패하였습니다.',
      );
    }
  }

  // D-Day 조회
  async get(user_id: string) {
    const Dday = await this.DdayRepository.find({
      where: { user_id },
      order: {
        end_at: 'ASC',
      },
    });

    return {
      status: 200,
      message: '해당 유저의 D-Day를 성공적으로 조회했습니다.',
      data: Dday,
    };
  }

  // D-Day 수정
  async update(Dday_id: number, updateDdayDTO: UpdateDdayDTO) {
    const Dday = await this.DdayRepository.findOne({
      where: { uid: Dday_id },
    });

    if (!Dday) {
      throw new NotFoundException('해당 D-Day를 찾을 수 없습니다.');
    }

    // 변경할 필드가 있다면 수정
    if (updateDdayDTO.title !== undefined) {
      Dday.title = updateDdayDTO.title;
    }

    if (updateDdayDTO.is_main !== undefined) {
      Dday.is_main = updateDdayDTO.is_main;
    }

    if (updateDdayDTO.end_at !== undefined) {
      Dday.end_at = updateDdayDTO.end_at;
    }

    await this.DdayRepository.save(Dday);

    return {
      status: 200,
      message: '해당 유저의 D-Day를 성공적으로 수정했습니다.',
      data: Dday,
    };
  }

  // D-Day 삭제
  async delete(Dday_id: number) {
    const Dday = await this.DdayRepository.findOne({
      where: { uid: Dday_id },
    });

    if (!Dday) {
      throw new NotFoundException('삭제할 D-Day가 존재하지 않습니다.');
    }

    await this.DdayRepository.delete(Dday_id);

    return {
      status: HttpStatus.OK,
      message: 'D-Day가 성공적으로 삭제되었습니다.',
      data: { Dday_id },
    };
  }
}
