import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

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
    console.log(user);

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
}
