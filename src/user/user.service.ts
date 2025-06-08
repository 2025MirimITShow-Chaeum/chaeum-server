import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserInfoDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async findUserByUid(uid: string): Promise<User> {
    return await this.userRepository.findOneBy({ uid });
  }

  async update(uid: string, dto: UpdateUserInfoDto) {
    const user = await this.findUserByUid(uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const updatedUser = {
        ...user,
        ...dto,
      };
      await this.userRepository.save(updatedUser);
      return await this.findUserByUid(uid);
    } catch (err) {
      console.log(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to update user info');
    }
  }
}
