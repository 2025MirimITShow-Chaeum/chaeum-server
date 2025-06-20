import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { FirebaseService } from '../firebase/firebase.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async loginWithFirebase(idToken: string): Promise<Object> {
    let decoded;
    try {
      decoded = await this.firebaseService.verifyIdToken(idToken);
    } catch (err) {
      throw new UnauthorizedException('Invalid Firebase token');
    }

    const { uid, email } = decoded;

    let user = await this.userService.findUserByUid(uid);

    if (!user) {
      user = await this.userRepository.create({
        uid,
        email,
        provider: decoded.firebase.sign_in_provider,
      });
    }
    await this.userRepository.save(user);

    const payload = { sub: user.uid, uid: user.uid };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user,
    };
  }

  async loginWithEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    const payload = { sub: user.uid, uid: user.uid };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user };
  }

  async register(uid: string, dto: RegisterDto) {
    const user = await this.userService.findUserByUid(uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const updatedUser = {
        ...user,
        ...dto,
      };
      await this.userRepository.save(updatedUser);
      return await this.userService.findUserByUid(uid);
    } catch (err) {
      console.log(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to register');
    }
  }
}
