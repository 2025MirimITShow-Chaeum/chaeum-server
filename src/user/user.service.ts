import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  // 유저 임시 생성 (소셜 로그인 기능 추가 예정)
  async create(createUserDto: CreateUserDto) {
    try {
      const user = {
        ...createUserDto,
      };

      await this.userRepository.save(user);

      return {
        status: HttpStatus.CREATED,
        message: 'User created successfully',
        data: user,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findUserById(id: string): Promise<object> {
    try {
      const user = await this.userRepository.findOneBy({ uuid: id });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        status: HttpStatus.OK,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (err) {
      console.log(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }
}
